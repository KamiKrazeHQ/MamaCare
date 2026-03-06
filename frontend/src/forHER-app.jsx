import { useState, useEffect } from "react";

// Google Fonts injection
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;1,400&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// ── THEME ──────────────────────────────────────────────────────────────────
const C = {
  yellow:   "#FCF1C1",
  peach:    "#FFCAD4",
  lavender: "#D7C5FF",
  mint:     "#D1F0DE",
  sky:      "#BFE7FF",
  white:    "#FFFDF8",
  textDark: "#5a4a6a",
  textMid:  "#8a7a9a",
};

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Lato', sans-serif; background: ${C.white}; color: ${C.textDark}; }

  @keyframes floatIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-soft {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.04); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .animate-in { animation: floatIn 0.5s ease forwards; }
  .animate-in-delay-1 { animation: floatIn 0.5s ease 0.1s both; }
  .animate-in-delay-2 { animation: floatIn 0.5s ease 0.2s both; }
  .animate-in-delay-3 { animation: floatIn 0.5s ease 0.3s both; }
  .animate-in-delay-4 { animation: floatIn 0.5s ease 0.4s both; }
  .animate-in-delay-5 { animation: floatIn 0.5s ease 0.5s both; }

  .logo-text {
    font-family: 'Dancing Script', cursive;
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, ${C.lavender}, #b89fe8, ${C.peach});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.02em;
  }

  .nav-tab {
    padding: 8px 18px;
    border-radius: 20px;
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
    transition: all 0.25s ease;
    background: transparent;
    color: ${C.textMid};
  }
  .nav-tab:hover { background: ${C.lavender}33; color: ${C.textDark}; transform: translateY(-1px); }
  .nav-tab.active { background: ${C.lavender}; color: ${C.textDark}; box-shadow: 0 4px 12px ${C.lavender}88; }

  .card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 4px 24px rgba(90,74,106,0.08);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(90,74,106,0.14); }

  .pill {
    display: inline-block;
    padding: 3px 12px;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .btn-primary {
    background: ${C.peach};
    color: ${C.textDark};
    border: none;
    border-radius: 20px;
    padding: 10px 22px;
    font-family: 'Lato', sans-serif;
    font-weight: 700;
    font-size: 0.82rem;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.25s ease;
    text-transform: uppercase;
  }
  .btn-primary:hover { background: #ffb3c1; transform: translateY(-2px); box-shadow: 0 4px 16px ${C.peach}99; }

  .btn-ghost {
    background: transparent;
    border: 2px solid ${C.lavender};
    color: ${C.textDark};
    border-radius: 20px;
    padding: 8px 18px;
    font-family: 'Lato', sans-serif;
    font-weight: 700;
    font-size: 0.78rem;
    cursor: pointer;
    transition: all 0.25s ease;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .btn-ghost:hover { background: ${C.lavender}33; transform: translateY(-1px); }

  .filter-chip {
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    letter-spacing: 0.03em;
  }
  .filter-chip.active { border-color: ${C.lavender}; background: ${C.lavender}55; }
  .filter-chip:not(.active) { background: ${C.mint}55; color: ${C.textMid}; }
  .filter-chip:hover { transform: translateY(-1px); }

  .mood-btn {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 3px solid transparent;
    font-size: 1.6rem;
    cursor: pointer;
    background: white;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .mood-btn:hover { transform: scale(1.15); box-shadow: 0 4px 16px rgba(0,0,0,0.14); }
  .mood-btn.selected { border-color: ${C.lavender}; background: ${C.lavender}33; transform: scale(1.15); }

  .progress-bar-track {
    height: 10px;
    background: ${C.lavender}44;
    border-radius: 10px;
    overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%;
    border-radius: 10px;
    background: linear-gradient(90deg, ${C.lavender}, ${C.peach});
    transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .coming-soon-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 320px;
    background: linear-gradient(135deg, ${C.sky}55, ${C.mint}55);
    border-radius: 24px;
    text-align: center;
    padding: 48px;
  }

  .search-input {
    width: 100%;
    padding: 12px 20px 12px 44px;
    border: 2px solid ${C.lavender}55;
    border-radius: 20px;
    font-family: 'Lato', sans-serif;
    font-size: 0.9rem;
    color: ${C.textDark};
    background: white;
    outline: none;
    transition: border-color 0.2s ease;
  }
  .search-input:focus { border-color: ${C.lavender}; box-shadow: 0 0 0 3px ${C.lavender}22; }

  .job-card { border-left: 4px solid ${C.lavender}; }
  .grocery-card { border-left: 4px solid ${C.mint}; }

  .week-badge {
    font-family: 'Dancing Script', cursive;
    font-size: 3.5rem;
    font-weight: 700;
    color: ${C.lavender};
    line-height: 1;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${C.sky}22; }
  ::-webkit-scrollbar-thumb { background: ${C.lavender}88; border-radius: 10px; }

  .floating-blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.18;
    pointer-events: none;
    z-index: 0;
  }
`;

// ── MOCK DATA ──────────────────────────────────────────────────────────────
const MOCK_JOBS = [
  {
    id: 1,
    title: "Remote Customer Success Manager",
    company: "Bloom Tech",
    location: "Remote · USA",
    salary: "$55,000 – $70,000/yr",
    type: "Full-time",
    tags: ["Remote", "Flexible Hours", "Family Leave"],
    posted: "2 days ago",
    description: "Join a caring team supporting customers from the comfort of home. We offer generous parental leave, flexible scheduling, and a deeply supportive culture.",
    logo: "🌸",
  },
  {
    id: 2,
    title: "Part-Time Content Writer",
    company: "Gentle Media Co.",
    location: "Remote · Worldwide",
    salary: "$25–$40/hr",
    type: "Part-time",
    tags: ["Remote", "Part-time", "Async"],
    posted: "1 day ago",
    description: "Write heartfelt content on health and wellness topics. Set your own hours and work asynchronously. Perfect for parents needing flexibility.",
    logo: "✍️",
  },
  {
    id: 3,
    title: "UX Researcher (Flexible Contract)",
    company: "NurtureDesign",
    location: "Remote · Europe/US",
    salary: "$45–$65/hr",
    type: "Contract",
    tags: ["Remote", "Flexible", "Contract"],
    posted: "3 days ago",
    description: "Conduct user research studies on your own schedule. We are a family-first company with 100% remote culture and comprehensive health benefits.",
    logo: "🔍",
  },
  {
    id: 4,
    title: "Virtual Bookkeeper",
    company: "HomeBalance Finance",
    location: "Remote · USA",
    salary: "$38,000 – $52,000/yr",
    type: "Full-time",
    tags: ["Remote", "Work from Home", "Benefits"],
    posted: "5 days ago",
    description: "Manage accounts for small businesses from home. Flexible 6-hour days, full health insurance coverage, and generous maternity leave policy.",
    logo: "📊",
  },
  {
    id: 5,
    title: "Online Tutor – Math & Science",
    company: "LearnNest",
    location: "Remote · Worldwide",
    salary: "$30–$55/hr",
    type: "Freelance",
    tags: ["Flexible Hours", "Freelance", "Remote"],
    posted: "Today",
    description: "Tutor students online on your own schedule. Earn while nurturing young minds. You pick your hours, student load, and subjects.",
    logo: "📚",
  },
  {
    id: 6,
    title: "Social Media Manager",
    company: "Petal & Bloom Brands",
    location: "Remote · USA/Canada",
    salary: "$48,000 – $62,000/yr",
    type: "Full-time",
    tags: ["Remote", "Creative", "Flexible"],
    posted: "4 days ago",
    description: "Manage social presence for wellness brands you believe in. Fully remote team, quarterly wellness stipend, and family-friendly culture baked in.",
    logo: "🌷",
  },
];

const MOCK_GROCERIES = [
  { id: 1, name: "Organic Spinach (Baby)", category: "Leafy Greens", price: "$3.99", unit: "5 oz bag", benefit: "Iron & Folate", emoji: "🥬", store: "Whole Foods", rating: 4.8 },
  { id: 2, name: "Wild Blueberries (Frozen)", category: "Fruits", price: "$5.49", unit: "16 oz bag", benefit: "Antioxidants", emoji: "🫐", store: "Instacart", rating: 4.9 },
  { id: 3, name: "Greek Yogurt (Full Fat)", category: "Dairy", price: "$4.29", unit: "32 oz", benefit: "Calcium & Protein", emoji: "🥛", store: "Target", rating: 4.7 },
  { id: 4, name: "Prenatal DHA Omega-3", category: "Supplements", price: "$18.99", unit: "60 softgels", benefit: "Brain Development", emoji: "💊", store: "CVS", rating: 4.9 },
  { id: 5, name: "Avocados (Organic)", category: "Fruits", price: "$6.99", unit: "4 ct bag", benefit: "Healthy Fats & Folate", emoji: "🥑", store: "Instacart", rating: 4.8 },
  { id: 6, name: "Lentil Soup (Low Sodium)", category: "Pantry", price: "$2.79", unit: "15 oz can", benefit: "Iron & Fiber", emoji: "🫘", store: "Whole Foods", rating: 4.6 },
  { id: 7, name: "Wild Salmon Fillets", category: "Proteins", price: "$12.99", unit: "1 lb", benefit: "Omega-3 & Protein", emoji: "🐟", store: "Trader Joe's", rating: 4.8 },
  { id: 8, name: "Free-Range Eggs (Dozen)", category: "Proteins", price: "$5.99", unit: "12 ct", benefit: "Choline & Protein", emoji: "🥚", store: "Target", rating: 4.7 },
  { id: 9, name: "Sweet Potatoes", category: "Vegetables", price: "$3.49", unit: "3 lb bag", benefit: "Beta-Carotene & Vitamin A", emoji: "🍠", store: "Instacart", rating: 4.6 },
  { id: 10, name: "Almond Butter (Natural)", category: "Pantry", price: "$7.99", unit: "16 oz jar", benefit: "Vitamin E & Protein", emoji: "🥜", store: "Whole Foods", rating: 4.7 },
  { id: 11, name: "Chamomile Tea (Caffeine-Free)", category: "Beverages", price: "$4.49", unit: "20 bags", benefit: "Relaxation & Sleep", emoji: "🍵", store: "Target", rating: 4.5 },
  { id: 12, name: "Whole Grain Crackers", category: "Pantry", price: "$3.99", unit: "8 oz box", benefit: "Complex Carbs & Fiber", emoji: "🫙", store: "Trader Joe's", rating: 4.4 },
];

const MOODS = ["😊", "😌", "😴", "🤢", "😰", "🥰"];
const MOOD_LABELS = ["Happy", "Calm", "Tired", "Nauseous", "Anxious", "Loving"];

const JOB_FILTERS = ["All", "Remote", "Part-time", "Flexible Hours", "Contract", "Freelance"];
const GROCERY_CATEGORIES = ["All", "Leafy Greens", "Fruits", "Dairy", "Proteins", "Vegetables", "Pantry", "Supplements", "Beverages"];

const WEEK_DATA = {
  week: 24,
  size: "cantaloupe",
  emoji: "🍈",
  trimester: 2,
  milestone: "Baby can now hear your voice and may respond to sounds!",
  progress: (24 / 40) * 100,
};

// ── COMPONENTS ─────────────────────────────────────────────────────────────

function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "dashboard", label: "🏠 Home" },
    { id: "jobs", label: "💼 Jobs" },
    { id: "groceries", label: "🛒 Groceries" },
    { id: "doctor", label: "👩‍⚕️ Doctor" },
    { id: "chat", label: "💬 Chat" },
    { id: "midwife", label: "🌿 Midwife" },
    { id: "calendar", label: "📅 Calendar" },
  ];

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(255,253,248,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.lavender}44`,
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.lavender}, ${C.peach})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem",
          }}>🌸</div>
          <span className="logo-text">forHER</span>
          <span style={{
            background: C.yellow,
            color: C.textMid,
            fontSize: "0.65rem",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>Beta</span>
        </div>

        {/* Tabs */}
        <nav style={{ display: "flex", gap: 4 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* User Avatar */}
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.peach}, ${C.yellow})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.2rem", cursor: "pointer",
          boxShadow: `0 2px 12px ${C.peach}88`,
        }}>👩</div>
      </div>
    </header>
  );
}

