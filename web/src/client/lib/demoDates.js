/**
 * Stable anchor for mock data so module init matches on server and client.
 * Avoids `new Date()` at import time (hydration mismatches).
 */
export const DEMO_ANCHOR_ISO = "2024-06-15T17:00:00.000Z";

export function demoDayOffset(days, hour, minute = 0) {
  const d = new Date(DEMO_ANCHOR_ISO);
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function demoMinutesAgo(minutes) {
  return new Date(
    new Date(DEMO_ANCHOR_ISO).getTime() - minutes * 60_000,
  ).toISOString();
}
