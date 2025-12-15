import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from repo root
app.use(express.static(process.cwd()));

// Homepage route (Index.html)
app.get("/", (req, res) => {
  const homepage = path.join(process.cwd(), "Index.html");
  res.sendFile(homepage, (err) => {
    if (err) {
      console.log("Index.html not found, redirecting to Artemis.html");
      res.sendFile(path.join(process.cwd(), "Artemis.html"));
    }
  });
});

// Chatbot page
app.get("/chat", (req, res) => {
  res.sendFile(path.join(process.cwd(), "Artemis.html"));
});

// Gemini API chatbot route
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log("📩 Received message:", userMessage);

    const apiKey = process.env.GEMINI_API_KEY;

    // Using gemini-2.5-flash-lite - might have better rate limits
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // Check if there's an error in the response
    if (data.error) {
      console.error("❌ Gemini API error:", data.error);
      
      // If it's a quota error, give a helpful message
      if (data.error.code === 429) {
        return res.json({ 
          reply: "⏳ Artemis has used up her daily thinking quota (20 questions/day on free tier). She'll be back at midnight Pacific Time! 🌙" 
        });
      }
      
      return res.json({ reply: `Error: ${data.error.message}` });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Artemis had no response 😔";

    res.json({ reply });

  } catch (error) {
    console.error("💥 Server error:", error);
    res.status(500).json({ reply: "Artemis crashed mentally 💀" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Artemis server running on port ${PORT}`);
});