function WeekCard() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <div className="card animate-in-delay-1" style={{
      background: `linear-gradient(135deg, ${C.lavender}44 0%, ${C.peach}33 100%)`,
      border: `1px solid ${C.lavender}55`,
      gridColumn: "span 2",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textMid, marginBottom: 6 }}>
            Your Pregnancy Journey
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span className="week-badge">{WEEK_DATA.week}</span>
            <span style={{ fontSize: "1.1rem", color: C.textMid, fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
              weeks along
            </span>
          </div>
          <p style={{ marginTop: 8, fontSize: "1rem", color: C.textDark }}>
            Your baby is the size of a <strong style={{ color: "#b89fe8" }}>{WEEK_DATA.size}</strong> {WEEK_DATA.emoji}
          </p>
          <p style={{ marginTop: 8, fontSize: "0.85rem", color: C.textMid, maxWidth: 340 }}>{WEEK_DATA.milestone}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "5rem", lineHeight: 1 }}>{WEEK_DATA.emoji}</div>
          <span className="pill" style={{ background: C.mint, color: "#3a7a5a", marginTop: 8 }}>
            Trimester {WEEK_DATA.trimester}
          </span>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: "0.78rem", color: C.textMid, fontWeight: 700 }}>Week 1</span>
          <span style={{ fontSize: "0.78rem", color: C.textMid, fontWeight: 700 }}>Week {WEEK_DATA.week} of 40</span>
          <span style={{ fontSize: "0.78rem", color: C.textMid, fontWeight: 700 }}>Week 40</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: loaded ? `${WEEK_DATA.progress}%` : "0%" }} />
        </div>
        <p style={{ marginTop: 6, fontSize: "0.75rem", color: C.textMid, textAlign: "right" }}>
          {Math.round(WEEK_DATA.progress)}% complete · {40 - WEEK_DATA.week} weeks to go 🎉
        </p>
      </div>
    </div>
  );
}

