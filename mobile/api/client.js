// api/client.js
const API_BASE = "https://forher-production.up.railway.app";

export const API = {
  // Health
  health: () => fetch(`${API_BASE}/health`).then(r => r.json()),

  // Jobs
  getJobs: (keyword = "remote flexible jobs for mothers") =>
    fetch(`${API_BASE}/api/jobs?keyword=${encodeURIComponent(keyword)}&max_items=20`)
      .then(r => r.json()),

  // Groceries
  getGroceries: (keyword = "") =>
    fetch(`${API_BASE}/api/groceries?max_items=24${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ""}`)
      .then(r => r.json()),

  // Calendar
  getAppointments: (userId) =>
    fetch(`${API_BASE}/api/appointments/${userId}`).then(r => r.json()),

  createAppointment: (data) =>
    fetch(`${API_BASE}/api/appointments/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(r => r.json()),

  cancelAppointment: (userId, appointmentId) =>
    fetch(`${API_BASE}/api/appointments/${userId}/${appointmentId}`, {
      method: "DELETE",
    }).then(r => r.json()),

  // Chat
  getChatHistory: (roomId) =>
    fetch(`${API_BASE}/api/chat/history/${roomId}`).then(r => r.json()),

  // WebSocket
  WS_BASE: API_BASE.replace("https://", "wss://"),
};