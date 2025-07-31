import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are a compassionate and friendly mental health assistant. Be kind, supportive, and empathetic in all responses.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (customPrompt = null) => {
    const userInput = customPrompt || input.trim();
    if (!userInput) return;

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        messages: newMessages,
      });

      const aiReply = res.data.reply;
      setMessages([...newMessages, { role: "assistant", content: aiReply }]);
    } catch (err) {
      alert("Failed to fetch reply");
    } finally {
      setLoading(false);
    }
  };

  const formatAssistantReply = (text) => {
    const lines = text.split(/(?=\d+\.\s)/g);
    if (lines.length === 1) return text;
    return (
      <ul style={{ paddingLeft: "1.2rem", marginTop: "0.5rem" }}>
        {lines.map((line, i) => (
          <li key={i} style={{ marginBottom: "0.5rem" }}>{line.trim()}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container">
      <h1 className="heading">🧠 Mental Health Chatbot</h1>

      <div className="chat-box">
        {messages.slice(1).map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.role === "user" ? "user" : "assistant"}`}
          >
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
            {msg.role === "assistant"
              ? formatAssistantReply(msg.content)
              : msg.content}
          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={() => sendMessage()}>{loading ? "..." : "Send"}</button>
      </div>

      <div className="quick-buttons">
        <button
          onClick={() =>
            sendMessage(
              "Can you give me a calming daily affirmation to boost my confidence and reduce stress?"
            )
          }
        >
          🌞 Daily Affirmation
        </button>
        <button
          onClick={() =>
            sendMessage(
              "I’m feeling anxious. Can you guide me through a short breathing or meditation exercise?"
            )
          }
        >
          🧘 Guided Meditation
        </button>
      </div>
    </div>
  );
}

export default App;