function MoodCard({ mood, setMood }) {
  return (
    <div className="card animate-in-delay-2" style={{ background: `linear-gradient(135deg, ${C.sky}55, ${C.sky}22)` }}>
      <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textMid, marginBottom: 12 }}>
        Daily Check-in
      </p>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", color: C.textDark, marginBottom: 16 }}>
        How are you feeling today?
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {MOODS.map((m, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <button
              className={`mood-btn ${mood === i ? "selected" : ""}`}
              onClick={() => setMood(mood === i ? null : i)}
              title={MOOD_LABELS[i]}
            >{m}</button>
            <p style={{ fontSize: "0.6rem", color: C.textMid, marginTop: 3, fontWeight: 700, letterSpacing: "0.03em" }}>
              {MOOD_LABELS[i]}
            </p>
          </div>
        ))}
      </div>
      {mood !== null && (
        <div style={{
          marginTop: 16, padding: "10px 16px", borderRadius: 12,
          background: `${C.lavender}44`,
          fontSize: "0.85rem", color: C.textDark,
          animation: "floatIn 0.3s ease",
        }}>
          {[
            "You're glowing! 🌟 Keep embracing this joy.",
            "Peace looks beautiful on you. 🕊️ Rest when you need to.",
            "Feeling tired is normal — your body is doing amazing things. 💪",
            "Nausea is tough but temporary. Ginger tea can help! 🫚",
            "It's okay to feel anxious. Take a slow breath. You've got this. 💜",
            "That love you feel? Your baby feels it too. 🥰",
          ][mood]}
        </div>
      )}
    </div>
  );
}

