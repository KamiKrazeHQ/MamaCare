import { C } from "./theme";

export default function ComingSoon({ icon, title, subtitle, color }) {
  return (
    <div style={{ maxWidth:800, margin:"60px auto", padding:"0 24px" }}>
      <div className="coming-soon-card" style={{ background:`linear-gradient(135deg, ${color}33, ${C.lavender}22)` }}>
        <div style={{ fontSize:"4rem", marginBottom:20 }}>{icon}</div>
        <h2 style={{ fontFamily:"'Dancing Script', cursive", fontSize:"2.2rem", color:C.textDark, marginBottom:12 }}>{title}</h2>
        <p style={{ color:C.textMid, fontSize:"1rem", maxWidth:340 }}>{subtitle}</p>
        <div style={{ marginTop:28 }}><span className="pill" style={{ background:C.peach, color:C.textDark, fontSize:"0.8rem", padding:"6px 18px" }}>Coming Soon ✨</span></div>
      </div>
    </div>
  );
}





