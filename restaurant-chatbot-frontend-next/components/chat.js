"use client";

import { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!query) return;

    setMessages([...messages, { role: "user", content: query }]);
    const userQuery = query;
    setQuery("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`,
        { query: userQuery }
      );

      const answer = res.data.answer;
      setMessages((prev) => [...prev, { role: "bot", content: answer }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error connecting to backend" },
      ]);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Chatbot</h1>
      <div className="border rounded p-4 mb-4 h-96 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${
              m.role === "user" ? "text-right text-blue-600" : "text-left text-green-700"
            }`}
          >
            <strong>{m.role === "user" ? "You: " : "Bot: "}</strong>
            {m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 border rounded p-2"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
