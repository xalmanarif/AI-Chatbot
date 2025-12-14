import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from current folder
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd())));

// Homepage route
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

// Chatbot page route
app.get("/chat", (req, res) => {
  res.sendFile(path.join(process.cwd(), "artemis.html"));
});

// API route for chatbot messages
app.post("/api/chat", async (req, res) => {
  // your chatbot backend logic here
});

app.listen(PORT, () => {
  console.log(`🚀 Artemis server running on port ${PORT}`);
});
