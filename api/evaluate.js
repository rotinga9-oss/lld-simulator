import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  // CORS headers (needed for local dev)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { problemTitle, steps } = req.body;

  // Build a single comprehensive prompt for all 6 steps
  const stepsText = steps
    .map(
      (s, i) => `
--- STEP ${i + 1}: ${s.label} ---
Rubric criteria:
${s.checks.map((c, j) => `  ${j + 1}. ${c.text}`).join("\n")}

Candidate's answer:
"""
${s.answer ? s.answer.trim() : "(no answer provided)"}
"""`
    )
    .join("\n");

  const prompt = `You are a senior SDE3 engineer at a top-tier tech company (Google, Amazon, Flipkart) evaluating a Low-Level Design interview.

Problem: ${problemTitle}

Evaluate the candidate's answers for each of the following 6 interview steps. Be fair — accept synonyms, paraphrasing, and equivalent concepts. A candidate who says "only one instance" has demonstrated Singleton even without naming it.

${stepsText}

Respond ONLY with a valid JSON object in this exact structure (no markdown, no explanation outside the JSON):
{
  "steps": {
    "${steps[0].id}": {
      "checkResults": [
        { "text": "exact criterion text", "passed": true, "comment": "why passed/failed in 1 sentence" }
      ],
      "assessment": "1 sentence overall quality of this step's answer",
      "topMiss": "most important missed concept, or null if nothing critical missed"
    },
    "${steps[1].id}": { ... },
    "${steps[2].id}": { ... },
    "${steps[3].id}": { ... },
    "${steps[4].id}": { ... },
    "${steps[5].id}": { ... }
  },
  "finalLevel": "SDE1" or "SDE2" or "SDE3",
  "globalFeedback": "2-3 sentences: biggest strength, biggest gap, one concrete thing to work on next"
}`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].text.trim();
    // Strip markdown fences if model adds them
    const clean = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    console.error("AI evaluation error:", err);
    res.status(500).json({ error: "AI evaluation failed", details: err.message });
  }
}
