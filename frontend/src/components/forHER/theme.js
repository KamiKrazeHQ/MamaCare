export function ensureForHerFonts() {
  if (document.getElementById("forher-fonts")) return;
  const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Lato:wght@300;400;700&family=Playfair+Display:ital,wght@0,400;1,400&display=swap";
fontLink.rel = "stylesheet";
  fontLink.id = "forher-fonts";
  document.head.appendChild(fontLink);
}

// THEME
export const C = {
  yellow:   "#FCF1C1",
  peach:    "#FFCAD4",
  lavender: "#D7C5FF",
  mint:     "#D1F0DE",
  sky:      "#BFE7FF",
  white:    "#FFFDF8",
  textDark: "#5a4a6a",
  textMid:  "#8a7a9a",
};

// GLOBAL STYLES
export const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Lato', sans-serif;
    color: ${C.textDark};
    background-color: ${C.white};
    background-image:
      radial-gradient(1200px 600px at 8% -10%, ${C.lavender}22 0%, transparent 58%),
      radial-gradient(900px 520px at 92% 0%, ${C.peach}1f 0%, transparent 60%),
      linear-gradient(180deg, #fffdf8 0%, #fffaf4 55%, #fffdf8 100%);
    background-attachment: fixed;
  }

  @keyframes floatIn {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeScale {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes shimmerSlide {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    14%      { transform: scale(1.12); }
    28%      { transform: scale(1); }
    42%      { transform: scale(1.08); }
    70%      { transform: scale(1); }
  }
  @keyframes checkPop {
    0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
    60%  { transform: scale(1.2) rotate(3deg);  opacity: 1; }
    100% { transform: scale(1)   rotate(0deg);  opacity: 1; }
  }
  @keyframes affirmShift {
    0%,100% { background-position: 0% 50%; }
    50%     { background-position: 100% 50%; }
  }

  .ai  { animation: floatIn   0.5s ease both; }
  .ai1 { animation: floatIn   0.5s ease 0.08s both; }
  .ai2 { animation: floatIn   0.5s ease 0.16s both; }
  .ai3 { animation: floatIn   0.5s ease 0.24s both; }
  .ai4 { animation: floatIn   0.5s ease 0.32s both; }
  .ai5 { animation: floatIn   0.5s ease 0.40s both; }
  .ai6 { animation: floatIn   0.5s ease 0.48s both; }
  .ai7 { animation: floatIn   0.5s ease 0.56s both; }

  .logo-text {
    font-family: 'Dancing Script', cursive;
    font-size: 2.2rem; font-weight: 700;
    background: linear-gradient(135deg, ${C.lavender}, #b89fe8, ${C.peach});
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0.3px 0.3px 0 rgba(90, 74, 106, 0.22);
  }

  .card {
    background: white; border-radius: 22px;
    padding: 22px;
    box-shadow: 0 4px 24px rgba(90,74,106,0.07);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .card:hover { transform: translateY(-3px); box-shadow: 0 10px 36px rgba(90,74,106,0.13); }

  .nav-tab {
    padding: 8px 16px; border-radius: 20px;
    font-size: 0.8rem; font-weight: 700;
    letter-spacing: 0.05em; text-transform: uppercase;
    cursor: pointer; border: none; transition: all 0.22s ease;
    background: transparent; color: ${C.textMid};
  }
  .nav-tab:hover { background: ${C.lavender}33; color: ${C.textDark}; transform: translateY(-1px); }
  .nav-tab.active { background: ${C.lavender}; color: ${C.textDark}; box-shadow: 0 4px 12px ${C.lavender}88; }

  .pill {
    display: inline-block; padding: 3px 11px; border-radius: 20px;
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.04em; text-transform: uppercase;
  }

  .btn-primary {
    background: ${C.peach}; color: ${C.textDark}; border: none;
    border-radius: 20px; padding: 9px 20px;
    font-family: 'Lato', sans-serif; font-weight: 700;
    font-size: 0.8rem; letter-spacing: 0.05em;
    cursor: pointer; transition: all 0.22s ease; text-transform: uppercase;
  }
  .btn-primary:hover { background: #ffb3c1; transform: translateY(-2px); box-shadow: 0 4px 14px ${C.peach}99; }

  .btn-ghost {
    background: transparent; border: 2px solid ${C.lavender};
    color: ${C.textDark}; border-radius: 20px; padding: 7px 16px;
    font-family: 'Lato', sans-serif; font-weight: 700;
    font-size: 0.76rem; cursor: pointer; transition: all 0.22s ease;
    letter-spacing: 0.04em; text-transform: uppercase;
  }
  .btn-ghost:hover { background: ${C.lavender}33; transform: translateY(-1px); }

  .mood-btn {
    width: 50px; height: 50px; border-radius: 50%;
    border: 3px solid transparent; font-size: 1.5rem;
    cursor: pointer; background: white; transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  }
  .mood-btn:hover    { transform: scale(1.15); box-shadow: 0 4px 16px rgba(0,0,0,0.13); }
  .mood-btn.selected { border-color: ${C.lavender}; background: ${C.lavender}33; transform: scale(1.15); }

  .progress-track { height: 10px; background: ${C.lavender}44; border-radius: 10px; overflow: hidden; }
  .progress-fill  {
    height: 100%; border-radius: 10px;
    background: linear-gradient(90deg, ${C.lavender}, ${C.peach});
    transition: width 1.6s cubic-bezier(0.34,1.56,0.64,1);
  }

  /* Checklist item */
  .check-item {
    display: flex; align-items: center; gap: 12px;
    padding: 9px 0; border-bottom: 1px solid ${C.lavender}22;
    cursor: pointer; transition: background 0.15s ease;
    border-radius: 8px; padding: 8px 10px;
  }
  .check-item:hover { background: ${C.lavender}11; }
  .check-item:last-child { border-bottom: none; }

  .check-box {
    width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0;
    border: 2px solid ${C.lavender}; display: flex; align-items: center;
    justify-content: center; transition: all 0.2s ease; background: white;
  }
  .check-box.checked {
    background: ${C.lavender}; border-color: ${C.lavender};
    animation: checkPop 0.28s ease both;
  }

  /* Affirmation shimmer */
  .affirmation-bg {
    background: linear-gradient(270deg, ${C.peach}88, ${C.lavender}88, ${C.sky}88, ${C.mint}88);
    background-size: 400% 400%;
    animation: affirmShift 8s ease infinite;
    border-radius: 18px; padding: 20px 22px;
  }

  /* Dev fact flip */
  .fact-inner {
    transition: all 0.4s ease;
  }

  .search-input {
    width: 100%; padding: 11px 18px 11px 42px;
    border: 2px solid ${C.lavender}55; border-radius: 20px;
    font-family: 'Lato', sans-serif; font-size: 0.88rem;
    color: ${C.textDark}; background: white; outline: none;
    transition: border-color 0.2s ease;
  }
  .search-input:focus { border-color: ${C.lavender}; box-shadow: 0 0 0 3px ${C.lavender}22; }

  .filter-chip {
    padding: 6px 14px; border-radius: 20px; font-size: 0.76rem;
    font-weight: 700; cursor: pointer; border: 2px solid transparent;
    transition: all 0.2s ease;
  }
  .filter-chip.active  { border-color: ${C.lavender}; background: ${C.lavender}55; }
  .filter-chip:not(.active) { background: ${C.mint}55; color: ${C.textMid}; }

  .job-card      { border-left: 4px solid ${C.lavender}; }
  .grocery-card  { border-left: 4px solid ${C.mint}; }

  .week-badge {
    font-family: 'Dancing Script', cursive;
    font-size: 3.4rem; font-weight: 700; color: ${C.lavender}; line-height: 1;
  }

  .appt-countdown {
    font-family: 'Dancing Script', cursive;
    font-size: 3rem; font-weight: 700;
    color: ${C.peach === "#FFCAD4" ? "#e87a90" : C.peach};
    line-height: 1;
  }

  .floating-blob {
    position: fixed; border-radius: 50%;
    filter: blur(70px); opacity: 0.15; pointer-events: none; z-index: 0;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${C.sky}22; }
  ::-webkit-scrollbar-thumb { background: ${C.lavender}88; border-radius: 10px; }

  .coming-soon-card {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 320px;
    background: linear-gradient(135deg, ${C.sky}55, ${C.mint}55);
    border-radius: 24px; text-align: center; padding: 48px;
  }
`;


