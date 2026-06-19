const DATE_KEY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_KEY_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export type DateKeyParts = { y: number; m: number; d: number };

/** Parse `YYYY-MM-DD` into numeric components (no `Date` timezone side effects). */
export function parseDateKeyParts(dateKey: string): DateKeyParts {
  const match = DATE_KEY_REGEX.exec(dateKey);
  if (!match) {
    throw new Error(`Invalid date key: ${dateKey}`);
  }
  const [, y, m, d] = match;
  return { y: Number(y), m: Number(m), d: Number(d) };
}

/** Day of week (0=Sun) for a calendar date — independent of server timezone. */
export function dayOfWeekFromDateKey(dateKey: string): number {
  const { y, m, d } = parseDateKeyParts(dateKey);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0, 0)).getUTCDay();
}

/**
 * Convert a wall-clock calendar date + time to a UTC instant.
 * `timezoneOffsetMinutes` is `Date.getTimezoneOffset()` from the client
 * (positive west of UTC, e.g. 300 for US Eastern).
 */
export function wallClockToInstant(
  dateKey: string,
  timeKey: string,
  timezoneOffsetMinutes = 0,
): Date {
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

/** Inclusive UTC bounds for one wall-clock calendar day in the client's timezone. */
export function wallClockDayBounds(
  dateKey: string,
  timezoneOffsetMinutes = 0,
): { start: Date; end: Date } {
  const start = wallClockToInstant(dateKey, "00:00", timezoneOffsetMinutes);
  const end = new Date(start.getTime() + 24 * 60 * 60_000 - 1);
  return { start, end };
}

export function startAtMatchesWallClock(
  startAt: Date,
  dateKey: string,
  timeKey: string,
  timezoneOffsetMinutes = 0,
  toleranceMs = 60_000,
): boolean {
  const expected = wallClockToInstant(dateKey, timeKey, timezoneOffsetMinutes);
  return Math.abs(startAt.getTime() - expected.getTime()) <= toleranceMs;
}
