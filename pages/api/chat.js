// pages/api/chat.js
import axios from "axios";

export default async function handler(req, res) {
  try {
    const { prompt, contextSummary } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY env var in Vercel" });

    // Build messages: system + context + user prompt
    const system = `You are a helpful analytics assistant. Use the provided contextSummary (structured JSON) to answer management questions accurately. If data is missing, say so.`;
    const messages = [
      { role: "system", content: system },
      { role: "user", content: `Context summary:\n${contextSummary}` },
      { role: "user", content: prompt }
    ];

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini", // or use whichever model you have access to
        messages,
        max_tokens: 600,
        temperature: 0.1
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json(response.data);
  } catch (err) {
    console.error("chat error", err?.response?.data || err.message);
    return res.status(500).json({ error: err?.response?.data || err.message });
  }
}
