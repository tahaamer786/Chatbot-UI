"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;

    const userQuery = query;
    setMessages((prev) => [...prev, { role: "user", content: userQuery }]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`,
        { query: userQuery }
      );

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: res.data.answer },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Server error. Try again." },
      ]);
    }

    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div style={styles.page}>
      <div style={styles.chatContainer}>
        <div style={styles.header}>
          <h2 style={{ color: "white" }}>🍽 Restaurant AI Assistant</h2>
          <button onClick={clearChat} style={styles.clearBtn}>
            Clear
          </button>
        </div>

        <div style={styles.chatBox}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={
                m.role === "user"
                  ? styles.userMessage
                  : styles.botMessage
              }
            >
              {m.content}
            </div>
          ))}

          {loading && (
            <div style={styles.botMessage}>
              <span className="typing">Typing...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div style={styles.inputContainer}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about menu, timings..."
            style={styles.input}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: any = {
  page: {
    height: "100vh",
    background: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  chatContainer: {
    width: "500px",
    height: "650px",
    background: "#1e293b",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  clearBtn: {
    background: "#ef4444",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    fontSize: "12px",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    background: "#0f172a",
    borderRadius: "10px",
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
  userMessage: {
    alignSelf: "flex-end",
    background: "#3b82f6",
    color: "white",
    padding: "10px 14px",
    borderRadius: "15px",
    marginBottom: "10px",
    maxWidth: "75%",
  },
  botMessage: {
    alignSelf: "flex-start",
    background: "#334155",
    color: "white",
    padding: "10px 14px",
    borderRadius: "15px",
    marginBottom: "10px",
    maxWidth: "75%",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },
  button: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "white",
  },
};
