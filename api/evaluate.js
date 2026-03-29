// Uses Google Gemini free tier (gemini-2.0-flash-lite) — no cost, no card needed.
// Get a free key at: aistudio.google.com → Get API Key
// Add GEMINI_API_KEY to Vercel environment variables.

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { problemTitle, steps } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not set" });

  // Compact prompt — every token counts on free tier
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
  "finalLevel": "SDE1"|"SDE2"|"SDE3",
  "globalFeedback": "<2 sentences: strength + top gap>"
}
Be generous — accept synonyms and equivalent concepts.`;

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1200, temperature: 0.2 },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini error:", errText);
      return res.status(500).json({ error: "Gemini API error", details: errText });
    }

    const data = await geminiRes.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    console.error("Evaluation error:", err);
    res.status(500).json({ error: "Evaluation failed", details: err.message });
  }
}
