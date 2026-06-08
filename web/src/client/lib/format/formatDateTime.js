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

/** e.g. Jan 5, 2026 */
export function formatShortDate(iso) {
  if (!iso) return "—";
  return formatDateLabel(iso, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** e.g. Friday, January 5, 2026 */
export function formatLongDate(iso) {
  if (!iso) return "—";
  return formatDateLabel(iso, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** e.g. Today, Yesterday, 3d ago, 2w ago */
/** e.g. just now, 5m ago, Yesterday, Jan 5 */
export function formatActivityTimestamp(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  const hrs = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days === 1) return "Yesterday";
  return formatDateLabel(iso, { day: "numeric", month: "short" });
}

export function formatRelativeAge(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}
