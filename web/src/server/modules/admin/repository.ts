import {
  and,
  asc,
  avg,
  count,
  desc,
  eq,
  exists,
  gte,
  inArray,
  isNotNull,
  lt,
  lte,
  or,
  sql,
  sum,
  type SQL,
} from "drizzle-orm";
import {
  db,
  appointments,
  appointmentServices,
  barberProfiles,
  barberRequests,
  barberSpecialties,
  chairs,
  contactMessages,
  notifications,
  queueEntries,
  reviews,
  services,
  shops,
  users,
  type Appointment,
} from "@/server/db";
import { contains } from "@/server/db/helpers";
import { getPrismaSkipTake } from "@/server/modules/shared/helpers/pagination";
import { NOTIFICATION_TYPE } from "@/server/modules/shared/constants/notificationTypes";
import { ROLES } from "@/server/modules/shared/constants/roles";
import {
  BARBER_REQUEST_STATUS,
  CONTACT_REPLY_STATUS,
} from "@/server/modules/shared/constants/statuses";
import { parseExperienceYears, slugFromName } from "@/server/modules/admin/helpers";
import { ensureDefaultBarberChairs } from "@/server/modules/barber/repository";
import type { AdminNotificationTabKey } from "@/server/modules/admin/constants";
import type {
  AdminAppointmentsQuery,
  AdminBarberRequestsQuery,
  AdminBarbersQuery,
  AdminContactMessagesQuery,
  AdminNotificationsQuery,
  AdminUsersQuery,
} from "@/server/modules/admin/schema";

type CancelledBy = NonNullable<Appointment["cancelledBy"]>;

type AppointmentCountFilter = {
  status?: string;
  bookedAt?: { gte?: Date; lt?: Date; lte?: Date };
};

type UserCountShape = { appointments: number; reviews: number };

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function appointmentDateRangeCondition(dateRange: string): SQL | undefined {
  if (dateRange === "all") return undefined;

  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  if (dateRange === "today") {
    return and(gte(appointments.startAt, todayStart), lte(appointments.startAt, todayEnd));
  }

  if (dateRange === "tomorrow") {
    const t = new Date(now);
    t.setDate(t.getDate() + 1);
    return and(gte(appointments.startAt, startOfDay(t)), lte(appointments.startAt, endOfDay(t)));
  }

  if (dateRange === "week") {
    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return and(gte(appointments.startAt, todayStart), lt(appointments.startAt, weekEnd));
  }

  if (dateRange === "past") {
    return lt(appointments.startAt, todayStart);
  }

  return undefined;
}

function buildAppointmentCountConditions(where?: AppointmentCountFilter): SQL | undefined {
  if (!where) return undefined;

  const parts: SQL[] = [];
  if (where.status) {
    parts.push(eq(appointments.status, where.status as Appointment["status"]));
  }
  if (where.bookedAt?.gte) {
    parts.push(gte(appointments.bookedAt, where.bookedAt.gte));
  }
  if (where.bookedAt?.lt) {
    parts.push(lt(appointments.bookedAt, where.bookedAt.lt));
  }
  if (where.bookedAt?.lte) {
    parts.push(lte(appointments.bookedAt, where.bookedAt.lte));
  }

  return parts.length > 0 ? and(...parts) : undefined;
}

function toDbAppointmentStatus(status: string): Appointment["status"] {
  return status.toUpperCase().replace(/-/g, "_") as Appointment["status"];
}

function reorderByIds<T extends { id: string }>(items: T[], ids: string[]): T[] {
  const map = new Map(items.map((item) => [item.id, item]));
  return ids.map((id) => map.get(id)).filter((item): item is T => item !== undefined);
}

async function attachUserCounts<T extends { id: string }>(
  rows: T[],
): Promise<(T & { _count: UserCountShape })[]> {
  if (rows.length === 0) return [];

  const ids = rows.map((row) => row.id);
  const [apptCounts, reviewCounts] = await Promise.all([
    db
      .select({ customerId: appointments.customerId, cnt: count() })
      .from(appointments)
      .where(inArray(appointments.customerId, ids))
      .groupBy(appointments.customerId),
    db
      .select({ customerId: reviews.customerId, cnt: count() })
      .from(reviews)
      .where(inArray(reviews.customerId, ids))
      .groupBy(reviews.customerId),
  ]);

  const apptMap = new Map(apptCounts.map((r) => [r.customerId, Number(r.cnt)]));
  const reviewMap = new Map(reviewCounts.map((r) => [r.customerId, Number(r.cnt)]));

  return rows.map((row) => ({
    ...row,
    _count: {
      appointments: apptMap.get(row.id) ?? 0,
      reviews: reviewMap.get(row.id) ?? 0,
    },
  }));
}

