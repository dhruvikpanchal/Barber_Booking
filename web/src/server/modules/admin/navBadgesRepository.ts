import { and, eq, gt, max } from "drizzle-orm";
import {
  adminNavSeen,
  appointments,
  barberProfiles,
  barberRequests,
  contactMessages,
  db,
  users,
} from "@/server/db";
import {
  ADMIN_NAV_SECTION_KEYS,
  type AdminNavSection,
} from "@/server/modules/admin/constants";
import { ROLES } from "@/server/modules/shared/constants/roles";
import { BARBER_REQUEST_STATUS } from "@/server/modules/shared/constants/statuses";

export type AdminNavBadgeCounts = Record<AdminNavSection, number>;

async function getMaxTimestampForSection(section: AdminNavSection): Promise<Date | null> {
  switch (section) {
    case "barber_requests": {
      const [row] = await db
        .select({ value: max(barberRequests.submittedAt) })
        .from(barberRequests)
        .where(eq(barberRequests.status, BARBER_REQUEST_STATUS.PENDING));
      return row?.value ?? null;
    }
    case "contact_messages": {
      const [row] = await db.select({ value: max(contactMessages.submittedAt) }).from(contactMessages);
      return row?.value ?? null;
    }
    case "users": {
      const [row] = await db
        .select({ value: max(users.createdAt) })
        .from(users)
        .where(eq(users.role, ROLES.CUSTOMER));
      return row?.value ?? null;
    }
    case "appointments": {
      const [row] = await db.select({ value: max(appointments.bookedAt) }).from(appointments);
      return row?.value ?? null;
    }
    case "barbers": {
      const [row] = await db.select({ value: max(barberProfiles.joinedAt) }).from(barberProfiles);
      return row?.value ?? null;
    }
    default:
      return null;
  }
}

async function countNewForSection(section: AdminNavSection, lastSeenAt: Date): Promise<number> {
  switch (section) {
    case "barber_requests":
      return db.$count(
        barberRequests,
        and(
          eq(barberRequests.status, BARBER_REQUEST_STATUS.PENDING),
          gt(barberRequests.submittedAt, lastSeenAt),
        ),
      );
    case "contact_messages":
      return db.$count(contactMessages, gt(contactMessages.submittedAt, lastSeenAt));
    case "users":
      return db.$count(
        users,
        and(eq(users.role, ROLES.CUSTOMER), gt(users.createdAt, lastSeenAt)),
      );
    case "appointments":
      return db.$count(appointments, gt(appointments.bookedAt, lastSeenAt));
    case "barbers":
      return db.$count(barberProfiles, gt(barberProfiles.joinedAt, lastSeenAt));
    default:
      return 0;
  }
}

export const adminNavBadgesRepository = {
  findLastSeenRow(adminUserId: string, section: AdminNavSection) {
    return db.query.adminNavSeen.findFirst({
      where: and(eq(adminNavSeen.adminUserId, adminUserId), eq(adminNavSeen.section, section)),
    });
  },

  async upsertLastSeen(adminUserId: string, section: AdminNavSection, lastSeenAt: Date) {
    const existing = await this.findLastSeenRow(adminUserId, section);
    const nextSeen = existing
      ? new Date(Math.max(existing.lastSeenAt.getTime(), lastSeenAt.getTime()))
      : lastSeenAt;

    if (existing) {
      await db
        .update(adminNavSeen)
        .set({ lastSeenAt: nextSeen, updatedAt: new Date() })
        .where(eq(adminNavSeen.id, existing.id));
    } else {
      await db.insert(adminNavSeen).values({
        adminUserId,
        section,
        lastSeenAt: nextSeen,
      });
    }

    return nextSeen;
  },

  async ensureWatermarked(adminUserId: string, section: AdminNavSection): Promise<Date> {
    const existing = await this.findLastSeenRow(adminUserId, section);
    if (existing?.lastSeenAt) return existing.lastSeenAt;

    const maxTs = await getMaxTimestampForSection(section);
    const watermark = maxTs ?? new Date();
    return this.upsertLastSeen(adminUserId, section, watermark);
  },

  async countSectionBadge(adminUserId: string, section: AdminNavSection): Promise<number> {
    const lastSeenAt = await this.ensureWatermarked(adminUserId, section);
    return countNewForSection(section, lastSeenAt);
  },

  async getBadgeCounts(adminUserId: string): Promise<AdminNavBadgeCounts> {
    const entries = await Promise.all(
      ADMIN_NAV_SECTION_KEYS.map(async (section) => {
        const value = await this.countSectionBadge(adminUserId, section);
        return [section, value] as const;
      }),
    );
    return Object.fromEntries(entries) as AdminNavBadgeCounts;
  },

  async markSectionSeen(adminUserId: string, section: AdminNavSection): Promise<Date> {
    return this.upsertLastSeen(adminUserId, section, new Date());
  },
};
