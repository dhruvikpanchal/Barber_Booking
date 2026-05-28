/** Fixed locale so SSR (Node) and the browser format the same text. */
export const DISPLAY_LOCALE = "en-US";

export function formatTimeLabel(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString(DISPLAY_LOCALE, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDateLabel(iso, options = {}) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(DISPLAY_LOCALE, options);
}

export function formatTimeAgo(iso, nowMs = Date.now()) {
  if (!iso) return "";
  const m = Math.round((nowMs - new Date(iso).getTime()) / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export function getGreeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function getTodayDateLabel(date = new Date()) {
  return date.toLocaleDateString(DISPLAY_LOCALE, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
