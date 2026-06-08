import type { AdminAnalyticsQuery } from "@/server/modules/admin/schema";

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

export function dayLabelsForRange(gte: Date, lte: Date): string[] {
  const labels: string[] = [];
  const cursor = new Date(gte);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(lte);
  end.setHours(23, 59, 59, 999);

  while (cursor <= end && labels.length < 14) {
    labels.push(
      cursor.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    );
    cursor.setDate(cursor.getDate() + 1);
  }

  return labels.length > 0 ? labels : ["—"];
}
