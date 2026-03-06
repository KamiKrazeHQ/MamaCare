import { C } from "./theme";

export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id:"dashboard", label:"🏠 Home" },
    { id:"jobs",      label:"💼 Jobs" },
    { id:"groceries", label:"🛒 Groceries" },
    { id:"doctor",    label:"👩‍⚕️ Doctor" },
    { id:"chat",      label:"💬 Chat" },
    { id:"midwife",   label:"🌿 Midwife" },
    { id:"calendar",  label:"📅 Calendar" },
  ];
  return (
    <header style={{ position:"sticky", top:0, zIndex:100, background:"rgba(255,253,248,0.93)", backdropFilter:"blur(14px)", borderBottom:`1px solid ${C.lavender}44`, padding:"0 24px" }}>
      <div style={{ maxWidth:1240, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:66 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg, ${C.lavender}, ${C.peach})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem" }}>🌸</div>
          <span className="logo-text">forHER</span>
          <span style={{ background:C.yellow, color:C.textMid, fontSize:"0.62rem", fontWeight:700, padding:"2px 8px", borderRadius:10, letterSpacing:"0.08em", textTransform:"uppercase" }}>Beta</span>
        </div>
        <nav style={{ display:"flex", gap:3 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`nav-tab ${activeTab===t.id?"active":""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div style={{ width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg, ${C.peach}, ${C.yellow})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", cursor:"pointer", boxShadow:`0 2px 10px ${C.peach}88` }}>👩</div>
      </div>
    </header>
  );
}




