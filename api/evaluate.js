// Uses Groq free tier (llama-3.3-70b-versatile) — completely free, no card needed.
// Get a free key at: console.groq.com → API Keys → Create key
// Add GROQ_API_KEY to Vercel environment variables.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { problemTitle, steps } = req.body;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GROQ_API_KEY not set" });

  const stepsText = steps.map((s, i) => {
    const wordCount = (s.answer || "").trim().split(/\s+/).filter(Boolean).length;
    return `STEP${i + 1} [${s.id}] ${s.label}:
Criteria (${s.checks.length} items): ${s.checks.map((c, j) => `${j + 1}. ${c.text}`).join("; ")}
Answer (${wordCount} words): """${s.answer?.trim() || ""}"""`;
  }).join("\n\n");

  const prompt = `You are a strict SDE3 interviewer evaluating a Low-Level Design interview response.

Problem: "${problemTitle}"

STRICT EVALUATION RULES — follow these exactly:
1. If an answer is EMPTY or fewer than 5 words, mark ALL its checkResults as passed:false and set assessment to "No answer provided."
2. Only mark passed:true if the answer EXPLICITLY mentions that concept. Do NOT infer, assume, or give benefit of the doubt for things not written.
3. A vague or off-topic answer should fail most checks.
4. finalLevel must be "SDE1" if fewer than 40% checks passed, "SDE2" if 40-75%, "SDE3" only if 75%+ with quality explanations.
5. globalFeedback must be honest — if answers were weak or missing, say so clearly.

${stepsText}

Respond ONLY with a valid JSON object — no markdown, no explanation outside JSON:
{
  "steps": {
    "clarify":       {"checkResults":[{"passed":false,"comment":"one honest sentence"}],"assessment":"one honest sentence","topMiss":"most critical missing concept or null"},
    "entities":      {"checkResults":[{"passed":false,"comment":"one honest sentence"}],"assessment":"one honest sentence","topMiss":"most critical missing concept or null"},
    "relationships": {"checkResults":[{"passed":false,"comment":"one honest sentence"}],"assessment":"one honest sentence","topMiss":"most critical missing concept or null"},
    "patterns":      {"checkResults":[{"passed":false,"comment":"one honest sentence"}],"assessment":"one honest sentence","topMiss":"most critical missing concept or null"},
    "design":        {"checkResults":[{"passed":false,"comment":"one honest sentence"}],"assessment":"one honest sentence","topMiss":"most critical missing concept or null"},
    "flow":          {"checkResults":[{"passed":false,"comment":"one honest sentence"}],"assessment":"one honest sentence","topMiss":"most critical missing concept or null"}
  },
  "finalLevel": "SDE1",
  "globalFeedback": "Honest 2-sentence summary: what was good (if anything) and what must improve."
}`;

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a strict technical interviewer. Never fabricate positive feedback for empty or weak answers. If an answer is blank, all checks fail. Output only valid JSON."
          },
          { role: "user", content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.1,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq error:", errText);
      return res.status(500).json({ error: "Groq API error", details: errText });
    }

    const data = await groqRes.json();
    const raw = data.choices?.[0]?.message?.content || "";
    // Extract JSON robustly — grab everything between first { and last }
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) throw new Error("No JSON found in response");
    const clean = raw.slice(firstBrace, lastBrace + 1);
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    console.error("Evaluation error:", err);
    res.status(500).json({ error: "Evaluation failed", details: err.message });
  }
}
