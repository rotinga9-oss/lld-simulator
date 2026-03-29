// Uses Groq free tier (llama-3.1-8b-instant) — completely free, no card needed.
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

  // Compact prompt — minimise tokens
  const stepsText = steps.map((s, i) =>
    `STEP${i + 1} [${s.id}] ${s.label}:\nCriteria: ${s.checks.map((c, j) => `${j + 1}.${c.text}`).join("; ")}\nAnswer: ${s.answer?.trim() || "(blank)"}`
  ).join("\n\n");

  const prompt = `You are a senior engineer evaluating an LLD interview for: ${problemTitle}

${stepsText}

Reply ONLY with valid JSON (no markdown fences), exactly this shape:
{
  "steps": {
    "clarify":       {"checkResults":[{"passed":bool,"comment":"<10 words"}],"assessment":"<15 words","topMiss":"<10 words or null"},
    "entities":      {"checkResults":[{"passed":bool,"comment":"<10 words"}],"assessment":"<15 words","topMiss":"<10 words or null"},
    "relationships": {"checkResults":[{"passed":bool,"comment":"<10 words"}],"assessment":"<15 words","topMiss":"<10 words or null"},
    "patterns":      {"checkResults":[{"passed":bool,"comment":"<10 words"}],"assessment":"<15 words","topMiss":"<10 words or null"},
    "design":        {"checkResults":[{"passed":bool,"comment":"<10 words"}],"assessment":"<15 words","topMiss":"<10 words or null"},
    "flow":          {"checkResults":[{"passed":bool,"comment":"<10 words"}],"assessment":"<15 words","topMiss":"<10 words or null"}
  },
  "finalLevel": "SDE1" or "SDE2" or "SDE3",
  "globalFeedback": "<2 sentences: strength + top gap>"
}
Be generous — accept synonyms and equivalent concepts.`;

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1200,
        temperature: 0.2,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq error:", errText);
      return res.status(500).json({ error: "Groq API error", details: errText });
    }

    const data = await groqRes.json();
    const raw = data.choices?.[0]?.message?.content || "";
    const clean = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    console.error("Evaluation error:", err);
    res.status(500).json({ error: "Evaluation failed", details: err.message });
  }
}
