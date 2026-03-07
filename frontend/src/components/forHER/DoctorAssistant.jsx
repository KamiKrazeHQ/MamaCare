import { useMemo, useState } from "react";
import { C } from "./theme";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const DISCLAIMER_TEXT =
  "Educational assistant only. Not a doctor. No diagnosis, no treatment plans, and no medication dosing.";

const TRIAGE_QUESTIONS = [
  {
    key: "is_emergency",
    label: "Is this an emergency?",
  },
  {
    key: "is_pregnant_or_postpartum",
    label: "Are you pregnant or postpartum?",
  },
  {
    key: "has_severe_symptoms",
    label: "Do you have severe symptoms right now?",
  },
];

function Intake({ triage, onSetValue, onStart }) {
  const complete = TRIAGE_QUESTIONS.every((q) => typeof triage[q.key] === "boolean");

  return (
    <div className="card ai1" style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: "1rem", marginBottom: 10, color: C.textDark }}>Safety Intake</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {TRIAGE_QUESTIONS.map((question) => (
          <div key={question.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "0.88rem", color: C.textDark }}>{question.label}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className={triage[question.key] === true ? "btn-primary" : "btn-ghost"}
                onClick={() => onSetValue(question.key, true)}
                style={{ padding: "6px 12px", fontSize: "0.72rem" }}
              >
                Yes
              </button>
              <button
                type="button"
                className={triage[question.key] === false ? "btn-primary" : "btn-ghost"}
                onClick={() => onSetValue(question.key, false)}
                style={{ padding: "6px 12px", fontSize: "0.72rem" }}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn-primary"
        disabled={!complete}
        onClick={onStart}
        style={{ marginTop: 14, opacity: complete ? 1 : 0.6 }}
      >
        Start AI Advisor Chat
      </button>
    </div>
  );
}

export default function DoctorAssistant() {
  const [triage, setTriage] = useState({
    is_emergency: undefined,
    is_pregnant_or_postpartum: undefined,
    has_severe_symptoms: undefined,
  });
  const [intakeDone, setIntakeDone] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "I can answer simple pregnancy and women's health education questions. I cannot diagnose or prescribe.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasImmediateRisk = useMemo(
    () => triage.is_emergency === true || triage.has_severe_symptoms === true,
    [triage],
  );

  const setTriageValue = (key, value) => {
    setTriage((prev) => ({ ...prev, [key]: value }));
  };

  const startChat = () => {
    setIntakeDone(true);
    if (hasImmediateRisk) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Your intake suggests urgent risk. Please seek in-person care now. If this could be life-threatening, call 911 or go to the nearest ER.",
          urgent: true,
        },
      ]);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || !intakeDone || loading) return;

    setError("");
    setLoading(true);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const res = await fetch(`${API_BASE}/api/doctor/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, triage }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || `HTTP ${res.status}`);
      }

      const answer = [data.answer, data.when_to_see_doctor, data.disclaimer].filter(Boolean).join("\n\n");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
          urgent: Boolean(data.escalate_now),
        },
      ]);
    } catch (err) {
      setError(err.message || "Could not reach AI advisor endpoint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
      <div className="ai" style={{ marginBottom: 18 }}>
        <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem", color: C.textDark }}>AI Advisor</h1>
      </div>

      <div
        className="card ai"
        style={{
          marginBottom: 16,
          border: `2px solid ${C.peach}`,
          background: `${C.peach}2A`,
          color: C.textDark,
          fontWeight: 700,
        }}
      >
        {DISCLAIMER_TEXT}
      </div>

      {!intakeDone && <Intake triage={triage} onSetValue={setTriageValue} onStart={startChat} />}

      {hasImmediateRisk && (
        <div
          className="card ai2"
          style={{
            marginBottom: 16,
            border: "2px solid #d9534f",
            background: "#ffe9e8",
            color: "#7f1d1d",
            fontWeight: 700,
          }}
        >
          Urgent symptoms selected. Please seek in-person medical care now. Call 911 for emergencies.
        </div>
      )}

      <div className="card ai2" style={{ minHeight: 360, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ flex: 1, maxHeight: 420, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingRight: 4 }}>
          {messages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background: msg.role === "user" ? C.lavender : msg.urgent ? "#ffe9e8" : "#fff",
                border: msg.role === "user" ? `1px solid ${C.lavender}` : `1px solid ${msg.urgent ? "#f5b3b0" : C.sky}`,
                borderRadius: 14,
                padding: "10px 12px",
                maxWidth: "80%",
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
                fontSize: "0.88rem",
              }}
            >
              {msg.content}
            </div>
          ))}
        </div>

        {error && <p style={{ color: "#b42318", fontSize: "0.82rem" }}>{error}</p>}

        <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
          <input
            className="search-input"
            style={{ paddingLeft: 14 }}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={intakeDone ? "Ask a simple health education question..." : "Complete intake first"}
            disabled={!intakeDone || loading}
          />
          <button type="submit" className="btn-primary" disabled={!intakeDone || loading || !input.trim()}>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
