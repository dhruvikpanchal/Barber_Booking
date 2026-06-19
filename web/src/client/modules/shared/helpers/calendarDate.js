const DATE_KEY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_KEY_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** `Date.getTimezoneOffset()` — pass through to booking/slot APIs. */
export function getBookingTimezoneOffsetMinutes() {
  return new Date().getTimezoneOffset();
}

export function parseDateKeyParts(dateKey) {
  const match = DATE_KEY_REGEX.exec(dateKey);
  if (!match) {
    throw new Error(`Invalid date key: ${dateKey}`);
  }
  const [, y, m, d] = match;
  return { y: Number(y), m: Number(m), d: Number(d) };
}

export function dayOfWeekFromDateKey(dateKey) {
  const { y, m, d } = parseDateKeyParts(dateKey);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0, 0)).getUTCDay();
}

/**
 * Wall-clock date + time → UTC instant (matches server `wallClockToInstant`).
 * @param {number} timezoneOffsetMinutes `Date.getTimezoneOffset()` from the browser.
 */
export function wallClockToInstant(dateKey, timeKey, timezoneOffsetMinutes = 0) {
  const timeMatch = TIME_KEY_REGEX.exec(timeKey);
  if (!timeMatch) {
    throw new Error(`Invalid time key: ${timeKey}`);
  }

  const { y, m, d } = parseDateKeyParts(dateKey);
  const h = Number(timeMatch[1]);
  const min = Number(timeMatch[2]);
  const utcMs =
    Date.UTC(y, m - 1, d, h, min, 0, 0) + timezoneOffsetMinutes * 60_000;
  return new Date(utcMs);
}

export function wallClockDayBounds(dateKey, timezoneOffsetMinutes = 0) {
  const start = wallClockToInstant(dateKey, "00:00", timezoneOffsetMinutes);
  const end = new Date(start.getTime() + 24 * 60 * 60_000 - 1);
  return { start, end };
}

/** Normalize `H:mm` or `HH:mm` to zero-padded `HH:mm` for API validation. */
export function normalizeTimeKey(time) {
  if (!time) return time;
  const match = /^(\d{1,2}):(\d{1,2})$/.exec(time);
  if (!match) return time;
  const h = Number(match[1]);
  const m = Number(match[2]);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
