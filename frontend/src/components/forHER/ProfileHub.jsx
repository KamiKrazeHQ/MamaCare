import { C } from "./theme";

export default function ProfileHub({ profile, savedJobs, cartItems, onToggleSaveJob, onToggleCartItem }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <div className="card" style={{ marginBottom: 18 }}>
        <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem", color: C.textDark, marginBottom: 6 }}>
          Profile
        </h1>
        <p style={{ color: C.textMid, marginBottom: 6 }}>{profile.name}</p>
        <p style={{ color: C.textMid, marginBottom: 6 }}>{profile.city}</p>
        <p style={{ color: C.textMid, fontSize: "0.86rem" }}>
          {profile.dueWeek} - Saved Jobs: {savedJobs.length} - Cart Items: {cartItems.length}
        </p>
      </div>

      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        <section className="card">
          <h2 style={{ fontSize: "1rem", color: C.textDark, marginBottom: 10 }}>Saved Jobs</h2>
          {savedJobs.length === 0 && <p style={{ color: C.textMid }}>No saved jobs yet.</p>}
          {savedJobs.map((job, idx) => (
            <div
              key={`${job.title || "job"}-${idx}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                padding: "8px 0",
                borderBottom: `1px solid ${C.lavender}33`,
              }}
            >
              <div>
                <p style={{ fontWeight: 700, color: C.textDark, fontSize: "0.88rem" }}>{job.title || "Untitled Role"}</p>
                <p style={{ color: C.textMid, fontSize: "0.78rem" }}>{job.company || "Unknown Company"}</p>
              </div>
              <button className="btn-ghost" type="button" onClick={() => onToggleSaveJob(job)} style={{ fontSize: "0.74rem" }}>
                Remove
              </button>
            </div>
          ))}
        </section>

        <section className="card">
          <h2 style={{ fontSize: "1rem", color: C.textDark, marginBottom: 10 }}>Cart Items</h2>
          {cartItems.length === 0 && <p style={{ color: C.textMid }}>No grocery items in cart yet.</p>}
          {cartItems.map((item, idx) => (
            <div
              key={`${item.name || "item"}-${idx}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                padding: "8px 0",
                borderBottom: `1px solid ${C.mint}44`,
              }}
            >
              <div>
                <p style={{ fontWeight: 700, color: C.textDark, fontSize: "0.88rem" }}>{item.name || "Unknown Item"}</p>
                <p style={{ color: C.textMid, fontSize: "0.78rem" }}>
                  {item.price || "N/A"} {item.store ? `- ${item.store}` : ""}
                </p>
              </div>
              <button className="btn-ghost" type="button" onClick={() => onToggleCartItem(item)} style={{ fontSize: "0.74rem" }}>
                Remove
              </button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
