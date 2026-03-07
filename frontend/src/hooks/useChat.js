// src/hooks/useChat.js
import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const WS_BASE = API_BASE.replace("http://", "ws://").replace("https://", "wss://");

export function useChat(roomId, userName) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!roomId || !userName) return;

    // Load message history first
    fetch(`${API_BASE}/api/chat/history/${roomId}`)
      .then((r) => r.json())
      .then((data) => setMessages(data.messages ?? []))
      .catch(() => setMessages([]));

    // Open WebSocket connection
    const ws = new WebSocket(`${WS_BASE}/api/chat/ws/${roomId}/${userName}`);
    socketRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages((prev) => [...prev, msg]);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onerror = () => {
      setError("Connection error — retrying may help");
    };

    ws.onclose = () => {
      setConnected(false);
    };

    // Cleanup on unmount or room/user change
    return () => {
      ws.close();
    };
  }, [roomId, userName]);

  const sendMessage = useCallback(
    (content) => {
      if (socketRef.current && connected && content.trim()) {
        socketRef.current.send(JSON.stringify({ content: content.trim() }));
      }
    },
    [connected]
  );

  return { messages, sendMessage, connected, error };
}