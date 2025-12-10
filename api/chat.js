// ===== api/chat.js =====
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { userMessage } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: userMessage }]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const botReply = response.data?.choices?.[0]?.message?.content || "No reply";

    res.status(200).json({ botReply });

  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);
    res.status(500).json({ botReply: "Error: AI not available" });
  }
}
