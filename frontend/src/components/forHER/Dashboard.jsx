import { useEffect, useState } from "react";
import { C } from "./theme";
import { AFFIRMATIONS, APPOINTMENTS, BAG_SECTIONS, DEV_FACTS, MOODS, MOOD_LABELS, MOOD_MSGS, WEEK_DATA } from "./data";
import { daysUntil, formatDate, todayIndex } from "./utils";

function AffirmationCard() {
  const idx = todayIndex() % AFFIRMATIONS.length;
  const [current, setCurrent] = useState(idx);
  const [flipping, setFlipping] = useState(false);

  function next() {
    setFlipping(true);
    setTimeout(() => { setCurrent(i => (i + 1) % AFFIRMATIONS.length); setFlipping(false); }, 260);
  }

  const aff = AFFIRMATIONS[current];

  return (
    <div className="card ai1" style={{ background: "white", position: "relative", overflow: "hidden" }}>
      {/* decorative corner */}
      <div style={{ position:"absolute", top:-18, right:-18, width:80, height:80, borderRadius:"50%", background:`${C.peach}44`, pointerEvents:"none" }} />

      <p style={{ fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMid, marginBottom:12 }}>
        ✨ Today's Affirmation
      </p>

      <div className="affirmation-bg" style={{ opacity: flipping ? 0 : 1, transition:"opacity 0.25s ease" }}>
        <p style={{
          fontFamily:"'Playfair Display', serif", fontSize:"1.05rem",
          color:C.textDark, lineHeight:1.7, fontStyle:"italic",
        }}>
          "{aff.text}"
        </p>
        <p style={{ marginTop:10, fontSize:"0.72rem", fontWeight:700, color:C.textMid, letterSpacing:"0.06em", textTransform:"uppercase" }}>
          — {aff.author}
        </p>
      </div>

      <div style={{ marginTop:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", gap:5 }}>
          {AFFIRMATIONS.map((_,i) => (
            <div key={i} style={{
              width: i===current ? 18 : 6, height:6, borderRadius:6,
              background: i===current ? C.lavender : `${C.lavender}44`,
              transition:"all 0.3s ease", cursor:"pointer",
            }} onClick={() => { setFlipping(true); setTimeout(() => { setCurrent(i); setFlipping(false); }, 260); }} />
          ))}
        </div>
        <button className="btn-ghost" style={{ fontSize:"0.72rem", padding:"5px 14px" }} onClick={next}>
          Next →
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  NEW WIDGET 2 — BABY DEVELOPMENT FACT
// ════════════════════════════════════════════════════════════════════════════
function BabyDevFactCard() {
  const [factIdx, setFactIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  function cycle(dir) {
    setVisible(false);
    setTimeout(() => {
      setFactIdx(i => (i + dir + DEV_FACTS.length) % DEV_FACTS.length);
      setVisible(true);
    }, 220);
  }

  const f = DEV_FACTS[factIdx];

  return (
    <div className="card ai2" style={{
      background: `linear-gradient(135deg, ${C.sky}44, ${C.mint}33)`,
      border: `1px solid ${C.sky}99`,
    }}>
      <p style={{ fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMid, marginBottom:14 }}>
        🧬 Week {WEEK_DATA.week} · Baby's Development
      </p>

      <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition:"all 0.22s ease" }}>
        <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
          <div style={{
            width:54, height:54, borderRadius:16, flexShrink:0,
            background:`${C.sky}88`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:"1.9rem",
            boxShadow:`0 4px 14px ${C.sky}99`,
          }}>
            {f.emoji}
          </div>
          <div>
            <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:"1rem", color:C.textDark, marginBottom:6 }}>
              {f.title}
            </h3>
            <p style={{ fontSize:"0.84rem", color:C.textMid, lineHeight:1.65 }}>{f.fact}</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:"0.75rem", color:C.textMid }}>
          {factIdx + 1} / {DEV_FACTS.length} facts
        </span>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn-ghost" style={{ fontSize:"0.72rem", padding:"5px 12px" }} onClick={() => cycle(-1)}>← Prev</button>
          <button className="btn-ghost" style={{ fontSize:"0.72rem", padding:"5px 12px" }} onClick={() => cycle(1)}>Next →</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  NEW WIDGET 3 — APPOINTMENT COUNTDOWN
// ════════════════════════════════════════════════════════════════════════════
function AppointmentCountdownCard() {
  const next = APPOINTMENTS[0];
  const days = daysUntil(next.date);

  return (
    <div className="card ai3" style={{
      background: `linear-gradient(135deg, ${C.peach}33, ${C.yellow}44)`,
      border: `1px solid ${C.peach}88`,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <p style={{ fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMid }}>
          📅 Next Appointment
        </p>
        <span className="pill" style={{ background:C.peach, color:C.textDark }}>
          {days === 0 ? "Today!" : days === 1 ? "Tomorrow" : `In ${days} days`}
        </span>
      </div>

      {/* Countdown number */}
      <div style={{ textAlign:"center", padding:"6px 0 14px" }}>
        {days > 0 ? (
          <>
            <span className="appt-countdown">{days}</span>
            <p style={{ fontSize:"0.78rem", color:C.textMid, marginTop:2 }}>days to go</p>
          </>
        ) : (
          <p style={{ fontFamily:"'Dancing Script', cursive", fontSize:"2rem", color:"#e87a90" }}>Today! 🎉</p>
        )}
      </div>

      {/* Appointment details */}
      <div style={{
        background:"white", borderRadius:14, padding:"14px 16px",
        boxShadow:`0 2px 12px ${C.peach}44`,
      }}>
        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
          <span style={{ fontSize:"1.5rem" }}>{next.emoji}</span>
          <div>
            <p style={{ fontWeight:700, fontSize:"0.92rem", color:C.textDark }}>{next.title}</p>
            <p style={{ fontSize:"0.78rem", color:C.textMid }}>{next.doctor}</p>
          </div>
        </div>
        <div style={{ display:"flex", gap:16, fontSize:"0.78rem", color:C.textMid }}>
          <span>📍 {next.location}</span>
          <span>🗓 {formatDate(next.date)}</span>
        </div>
      </div>

      {/* Upcoming list */}
      <div style={{ marginTop:14 }}>
        <p style={{ fontSize:"0.72rem", fontWeight:700, color:C.textMid, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:8 }}>
          Upcoming
        </p>
        {APPOINTMENTS.slice(1).map(a => (
          <div key={a.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderTop:`1px solid ${C.peach}33` }}>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ fontSize:"1rem" }}>{a.emoji}</span>
              <span style={{ fontSize:"0.82rem", color:C.textDark }}>{a.title}</span>
            </div>
            <span className="pill" style={{ background:`${a.color}55`, color:C.textDark, fontSize:"0.68rem" }}>
              {daysUntil(a.date)}d
            </span>
          </div>
        ))}
      </div>

      <button className="btn-primary" style={{ width:"100%", marginTop:14, textAlign:"center" }}>
        + Add Appointment
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  NEW WIDGET 4 — HOSPITAL BAG CHECKLIST
// ════════════════════════════════════════════════════════════════════════════
function HospitalBagCard() {
  // Flatten all items with section metadata
  const allItems = BAG_SECTIONS.flatMap((s, si) =>
    s.items.map((item, ii) => ({ id:`${si}-${ii}`, label:item, section:s.section, color:s.color }))
  );
  const [checked, setChecked] = useState(() => new Set());
  const [activeSection, setActiveSection] = useState("For Mama");

  function toggle(id) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const total    = allItems.length;
  const done     = checked.size;
  const pct      = Math.round((done / total) * 100);
  const sectionItems = allItems.filter(i => i.section === activeSection);

  return (
    <div className="card ai4" style={{ gridColumn:"span 2" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div>
          <p style={{ fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMid, marginBottom:4 }}>
            🧳 Hospital Bag Checklist
          </p>
          <p style={{ fontSize:"0.84rem", color:C.textMid }}>
            {done} of {total} items packed
            {pct === 100 && <span style={{ color:"#3a7a5a", fontWeight:700, marginLeft:8 }}>— You're ready! 🎉</span>}
          </p>
        </div>
        <div style={{ textAlign:"right" }}>
          <p style={{ fontFamily:"'Dancing Script', cursive", fontSize:"2rem", color: pct === 100 ? "#3a7a5a" : C.lavender, lineHeight:1 }}>
            {pct}%
          </p>
          <p style={{ fontSize:"0.7rem", color:C.textMid }}>packed</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-track" style={{ marginBottom:18 }}>
        <div className="progress-fill" style={{ width:`${pct}%`, background: pct === 100 ? `linear-gradient(90deg, ${C.mint}, #3a7a5a)` : undefined }} />
      </div>

      {/* Section tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {BAG_SECTIONS.map(s => {
          const sItems = allItems.filter(i => i.section === s.section);
          const sDone  = sItems.filter(i => checked.has(i.id)).length;
          return (
            <button
              key={s.section}
              onClick={() => setActiveSection(s.section)}
              style={{
                padding:"7px 16px", borderRadius:20, border:"2px solid transparent",
                fontFamily:"'Lato', sans-serif", fontWeight:700, fontSize:"0.78rem",
                cursor:"pointer", transition:"all 0.2s ease",
                background: activeSection === s.section ? `${s.color}` : `${s.color}44`,
                borderColor: activeSection === s.section ? s.color : "transparent",
                color: C.textDark,
              }}
            >
              {s.emoji} {s.section} ({sDone}/{sItems.length})
            </button>
          );
        })}
      </div>

      {/* Items */}
      <div style={{ columns:2, columnGap:16 }}>
        {sectionItems.map(item => (
          <div key={item.id} className="check-item" style={{ breakInside:"avoid" }}
            onClick={() => toggle(item.id)}>
            <div className={`check-box ${checked.has(item.id) ? "checked" : ""}`}>
              {checked.has(item.id) && <span style={{ fontSize:"0.8rem", color:"white" }}>✓</span>}
            </div>
            <span style={{
              fontSize:"0.84rem", color: checked.has(item.id) ? C.textMid : C.textDark,
              textDecoration: checked.has(item.id) ? "line-through" : "none",
              transition:"all 0.2s ease",
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {done > 0 && (
        <button
          onClick={() => setChecked(new Set())}
          style={{ marginTop:14, background:"none", border:"none", fontSize:"0.75rem", color:C.textMid, cursor:"pointer", textDecoration:"underline" }}
        >
          Reset all
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  EXISTING WIDGETS (kept intact)
// ═══════════════════════════════════════════════════════════════════════════
function WeekCard() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 120); }, []);
  return (
    <div className="card ai" style={{ background:`linear-gradient(135deg, ${C.lavender}44, ${C.peach}33)`, border:`1px solid ${C.lavender}55`, gridColumn:"span 2" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
        <div>
          <p style={{ fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMid, marginBottom:6 }}>Your Pregnancy Journey</p>
          <div style={{ display:"flex", alignItems:"baseline", gap:12 }}>
            <span className="week-badge">{WEEK_DATA.week}</span>
            <span style={{ fontSize:"1.05rem", color:C.textMid, fontFamily:"'Playfair Display', serif", fontStyle:"italic" }}>weeks along</span>
          </div>
          <p style={{ marginTop:8, fontSize:"0.98rem", color:C.textDark }}>Your baby is the size of a <strong style={{ color:"#b89fe8" }}>{WEEK_DATA.size}</strong> {WEEK_DATA.emoji}</p>
          <p style={{ marginTop:8, fontSize:"0.84rem", color:C.textMid, maxWidth:340 }}>{WEEK_DATA.milestone}</p>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"5rem", lineHeight:1 }}>{WEEK_DATA.emoji}</div>
          <span className="pill" style={{ background:C.mint, color:"#3a7a5a", marginTop:8 }}>Trimester {WEEK_DATA.trimester}</span>
        </div>
      </div>
      <div style={{ marginTop:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <span style={{ fontSize:"0.75rem", color:C.textMid, fontWeight:700 }}>Week 1</span>
          <span style={{ fontSize:"0.75rem", color:C.textMid, fontWeight:700 }}>Week {WEEK_DATA.week} of 40</span>
          <span style={{ fontSize:"0.75rem", color:C.textMid, fontWeight:700 }}>Week 40</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: loaded ? `${WEEK_DATA.progress}%` : "0%" }} />
        </div>
        <p style={{ marginTop:6, fontSize:"0.72rem", color:C.textMid, textAlign:"right" }}>{Math.round(WEEK_DATA.progress)}% complete · {40 - WEEK_DATA.week} weeks to go 🎉</p>
      </div>
    </div>
  );
}

function MoodCard() {
  const [mood, setMood] = useState(null);
  return (
    <div className="card ai1" style={{ background:`linear-gradient(135deg, ${C.sky}55, ${C.sky}22)` }}>
      <p style={{ fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMid, marginBottom:12 }}>Daily Check-in</p>
      <p style={{ fontFamily:"'Playfair Display', serif", fontSize:"1rem", color:C.textDark, marginBottom:16 }}>How are you feeling today?</p>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {MOODS.map((m,i) => (
          <div key={i} style={{ textAlign:"center" }}>
            <button className={`mood-btn ${mood===i?"selected":""}`} onClick={() => setMood(mood===i?null:i)} title={MOOD_LABELS[i]}>{m}</button>
            <p style={{ fontSize:"0.58rem", color:C.textMid, marginTop:3, fontWeight:700 }}>{MOOD_LABELS[i]}</p>
          </div>
        ))}
      </div>
      {mood !== null && (
        <div style={{ marginTop:14, padding:"10px 14px", borderRadius:12, background:`${C.lavender}44`, fontSize:"0.84rem", color:C.textDark, animation:"floatIn 0.3s ease" }}>
          {MOOD_MSGS[mood]}
        </div>
      )}
    </div>
  );
}

function TipCard() {
  const tips = [
    { emoji:"💧", title:"Stay Hydrated", tip:"Aim for 8–10 glasses of water today. Add cucumber or lemon for a refreshing twist!" },
    { emoji:"🚶‍♀️", title:"Gentle Movement", tip:"A 20-minute prenatal walk improves circulation and boosts your mood naturally." },
    { emoji:"😴", title:"Sleep Matters", tip:"Try sleeping on your left side with a pillow between your knees for better comfort." },
  ];
  const tip = tips[new Date().getDay() % 3];
  return (
    <div className="card ai2" style={{ background:`linear-gradient(135deg, ${C.mint}55, ${C.yellow}44)` }}>
      <p style={{ fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMid, marginBottom:12 }}>Today's Wellness Tip</p>
      <div style={{ fontSize:"2rem", marginBottom:8 }}>{tip.emoji}</div>
      <p style={{ fontFamily:"'Playfair Display', serif", fontSize:"1rem", color:C.textDark, marginBottom:8 }}>{tip.title}</p>
      <p style={{ fontSize:"0.84rem", color:C.textMid, lineHeight:1.65 }}>{tip.tip}</p>
    </div>
  );
}

function QuickLinksCard({ setActiveTab }) {
  const links = [
    { label:"Browse Jobs",   icon:"💼", tab:"jobs",      color:C.lavender },
    { label:"Shop Healthy",  icon:"🛒", tab:"groceries", color:C.mint },
    { label:"Book Doctor",   icon:"👩‍⚕️", tab:"doctor",    color:C.peach },
    { label:"Chat Support",  icon:"💬", tab:"chat",      color:C.sky },
  ];
  return (
    <div className="card ai3" style={{ gridColumn:"span 3" }}>
      <p style={{ fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMid, marginBottom:16 }}>Quick Access</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {links.map(l => (
          <button key={l.tab} onClick={() => setActiveTab(l.tab)} style={{ background:`${l.color}44`, border:"none", borderRadius:16, padding:"16px 8px", cursor:"pointer", transition:"all 0.2s ease", fontFamily:"'Lato', sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.background=`${l.color}88`; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.background=`${l.color}44`; }}>
            <div style={{ fontSize:"1.7rem", marginBottom:6 }}>{l.icon}</div>
            <p style={{ fontSize:"0.76rem", fontWeight:700, color:C.textDark }}>{l.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  DASHBOARD (updated layout)
// ═══════════════════════════════════════════════════════════════════════════
export default function Dashboard({ setActiveTab }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ maxWidth:1240, margin:"0 auto", padding:"32px 24px" }}>
      {/* Welcome */}
      <div className="ai" style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:"'Dancing Script', cursive", fontSize:"2.4rem", fontWeight:700, color:C.textDark, marginBottom:4 }}>
          {greeting}, Mama ✨
        </h1>
        <p style={{ fontSize:"0.98rem", color:C.textMid, fontFamily:"'Playfair Display', serif", fontStyle:"italic" }}>
          Every day is a miracle. Here's your journey so far.
        </p>
      </div>

      {/* ── ROW 1: Week Card (span 2) + Mood ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, marginBottom:18 }}>
        <WeekCard />
        <MoodCard />
      </div>

      {/* ── ROW 2: Affirmation + Baby Dev Fact + Appointment ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, marginBottom:18 }}>
        <AffirmationCard />
        <BabyDevFactCard />
        <AppointmentCountdownCard />
      </div>

      {/* ── ROW 3: Hospital Bag (span 2) + Tip ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18, marginBottom:18 }}>
        <HospitalBagCard />
        <TipCard />
      </div>

      {/* ── ROW 4: Quick Links (full width) ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
        <QuickLinksCard setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}





