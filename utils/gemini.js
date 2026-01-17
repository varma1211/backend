import dotenv from "dotenv";
dotenv.config();

if (!global.fetch) {
  const { default: fetch } = await import("node-fetch");
  global.fetch = fetch;
}

export async function askGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Gemini API error");
  }

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No response from AI."
  );
}
