const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

// Use relative path so it works on Render and locally
const API_URL = "/api/chat";

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const userMsg = input.value.trim();
  if (!userMsg) return;

  appendMessage("You", userMsg);
  input.value = "";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg })
    });

    if (!res.ok) throw new Error("Network response not ok");

    const data = await res.json();
    const botReply = data.reply || "No response.";
    appendMessage("Artemis", botReply);

  } catch (err) {
    appendMessage("Artemis", "Oops! Something went wrong. Try again.");
    console.error(err);
  }
}

function appendMessage(sender, msg) {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${sender}:</strong> ${escapeHTML(msg)}`;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
