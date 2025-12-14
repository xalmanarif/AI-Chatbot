import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the root folder
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd())));

// Homepage route (optional, only if index.html exists)
app.get("/", (req, res) => {
  const homepage = path.join(process.cwd(), "Index.html");
  res.sendFile(homepage, (err) => {
    if (err) {
      console.log("Index.html not found, redirecting to chatbot page");
      res.sendFile(path.join(process.cwd(), "Artemis.html"));
    }
  });
});

// Chatbot page route
app.get("/chat", (req, res) => {
  res.sendFile(path.join(process.cwd(), "Artemis.html"));
});

// API route for chatbot messages
app.post("/api/chat", async (req, res) => {
  // Your chatbot backend logic goes here
  // Example placeholder:
  res.json({ choices: [{ message: { content: "Hello! Artemis is online." } }] });
});

app.listen(PORT, () => {
  console.log(`🚀 Artemis server running on port ${PORT}`);
});
