import type { AdminAnalyticsQuery } from "@/server/modules/admin/schema";
import { regionConfig } from "@/server/config/region";

export function slugFromName(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || `barber-${Date.now()}`;
}

export function parseExperienceYears(experience: string): number {
  const match = experience.match(/(\d+)/);
  return match ? Number.parseInt(match[1]!, 10) : 0;
}

export function reportDateRange(query: { range: string; start?: string; end?: string }): {
  gte: Date;
  lte: Date;
} {
  const now = new Date();
  if (query.range === "custom" && query.start && query.end) {
    return {
      gte: new Date(`${query.start}T00:00:00`),
      lte: new Date(`${query.end}T23:59:59`),
    };
  }

  const gte = new Date(now);
  if (query.range === "today") {
    gte.setHours(0, 0, 0, 0);
    return { gte, lte: now };
  }
  if (query.range === "week") {
    gte.setDate(gte.getDate() - 7);
    return { gte, lte: now };
  }
  if (query.range === "year") {
    gte.setFullYear(gte.getFullYear() - 1);
    return { gte, lte: now };
  }
  gte.setMonth(gte.getMonth() - 1);
  return { gte, lte: now };
}

export function analyticsDateRange(query: AdminAnalyticsQuery): { gte: Date; lte: Date } {
  return reportDateRange({
    range: query.period,
    start: query.start,
    end: query.end,
  });
}

export function percentDelta(current: number, previous: number): number {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function buildDailyTrendSeries(
  rows: { startAt: Date }[],
  range: { gte: Date; lte: Date },
): { labels: string[]; data: number[] } {
  const buckets = new Map<string, number>();
  const cursor = new Date(range.gte);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(range.lte);
  end.setHours(0, 0, 0, 0);

  while (cursor <= end) {
    buckets.set(cursor.toISOString().slice(0, 10), 0);
    cursor.setDate(cursor.getDate() + 1);
  }

  for (const row of rows) {
    const key = row.startAt.toISOString().slice(0, 10);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  const labels = [...buckets.keys()].map((key) => {
    const date = new Date(`${key}T12:00:00`);
    return date.toLocaleDateString(regionConfig.locale, { month: "short", day: "numeric" });
  });

  return {
    labels,
    data: [...buckets.values()],
  };
}

export function peakBookingPatterns(rows: { startAt: Date }[]): {
  peakBookingDay: string;
  peakBookingTime: string;
} {
  if (rows.length === 0) {
    return { peakBookingDay: "—", peakBookingTime: "—" };
  }

  const byDay = new Map<number, number>();
  const byHour = new Map<number, number>();

  for (const row of rows) {
    const day = row.startAt.getDay();
    const hour = row.startAt.getHours();
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
    byHour.set(hour, (byHour.get(hour) ?? 0) + 1);
  }

  const peakDay = [...byDay.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const peakHour = [...byHour.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  const formatHour = (hour: number) => {
    const suffix = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 || 12;
    return `${h}:00 ${suffix}`;
  };

  return {
    peakBookingDay: peakDay !== undefined ? (DAY_NAMES[peakDay] ?? "—") : "—",
    peakBookingTime: peakHour !== undefined ? formatHour(peakHour) : "—",
  };
}
