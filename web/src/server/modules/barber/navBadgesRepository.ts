import { and, eq, exists, gt, isNull, max, sql } from "drizzle-orm";
import {
  appointments,
  barberNavSeen,
  db,
  queueEntries,
  reviews,
} from "@/server/db";
import {
  BARBER_NAV_SECTION_KEYS,
  type BarberNavSection,
} from "@/server/modules/barber/constants";
import { QUEUE_SOURCE } from "@/server/modules/shared/constants/QueueSource";
import {
  APPOINTMENT_STATUS,
  WALK_IN_STATUS,
} from "@/server/modules/shared/constants/statuses";

export type BarberNavBadgeCounts = Record<BarberNavSection, number>;

const queueBadgeConditions = (barberId: string) =>
  and(
    eq(queueEntries.barberId, barberId),
    eq(queueEntries.source, QUEUE_SOURCE.ONLINE),
    eq(queueEntries.status, WALK_IN_STATUS.WAITING),
    eq(appointments.status, APPOINTMENT_STATUS.CONFIRMED),
  );

async function getMaxTimestampForSection(
  barberId: string,
  section: BarberNavSection,
): Promise<Date | null> {
  switch (section) {
    case "appointments": {
      const [row] = await db
        .select({ value: max(appointments.bookedAt) })
        .from(appointments)
        .where(
          and(
            eq(appointments.barberId, barberId),
            eq(appointments.status, APPOINTMENT_STATUS.PENDING),
          ),
        );
      return row?.value ?? null;
    }
    case "queue": {
      const [row] = await db
        .select({ value: max(appointments.confirmedAt) })
        .from(queueEntries)
        .innerJoin(appointments, eq(queueEntries.appointmentId, appointments.id))
        .where(queueBadgeConditions(barberId));
      return row?.value ?? null;
    }
    case "reviews": {
      const [row] = await db
        .select({ value: max(reviews.createdAt) })
        .from(reviews)
        .where(and(eq(reviews.barberId, barberId), isNull(reviews.barberReply)));
      return row?.value ?? null;
    }
    default:
      return null;
  }
}

async function countNewForSection(
  barberId: string,
  section: BarberNavSection,
  lastSeenAt: Date,
): Promise<number> {
  switch (section) {
    case "appointments":
      return db.$count(
        appointments,
        and(
          eq(appointments.barberId, barberId),
          eq(appointments.status, APPOINTMENT_STATUS.PENDING),
          gt(appointments.bookedAt, lastSeenAt),
        ),
      );
    case "queue":
      return db.$count(
        queueEntries,
        and(
          eq(queueEntries.barberId, barberId),
          eq(queueEntries.source, QUEUE_SOURCE.ONLINE),
          eq(queueEntries.status, WALK_IN_STATUS.WAITING),
          exists(
            db
              .select({ one: sql`1` })
              .from(appointments)
              .where(
                and(
                  eq(appointments.id, queueEntries.appointmentId),
                  eq(appointments.status, APPOINTMENT_STATUS.CONFIRMED),
                  gt(appointments.confirmedAt, lastSeenAt),
                ),
              ),
          ),
        ),
      );
    case "reviews":
      return db.$count(
        reviews,
        and(
          eq(reviews.barberId, barberId),
          isNull(reviews.barberReply),
          gt(reviews.createdAt, lastSeenAt),
        ),
      );
    default:
      return 0;
  }
}

export const barberNavBadgesRepository = {
  findLastSeenRow(barberUserId: string, section: BarberNavSection) {
    return db.query.barberNavSeen.findFirst({
      where: and(eq(barberNavSeen.barberUserId, barberUserId), eq(barberNavSeen.section, section)),
    });
  },

  async upsertLastSeen(barberUserId: string, section: BarberNavSection, lastSeenAt: Date) {
    const existing = await this.findLastSeenRow(barberUserId, section);
    const nextSeen = existing
      ? new Date(Math.max(existing.lastSeenAt.getTime(), lastSeenAt.getTime()))
      : lastSeenAt;

    if (existing) {
      await db
        .update(barberNavSeen)
        .set({ lastSeenAt: nextSeen, updatedAt: new Date() })
        .where(eq(barberNavSeen.id, existing.id));
    } else {
      await db.insert(barberNavSeen).values({
        barberUserId,
        section,
        lastSeenAt: nextSeen,
      });
    }

    return nextSeen;
  },

  async ensureWatermarked(barberUserId: string, barberId: string, section: BarberNavSection) {
    const existing = await this.findLastSeenRow(barberUserId, section);
    if (existing?.lastSeenAt) return existing.lastSeenAt;

    const maxTs = await getMaxTimestampForSection(barberId, section);
    const watermark = maxTs ?? new Date();
    return this.upsertLastSeen(barberUserId, section, watermark);
  },

  async countSectionBadge(
    barberUserId: string,
    barberId: string,
    section: BarberNavSection,
  ): Promise<number> {
    const lastSeenAt = await this.ensureWatermarked(barberUserId, barberId, section);
    return countNewForSection(barberId, section, lastSeenAt);
  },

  async getBadgeCounts(barberUserId: string, barberId: string): Promise<BarberNavBadgeCounts> {
    const entries = await Promise.all(
      BARBER_NAV_SECTION_KEYS.map(async (section) => {
        const value = await this.countSectionBadge(barberUserId, barberId, section);
        return [section, value] as const;
      }),
    );
    return Object.fromEntries(entries) as BarberNavBadgeCounts;
  },

  async markSectionSeen(barberUserId: string, section: BarberNavSection): Promise<Date> {
    return this.upsertLastSeen(barberUserId, section, new Date());
  },
};