const appointmentListWith = {
  customer: {
    columns: { fullName: true, email: true, phone: true },
  },
  barber: {
    columns: { id: true },
    with: {
      user: { columns: { fullName: true } },
      shop: { columns: { city: true } },
    },
  },
  services: {
    columns: { name: true, price: true, duration: true },
  },
} as const;

const barberListWith = {
  user: {
    columns: { fullName: true, email: true, phone: true, city: true },
  },
  shop: {
    columns: { name: true, city: true },
  },
  specialties: {
    columns: { name: true },
  },
} as const;

const barberRequestWith = {
  documents: true,
} as const;

function normalizeBarberRequest<T extends { documents: { uploadedAt: Date }[] }>(row: T): T {
  return {
    ...row,
    documents: [...row.documents].sort((a, b) => a.uploadedAt.getTime() - b.uploadedAt.getTime()),
  } as T;
}

const adminUserColumns = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  photoUrl: true,
  city: true,
  isActive: true,
  createdAt: true,
  lastActiveAt: true,
} as const;

function buildAppointmentListConditions(query: AdminAppointmentsQuery): SQL | undefined {
  const { status, dateRange, city, barberId, q } = query;
  const parts: SQL[] = [];

  if (status && status !== "all") {
    parts.push(eq(appointments.status, toDbAppointmentStatus(status)));
  }

  const dateFilter = appointmentDateRangeCondition(dateRange);
  if (dateFilter) parts.push(dateFilter);

  if (barberId) parts.push(eq(appointments.barberId, barberId));

  if (city) {
    parts.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(barberProfiles)
          .innerJoin(shops, eq(barberProfiles.shopId, shops.id))
          .where(and(eq(barberProfiles.id, appointments.barberId), contains(shops.city, city))),
      ),
    );
  }

  if (q) {
    parts.push(
      or(
        contains(appointments.id, q),
        exists(
          db
            .select({ one: sql`1` })
            .from(users)
            .where(and(eq(users.id, appointments.customerId), contains(users.fullName, q))),
        ),
        exists(
          db
            .select({ one: sql`1` })
            .from(barberProfiles)
            .innerJoin(users, eq(barberProfiles.userId, users.id))
            .where(and(eq(barberProfiles.id, appointments.barberId), contains(users.fullName, q))),
        ),
        exists(
          db
            .select({ one: sql`1` })
            .from(appointmentServices)
            .where(
              and(
                eq(appointmentServices.appointmentId, appointments.id),
                contains(appointmentServices.name, q),
              ),
            ),
        ),
      )!,
    );
  }

  return parts.length > 0 ? and(...parts) : undefined;
}

function buildBarberListConditions(query: AdminBarbersQuery): SQL | undefined {
  const { status, q, city } = query;
  const parts: SQL[] = [];

  if (status && status !== "all") {
    parts.push(
      eq(
        barberProfiles.barberStatus,
        status.toUpperCase() as (typeof barberProfiles.$inferSelect)["barberStatus"],
      ),
    );
  }

  if (city) {
    parts.push(
      or(
        exists(
          db
            .select({ one: sql`1` })
            .from(shops)
            .where(and(eq(shops.id, barberProfiles.shopId), contains(shops.city, city))),
        ),
        exists(
          db
            .select({ one: sql`1` })
            .from(users)
            .where(and(eq(users.id, barberProfiles.userId), contains(users.city, city))),
        ),
      )!,
    );
  }

  if (q) {
    parts.push(
      or(
        exists(
          db
            .select({ one: sql`1` })
            .from(users)
            .where(
              and(
                eq(users.id, barberProfiles.userId),
                or(contains(users.fullName, q), contains(users.email, q)),
              ),
            ),
        ),
        exists(
          db
            .select({ one: sql`1` })
            .from(shops)
            .where(and(eq(shops.id, barberProfiles.shopId), contains(shops.name, q))),
        ),
      )!,
    );
  }

  return parts.length > 0 ? and(...parts) : undefined;
}

function barberSortNeedsUserJoin(sort: string): boolean {
  return sort === "name_asc" || sort === "name_desc" || !sort;
}

