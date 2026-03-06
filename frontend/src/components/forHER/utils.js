export function daysUntil(date) {
  return Math.max(0, Math.ceil((date - Date.now()) / 86400000));
}
export function formatDate(date) {
  return date.toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" });
}
export function todayIndex() {
  return new Date().getDay(); // 0–6
}

// ════════════════════════════════════════════════════════════════════════════
//  NEW WIDGET 1 — DAILY AFFIRMATION

