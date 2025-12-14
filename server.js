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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Artemis had no response 😔";

    res.json({ reply });

  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ reply: "Artemis crashed mentally 💀" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Artemis server running on port ${PORT}`);
});
