// src/components/forHER/ChatRoom.jsx
import { useEffect, useRef, useState } from "react";
import { useChat } from "../../hooks/useChat";
import { C } from "./theme";

const ROOMS = [
  { id: "general", label: "💬 General", description: "Open chat for all moms" },
  { id: "first-trimester", label: "🌱 First Trimester", description: "Weeks 1–12" },
  { id: "second-trimester", label: "🌸 Second Trimester", description: "Weeks 13–26" },
  { id: "third-trimester", label: "🌺 Third Trimester", description: "Weeks 27–40" },
  { id: "newborn", label: "👶 Newborn", description: "0–3 months postpartum" },
  { id: "teenage-moms", label: "💜 Teen Moms", description: "Support for younger mothers" },
];

export default function ChatRoom() {
  const [userName, setUserName] = useState("");
  const [enteredName, setEnteredName] = useState(false);
  const [activeRoom, setActiveRoom] = useState(ROOMS[0]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const { messages, sendMessage, connected, error } = useChat(
    enteredName ? activeRoom.id : null,
    enteredName ? userName : null
  );

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Name entry screen
  if (!enteredName) {
    return (
      <div style={{ maxWidth: 480, margin: "80px auto", padding: "0 16px" }}>
        <div style={{
          background: "white",
          borderRadius: 24,
          padding: 40,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: "0 0 8px" }}>
            Join the Community
          </h2>
          <p style={{ color: C.muted, marginBottom: 24 }}>
            Connect with mothers who understand your journey
          </p>
          <input
            placeholder="Enter your display name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && userName.trim() && setEnteredName(true)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #e0e0e0",
              fontSize: 15,
              marginBottom: 16,
              boxSizing: "border-box",
              outline: "none",
            }}
            autoFocus
          />
          <button
            onClick={() => userName.trim() && setEnteredName(true)}
            disabled={!userName.trim()}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              border: "none",
              background: userName.trim() ? C.lavender : "#eee",
              color: userName.trim() ? C.text : "#aaa",
              fontSize: 15,
              fontWeight: 600,
              cursor: userName.trim() ? "pointer" : "not-allowed",
            }}
          >
            Enter Chat →
          </button>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (input.trim() && connected) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: C.text, margin: 0 }}>
          💬 Mom Community
        </h1>
        <p style={{ color: C.muted, marginTop: 4 }}>
          Chatting as <strong>{userName}</strong> ·{" "}
          <span style={{ color: connected ? "#4caf50" : "#f44336" }}>
            {connected ? "● Connected" : "● Disconnected"}
          </span>
        </p>
      </div>

      <div style={{ display: "flex", gap: 16, height: "calc(100vh - 220px)", minHeight: 500 }}>
        {/* Room Sidebar */}
        <div style={{
          width: 220,
          flexShrink: 0,
          background: "white",
          borderRadius: 20,
          padding: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          overflowY: "auto",
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px" }}>
            Rooms
          </p>
          {ROOMS.map((room) => (
            <div
              key={room.id}
              onClick={() => setActiveRoom(room)}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                cursor: "pointer",
                background: activeRoom.id === room.id ? C.lavender : "transparent",
                marginBottom: 4,
                transition: "background 0.15s",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{room.label}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{room.description}</div>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "white",
          borderRadius: 20,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}>
          {/* Room Header */}
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid #f0f0f0",
            fontWeight: 700,
            fontSize: 16,
            color: C.text,
          }}>
            {activeRoom.label}
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 400, marginLeft: 8 }}>
              {activeRoom.description}
            </span>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}>
            {error && (
              <div style={{ textAlign: "center", color: "#f44336", fontSize: 13 }}>{error}</div>
            )}
            {messages.length === 0 && (
              <div style={{ textAlign: "center", color: C.muted, marginTop: 40 }}>
                No messages yet. Say hello! 👋
              </div>
            )}
            {messages.map((msg, i) => {
              const isSystem = msg.type === "system";
              const isMe = msg.sender === userName;

              if (isSystem) {
                return (
                  <div key={i} style={{ textAlign: "center" }}>
                    <span style={{
                      fontSize: 12,
                      color: C.muted,
                      background: "#f5f5f5",
                      padding: "3px 12px",
                      borderRadius: 20,
                    }}>
                      {msg.content}
                    </span>
                  </div>
                );
              }

              return (
                <div key={i} style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMe ? "flex-end" : "flex-start",
                }}>
                  {!isMe && (
                    <span style={{ fontSize: 11, color: C.muted, marginBottom: 2, marginLeft: 4 }}>
                      {msg.sender}
                    </span>
                  )}
                  <div style={{
                    maxWidth: "70%",
                    padding: "10px 14px",
                    borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: isMe ? C.lavender : "#f5f5f5",
                    color: C.text,
                    fontSize: 14,
                    lineHeight: 1.4,
                  }}>
                    {msg.content}
                  </div>
                  <span style={{ fontSize: 10, color: C.muted, marginTop: 2, marginLeft: 4, marginRight: 4 }}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 16px",
            borderTop: "1px solid #f0f0f0",
            display: "flex",
            gap: 8,
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={connected ? "Type a message..." : "Connecting..."}
              disabled={!connected}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 24,
                border: "1px solid #e0e0e0",
                fontSize: 14,
                outline: "none",
                background: connected ? "white" : "#fafafa",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!connected || !input.trim()}
              style={{
                padding: "10px 20px",
                borderRadius: 24,
                border: "none",
                background: connected && input.trim() ? C.lavender : "#eee",
                color: connected && input.trim() ? C.text : "#aaa",
                fontWeight: 600,
                cursor: connected && input.trim() ? "pointer" : "not-allowed",
                fontSize: 14,
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
