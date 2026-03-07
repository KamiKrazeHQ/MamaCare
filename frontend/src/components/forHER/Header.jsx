import { C } from "./theme";

export default function Header({ activeTab, setActiveTab, savedJobsCount = 0, cartItemsCount = 0 }) {
  const tabs = [
    { id: "dashboard", label: "Home" },
    { id: "jobs", label: "Jobs" },
    { id: "groceries", label: "Groceries" },
    { id: "doctor", label: "AI Advisor" },
    { id: "chat", label: "MOMgram" },
    { id: "midwife", label: "Midwife" },
    { id: "calendar", label: "Calendar" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255,253,248,0.93)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${C.lavender}44`,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 66,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.lavender}, ${C.peach})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              fontWeight: 700,
            }}
          >
            💜
          </div>
          <span className="logo-text">MAMAcare</span>
        </div>

        <nav style={{ display: "flex", gap: 3 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`nav-tab ${activeTab === "profile" ? "active" : ""}`}
          style={{ marginLeft: 10, display: "flex", alignItems: "center", gap: 6 }}
          title="Open profile"
          aria-label="Open profile"
        >
          Profile
          <span
            style={{
              background: `${C.peach}88`,
              borderRadius: 999,
              padding: "2px 8px",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: C.textDark,
            }}
          >
            {savedJobsCount + cartItemsCount}
          </span>
        </button>
      </div>
    </header>
  );
}
