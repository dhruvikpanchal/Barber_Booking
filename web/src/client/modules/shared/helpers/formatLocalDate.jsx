import { parseDateKeyParts } from "@/client/modules/shared/helpers/calendarDate.js";

/** @param {Date | string} date */
export function formatLocalDate(date) {
  const d = date instanceof Date ? date : parseLocalDateKey(date) ?? new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse `YYYY-MM-DD` in local time (avoids UTC midnight shifts). */
export function parseLocalDateKey(key) {
  if (!key || typeof key !== "string") return null;
  try {
    const { y, m, d } = parseDateKeyParts(key);
    return new Date(y, m - 1, d);
  } catch {
    return null;
  }
}

/** Format a local date key or ISO string for display. */
export function formatLongLocalDate(value, locale = undefined) {
  if (!value) return "—";
  const d = parseLocalDateKey(value) ?? new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
