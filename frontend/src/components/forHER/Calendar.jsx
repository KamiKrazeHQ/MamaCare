// src/components/forHER/Calendar.jsx
import { useEffect, useState } from "react";
import { cancelAppointment, createAppointment, getAppointments } from "../../api/calendar";
import { C } from "./theme";

// Hardcoded user for now — swap with real auth user ID later
const USER_ID = "user_demo_1";

const APPOINTMENT_TYPES = ["in-person", "online"];

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function Calendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [form, setForm] = useState({
    title: "",
    appointment_type: "in-person",
    with_whom: "",
    time: "09:00",
    notes: "",
  });

  // Load appointments
  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await getAppointments(USER_ID);
      setAppointments(data);
    } catch (e) {
      console.error("Failed to load appointments:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // Get appointments for a specific date string
  const getApptsForDate = (dateStr) =>
    appointments.filter((a) => a.datetime?.startsWith(dateStr));

  // Navigate months
  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  // Handle date click
  const handleDateClick = (day) => {
    const month = String(currentMonth + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    setSelectedDate(`${currentYear}-${month}-${dayStr}`);
    setSelectedAppt(null);
    setShowForm(true);
  };

  // Handle form submit
  const handleBook = async () => {
    if (!form.title || !form.with_whom) return;
    try {
      await createAppointment({
        user_id: USER_ID,
        title: form.title,
        datetime: `${selectedDate}T${form.time}:00`,
        appointment_type: form.appointment_type,
        with_whom: form.with_whom,
        notes: form.notes,
      });
      setShowForm(false);
      setForm({ title: "", appointment_type: "in-person", with_whom: "", time: "09:00", notes: "" });
      await loadAppointments();
    } catch (e) {
      console.error("Failed to book:", e);
    }
  };

  // Handle cancel appointment
  const handleCancel = async (appt) => {
    try {
      await cancelAppointment(USER_ID, appt.appointment_id);
      setSelectedAppt(null);
      await loadAppointments();
    } catch (e) {
      console.error("Failed to cancel:", e);
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: C.text, margin: 0 }}>
          📅 Pregnancy Calendar
        </h1>
        <p style={{ color: C.muted, marginTop: 4 }}>
          Track your appointments and milestones
        </p>
      </div>

      {/* Calendar Card */}
      <div style={{
        background: "white",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        marginBottom: 24,
      }}>
        {/* Month Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <button onClick={prevMonth} style={navBtn}>‹</button>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          <button onClick={nextMonth} style={navBtn}>›</button>
        </div>

        {/* Day Headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
          {DAYS.map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: C.muted, padding: "4px 0" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {/* Empty cells for first day offset */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const month = String(currentMonth + 1).padStart(2, "0");
            const dayStr = String(day).padStart(2, "0");
            const dateStr = `${currentYear}-${month}-${dayStr}`;
            const dayAppts = getApptsForDate(dateStr);
            const isToday =
              day === today.getDate() &&
              currentMonth === today.getMonth() &&
              currentYear === today.getFullYear();

            return (
              <div
                key={day}
                onClick={() => handleDateClick(day)}
                style={{
                  minHeight: 56,
                  borderRadius: 10,
                  padding: "6px 4px",
                  cursor: "pointer",
                  background: isToday ? C.lavender : dayAppts.length > 0 ? "#fff0f6" : "#f9f9f9",
                  border: isToday ? `2px solid ${C.purple}` : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  fontSize: 13,
                  fontWeight: isToday ? 700 : 500,
                  color: isToday ? C.purple : C.text,
                  textAlign: "center",
                }}>
                  {day}
                </div>
                {dayAppts.slice(0, 2).map((a, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setSelectedAppt(a); setShowForm(false); }}
                    style={{
                      fontSize: 9,
                      background: C.peach,
                      borderRadius: 4,
                      padding: "1px 3px",
                      marginTop: 2,
                      color: C.text,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      cursor: "pointer",
                    }}
                  >
                    {a.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Form */}
      {showForm && selectedDate && (
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 16px", color: C.text }}>
            Book Appointment — {selectedDate}
          </h3>
          <input
            placeholder="Title (e.g. Midwife Checkup)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="With whom (e.g. Dr. Sarah Jones)"
            value={form.with_whom}
            onChange={(e) => setForm({ ...form, with_whom: e.target.value })}
            style={inputStyle}
          />
          <div style={{ display: "flex", gap: 12 }}>
            <select
              value={form.appointment_type}
              onChange={(e) => setForm({ ...form, appointment_type: e.target.value })}
              style={{ ...inputStyle, flex: 1 }}
            >
              {APPOINTMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
          <textarea
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            style={{ ...inputStyle, height: 80, resize: "vertical" }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleBook} style={primaryBtn}>Book Appointment</button>
            <button onClick={() => setShowForm(false)} style={ghostBtn}>Cancel</button>
          </div>
        </div>
      )}

      {/* Appointment Detail */}
      {selectedAppt && (
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 12px", color: C.text }}>{selectedAppt.title}</h3>
          <p style={{ margin: "4px 0", color: C.muted }}>👩‍⚕️ {selectedAppt.with_whom}</p>
          <p style={{ margin: "4px 0", color: C.muted }}>📅 {selectedAppt.datetime?.replace("T", " at ").slice(0, 16)}</p>
          <p style={{ margin: "4px 0", color: C.muted }}>📍 {selectedAppt.appointment_type}</p>
          {selectedAppt.notes && <p style={{ margin: "4px 0", color: C.muted }}>📝 {selectedAppt.notes}</p>}
          <p style={{ margin: "8px 0 16px", color: selectedAppt.status === "confirmed" ? "green" : C.peach }}>
            Status: {selectedAppt.status}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => handleCancel(selectedAppt)} style={{ ...ghostBtn, color: "red", borderColor: "red" }}>
              Cancel Appointment
            </button>
            <button onClick={() => setSelectedAppt(null)} style={ghostBtn}>Close</button>
          </div>
        </div>
      )}

      {/* Upcoming Appointments List */}
      <div style={cardStyle}>
        <h3 style={{ margin: "0 0 16px", color: C.text }}>Upcoming Appointments</h3>
        {loading ? (
          <p style={{ color: C.muted }}>Loading...</p>
        ) : appointments.length === 0 ? (
          <p style={{ color: C.muted }}>No appointments yet. Click a date to book one.</p>
        ) : (
          appointments
            .sort((a, b) => a.datetime?.localeCompare(b.datetime))
            .map((appt) => (
              <div
                key={appt.appointment_id}
                onClick={() => { setSelectedAppt(appt); setShowForm(false); }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "#f9f9f9",
                  marginBottom: 8,
                  cursor: "pointer",
                  border: "1px solid #eee",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: C.text }}>{appt.title}</div>
                  <div style={{ fontSize: 13, color: C.muted }}>
                    {appt.with_whom} · {appt.datetime?.replace("T", " ").slice(0, 16)}
                  </div>
                </div>
                <span style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: appt.status === "confirmed" ? "#e8f5e9" : "#fff3e0",
                  color: appt.status === "confirmed" ? "green" : "#e65100",
                  fontWeight: 600,
                }}>
                  {appt.status}
                </span>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const navBtn = {
  background: "none",
  border: "none",
  fontSize: 24,
  cursor: "pointer",
  color: "#888",
  padding: "0 12px",
};

const cardStyle = {
  background: "white",
  borderRadius: 20,
  padding: 24,
  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  marginBottom: 24,
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #e0e0e0",
  fontSize: 14,
  marginBottom: 12,
  boxSizing: "border-box",
  outline: "none",
};

const primaryBtn = {
  background: "#b39ddb",
  color: "white",
  border: "none",
  borderRadius: 10,
  padding: "10px 20px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

const ghostBtn = {
  background: "none",
  color: "#888",
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: "10px 20px",
  fontSize: 14,
  cursor: "pointer",
};