function TipCard() {
  const tips = [
    { emoji: "💧", title: "Stay Hydrated", tip: "Aim for 8–10 glasses of water today. Add cucumber or lemon for a refreshing twist!" },
    { emoji: "🚶‍♀️", title: "Gentle Movement", tip: "A 20-minute prenatal walk improves circulation and boosts your mood naturally." },
    { emoji: "😴", title: "Sleep Matters", tip: "Try sleeping on your left side with a pillow between your knees for better comfort." },
  ];
  const tip = tips[new Date().getDay() % 3];

  return (
    <div className="card animate-in-delay-3" style={{ background: `linear-gradient(135deg, ${C.mint}55, ${C.yellow}44)` }}>
      <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textMid, marginBottom: 12 }}>
        Today's Wellness Tip
      </p>
      <div style={{ fontSize: "2rem", marginBottom: 8 }}>{tip.emoji}</div>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 400, color: C.textDark, marginBottom: 8 }}>
        {tip.title}
      </p>
      <p style={{ fontSize: "0.85rem", color: C.textMid, lineHeight: 1.6 }}>{tip.tip}</p>
    </div>
  );
}

function QuickLinksCard({ setActiveTab }) {
  const links = [
    { label: "Browse Jobs", icon: "💼", tab: "jobs", color: C.lavender },
    { label: "Shop Healthy", icon: "🛒", tab: "groceries", color: C.mint },
    { label: "Book Doctor", icon: "👩‍⚕️", tab: "doctor", color: C.peach },
    { label: "Chat Support", icon: "💬", tab: "chat", color: C.sky },
  ];

  return (
    <div className="card animate-in-delay-4" style={{ gridColumn: "span 3" }}>
      <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textMid, marginBottom: 16 }}>
        Quick Access
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {links.map(l => (
          <button
            key={l.tab}
            onClick={() => setActiveTab(l.tab)}
            style={{
              background: `${l.color}44`,
              border: "none", borderRadius: 16,
              padding: "16px 8px", cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "'Lato', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.background = `${l.color}88`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = `${l.color}44`; }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>{l.icon}</div>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: C.textDark }}>{l.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ setActiveTab }) {
  const [mood, setMood] = useState(null);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      {/* Welcome Banner */}
      <div className="animate-in" style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: "2.4rem",
          fontWeight: 700,
          color: C.textDark,
          marginBottom: 4,
        }}>
          {greeting}, Mama ✨
        </h1>
        <p style={{ fontSize: "1rem", color: C.textMid, fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
          Every day is a miracle. Here's your journey so far.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        <WeekCard />
        <MoodCard mood={mood} setMood={setMood} />
        <TipCard />
        <QuickLinksCard setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

// ── JOB BOARD ──────────────────────────────────────────────────────────────
function JobCard({ job }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="card job-card animate-in" style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: `${C.lavender}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.6rem", flexShrink: 0,
          }}>{job.logo}</div>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: C.textDark, marginBottom: 2 }}>{job.title}</h3>
            <p style={{ fontSize: "0.82rem", color: C.textMid }}>{job.company} · {job.location}</p>
          </div>
        </div>
        <button
          onClick={() => setSaved(!saved)}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.3rem", flexShrink: 0 }}
          title={saved ? "Unsave" : "Save job"}
        >{saved ? "❤️" : "🤍"}</button>
      </div>

      <p style={{ margin: "14px 0 12px", fontSize: "0.85rem", color: C.textMid, lineHeight: 1.65 }}>{job.description}</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {job.tags.map(tag => (
          <span key={tag} className="pill" style={{ background: `${C.lavender}44`, color: C.textDark }}>{tag}</span>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontWeight: 700, color: C.textDark, fontSize: "0.9rem" }}>{job.salary}</span>
          <span className="pill" style={{ background: C.mint, color: "#3a7a5a", marginLeft: 8 }}>{job.type}</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: "0.75rem", color: C.textMid }}>{job.posted}</span>
          <button className="btn-primary">Apply →</button>
        </div>
      </div>
    </div>
  );
}

function JobBoard() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [loading, setLoading] = useState(false);

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                        j.company.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "All" || j.tags.includes(activeFilter);
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <div className="animate-in" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem", color: C.textDark, marginBottom: 6 }}>
          💼 Mother-Friendly Jobs
        </h1>
        <p style={{ color: C.textMid, fontSize: "0.9rem" }}>
          Curated remote & flexible opportunities — sourced fresh via Apify's Google Jobs Scraper
        </p>
      </div>

      {/* Search & Filters */}
      <div className="animate-in-delay-1" style={{ marginBottom: 24 }}>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: "1rem" }}>🔍</span>
          <input
            className="search-input"
            placeholder="Search by title, company, or keyword…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {JOB_FILTERS.map(f => (
            <button key={f} className={`filter-chip ${activeFilter === f ? "active" : ""}`}
              style={{ background: activeFilter === f ? undefined : `${C.lavender}22` }}
              onClick={() => setActiveFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* API Note */}
      <div className="animate-in-delay-2" style={{
        background: `${C.yellow}88`,
        border: `1px solid ${C.yellow}`,
        borderRadius: 14, padding: "12px 18px",
        fontSize: "0.82rem", color: C.textMid,
        marginBottom: 24, display: "flex", gap: 10, alignItems: "center",
      }}>
        <span>⚡</span>
        <span>
          <strong style={{ color: C.textDark }}>Live Data Mode:</strong> Connect your Apify token in <code style={{ background: `${C.lavender}33`, padding: "1px 6px", borderRadius: 6 }}>/backend/app.py</code> to replace these previews with real-time scraped jobs.
        </span>
      </div>

      {/* Results */}
      <p style={{ fontSize: "0.82rem", color: C.textMid, marginBottom: 16 }}>
        Showing <strong style={{ color: C.textDark }}>{filtered.length}</strong> opportunities
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.length > 0 ? filtered.map((job, i) => (
          <div key={job.id} style={{ animationDelay: `${i * 0.07}s` }}>
            <JobCard job={job} />
          </div>
        )) : (
          <div style={{ textAlign: "center", padding: 60, color: C.textMid }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🔍</div>
            <p>No jobs found for "<strong>{search}</strong>" with filter "<strong>{activeFilter}</strong>"</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── GROCERY LIST ───────────────────────────────────────────────────────────
function GroceryCard({ item }) {
  const [inCart, setInCart] = useState(false);
  return (
    <div className="card grocery-card" style={{
      opacity: inCart ? 0.6 : 1,
      transition: "opacity 0.3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: `${C.mint}66`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.7rem",
          }}>{item.emoji}</div>
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.textDark, marginBottom: 2 }}>{item.name}</h3>
            <p style={{ fontSize: "0.78rem", color: C.textMid }}>{item.unit} · {item.store}</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontWeight: 700, color: C.textDark, fontSize: "1rem" }}>{item.price}</p>
          <p style={{ fontSize: "0.72rem", color: C.textMid }}>⭐ {item.rating}</p>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
        <span className="pill" style={{ background: `${C.mint}66`, color: "#3a7a5a" }}>
          💚 {item.benefit}
        </span>
        <button
          className={inCart ? "btn-ghost" : "btn-primary"}
          style={{ fontSize: "0.78rem", padding: "7px 16px" }}
          onClick={() => setInCart(!inCart)}
        >
          {inCart ? "✓ Added" : "+ Add to Cart"}
        </button>
      </div>
    </div>
  );
}

function GroceryList() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = MOCK_GROCERIES.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || g.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <div className="animate-in" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem", color: C.textDark, marginBottom: 6 }}>
          🛒 Prenatal Essentials
        </h1>
        <p style={{ color: C.textMid, fontSize: "0.9rem" }}>
          Hand-picked nutritious groceries for you and your baby — powered by Apify's Instacart scraper
        </p>
      </div>

      {/* Search & Filters */}
      <div className="animate-in-delay-1" style={{ marginBottom: 24 }}>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: "1rem" }}>🔍</span>
          <input
            className="search-input"
            placeholder="Search groceries…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {GROCERY_CATEGORIES.map(cat => (
            <button key={cat} className={`filter-chip ${activeCategory === cat ? "active" : ""}`}
              style={{ background: activeCategory === cat ? undefined : `${C.mint}33` }}
              onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* API Note */}
      <div className="animate-in-delay-2" style={{
        background: `${C.mint}55`,
        border: `1px solid ${C.mint}`,
        borderRadius: 14, padding: "12px 18px",
        fontSize: "0.82rem", color: C.textMid,
        marginBottom: 24, display: "flex", gap: 10, alignItems: "center",
      }}>
        <span>🌿</span>
        <span>
          <strong style={{ color: C.textDark }}>Live Data Mode:</strong> Connect Apify's Instacart actor in your backend to pull real-time product listings and prices.
        </span>
      </div>

      <p style={{ fontSize: "0.82rem", color: C.textMid, marginBottom: 16 }}>
        Showing <strong style={{ color: C.textDark }}>{filtered.length}</strong> items
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {filtered.map((item, i) => (
          <div key={item.id} style={{ animationDelay: `${i * 0.05}s` }}>
            <GroceryCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── COMING SOON ────────────────────────────────────────────────────────────
function ComingSoon({ icon, title, subtitle, color }) {
  return (
    <div style={{ maxWidth: 800, margin: "60px auto", padding: "0 24px" }}>
      <div className="coming-soon-card" style={{ background: `linear-gradient(135deg, ${color}33, ${C.lavender}22)` }}>
        <div style={{ fontSize: "4rem", marginBottom: 20 }}>{icon}</div>
        <h2 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2.2rem", color: C.textDark, marginBottom: 12 }}>
          {title}
        </h2>
        <p style={{ color: C.textMid, fontSize: "1rem", maxWidth: 340 }}>{subtitle}</p>
        <div style={{ marginTop: 28 }}>
          <span className="pill" style={{ background: C.peach, color: C.textDark, fontSize: "0.8rem", padding: "6px 18px" }}>
            Coming Soon ✨
          </span>
        </div>
      </div>
    </div>
  );
}

// ── APP ROOT ───────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":  return <Dashboard setActiveTab={setActiveTab} />;
      case "jobs":       return <JobBoard />;
      case "groceries":  return <GroceryList />;
      case "doctor":     return <ComingSoon icon="👩‍⚕️" title="Doctor Finder" color={C.peach} subtitle="Search and book prenatal specialist appointments near you — coming very soon." />;
      case "chat":       return <ComingSoon icon="💬" title="Support Chat" color={C.sky} subtitle="Talk to certified doulas, nurses, and other mamas 24/7 — launching soon." />;
      case "midwife":    return <ComingSoon icon="🌿" title="Midwife Connect" color={C.mint} subtitle="Connect with certified midwives for holistic prenatal care — coming soon." />;
      case "calendar":   return <ComingSoon icon="📅" title="Pregnancy Calendar" color={C.yellow} subtitle="Track appointments, milestones, and baby's growth week by week — coming soon." />;
      default:           return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      <style>{styles}</style>
      {/* Ambient blobs */}
      <div className="floating-blob" style={{ width: 500, height: 500, background: C.lavender, top: -100, right: -100 }} />
      <div className="floating-blob" style={{ width: 400, height: 400, background: C.peach, bottom: -50, left: -80 }} />
      <div className="floating-blob" style={{ width: 300, height: 300, background: C.mint, top: "40%", left: "30%" }} />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main>{renderContent()}</main>
      </div>
    </>
  );
}