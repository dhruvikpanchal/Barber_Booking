import "dotenv/config";
import { db } from "../src/server/db/index.ts";
import { barberAnalyticsRepository } from "../src/server/modules/barber/repository.ts";
import { barberAnalyticsService } from "../src/server/modules/barber/service.ts";
import { barberProfileRepository } from "../src/server/modules/barber/repository.ts";

const profile = await db.query.barberProfiles.findFirst({
  columns: { id: true, userId: true },
});

if (!profile) {
  console.error("No barber profile found");
  process.exit(1);
}

console.log("Testing analytics for barber", profile.id);

const now = new Date();
const start = new Date(now.getFullYear(), now.getMonth(), 1);

try {
  const stats = await barberAnalyticsRepository.getAggregateStats(profile.id, start, now);
  console.log("getAggregateStats OK", stats);
} catch (error) {
  console.error("getAggregateStats FAILED", error);
}

try {
  const growth = await barberAnalyticsRepository.getCustomerGrowth(
    profile.id,
    start,
    now,
    "day",
  );
  console.log("getCustomerGrowth OK", growth);
} catch (error) {
  console.error("getCustomerGrowth FAILED", error);
}

try {
  const data = await barberAnalyticsService.getAnalytics(profile.userId, { period: "month" });
  console.log("getAnalytics OK", {
    label: data.label,
    stats: data.stats,
    revenueTrendLen: data.revenueTrend.length,
  });
} catch (error) {
  console.error("getAnalytics FAILED", error);
}

process.exit(0);
