// src/api/calendar.js

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Create a new appointment
export async function createAppointment(data) {
  const res = await fetch(`${API_BASE}/api/appointments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return await res.json();
}

// Get all appointments for a user
export async function getAppointments(userId) {
  const res = await fetch(`${API_BASE}/api/appointments/${userId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.appointments ?? [];
}

// Update an appointment
export async function updateAppointment(userId, appointmentId, updates) {
  const res = await fetch(`${API_BASE}/api/appointments/${userId}/${appointmentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return await res.json();
}

// Cancel an appointment
export async function cancelAppointment(userId, appointmentId) {
  const res = await fetch(`${API_BASE}/api/appointments/${userId}/${appointmentId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return await res.json();
}