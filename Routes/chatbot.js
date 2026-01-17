import express from "express";
import { askGemini } from "../utils/gemini.js";

const router = express.Router();

// ✅ GLOBAL RATE LIMIT (VERY IMPORTANT)
let lastGeminiCall = 0;

router.post("/", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.json({ reply: "Please ask a question." });
    }

    // ✅ RATE LIMIT: 1 request per 6 seconds
    if (Date.now() - lastGeminiCall < 6000) {
      return res.json({
        reply: "⏳ Please wait a few seconds before asking again."
      });
    }

    lastGeminiCall = Date.now();

    // ✅ BUILD SAFE HISTORY (LIMITED)
    const conversation = history
      .slice(-2)
      .filter(m => m && typeof m.text === "string")
      .map(m => {
        const role = m.role === "user" ? "User" : "Assistant";
        return `${role}: ${m.text}`;
      })
      .join("\n");

    const prompt = `
You are an interview preparation assistant.

RULES:
- Continue conversation naturally
- NEVER say you lack conversation history
- Be concise and clear

Conversation:
${conversation || "No previous messages."}

User:
${message}
`;

    const reply = await askGemini(prompt);

    res.json({ reply });
  } catch (error) {
    console.error("❌ CHATBOT ERROR:", error.message);

    // ✅ FRIENDLY QUOTA MESSAGE
    if (error.message.toLowerCase().includes("quota")) {
      return res.json({
        reply:
          "⚠️ I'm temporarily busy due to high usage. Please try again in a minute."
      });
    }

    res.json({
      reply: "⚠️ Something went wrong. Please try again."
    });
  }
});

export default router;