function barberProfileOrderBy(sort: string) {
  switch (sort) {
    case "rating_desc":
      return desc(barberProfiles.averageRating);
    case "rating_asc":
      return asc(barberProfiles.averageRating);
    case "reviews_desc":
      return desc(barberProfiles.reviewCount);
    case "appts_desc":
      return desc(barberProfiles.totalAppointments);
    case "joined_asc":
      return asc(barberProfiles.joinedAt);
    case "joined_desc":
      return desc(barberProfiles.joinedAt);
    default:
      return asc(barberProfiles.joinedAt);
  }
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function userOrderBy(sort: string) {
  switch (sort) {
    case "name_desc":
      return desc(users.fullName);
    case "joined_desc":
      return desc(users.createdAt);
    case "joined_asc":
      return asc(users.createdAt);
    case "last_active":
      return desc(users.lastActiveAt);
    case "name_asc":
    default:
      return asc(users.fullName);
  }
}

function buildUserListConditions(query: AdminUsersQuery): SQL {
  const { status, q } = query;
  const parts: SQL[] = [eq(users.role, ROLES.CUSTOMER)];

  if (status === "disabled") {
    parts.push(eq(users.isActive, false));
  } else if (status === "active") {
    parts.push(eq(users.isActive, true));
  } else if (status === "inactive") {
    parts.push(eq(users.isActive, true));
    parts.push(lt(users.lastActiveAt, daysAgo(90)));
  }

  if (q) {
    parts.push(or(contains(users.fullName, q), contains(users.email, q), contains(users.city, q))!);
  }

  return and(...parts)!;
}

// ─────────────────────────────────────────────────────────────────────────────
// Profile
// ─────────────────────────────────────────────────────────────────────────────

export const adminProfileRepository = {
  findAdminById(userId: string) {
    return db.query.users.findFirst({
      where: and(eq(users.id, userId), eq(users.role, ROLES.ADMIN)),
      columns: adminUserColumns,
    });
  },

  async updateAdminProfile(userId: string, data: { fullName?: string; phone?: string | null }) {
    const [row] = await db.update(users).set(data).where(eq(users.id, userId)).returning({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      phone: users.phone,
      photoUrl: users.photoUrl,
      city: users.city,
      isActive: users.isActive,
      createdAt: users.createdAt,
      lastActiveAt: users.lastActiveAt,
    });
    return row!;
  },

  findByIdForPassword(userId: string) {
    return db.query.users.findFirst({
      where: and(eq(users.id, userId), eq(users.role, ROLES.ADMIN)),
      columns: { id: true, passwordHash: true },
    });
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard & analytics
// ─────────────────────────────────────────────────────────────────────────────

export const adminDashboardRepository = {
  countCustomers() {
    return db.$count(users, eq(users.role, ROLES.CUSTOMER));
  },

  countActiveBarbers() {
    return db.$count(barberProfiles, eq(barberProfiles.barberStatus, "ACTIVE"));
  },

  countAppointments(where?: AppointmentCountFilter) {
    const conditions = buildAppointmentCountConditions(where);
    return conditions ? db.$count(appointments, conditions) : db.$count(appointments);
  },

  countPendingBarberRequests() {
    return db.$count(barberRequests, eq(barberRequests.status, BARBER_REQUEST_STATUS.PENDING));
  },

  countUnreadContactMessages() {
    return db.$count(contactMessages, eq(contactMessages.isRead, false));
  },

  recentAppointments(limit: number) {
    return db.query.appointments.findMany({
      limit,
      orderBy: (fields, { desc: descFn }) => [descFn(fields.bookedAt)],
      columns: {
        id: true,
        status: true,
        startAt: true,
        bookedAt: true,
      },
      with: {
        customer: { columns: { fullName: true } },
        barber: {
          columns: { id: true },
          with: { user: { columns: { fullName: true } } },
        },
        services: {
          columns: { name: true },
          limit: 1,
        },
      },
    });
  },

  bookingTrendSince(since: Date) {
    return db.query.appointments.findMany({
      where: gte(appointments.bookedAt, since),
      columns: { bookedAt: true },
      orderBy: (fields, { asc: ascFn }) => [ascFn(fields.bookedAt)],
    });
  },

  async cityBarberCounts() {
    const rows = await db
      .select({
        city: shops.city,
        barberCount: count(barberProfiles.id),
      })
      .from(shops)
      .leftJoin(barberProfiles, eq(barberProfiles.shopId, shops.id))
      .groupBy(shops.id, shops.city)
      .orderBy(desc(count(barberProfiles.id)));

    return rows.slice(0, 10).map((row) => ({
      city: row.city,
      _count: { barbers: Number(row.barberCount) },
    }));
  },
};

export const adminAnalyticsRepository = {
  async aggregateAppointments(range: { gte: Date; lte: Date }) {
    const rows = await db
      .select({
        status: appointments.status,
        idCount: count(appointments.id),
        finalPriceSum: sum(appointments.finalPrice),
        estimatedPriceSum: sum(appointments.estimatedPrice),
      })
      .from(appointments)
      .where(and(gte(appointments.startAt, range.gte), lte(appointments.startAt, range.lte)))
      .groupBy(appointments.status);

    return rows.map((row) => ({
      status: row.status,
      _count: { id: Number(row.idCount) },
      _sum: {
        finalPrice: row.finalPriceSum !== null ? Number(row.finalPriceSum) : null,
        estimatedPrice: row.estimatedPriceSum !== null ? Number(row.estimatedPriceSum) : null,
      },
    }));
  },

  countUsersSince(range: { gte: Date; lte: Date }) {
    return db.$count(
      users,
      and(
        gte(users.createdAt, range.gte),
        lte(users.createdAt, range.lte),
        eq(users.role, ROLES.CUSTOMER),
      ),
    );
  },

  countBarbers(range: { gte: Date; lte: Date }) {
    return db.$count(
      barberProfiles,
      and(gte(barberProfiles.joinedAt, range.gte), lte(barberProfiles.joinedAt, range.lte)),
    );
  },

  countActiveBarbers() {
    return db.$count(barberProfiles, eq(barberProfiles.barberStatus, "ACTIVE"));
  },

  countServices() {
    return db.$count(services, eq(services.isActive, true));
  },

  async averageBarberRating() {
    const [row] = await db
      .select({ averageRating: avg(barberProfiles.averageRating) })
      .from(barberProfiles);

    return {
      _avg: {
        averageRating: row?.averageRating !== null ? Number(row.averageRating) : null,
      },
    };
  },

  appointmentsInRange(range: { gte: Date; lte: Date }) {
    return db.query.appointments.findMany({
      where: and(gte(appointments.startAt, range.gte), lte(appointments.startAt, range.lte)),
      columns: { startAt: true, bookedAt: true, status: true },
    });
  },

  async topServicesInRange(range: { gte: Date; lte: Date }, limit = 5) {
    const rows = await db
      .select({
        name: appointmentServices.name,
        nameCount: count(appointmentServices.name),
      })
      .from(appointmentServices)
      .innerJoin(appointments, eq(appointmentServices.appointmentId, appointments.id))
      .where(and(gte(appointments.startAt, range.gte), lte(appointments.startAt, range.lte)))
      .groupBy(appointmentServices.name)
      .orderBy(desc(count(appointmentServices.name)))
      .limit(limit);

    return rows.map((row) => ({
      name: row.name,
      _count: { name: Number(row.nameCount) },
    }));
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Appointments
// ─────────────────────────────────────────────────────────────────────────────

export const adminAppointmentsRepository = {
  list(query: AdminAppointmentsQuery) {
    const { page, limit } = query;
    const { skip, take } = getPrismaSkipTake(page, limit);
    const where = buildAppointmentListConditions(query);

    const findMany = db.query.appointments.findMany({
      where,
      with: appointmentListWith,
      orderBy: (fields, { desc: descFn }) => [descFn(fields.startAt)],
      offset: skip,
      limit: take,
    });

    const countQuery = where ? db.$count(appointments, where) : db.$count(appointments);

    return Promise.all([findMany, countQuery]);
  },

  async countByStatus() {
    const rows = await db
      .select({
        status: appointments.status,
        idCount: count(appointments.id),
      })
      .from(appointments)
      .groupBy(appointments.status);

    return rows.map((row) => ({
      status: row.status,
      _count: { id: Number(row.idCount) },
    }));
  },

  findById(id: string) {
    return db.query.appointments.findFirst({
      where: eq(appointments.id, id),
      with: {
        ...appointmentListWith,
        modificationHistory: {
          columns: { id: true, actor: true, summary: true, at: true },
          orderBy: (fields, { asc: ascFn }) => [ascFn(fields.at)],
        },
      },
    });
  },

  async updateStatus(
    id: string,
    data: {
      status: string;
      cancelReason?: string | null;
      cancelledBy?: CancelledBy | null;
      barberNotes?: string | null;
      confirmedAt?: Date | null;
      arrivedAt?: Date | null;
      completedAt?: Date | null;
      cancelledAt?: Date | null;
      finalPrice?: number | null;
    },
  ) {
    await db
      .update(appointments)
      .set({
        status: data.status as Appointment["status"],
        cancelReason: data.cancelReason,
        cancelledBy: data.cancelledBy,
        barberNotes: data.barberNotes,
        confirmedAt: data.confirmedAt,
        arrivedAt: data.arrivedAt,
        completedAt: data.completedAt,
        cancelledAt: data.cancelledAt,
        finalPrice: data.finalPrice,
      })
      .where(eq(appointments.id, id));

    return db.query.appointments.findFirst({
      where: eq(appointments.id, id),
      with: appointmentListWith,
    });
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Barber requests
// ─────────────────────────────────────────────────────────────────────────────

export const adminBarberRequestsRepository = {
  list(query: AdminBarberRequestsQuery) {
    const { page, limit, tab, q } = query;
    const { skip, take } = getPrismaSkipTake(page, limit);

    const parts: SQL[] = [];
    if (tab && tab !== "all") {
      parts.push(
        eq(
          barberRequests.status,
          tab.toUpperCase() as (typeof barberRequests.$inferSelect)["status"],
        ),
      );
    }
    if (q) {
      parts.push(
        or(
          contains(barberRequests.id, q),
          contains(barberRequests.firstName, q),
          contains(barberRequests.lastName, q),
          contains(barberRequests.shopName, q),
          contains(barberRequests.city, q),
          contains(barberRequests.email, q),
        )!,
      );
    }
    const where = parts.length > 0 ? and(...parts) : undefined;

    const findMany = db.query.barberRequests.findMany({
      where,
      with: barberRequestWith,
      orderBy: (fields, { desc: descFn }) => [descFn(fields.submittedAt)],
      offset: skip,
      limit: take,
    });

    const countQuery = where ? db.$count(barberRequests, where) : db.$count(barberRequests);

    return Promise.all([findMany.then((rows) => rows.map(normalizeBarberRequest)), countQuery]);
  },

  findById(id: string) {
    return db.query.barberRequests
      .findFirst({
        where: eq(barberRequests.id, id),
        with: barberRequestWith,
      })
      .then((row) => (row ? normalizeBarberRequest(row) : undefined));
  },

  async approve(id: string, reviewedAt: Date) {
    const request = await db.query.barberRequests.findFirst({
      where: eq(barberRequests.id, id),
      with: barberRequestWith,
    });
    if (!request || request.status !== BARBER_REQUEST_STATUS.PENDING) {
      return null;
    }

    const user = await db.query.users.findFirst({
      where: and(eq(users.email, request.email), eq(users.role, ROLES.BARBER)),
      with: { barberProfile: true },
    });
    if (!user) return null;

    const fullName = `${request.firstName} ${request.lastName}`.trim();
    const baseSlug = slugFromName(fullName);

    return db.transaction(async (tx) => {
      let barberId = user.barberProfile?.id;

      if (!barberId) {
        let slug = baseSlug;
        let suffix = 1;
        while (
          await tx.query.barberProfiles.findFirst({
            where: eq(barberProfiles.slug, slug),
            columns: { id: true },
          })
        ) {
          slug = `${baseSlug}-${suffix++}`;
        }

        const specialtyNames = Array.isArray(request.specialties)
          ? (request.specialties as string[])
          : [];

        const [profile] = await tx
          .insert(barberProfiles)
          .values({
            userId: user.id,
            slug,
            displayRole: "Barber",
            bio: request.bio,
            experience: parseExperienceYears(request.experience),
            portfolioUrl: request.portfolioUrl,
            availability: request.availability,
            barberStatus: "ACTIVE",
            isAvailable: true,
          })
          .returning({ id: barberProfiles.id });

        barberId = profile!.id;

        if (specialtyNames.length > 0) {
          await tx.insert(barberSpecialties).values(
            specialtyNames.map((name) => ({
              barberId: barberId!,
              name,
            })),
          );
        }

        await ensureDefaultBarberChairs(barberId, tx);
      } else {
        await tx
          .update(barberProfiles)
          .set({ barberStatus: "ACTIVE", isAvailable: true })
          .where(eq(barberProfiles.id, barberId));
      }

      await tx.update(users).set({ isActive: true }).where(eq(users.id, user.id));

      const [updated] = await tx
        .update(barberRequests)
        .set({
          status: BARBER_REQUEST_STATUS.APPROVED,
          reviewedAt,
          rejectionNote: null,
          barberId,
        })
        .where(eq(barberRequests.id, id))
        .returning({ id: barberRequests.id });

      if (!updated) return null;

      const row = await tx.query.barberRequests.findFirst({
        where: eq(barberRequests.id, id),
        with: barberRequestWith,
      });
      return row ? normalizeBarberRequest(row) : null;
    });
  },

  async reject(id: string, rejectionNote: string, reviewedAt: Date) {
    await db
      .update(barberRequests)
      .set({
        status: BARBER_REQUEST_STATUS.REJECTED,
        rejectionNote,
        reviewedAt,
      })
      .where(eq(barberRequests.id, id));

    const row = await db.query.barberRequests.findFirst({
      where: eq(barberRequests.id, id),
      with: barberRequestWith,
    });
    return row ? normalizeBarberRequest(row) : undefined;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Barbers
// ─────────────────────────────────────────────────────────────────────────────

export const adminBarbersRepository = {
  async list(query: AdminBarbersQuery) {
    const { page, limit, sort } = query;
    const { skip, take } = getPrismaSkipTake(page, limit);
    const where = buildBarberListConditions(query);

    if (barberSortNeedsUserJoin(sort)) {
      const idRows = await db
        .select({ id: barberProfiles.id })
        .from(barberProfiles)
        .innerJoin(users, eq(barberProfiles.userId, users.id))
        .where(where)
        .orderBy(sort === "name_desc" ? desc(users.fullName) : asc(users.fullName))
        .offset(skip)
        .limit(take);

      const ids = idRows.map((row) => row.id);
      const countQuery = where
        ? db
            .select({ cnt: count() })
            .from(barberProfiles)
            .where(where)
            .then((rows) => Number(rows[0]?.cnt ?? 0))
        : db.$count(barberProfiles);

      if (ids.length === 0) {
        const total = await countQuery;
        return [[], total] as const;
      }

      const items = await db.query.barberProfiles.findMany({
        where: inArray(barberProfiles.id, ids),
        with: barberListWith,
      });

      const total = await countQuery;
      return [reorderByIds(items, ids), total] as const;
    }

    const findMany = db.query.barberProfiles.findMany({
      where,
      with: barberListWith,
      orderBy: barberProfileOrderBy(sort),
      offset: skip,
      limit: take,
    });

    const countQuery = where ? db.$count(barberProfiles, where) : db.$count(barberProfiles);

    return Promise.all([findMany, countQuery]);
  },

  findById(id: string) {
    return db.query.barberProfiles.findFirst({
      where: eq(barberProfiles.id, id),
      with: barberListWith,
    });
  },

  async updateStatus(id: string, barberStatus: string) {
    await db
      .update(barberProfiles)
      .set({
        barberStatus: barberStatus as (typeof barberProfiles.$inferSelect)["barberStatus"],
        isAvailable: barberStatus === "ACTIVE",
      })
      .where(eq(barberProfiles.id, id));

    return db.query.barberProfiles.findFirst({
      where: eq(barberProfiles.id, id),
      with: barberListWith,
    });
  },

  async deactivate(id: string) {
    const barber = await db.query.barberProfiles.findFirst({
      where: eq(barberProfiles.id, id),
      columns: { userId: true },
    });
    if (!barber) return null;

    await db.update(users).set({ isActive: false }).where(eq(users.id, barber.userId));

    await db
      .update(barberProfiles)
      .set({ barberStatus: "DISABLED", isAvailable: false })
      .where(eq(barberProfiles.id, id));

    return db.query.barberProfiles.findFirst({
      where: eq(barberProfiles.id, id),
      with: barberListWith,
    });
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Users (customers)
// ─────────────────────────────────────────────────────────────────────────────

export const adminUsersRepository = {
  async list(query: AdminUsersQuery) {
    const { page, limit } = query;
    const { skip, take } = getPrismaSkipTake(page, limit);
    const where = buildUserListConditions(query);

    const rows = await db.query.users.findMany({
      where,
      columns: adminUserColumns,
      orderBy: userOrderBy(query.sort),
      offset: skip,
      limit: take,
    });

    const countQuery = db.$count(users, where);
    const [items, total] = await Promise.all([attachUserCounts(rows), countQuery]);
    return [items, total] as const;
  },

  async findById(id: string) {
    const row = await db.query.users.findFirst({
      where: and(eq(users.id, id), eq(users.role, ROLES.CUSTOMER)),
      columns: adminUserColumns,
      with: {
        appointments: {
          orderBy: (fields, { desc: descFn }) => [descFn(fields.startAt)],
          limit: 20,
          columns: {
            id: true,
            status: true,
            startAt: true,
            estimatedPrice: true,
            finalPrice: true,
          },
          with: {
            barber: {
              with: {
                user: { columns: { fullName: true } },
              },
            },
            services: {
              columns: { name: true },
              limit: 1,
            },
          },
        },
      },
    });

    if (!row) return null;

    const [withCounts] = await attachUserCounts([row]);
    return withCounts;
  },

  async updateActive(id: string, isActive: boolean) {
    const [row] = await db.update(users).set({ isActive }).where(eq(users.id, id)).returning({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      phone: users.phone,
      photoUrl: users.photoUrl,
      city: users.city,
      isActive: users.isActive,
      createdAt: users.createdAt,
      lastActiveAt: users.lastActiveAt,
    });

    if (!row) return null;

    const [withCounts] = await attachUserCounts([row]);
    return withCounts;
  },

  deactivate(id: string) {
    return this.updateActive(id, false);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Contact messages
// ─────────────────────────────────────────────────────────────────────────────

type ContactMessageUpdate = Partial<{
  isRead: boolean;
  internalNote: string | null;
  assignedTo: string | null;
  replyText: string;
  replyStatus: (typeof contactMessages.$inferSelect)["replyStatus"];
  repliedAt: Date;
}>;

export const adminContactMessagesRepository = {
  list(query: AdminContactMessagesQuery) {
    const { page, limit, tab, q } = query;
    const { skip, take } = getPrismaSkipTake(page, limit);

    const parts: SQL[] = [];
    if (tab === "unread") parts.push(eq(contactMessages.isRead, false));
    if (tab === "unreplied") {
      parts.push(eq(contactMessages.replyStatus, CONTACT_REPLY_STATUS.UNREPLIED));
    }
    if (tab === "replied") {
      parts.push(eq(contactMessages.replyStatus, CONTACT_REPLY_STATUS.REPLIED));
    }
    if (q) {
      parts.push(
        or(
          contains(contactMessages.name, q),
          contains(contactMessages.email, q),
          contains(contactMessages.subject, q),
          contains(contactMessages.message, q),
        )!,
      );
    }
    const where = parts.length > 0 ? and(...parts) : undefined;

    const findMany = db.query.contactMessages.findMany({
      where,
      orderBy: (fields, { desc: descFn }) => [descFn(fields.submittedAt)],
      offset: skip,
      limit: take,
    });

    const countQuery = where ? db.$count(contactMessages, where) : db.$count(contactMessages);

    return Promise.all([findMany, countQuery]);
  },

  findById(id: string) {
    return db.query.contactMessages.findFirst({
      where: eq(contactMessages.id, id),
    });
  },

  async update(id: string, data: ContactMessageUpdate) {
    const [row] = await db
      .update(contactMessages)
      .set(data)
      .where(eq(contactMessages.id, id))
      .returning();
    return row!;
  },

  async reply(id: string, replyText: string) {
    const [row] = await db
      .update(contactMessages)
      .set({
        replyText,
        replyStatus: CONTACT_REPLY_STATUS.REPLIED,
        repliedAt: new Date(),
        isRead: true,
      })
      .where(eq(contactMessages.id, id))
      .returning();
    return row!;
  },

  countStats() {
    return Promise.all([
      db.$count(contactMessages),
      db.$count(contactMessages, eq(contactMessages.isRead, false)),
      db.$count(contactMessages, eq(contactMessages.replyStatus, CONTACT_REPLY_STATUS.UNREPLIED)),
    ]);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Notifications (admin inbox)
// ─────────────────────────────────────────────────────────────────────────────

const NOTIFICATION_TAB_TYPES: Record<
  Exclude<AdminNotificationTabKey, "all" | "unread">,
  string[]
> = {
  system: [
    NOTIFICATION_TYPE.BARBER_REQUEST_SUBMITTED,
    NOTIFICATION_TYPE.BARBER_REQUEST_APPROVED,
    NOTIFICATION_TYPE.BARBER_REQUEST_REJECTED,
  ],
  appointments: [NOTIFICATION_TYPE.BOOKING_CONFIRMED, NOTIFICATION_TYPE.BOOKING_CANCELLED],
  barber: [NOTIFICATION_TYPE.BARBER_REQUEST_SUBMITTED, NOTIFICATION_TYPE.BARBER_REQUEST_APPROVED],
  contact: [NOTIFICATION_TYPE.NEW_CONTACT_MESSAGE],
};

export const adminNotificationsRepository = {
  list(userId: string, query: AdminNotificationsQuery) {
    const { page, limit, tab } = query;
    const { skip, take } = getPrismaSkipTake(page, limit);

    const parts: SQL[] = [eq(notifications.userId, userId)];

    if (tab === "unread") {
      parts.push(eq(notifications.isRead, false));
    } else if (tab !== "all" && tab !== "unread") {
      const types = NOTIFICATION_TAB_TYPES[tab as keyof typeof NOTIFICATION_TAB_TYPES];
      if (types?.length) {
        parts.push(
          inArray(notifications.type, types as (typeof notifications.$inferSelect)["type"][]),
        );
      }
    }

    const where = and(...parts);

    const findMany = db.query.notifications.findMany({
      where,
      orderBy: (fields, { desc: descFn }) => [descFn(fields.createdAt)],
      offset: skip,
      limit: take,
    });

    const countQuery = db.$count(notifications, where);
    return Promise.all([findMany, countQuery]);
  },

  async markRead(userId: string, id: string, isRead: boolean) {
    const updated = await db
      .update(notifications)
      .set({ isRead })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning({ id: notifications.id });
    return { count: updated.length };
  },

  async markAllRead(userId: string) {
    const updated = await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
      .returning({ id: notifications.id });
    return { count: updated.length };
  },

  unreadCount(userId: string) {
    return db.$count(
      notifications,
      and(eq(notifications.userId, userId), eq(notifications.isRead, false)),
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Barber request stats
// ─────────────────────────────────────────────────────────────────────────────

export const adminBarberRequestStatsRepository = {
  countByStatus() {
    return Promise.all([
      db.$count(barberRequests, eq(barberRequests.status, BARBER_REQUEST_STATUS.PENDING)),
      db.$count(barberRequests, eq(barberRequests.status, BARBER_REQUEST_STATUS.APPROVED)),
      db.$count(barberRequests, eq(barberRequests.status, BARBER_REQUEST_STATUS.REJECTED)),
    ]);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Global queue (dashboard / analytics)
// ─────────────────────────────────────────────────────────────────────────────

export const adminQueueRepository = {
  async globalOverview() {
    const [waiting, inService, chairsTotal, chairsBusy] = await Promise.all([
      db.$count(queueEntries, eq(queueEntries.status, "WAITING")),
      db.$count(queueEntries, eq(queueEntries.status, "IN_SERVICE")),
      db.$count(chairs),
      db.$count(
        queueEntries,
        and(eq(queueEntries.status, "IN_SERVICE"), isNotNull(queueEntries.chairId)),
      ),
    ]);

    return { waiting, inService, chairsTotal, chairsBusy };
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Reports data
// ─────────────────────────────────────────────────────────────────────────────

export const adminReportsRepository = {
  appointmentsReport(range: { gte: Date; lte: Date }, limit = 100) {
    return db.query.appointments.findMany({
      where: and(gte(appointments.startAt, range.gte), lte(appointments.startAt, range.lte)),
      with: {
        customer: { columns: { fullName: true } },
        barber: {
          columns: { id: true },
          with: { user: { columns: { fullName: true } } },
        },
        services: {
          columns: { name: true, price: true },
          limit: 1,
        },
      },
      orderBy: (fields, { desc: descFn }) => [descFn(fields.startAt)],
      limit,
    });
  },

  async customersReport(range: { gte: Date; lte: Date }, limit = 100) {
    const rows = await db.query.users.findMany({
      where: and(eq(users.role, ROLES.CUSTOMER), lte(users.createdAt, range.lte)),
      columns: {
        id: true,
        fullName: true,
        email: true,
        isActive: true,
        lastActiveAt: true,
      },
      orderBy: (fields, { desc: descFn }) => [descFn(fields.createdAt)],
      limit,
    });

    return attachUserCounts(rows);
  },

  barbersReport(limit = 100) {
    return db.query.barberProfiles.findMany({
      with: {
        user: { columns: { fullName: true } },
        shop: { columns: { name: true } },
      },
      orderBy: (fields, { desc: descFn }) => [descFn(fields.totalAppointments)],
      limit,
    });
  },

  async serviceUsageReport(range: { gte: Date; lte: Date }, limit = 20) {
    const rows = await db
      .select({
        name: appointmentServices.name,
        nameCount: count(appointmentServices.name),
        priceSum: sum(appointmentServices.price),
      })
      .from(appointmentServices)
      .innerJoin(appointments, eq(appointmentServices.appointmentId, appointments.id))
      .where(and(gte(appointments.startAt, range.gte), lte(appointments.startAt, range.lte)))
      .groupBy(appointmentServices.name)
      .orderBy(desc(count(appointmentServices.name)))
      .limit(limit);

    return rows.map((row) => ({
      name: row.name,
      _count: { name: Number(row.nameCount) },
      _sum: { price: row.priceSum !== null ? Number(row.priceSum) : null },
    }));
  },

  registrationsReport(range: { gte: Date; lte: Date }, limit = 100) {
    return Promise.all([
      db.query.users.findMany({
        where: and(
          eq(users.role, ROLES.CUSTOMER),
          gte(users.createdAt, range.gte),
          lte(users.createdAt, range.lte),
        ),
        columns: { fullName: true, email: true, isActive: true, createdAt: true },
        orderBy: (fields, { desc: descFn }) => [descFn(fields.createdAt)],
        limit,
      }),
      db.query.barberRequests.findMany({
        where: and(
          gte(barberRequests.submittedAt, range.gte),
          lte(barberRequests.submittedAt, range.lte),
        ),
        columns: {
          firstName: true,
          lastName: true,
          email: true,
          status: true,
          submittedAt: true,
        },
        orderBy: (fields, { desc: descFn }) => [descFn(fields.submittedAt)],
        limit,
      }),
    ]);
  },
};
