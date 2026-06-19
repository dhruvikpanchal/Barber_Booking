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
  isNull,
  lt,
  lte,
  notExists,
  or,
  sql,
  sum,
  type SQL,
} from "drizzle-orm";
import {
  db,
  appointmentModifications,
  appointmentServices,
  appointments,
  barberProfiles,
  barberServices,
  barberSpecialties,
  breakSlots,
  chairs,
  galleryImages,
  notifications,
  queueEntries,
  reviews,
  serviceChangeRequests,
  services,
  unavailableDates,
  shops,
  users,
  walkIns,
  workingHours,
  type Appointment,
} from "@/server/db";
import { contains } from "@/server/db/helpers";
import { slugify } from "@/server/modules/shared/helpers";
import { getPrismaSkipTake } from "@/server/modules/shared/helpers/pagination";
import {
  APPOINTMENT_STATUS,
  WALK_IN_STATUS,
  SERVICE_CHANGE_STATUS,
} from "@/server/modules/shared/constants/statuses";
import { NOTIFICATION_TYPE } from "@/server/modules/shared/constants/notificationTypes";
import { QUEUE_SOURCE } from "@/server/modules/shared/constants/QueueSource";
import type {
  AppointmentsQuery,
  QueueQuery,
  WalkInsQuery,
  ReviewsQuery,
  NotificationsQuery,
} from "@/server/modules/barber/schema";
import { DEFAULT_BARBER_CHAIR_LABELS } from "@/server/modules/barber/constants";

type CancelledBy = NonNullable<Appointment["cancelledBy"]>;
type NotificationType = (typeof notifications.$inferSelect)["type"];
type WalkInStatus = (typeof walkIns.$inferSelect)["status"];
type QueueSource = (typeof queueEntries.$inferSelect)["source"];

type BarberProfileUpdate = Partial<typeof barberProfiles.$inferInsert>;
type UserUpdate = Partial<typeof users.$inferInsert>;
type GalleryImageUpdate = Partial<
  Pick<typeof galleryImages.$inferInsert, "src" | "alt" | "sortOrder">
>;

// ─── SHARED WITH / COLUMNS ───────────────────────────────────────────────────

const customerWith = {
  columns: {
    id: true,
    fullName: true,
    email: true,
    phone: true,
    photoUrl: true,
  },
} as const;

const appointmentListWith = {
  customer: customerWith,
  services: {
    columns: { name: true, price: true, duration: true },
  },
  modificationHistory: {
    columns: { field: true },
  },
} as const;

const appointmentListColumns = {
  id: true,
  customerId: true,
  status: true,
  startAt: true,
  estimatedPrice: true,
  finalPrice: true,
  notes: true,
  bookedAt: true,
  cancelledBy: true,
  cancelReason: true,
} as const;

const queueEntryColumns = {
  id: true,
  source: true,
  customerName: true,
  phone: true,
  serviceName: true,
  duration: true,
  notes: true,
  status: true,
  position: true,
  addedAt: true,
  startedAt: true,
  completedAt: true,
  appointmentId: true,
  walkInId: true,
} as const;

const queueEntryWith = {
  chair: { columns: { id: true, label: true } },
} as const;

const chairColumns = {
  id: true,
  label: true,
  sortOrder: true,
} as const;

const barberServiceColumns = {
  id: true,
  isActive: true,
  priceOverride: true,
} as const;

const barberServiceWith = {
  service: {
    columns: {
      id: true,
      slug: true,
      name: true,
      description: true,
      price: true,
      duration: true,
      isPopular: true,
      isActive: true,
    },
  },
} as const;

const walkInColumns = {
  id: true,
  customerName: true,
  phone: true,
  serviceName: true,
  duration: true,
  notes: true,
  status: true,
  addedAt: true,
  startedAt: true,
  completedAt: true,
  cancelledAt: true,
} as const;

const reviewWith = {
  customer: {
    columns: { fullName: true, email: true, phone: true },
  },
  appointment: {
    columns: { id: true },
    with: {
      services: { columns: { name: true } },
    },
  },
} as const;

const reviewColumns = {
  id: true,
  customerId: true,
  rating: true,
  comment: true,
  barberReply: true,
  barberRepliedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

const barberProfileDetailWith = {
  user: {
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      fullName: true,
      email: true,
      phone: true,
      photoUrl: true,
      city: true,
    },
  },
  shop: {
    columns: {
      id: true,
      name: true,
      address: true,
      city: true,
      openHoursSummary: true,
    },
  },
  specialties: { columns: { name: true } },
  galleryImages: {
    columns: { id: true, src: true, alt: true, sortOrder: true },
  },
  workingHours: {
    columns: { day: true, openTime: true, closeTime: true, isClosed: true },
  },
} as const;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function dateLabelSql(granularity: "hour" | "day" | "month", column: SQL = sql`start_at`): SQL {
  if (granularity === "hour") {
    return sql`to_char(${column}, 'HH24:00')`;
  }
  if (granularity === "day") {
    return sql`trim(to_char(${column}, 'Dy'))`;
  }
  return sql`to_char(${column}, 'Mon')`;
}

function buildAppointmentListConditions(
  barberId: string,
  query: AppointmentsQuery,
): SQL | undefined {
  const { tab, q, date } = query;
  const parts: SQL[] = [eq(appointments.barberId, barberId)];

  if (tab && tab !== "all") {
    if (tab === "rescheduled") {
      parts.push(eq(appointments.status, APPOINTMENT_STATUS.CONFIRMED));
      parts.push(
        exists(
          db
            .select({ one: sql`1` })
            .from(appointmentModifications)
            .where(
              and(
                eq(appointmentModifications.appointmentId, appointments.id),
                eq(appointmentModifications.field, "startAt"),
              ),
            ),
        ),
      );
    } else {
      const statusMap: Record<string, string[]> = {
        upcoming: [APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.IN_SERVICE],
        pending: [APPOINTMENT_STATUS.PENDING],
        confirmed: [APPOINTMENT_STATUS.CONFIRMED],
        completed: [APPOINTMENT_STATUS.COMPLETED],
        cancelled: [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.NO_SHOW],
      };
      if (statusMap[tab]) {
        parts.push(inArray(appointments.status, statusMap[tab] as Appointment["status"][]));
      }
    }
  }

  if (date) {
    const start = new Date(`${date}T00:00:00`);
    const end = new Date(`${date}T23:59:59`);
    parts.push(gte(appointments.startAt, start), lte(appointments.startAt, end));
  }

  if (q) {
    parts.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(users)
          .where(
            and(
              eq(users.id, appointments.customerId),
              or(contains(users.fullName, q), contains(users.email, q)),
            ),
          ),
      ),
    );
  }

  return and(...parts);
}

async function findBarberServiceById(id: string, barberId?: string) {
  const row = await db.query.barberServices.findFirst({
    where: barberId
      ? and(eq(barberServices.id, id), eq(barberServices.barberId, barberId))
      : eq(barberServices.id, id),
    columns: barberServiceColumns,
    with: barberServiceWith,
  });
  return row ?? null;
}

async function aggregateCompletedRevenue(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  barberId: string,
  range: { gte: Date; lte: Date },
) {
  const [row] = await tx
    .select({
      finalPriceSum: sum(appointments.finalPrice),
      estimatedPriceSum: sum(appointments.estimatedPrice),
      idCount: count(appointments.id),
    })
    .from(appointments)
    .where(
      and(
        eq(appointments.barberId, barberId),
        eq(appointments.status, APPOINTMENT_STATUS.COMPLETED),
        gte(appointments.startAt, range.gte),
        lte(appointments.startAt, range.lte),
      ),
    );

  return {
    _sum: {
      finalPrice: row?.finalPriceSum !== null ? Number(row.finalPriceSum) : null,
      estimatedPrice: row?.estimatedPriceSum !== null ? Number(row.estimatedPriceSum) : null,
    },
    _count: { id: Number(row?.idCount ?? 0) },
  };
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────

export const barberProfileRepository = {
  findByUserId(userId: string) {
    return db.query.barberProfiles.findFirst({
      where: eq(barberProfiles.userId, userId),
      columns: {
        id: true,
        slug: true,
        displayRole: true,
        experience: true,
        bio: true,
        portfolioUrl: true,
        availability: true,
        isAvailable: true,
        barberStatus: true,
        joinedAt: true,
      },
      with: {
        user: barberProfileDetailWith.user,
        shop: barberProfileDetailWith.shop,
        specialties: barberProfileDetailWith.specialties,
        galleryImages: {
          columns: { id: true, src: true, alt: true, sortOrder: true },
          orderBy: (t, { asc: ascFn }) => [ascFn(t.sortOrder)],
        },
        workingHours: {
          columns: { day: true, openTime: true, closeTime: true, isClosed: true },
          orderBy: (t, { asc: ascFn }) => [ascFn(t.day)],
        },
      },
    });
  },

  findIdByUserId(userId: string) {
    return db.query.barberProfiles.findFirst({
      where: eq(barberProfiles.userId, userId),
      columns: { id: true },
    });
  },

  updateProfile(
    barberId: string,
    data: {
      profile: BarberProfileUpdate;
      user: UserUpdate;
    },
  ) {
    return db.transaction(async (tx) => {
      const [profile] = await tx
        .update(barberProfiles)
        .set(data.profile)
        .where(eq(barberProfiles.id, barberId))
        .returning();

      if (Object.keys(data.user).length > 0) {
        await tx.update(users).set(data.user).where(eq(users.id, profile!.userId));
      }

      return profile!;
    });
  },

  async updateUserForBarber(barberId: string, user: UserUpdate) {
    const profile = await db.query.barberProfiles.findFirst({
      where: eq(barberProfiles.id, barberId),
      columns: { userId: true },
    });
    if (!profile || Object.keys(user).length === 0) return null;

    const [row] = await db.update(users).set(user).where(eq(users.id, profile.userId)).returning();
    return row ?? null;
  },

  updatePhoto(barberId: string, photoUrl: string) {
    return db.transaction(async (tx) => {
      const profile = await tx.query.barberProfiles.findFirst({
        where: eq(barberProfiles.id, barberId),
        columns: { userId: true },
      });
      if (!profile) return null;

      const [user] = await tx
        .update(users)
        .set({ photoUrl })
        .where(eq(users.id, profile.userId))
        .returning();

      return user ?? null;
    });
  },

  syncSpecialties(barberId: string, names: string[]) {
    return db.transaction(async (tx) => {
      await tx.delete(barberSpecialties).where(eq(barberSpecialties.barberId, barberId));
      if (names.length === 0) return;

      await tx.insert(barberSpecialties).values(names.map((name) => ({ barberId, name })));
    });
  },

  countGalleryImages(barberId: string) {
    return db.$count(galleryImages, eq(galleryImages.barberId, barberId));
  },

  async addGalleryImage(barberId: string, data: { src: string; alt?: string; sortOrder?: number }) {
    const [row] = await db
      .insert(galleryImages)
      .values({
        barberId,
        src: data.src,
        alt: data.alt ?? null,
        sortOrder: data.sortOrder ?? 0,
      })
      .returning();

    return row!;
  },

  findGalleryImage(id: string, barberId: string) {
    return db.query.galleryImages.findFirst({
      where: and(eq(galleryImages.id, id), eq(galleryImages.barberId, barberId)),
    });
  },

  async updateGalleryImage(id: string, data: GalleryImageUpdate) {
    const [row] = await db
      .update(galleryImages)
      .set(data)
      .where(eq(galleryImages.id, id))
      .returning();

    return row!;
  },

  deleteGalleryImage(id: string) {
    return db.delete(galleryImages).where(eq(galleryImages.id, id));
  },

  async updateShopForBarber(
    barberId: string,
    data: {
      name?: string;
      address?: string | null;
      city?: string;
      openHoursSummary?: string | null;
    },
  ) {
    const profile = await db.query.barberProfiles.findFirst({
      where: eq(barberProfiles.id, barberId),
      columns: { shopId: true },
    });

    if (!profile?.shopId) return null;

    const [shop] = await db
      .update(shops)
      .set(data)
      .where(eq(shops.id, profile.shopId))
      .returning();

    return shop ?? null;
  },

  async ensureShopForBarber(
    barberId: string,
    data: {
      name: string;
      address?: string | null;
      city?: string;
      openHoursSummary?: string | null;
    },
  ) {
    const profile = await db.query.barberProfiles.findFirst({
      where: eq(barberProfiles.id, barberId),
      columns: { shopId: true },
    });

    if (!profile) return null;

    if (profile.shopId) {
      return barberProfileRepository.updateShopForBarber(barberId, data);
    }

    const name = data.name.trim();
    if (!name) return null;

    const baseSlug = slugify(name) || "shop";
    const slug = `${baseSlug}-${barberId.slice(-6)}`;

    const [shop] = await db
      .insert(shops)
      .values({
        slug,
        name,
        city: data.city?.trim() || "Local",
        address: data.address ?? null,
        openHoursSummary: data.openHoursSummary ?? null,
      })
      .returning();

    await db
      .update(barberProfiles)
      .set({ shopId: shop!.id })
      .where(eq(barberProfiles.id, barberId));

    return shop ?? null;
  },
};

// ─── SERVICES ────────────────────────────────────────────────────────────────

export const barberServicesRepository = {
  async listServices(barberId: string, filter: "all" | "active" | "hidden") {
    const parts: SQL[] = [eq(barberServices.barberId, barberId)];
    if (filter === "active") parts.push(eq(barberServices.isActive, true));
    if (filter === "hidden") parts.push(eq(barberServices.isActive, false));

    const rows = await db.query.barberServices.findMany({
      where: and(...parts),
      columns: barberServiceColumns,
      with: barberServiceWith,
    });

    return rows.sort((a, b) => a.service.name.localeCompare(b.service.name));
  },

  findService(id: string, barberId: string) {
    return findBarberServiceById(id, barberId);
  },

  createService(
    barberId: string,
    data: {
      name: string;
      description?: string;
      price: number;
      duration: number;
      active: boolean;
    },
  ) {
    return db.transaction(async (tx) => {
      const [service] = await tx
        .insert(services)
        .values({
          slug: data.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
          name: data.name,
          description: data.description ?? null,
          price: data.price,
          duration: data.duration,
          isActive: true,
        })
        .returning({ id: services.id });

      const [barberService] = await tx
        .insert(barberServices)
        .values({
          barberId,
          serviceId: service!.id,
          priceOverride: null,
          isActive: data.active,
        })
        .returning({ id: barberServices.id });

      return tx.query.barberServices.findFirst({
        where: eq(barberServices.id, barberService!.id),
        columns: barberServiceColumns,
        with: barberServiceWith,
      });
    });
  },

  updateService(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      duration?: number;
      active?: boolean;
    },
  ) {
    return db.transaction(async (tx) => {
      const bs = await tx.query.barberServices.findFirst({
        where: eq(barberServices.id, id),
        columns: { serviceId: true },
      });
      if (!bs) return null;

      const serviceUpdate: Partial<typeof services.$inferInsert> = {};
      if (data.name !== undefined) serviceUpdate.name = data.name;
      if (data.description !== undefined) serviceUpdate.description = data.description;
      if (data.price !== undefined) serviceUpdate.price = data.price;
      if (data.duration !== undefined) serviceUpdate.duration = data.duration;

      if (Object.keys(serviceUpdate).length > 0) {
        await tx.update(services).set(serviceUpdate).where(eq(services.id, bs.serviceId));
      }

      const bsUpdate: Partial<typeof barberServices.$inferInsert> = {};
      if (data.active !== undefined) bsUpdate.isActive = data.active;

      if (Object.keys(bsUpdate).length > 0) {
        await tx.update(barberServices).set(bsUpdate).where(eq(barberServices.id, id));
      }

      return tx.query.barberServices.findFirst({
        where: eq(barberServices.id, id),
        columns: barberServiceColumns,
        with: barberServiceWith,
      });
    });
  },

  async toggleService(id: string, active: boolean) {
    const [row] = await db
      .update(barberServices)
      .set({ isActive: active })
      .where(eq(barberServices.id, id))
      .returning({ id: barberServices.id, isActive: barberServices.isActive });

    return row!;
  },

  async deleteService(id: string, barberId: string) {
    const deleted = await db
      .delete(barberServices)
      .where(and(eq(barberServices.id, id), eq(barberServices.barberId, barberId)))
      .returning({ id: barberServices.id });

    return { count: deleted.length };
  },
};

// ─── SCHEDULE ────────────────────────────────────────────────────────────────

export const barberScheduleRepository = {
  async getSchedule(barberId: string) {
    const [workingHoursRows, breaks, unavailableDatesRows] = await Promise.all([
      db.query.workingHours.findMany({
        where: eq(workingHours.barberId, barberId),
        columns: { day: true, openTime: true, closeTime: true, isClosed: true },
        orderBy: (t, { asc: ascFn }) => [ascFn(t.day)],
      }),
      db.query.breakSlots.findMany({
        where: eq(breakSlots.barberId, barberId),
        columns: { id: true, label: true, start: true, end: true },
        orderBy: (t, { asc: ascFn }) => [ascFn(t.start)],
      }),
      db.query.unavailableDates.findMany({
        where: eq(unavailableDates.barberId, barberId),
        columns: { id: true, date: true },
        orderBy: (t, { asc: ascFn }) => [ascFn(t.date)],
      }),
    ]);

    return {
      workingHours: workingHoursRows,
      breaks,
      unavailableDates: unavailableDatesRows,
    };
  },

  saveWorkingHours(
    barberId: string,
    days: {
      dayIndex: number;
      enabled: boolean;
      openTime: string | null;
      closeTime: string | null;
    }[],
  ) {
    return db.transaction(async (tx) => {
      for (const { dayIndex, enabled, openTime, closeTime } of days) {
        await tx
          .insert(workingHours)
          .values({
            barberId,
            day: dayIndex,
            openTime,
            closeTime,
            isClosed: !enabled,
          })
          .onConflictDoUpdate({
            target: [workingHours.barberId, workingHours.day],
            set: {
              openTime,
              closeTime,
              isClosed: !enabled,
            },
          });
      }
    });
  },

  syncBreaks(
    barberId: string,
    breaks: { id?: string; label: string; start: string; end: string }[],
  ) {
    return db.transaction(async (tx) => {
      await tx.delete(breakSlots).where(eq(breakSlots.barberId, barberId));
      if (breaks.length === 0) return [];

      await tx
        .insert(breakSlots)
        .values(breaks.map((b) => ({ barberId, label: b.label, start: b.start, end: b.end })));

      return tx.query.breakSlots.findMany({
        where: eq(breakSlots.barberId, barberId),
        columns: { id: true, label: true, start: true, end: true },
        orderBy: (t, { asc: ascFn }) => [ascFn(t.start)],
      });
    });
  },

  addUnavailableDate(barberId: string, date: string) {
    return db
      .insert(unavailableDates)
      .values({ barberId, date })
      .onConflictDoUpdate({
        target: [unavailableDates.barberId, unavailableDates.date],
        set: { date },
      })
      .returning();
  },

  async removeUnavailableDate(barberId: string, date: string) {
    await db
      .delete(unavailableDates)
      .where(and(eq(unavailableDates.barberId, barberId), eq(unavailableDates.date, date)));
  },
};

// ─── APPOINTMENTS ────────────────────────────────────────────────────────────

async function getAppointmentSummaryStats(barberId: string) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart.getTime() + 86_400_000);

  const [statusRows, todayRow] = await Promise.all([
    db
      .select({ status: appointments.status, total: count() })
      .from(appointments)
      .where(eq(appointments.barberId, barberId))
      .groupBy(appointments.status),
    db
      .select({ total: count() })
      .from(appointments)
      .where(
        and(
          eq(appointments.barberId, barberId),
          gte(appointments.startAt, todayStart),
          lte(appointments.startAt, todayEnd),
        ),
      ),
  ]);

  const byStatus = Object.fromEntries(statusRows.map((r) => [r.status, Number(r.total)]));
  return {
    pending: byStatus[APPOINTMENT_STATUS.PENDING] ?? 0,
    confirmed: byStatus[APPOINTMENT_STATUS.CONFIRMED] ?? 0,
    completed: byStatus[APPOINTMENT_STATUS.COMPLETED] ?? 0,
    today: Number(todayRow[0]?.total ?? 0),
  };
}

export const barberAppointmentsRepository = {
  listAppointments(barberId: string, query: AppointmentsQuery) {
    const { page, limit } = query;
    const { skip, take } = getPrismaSkipTake(page, limit);
    const where = buildAppointmentListConditions(barberId, query);

    const findMany = db.query.appointments.findMany({
      where,
      columns: appointmentListColumns,
      with: appointmentListWith,
      orderBy: (t, { asc: ascFn }) => [ascFn(t.startAt)],
      offset: skip,
      limit: take,
    });

    const countQuery = where
      ? db.$count(appointments, where)
      : db.$count(appointments, eq(appointments.barberId, barberId));

    const statsQuery = getAppointmentSummaryStats(barberId);

    return Promise.all([findMany, countQuery, statsQuery]);
  },

  getAppointmentSummaryStats,

  findAppointmentDetail(id: string, barberId: string) {
    return db.query.appointments.findFirst({
      where: and(eq(appointments.id, id), eq(appointments.barberId, barberId)),
      columns: {
        ...appointmentListColumns,
        confirmedAt: true,
        arrivedAt: true,
        completedAt: true,
        barberNotes: true,
      },
      with: {
        ...appointmentListWith,
        barber: {
          with: {
            user: { columns: { fullName: true } },
          },
        },
        serviceChangeRequests: {
          columns: {
            id: true,
            status: true,
            customerNote: true,
            rejectionNote: true,
            requestedAt: true,
            resolvedAt: true,
          },
          with: {
            items: {
              columns: { side: true, name: true, price: true, duration: true },
            },
          },
          orderBy: (t, { desc: descFn }) => [descFn(t.requestedAt)],
        },
        modificationHistory: {
          columns: {
            id: true,
            actor: true,
            field: true,
            previousValue: true,
            updatedValue: true,
            summary: true,
            reason: true,
            at: true,
          },
          orderBy: (t, { asc: ascFn }) => [ascFn(t.at)],
        },
      },
    });
  },

  updateStatus(
    id: string,
    _barberId: string,
    data: {
      status: string;
      cancelReason?: string;
      cancelledBy?: CancelledBy;
      barberNotes?: string;
      timestamps: Partial<{
        confirmedAt: Date;
        arrivedAt: Date;
        completedAt: Date;
      }>;
    },
  ) {
    return db
      .update(appointments)
      .set({
        status: data.status as Appointment["status"],
        cancelReason: data.cancelReason ?? undefined,
        cancelledBy: data.cancelledBy,
        barberNotes: data.barberNotes ?? undefined,
        ...data.timestamps,
      })
      .where(eq(appointments.id, id));
  },

  async addModification(data: {
    appointmentId: string;
    actor: string;
    field?: string;
    previousValue?: string;
    updatedValue?: string;
    summary: string;
    reason?: string;
  }) {
    const [row] = await db.insert(appointmentModifications).values(data).returning();
    return row!;
  },

  rescheduleAppointment(id: string, barberId: string, startAt: Date, reason?: string) {
    return db.transaction(async (tx) => {
      const appt = await tx.query.appointments.findFirst({
        where: and(eq(appointments.id, id), eq(appointments.barberId, barberId)),
        columns: { startAt: true },
      });
      if (!appt) return null;

      await tx.update(appointments).set({ startAt }).where(eq(appointments.id, id));

      await tx.insert(appointmentModifications).values({
        appointmentId: id,
        actor: "Barber",
        field: "Booking",
        previousValue: appt.startAt.toISOString(),
        updatedValue: startAt.toISOString(),
        summary: "Appointment rescheduled by barber",
        reason: reason ?? null,
      });

      return true;
    });
  },

  listPendingServiceChanges(barberId: string) {
    return db.query.serviceChangeRequests.findMany({
      where: and(
        eq(serviceChangeRequests.status, SERVICE_CHANGE_STATUS.PENDING),
        exists(
          db
            .select({ one: sql`1` })
            .from(appointments)
            .where(
              and(
                eq(appointments.id, serviceChangeRequests.appointmentId),
                eq(appointments.barberId, barberId),
              ),
            ),
        ),
      ),
      columns: {
        id: true,
        appointmentId: true,
        status: true,
        customerNote: true,
        rejectionNote: true,
        requestedAt: true,
        resolvedAt: true,
      },
      with: {
        items: {
          columns: { side: true, name: true, price: true, duration: true },
        },
        appointment: {
          columns: { id: true, startAt: true },
          with: {
            customer: customerWith,
            services: {
              columns: { name: true, price: true, duration: true },
            },
          },
        },
      },
      orderBy: (t, { desc: descFn }) => [descFn(t.requestedAt)],
    });
  },

  findServiceChangeRequest(reqId: string, appointmentId: string, barberId: string) {
    return db.query.serviceChangeRequests.findFirst({
      where: and(
        eq(serviceChangeRequests.id, reqId),
        eq(serviceChangeRequests.appointmentId, appointmentId),
        eq(serviceChangeRequests.status, SERVICE_CHANGE_STATUS.PENDING),
        exists(
          db
            .select({ one: sql`1` })
            .from(appointments)
            .where(
              and(
                eq(appointments.id, serviceChangeRequests.appointmentId),
                eq(appointments.barberId, barberId),
              ),
            ),
        ),
      ),
    });
  },

  async resolveServiceChangeRequest(
    reqId: string,
    decision: "ACCEPTED" | "REJECTED",
    rejectionNote?: string,
  ) {
    const [row] = await db
      .update(serviceChangeRequests)
      .set({
        status: decision,
        rejectionNote: rejectionNote ?? null,
        resolvedAt: new Date(),
      })
      .where(eq(serviceChangeRequests.id, reqId))
      .returning();

    return row!;
  },
};

// ─── QUEUE ───────────────────────────────────────────────────────────────────

type DbOrTx = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

type OnlineAppointmentQueueRow = {
  id: string;
  status: string;
  notes: string | null;
  startAt: Date;
  arrivedAt: Date | null;
  completedAt: Date | null;
  customer: { fullName: string; phone: string | null };
  services: { name: string; duration: number }[];
};

function startOfToday() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return todayStart;
}

function isAppointmentDateToday(startAt: Date) {
  const todayStart = startOfToday();
  const todayEnd = new Date(todayStart.getTime() + 86_400_000);
  return startAt >= todayStart && startAt < todayEnd;
}

function mapAppointmentStatusToQueueStatus(status: string): WalkInStatus {
  switch (status) {
    case "IN_SERVICE":
      return "IN_SERVICE";
    case "COMPLETED":
      return "DONE";
    case "CANCELLED":
    case "NO_SHOW":
      return "CANCELLED";
    case "PENDING":
      return "WAITING";
    default:
      return "WAITING";
  }
}

const QUEUE_STATUS_RANK: Record<string, number> = {
  WAITING: 0,
  IN_SERVICE: 1,
  DONE: 2,
  CANCELLED: 3,
};

function resolveQueueStatusFromAppointment(
  existingStatus: WalkInStatus | undefined,
  mappedStatus: WalkInStatus,
  appointmentStatus: string,
): WalkInStatus {
  if (["CANCELLED", "NO_SHOW"].includes(appointmentStatus)) return "CANCELLED";
  if (appointmentStatus === "COMPLETED") return "DONE";
  if (appointmentStatus === "PENDING") return "WAITING";

  if (!existingStatus) return mappedStatus;
  if (existingStatus === "CANCELLED" || existingStatus === "DONE") return existingStatus;

  const existingRank = QUEUE_STATUS_RANK[existingStatus] ?? 0;
  const mappedRank = QUEUE_STATUS_RANK[mappedStatus] ?? 0;
  return mappedRank >= existingRank ? mappedStatus : existingStatus;
}

async function nextQueuePosition(barberId: string, client: DbOrTx) {
  const lastEntry = await client.query.queueEntries.findFirst({
    where: and(
      eq(queueEntries.barberId, barberId),
      inArray(queueEntries.status, ["WAITING", "IN_SERVICE"]),
    ),
    columns: { position: true },
    orderBy: (t, { desc: descFn }) => [descFn(t.position)],
  });

  return (lastEntry?.position ?? 0) + 1;
}

export async function upsertOnlineAppointmentQueueEntry(
  barberId: string,
  appt: OnlineAppointmentQueueRow,
  client: DbOrTx = db,
) {
  if (!isAppointmentDateToday(appt.startAt)) return null;

  const existing = await client.query.queueEntries.findFirst({
    where: eq(queueEntries.appointmentId, appt.id),
    columns: { id: true, status: true, startedAt: true },
  });

  if (appt.status === "PENDING") {
    if (existing) {
      await client.delete(queueEntries).where(eq(queueEntries.id, existing.id));
    }
    return null;
  }

  const serviceName = appt.services.map((s) => s.name).join(" + ");
  const duration = appt.services.reduce((sum, s) => sum + s.duration, 0);
  const mappedQueueStatus = mapAppointmentStatusToQueueStatus(appt.status);

  const queueStatus = resolveQueueStatusFromAppointment(
    existing?.status,
    mappedQueueStatus,
    appt.status,
  );

  if (existing) {
    const updates: Partial<typeof queueEntries.$inferInsert> = {
      status: queueStatus,
      customerName: appt.customer.fullName,
      phone: appt.customer.phone,
      serviceName,
      duration,
      notes: appt.notes,
    };
    if (queueStatus === "IN_SERVICE" && !existing.startedAt) {
      updates.startedAt = appt.arrivedAt ?? new Date();
    }
    if (queueStatus === "DONE") {
      updates.completedAt = appt.completedAt ?? new Date();
    }

    await client.update(queueEntries).set(updates).where(eq(queueEntries.id, existing.id));
    return existing.id;
  }

  if (["CANCELLED", "NO_SHOW", "COMPLETED"].includes(appt.status)) {
    return null;
  }

  const position = await nextQueuePosition(barberId, client);
  const [entry] = await client
    .insert(queueEntries)
    .values({
      barberId,
      appointmentId: appt.id,
      source: QUEUE_SOURCE.ONLINE,
      customerName: appt.customer.fullName,
      phone: appt.customer.phone,
      serviceName,
      duration,
      notes: appt.notes,
      status: queueStatus,
      position,
    })
    .returning({ id: queueEntries.id });

  return entry?.id ?? null;
}

export async function syncOnlineAppointmentQueueEntry(
  barberId: string,
  appointmentId: string,
  client: DbOrTx = db,
) {
  const appt = await client.query.appointments.findFirst({
    where: and(eq(appointments.id, appointmentId), eq(appointments.barberId, barberId)),
    columns: {
      id: true,
      status: true,
      notes: true,
      startAt: true,
      arrivedAt: true,
      completedAt: true,
    },
    with: {
      customer: customerWith,
      services: { columns: { name: true, duration: true } },
    },
  });

  if (!appt) return null;
  return upsertOnlineAppointmentQueueEntry(barberId, appt, client);
}

export async function syncTodayOnlineAppointmentsToQueue(barberId: string, client: DbOrTx = db) {
  const todayStart = startOfToday();
  const todayEnd = new Date(todayStart.getTime() + 86_400_000);

  const rows = await client.query.appointments.findMany({
    where: and(
      eq(appointments.barberId, barberId),
      gte(appointments.startAt, todayStart),
      lt(appointments.startAt, todayEnd),
    ),
    columns: {
      id: true,
      status: true,
      notes: true,
      startAt: true,
      arrivedAt: true,
      completedAt: true,
    },
    with: {
      customer: customerWith,
      services: { columns: { name: true, duration: true } },
    },
    orderBy: (t, { asc: ascFn }) => [ascFn(t.startAt)],
  });

  for (const appt of rows) {
    await upsertOnlineAppointmentQueueEntry(barberId, appt, client);
  }
}

export async function ensureDefaultBarberChairs(barberId: string, client: DbOrTx = db) {
  const existing = await client.$count(chairs, eq(chairs.barberId, barberId));
  if (existing > 0) return;

  await client.insert(chairs).values(
    DEFAULT_BARBER_CHAIR_LABELS.map((label, sortOrder) => ({
      barberId,
      label,
      sortOrder,
    })),
  );
}

export async function prepareBarberQueue(barberId: string, client: DbOrTx = db) {
  await ensureDefaultBarberChairs(barberId, client);
  await syncTodayOnlineAppointmentsToQueue(barberId, client);
}

export const barberQueueRepository = {
  async getLiveQueue(barberId: string, query: QueueQuery) {
    const parts: SQL[] = [eq(queueEntries.barberId, barberId)];

    if (query.tab && query.tab !== "all") {
      const statusMap: Record<string, string[]> = {
        active: [WALK_IN_STATUS.WAITING, WALK_IN_STATUS.IN_SERVICE],
        waiting: [WALK_IN_STATUS.WAITING],
        "in-service": [WALK_IN_STATUS.IN_SERVICE],
        done: [WALK_IN_STATUS.DONE],
        cancelled: [WALK_IN_STATUS.CANCELLED],
      };
      if (statusMap[query.tab]) {
        parts.push(inArray(queueEntries.status, statusMap[query.tab] as WalkInStatus[]));
      }
    }

    if (query.source && query.source !== "all") {
      parts.push(
        eq(queueEntries.source, (query.source === "online" ? "ONLINE" : "WALK_IN") as QueueSource),
      );
    }

    const where = and(...parts);

    const entries = db.query.queueEntries.findMany({
      where,
      columns: queueEntryColumns,
      with: queueEntryWith,
      orderBy: (t, { asc: ascFn }) => [ascFn(t.position), ascFn(t.addedAt)],
    });

    const chairsQuery = db.query.chairs.findMany({
      where: eq(chairs.barberId, barberId),
      columns: chairColumns,
      orderBy: (t, { asc: ascFn }) => [ascFn(t.sortOrder)],
    });

    return Promise.all([entries, chairsQuery]);
  },

  addToQueue(
    barberId: string,
    data: {
      source: string;
      customerName: string;
      phone?: string;
      serviceName: string;
      duration: number;
      notes?: string;
      appointmentId?: string;
      walkInId?: string;
    },
  ) {
    return db.transaction(async (tx) => {
      const lastEntry = await tx.query.queueEntries.findFirst({
        where: and(
          eq(queueEntries.barberId, barberId),
          inArray(queueEntries.status, ["WAITING", "IN_SERVICE"]),
        ),
        columns: { position: true },
        orderBy: (t, { desc: descFn }) => [descFn(t.position)],
      });

      const position = (lastEntry?.position ?? 0) + 1;

      const [entry] = await tx
        .insert(queueEntries)
        .values({
          barberId,
          source: data.source as QueueSource,
          customerName: data.customerName,
          phone: data.phone ?? null,
          serviceName: data.serviceName,
          duration: data.duration,
          notes: data.notes ?? null,
          position,
          appointmentId: data.appointmentId ?? null,
          walkInId: data.walkInId ?? null,
        })
        .returning({ id: queueEntries.id });

      return tx.query.queueEntries.findFirst({
        where: eq(queueEntries.id, entry!.id),
        columns: queueEntryColumns,
        with: queueEntryWith,
      });
    });
  },

  findQueueEntry(id: string, barberId: string) {
    return db.query.queueEntries.findFirst({
      where: and(eq(queueEntries.id, id), eq(queueEntries.barberId, barberId)),
      columns: queueEntryColumns,
    });
  },

  findQueueEntryByWalkInId(walkInId: string, barberId: string) {
    return db.query.queueEntries.findFirst({
      where: and(eq(queueEntries.walkInId, walkInId), eq(queueEntries.barberId, barberId)),
      columns: { id: true },
    });
  },

  updateQueueStatus(id: string, _barberId: string, status: string) {
    const timestamps: Partial<typeof queueEntries.$inferInsert> = {};
    if (status === "IN_SERVICE") timestamps.startedAt = new Date();
    if (status === "DONE") timestamps.completedAt = new Date();

    return db
      .update(queueEntries)
      .set({
        status: status as WalkInStatus,
        ...timestamps,
      })
      .where(eq(queueEntries.id, id))
      .returning({ id: queueEntries.id });
  },

  syncQueueEntryStatus(walkInId: string, barberId: string, status: string) {
    const timestamps: Partial<typeof queueEntries.$inferInsert> = {};
    if (status === "IN_SERVICE") timestamps.startedAt = new Date();
    if (status === "DONE") timestamps.completedAt = new Date();

    return db
      .update(queueEntries)
      .set({
        status: status as WalkInStatus,
        ...timestamps,
      })
      .where(and(eq(queueEntries.walkInId, walkInId), eq(queueEntries.barberId, barberId)));
  },

  assignChair(id: string, _barberId: string, chairId: string | null) {
    return db.update(queueEntries).set({ chairId }).where(eq(queueEntries.id, id));
  },

  removeFromQueue(id: string, _barberId: string) {
    return db.delete(queueEntries).where(eq(queueEntries.id, id));
  },
};

// ─── WALK-INS ────────────────────────────────────────────────────────────────

export const barberWalkInsRepository = {
  listWalkIns(barberId: string, query: WalkInsQuery) {
    const parts: SQL[] = [eq(walkIns.barberId, barberId)];

    if (query.status && query.status !== "all") {
      const statusMap: Record<string, WalkInStatus> = {
        waiting: WALK_IN_STATUS.WAITING,
        "in-service": WALK_IN_STATUS.IN_SERVICE,
        done: WALK_IN_STATUS.DONE,
        cancelled: WALK_IN_STATUS.CANCELLED,
      };
      const dbStatus = statusMap[query.status];
      if (dbStatus) {
        parts.push(eq(walkIns.status, dbStatus));
      }
    }

    if (query.date) {
      const start = new Date(`${query.date}T00:00:00`);
      const end = new Date(`${query.date}T23:59:59`);
      parts.push(gte(walkIns.addedAt, start), lte(walkIns.addedAt, end));
    }

    return db.query.walkIns.findMany({
      where: and(...parts),
      columns: walkInColumns,
      orderBy: (t, { desc: descFn }) => [descFn(t.addedAt)],
    });
  },

  createWalkIn(
    barberId: string,
    data: {
      customerName: string;
      phone?: string;
      serviceName: string;
      duration: number;
      notes?: string;
    },
  ) {
    return db
      .insert(walkIns)
      .values({
        barberId,
        customerName: data.customerName,
        phone: data.phone ?? null,
        serviceName: data.serviceName,
        duration: data.duration,
        notes: data.notes ?? null,
      })
      .returning({
        id: walkIns.id,
        customerName: walkIns.customerName,
        phone: walkIns.phone,
        serviceName: walkIns.serviceName,
        duration: walkIns.duration,
        notes: walkIns.notes,
        status: walkIns.status,
        addedAt: walkIns.addedAt,
        startedAt: walkIns.startedAt,
        completedAt: walkIns.completedAt,
        cancelledAt: walkIns.cancelledAt,
      })
      .then(([row]) => row!);
  },

  updateWalkInStatus(id: string, _barberId: string, status: string) {
    const timestamps: Partial<typeof walkIns.$inferInsert> = {};
    if (status === "IN_SERVICE") timestamps.startedAt = new Date();
    if (status === "DONE") timestamps.completedAt = new Date();
    if (status === "CANCELLED") timestamps.cancelledAt = new Date();

    return db
      .update(walkIns)
      .set({
        status: status as WalkInStatus,
        ...timestamps,
      })
      .where(eq(walkIns.id, id))
      .returning({
        id: walkIns.id,
        customerName: walkIns.customerName,
        phone: walkIns.phone,
        serviceName: walkIns.serviceName,
        duration: walkIns.duration,
        notes: walkIns.notes,
        status: walkIns.status,
        addedAt: walkIns.addedAt,
        startedAt: walkIns.startedAt,
        completedAt: walkIns.completedAt,
        cancelledAt: walkIns.cancelledAt,
      })
      .then(([row]) => row!);
  },
};

// ─── REVIEWS ─────────────────────────────────────────────────────────────────

export const barberReviewsRepository = {
  listReviews(barberId: string, query: ReviewsQuery) {
    const { page, limit, sort, ratingFilter, service, q } = query;
    const { skip, take } = getPrismaSkipTake(page, limit);

    const parts: SQL[] = [eq(reviews.barberId, barberId)];
    if (ratingFilter) parts.push(eq(reviews.rating, ratingFilter));
    if (service) {
      parts.push(
        exists(
          db
            .select({ one: sql`1` })
            .from(appointmentServices)
            .where(
              and(
                eq(appointmentServices.appointmentId, reviews.appointmentId),
                contains(appointmentServices.name, service),
              ),
            ),
        ),
      );
    }
    if (q) parts.push(contains(reviews.comment, q));

    const where = and(...parts);

    const findMany = db.query.reviews.findMany({
      where,
      columns: reviewColumns,
      with: reviewWith,
      orderBy:
        sort === "highest"
          ? (t, { desc: descFn }) => [descFn(t.rating)]
          : sort === "lowest"
            ? (t, { asc: ascFn }) => [ascFn(t.rating)]
            : (t, { desc: descFn }) => [descFn(t.createdAt)],
      offset: skip,
      limit: take,
    });

    const countQuery = db.$count(reviews, where);

    return Promise.all([findMany, countQuery]);
  },

  findReview(id: string, barberId: string) {
    return db.query.reviews.findFirst({
      where: and(eq(reviews.id, id), eq(reviews.barberId, barberId)),
      columns: reviewColumns,
      with: reviewWith,
    });
  },

  addReply(id: string, reply: string) {
    return db
      .update(reviews)
      .set({ barberReply: reply, barberRepliedAt: new Date() })
      .where(eq(reviews.id, id));
  },

  getRatingBreakdown(barberId: string) {
    return db.query.reviews.findMany({
      where: eq(reviews.barberId, barberId),
      columns: { rating: true },
    });
  },

  async getReviewReplySummary(barberId: string) {
    const [unreplied] = await db
      .select({ total: count() })
      .from(reviews)
      .where(and(eq(reviews.barberId, barberId), isNull(reviews.barberReply)));

    const [replied] = await db
      .select({ total: count() })
      .from(reviews)
      .where(and(eq(reviews.barberId, barberId), sql`${reviews.barberReply} IS NOT NULL`));

    return {
      unreplied: Number(unreplied?.total ?? 0),
      replied: Number(replied?.total ?? 0),
    };
  },

  updateBarberAverageRating(barberId: string) {
    return db.transaction(async (tx) => {
      const [agg] = await tx
        .select({
          ratingAvg: avg(reviews.rating),
          ratingCount: count(reviews.rating),
        })
        .from(reviews)
        .where(eq(reviews.barberId, barberId));

      await tx
        .update(barberProfiles)
        .set({
          averageRating: agg?.ratingAvg !== null ? Number(agg.ratingAvg) : 0,
          reviewCount: Number(agg?.ratingCount ?? 0),
        })
        .where(eq(barberProfiles.id, barberId));
    });
  },
};

// ─── ANALYTICS ───────────────────────────────────────────────────────────────

/** postgres.js + drizzle raw SQL requires ISO strings, not Date objects. */
function analyticsBetween(column: SQL, start: Date, end: Date) {
  return sql`${column} >= ${start.toISOString()} AND ${column} <= ${end.toISOString()}`;
}

export const barberAnalyticsRepository = {
  getRevenueTrend(barberId: string, start: Date, end: Date, granularity: "hour" | "day" | "month") {
    const labelExpr = dateLabelSql(granularity);

    return db.execute<{ label: string; totalCents: number }>(sql`
      SELECT ${labelExpr} AS label,
             COALESCE(SUM(final_price), SUM(estimated_price))::int AS "totalCents"
      FROM appointments
      WHERE barber_id = ${barberId}
        AND status = 'COMPLETED'
        AND ${analyticsBetween(sql`start_at`, start, end)}
      GROUP BY 1
      ORDER BY MIN(start_at)
    `);
  },

  getAppointmentTrend(
    barberId: string,
    start: Date,
    end: Date,
    granularity: "hour" | "day" | "month",
  ) {
    const labelExpr = dateLabelSql(granularity);

    return db.execute<{ label: string; value: number }>(sql`
      SELECT ${labelExpr} AS label,
             COUNT(*)::int AS value
      FROM appointments
      WHERE barber_id = ${barberId}
        AND ${analyticsBetween(sql`start_at`, start, end)}
      GROUP BY 1
      ORDER BY MIN(start_at)
    `);
  },

  getServicePopularity(barberId: string, start: Date, end: Date) {
    return db.execute<{ label: string; value: number }>(sql`
      SELECT aps.name AS label,
             COUNT(*)::int AS value
      FROM appointment_services aps
      INNER JOIN appointments a ON a.id = aps.appointment_id
      WHERE a.barber_id = ${barberId}
        AND a.status = 'COMPLETED'
        AND ${analyticsBetween(sql`a.start_at`, start, end)}
      GROUP BY aps.name
      ORDER BY value DESC
      LIMIT 8
    `);
  },

  getCustomerGrowth(
    barberId: string,
    start: Date,
    end: Date,
    granularity: "hour" | "day" | "month",
  ) {
    const labelExpr = dateLabelSql(granularity, sql`a.start_at`);

    return db.execute<{ label: string; new: number; returning: number }>(sql`
      SELECT ${labelExpr} AS label,
             SUM(CASE WHEN first_appt.customer_id IS NOT NULL THEN 1 ELSE 0 END)::int AS "new",
             SUM(CASE WHEN first_appt.customer_id IS NULL THEN 1 ELSE 0 END)::int AS "returning"
      FROM appointments a
      LEFT JOIN (
        SELECT customer_id, MIN(start_at) AS first_at
        FROM appointments
        WHERE barber_id = ${barberId}
        GROUP BY customer_id
      ) first_appt ON first_appt.customer_id = a.customer_id
                   AND a.start_at = first_appt.first_at
      WHERE a.barber_id = ${barberId}
        AND ${analyticsBetween(sql`a.start_at`, start, end)}
      GROUP BY 1
      ORDER BY MIN(a.start_at)
    `);
  },

  getMonthlySummary(barberId: string) {
    return db.execute<{
      month: string;
      revenueCents: number;
      appointments: number;
      completed: number;
      rating: number;
    }>(sql`
      SELECT to_char(a.start_at, 'Mon') AS month,
             COALESCE(SUM(a.final_price), SUM(a.estimated_price))::int AS "revenueCents",
             COUNT(*)::int AS appointments,
             SUM(CASE WHEN a.status = 'COMPLETED' THEN 1 ELSE 0 END)::int AS completed,
             ROUND(COALESCE(AVG(r.rating), 0), 1)::float AS rating
      FROM appointments a
      LEFT JOIN reviews r ON r.appointment_id = a.id
      WHERE a.barber_id = ${barberId}
        AND a.start_at >= NOW() - INTERVAL '12 months'
      GROUP BY to_char(a.start_at, 'Mon'), EXTRACT(MONTH FROM a.start_at)
      ORDER BY MIN(a.start_at)
    `);
  },

  getAggregateStats(barberId: string, start: Date, end: Date) {
    return db.transaction(async (tx) => {
      const revenueAgg = await aggregateCompletedRevenue(tx, barberId, { gte: start, lte: end });

      const completedCount = await tx.$count(
        appointments,
        and(
          eq(appointments.barberId, barberId),
          eq(appointments.status, APPOINTMENT_STATUS.COMPLETED),
          gte(appointments.startAt, start),
          lte(appointments.startAt, end),
        ),
      );

      const customerSet = await tx
        .selectDistinct({ customerId: appointments.customerId })
        .from(appointments)
        .where(
          and(
            eq(appointments.barberId, barberId),
            gte(appointments.startAt, start),
            lte(appointments.startAt, end),
          ),
        );

      const [ratingRow] = await tx
        .select({ ratingAvg: avg(reviews.rating) })
        .from(reviews)
        .where(
          and(
            eq(reviews.barberId, barberId),
            gte(reviews.createdAt, start),
            lte(reviews.createdAt, end),
          ),
        );

      const newCustomersResult = await tx.execute<{ cnt: number }>(sql`
        SELECT COUNT(DISTINCT a.customer_id)::int AS cnt
        FROM appointments a
        WHERE a.barber_id = ${barberId}
          AND ${analyticsBetween(sql`a.start_at`, start, end)}
          AND NOT EXISTS (
            SELECT 1 FROM appointments a2
            WHERE a2.customer_id = a.customer_id
              AND a2.barber_id = ${barberId}
              AND a2.start_at < ${start.toISOString()}
          )
      `);

      const newCustomers = Number(newCustomersResult[0]?.cnt ?? 0);

      return {
        totalRevenueCents: revenueAgg._sum.finalPrice ?? revenueAgg._sum.estimatedPrice ?? 0,
        totalAppointments: revenueAgg._count.id,
        completedAppointments: completedCount,
        totalCustomers: customerSet.length,
        newCustomers,
        returningCustomers: customerSet.length - newCustomers,
        averageRating: ratingRow?.ratingAvg !== null ? Number(ratingRow.ratingAvg) : 0,
      };
    });
  },

  getPrevPeriodStats(barberId: string, prevStart: Date, prevEnd: Date) {
    return db.transaction(async (tx) => {
      const revenueAgg = await aggregateCompletedRevenue(tx, barberId, {
        gte: prevStart,
        lte: prevEnd,
      });

      const completedCount = await tx.$count(
        appointments,
        and(
          eq(appointments.barberId, barberId),
          eq(appointments.status, APPOINTMENT_STATUS.COMPLETED),
          gte(appointments.startAt, prevStart),
          lte(appointments.startAt, prevEnd),
        ),
      );

      const customerSet = await tx
        .selectDistinct({ customerId: appointments.customerId })
        .from(appointments)
        .where(
          and(
            eq(appointments.barberId, barberId),
            gte(appointments.startAt, prevStart),
            lte(appointments.startAt, prevEnd),
          ),
        );

      const [ratingRow] = await tx
        .select({ ratingAvg: avg(reviews.rating) })
        .from(reviews)
        .where(
          and(
            eq(reviews.barberId, barberId),
            gte(reviews.createdAt, prevStart),
            lte(reviews.createdAt, prevEnd),
          ),
        );

      return {
        prevTotalRevenueCents: revenueAgg._sum.finalPrice ?? revenueAgg._sum.estimatedPrice ?? 0,
        prevTotalAppointments: revenueAgg._count.id,
        prevCompletedAppointments: completedCount,
        prevTotalCustomers: customerSet.length,
        prevAverageRating: ratingRow?.ratingAvg !== null ? Number(ratingRow.ratingAvg) : 0,
      };
    });
  },
};

// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────

export const barberNotificationsRepository = {
  listNotifications(userId: string, query: NotificationsQuery) {
    const { page, limit, filter, type } = query;
    const { skip, take } = getPrismaSkipTake(page, limit);

    const barberTypes: NotificationType[] = [
      NOTIFICATION_TYPE.NEW_BOOKING_REQUEST,
      NOTIFICATION_TYPE.BOOKING_MODIFICATION_REQUEST,
      NOTIFICATION_TYPE.SERVICE_CHANGE_REQUESTED,
      NOTIFICATION_TYPE.BOOKING_CANCELLED_BY_CUSTOMER,
      NOTIFICATION_TYPE.NEW_CUSTOMER_REVIEW,
    ];

    const actionableTypes: NotificationType[] = [
      NOTIFICATION_TYPE.NEW_BOOKING_REQUEST,
      NOTIFICATION_TYPE.BOOKING_MODIFICATION_REQUEST,
      NOTIFICATION_TYPE.SERVICE_CHANGE_REQUESTED,
      NOTIFICATION_TYPE.NEW_CUSTOMER_REVIEW,
    ];

    const parts: SQL[] = [
      eq(notifications.userId, userId),
      inArray(notifications.type, type ? [type as NotificationType] : barberTypes),
    ];

    if (filter === "unread") parts.push(eq(notifications.isRead, false));
    if (filter === "actionable") {
      parts.push(inArray(notifications.type, actionableTypes));
    }

    const where = and(...parts);

    const findMany = db.query.notifications.findMany({
      where,
      columns: {
        id: true,
        type: true,
        title: true,
        message: true,
        isRead: true,
        metadata: true,
        createdAt: true,
        appointmentId: true,
      },
      orderBy: (t, { desc: descFn }) => [descFn(t.createdAt)],
      offset: skip,
      limit: take,
    });

    const countQuery = db.$count(notifications, where);

    return Promise.all([findMany, countQuery]);
  },

  async markRead(id: string, userId: string) {
    const updated = await db
      .update(notifications)
      .set({ isRead: true })
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

  async countUnread(userId: string) {
    const barberTypes: NotificationType[] = [
      NOTIFICATION_TYPE.NEW_BOOKING_REQUEST,
      NOTIFICATION_TYPE.BOOKING_MODIFICATION_REQUEST,
      NOTIFICATION_TYPE.SERVICE_CHANGE_REQUESTED,
      NOTIFICATION_TYPE.BOOKING_CANCELLED_BY_CUSTOMER,
      NOTIFICATION_TYPE.NEW_CUSTOMER_REVIEW,
    ];

    const [result] = await db
      .select({ total: count() })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false),
          inArray(notifications.type, barberTypes),
        ),
      );

    return result?.total ?? 0;
  },

  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    appointmentId?: string;
    metadata?: Record<string, unknown>;
  }) {
    const [row] = await db
      .insert(notifications)
      .values({
        userId: data.userId,
        type: data.type as NotificationType,
        title: data.title,
        message: data.message,
        appointmentId: data.appointmentId ?? null,
        metadata: data.metadata ?? null,
      })
      .returning();

    return row!;
  },
};

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

export const barberDashboardRepository = {
  getDashboardData(barberId: string, _userId: string, pendingLimit: number) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart.getTime() + 86_400_000);

    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const yesterday = new Date(todayStart);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayEnd = new Date(todayStart);

    return db.transaction(async (tx) => {
      const [barberInfo, todayAppointments, pendingRequests, queueEntriesRows, chairsRows] =
        await Promise.all([
          tx.query.barberProfiles.findFirst({
            where: eq(barberProfiles.id, barberId),
            columns: { averageRating: true, reviewCount: true, displayRole: true },
            with: {
              user: { columns: { firstName: true, photoUrl: true } },
            },
          }),

          tx.query.appointments.findMany({
            where: and(
              eq(appointments.barberId, barberId),
              gte(appointments.startAt, todayStart),
              lt(appointments.startAt, todayEnd),
            ),
            columns: appointmentListColumns,
            with: appointmentListWith,
            orderBy: (t, { asc: ascFn }) => [ascFn(t.startAt)],
          }),

          tx.query.appointments.findMany({
            where: and(
              eq(appointments.barberId, barberId),
              eq(appointments.status, APPOINTMENT_STATUS.PENDING),
            ),
            columns: appointmentListColumns,
            with: appointmentListWith,
            orderBy: (t, { asc: ascFn }) => [ascFn(t.bookedAt)],
            limit: pendingLimit,
          }),

          tx.query.queueEntries.findMany({
            where: and(
              eq(queueEntries.barberId, barberId),
              inArray(queueEntries.status, ["WAITING", "IN_SERVICE"]),
            ),
            columns: queueEntryColumns,
            with: queueEntryWith,
            orderBy: (t, { asc: ascFn }) => [ascFn(t.position), ascFn(t.addedAt)],
          }),

          tx.query.chairs.findMany({
            where: eq(chairs.barberId, barberId),
            columns: chairColumns,
            orderBy: (t, { asc: ascFn }) => [ascFn(t.sortOrder)],
          }),
        ]);

      const sumFinalPrice = async (range: { gte: Date; lt: Date }) => {
        const [row] = await tx
          .select({ finalPriceSum: sum(appointments.finalPrice) })
          .from(appointments)
          .where(
            and(
              eq(appointments.barberId, barberId),
              eq(appointments.status, APPOINTMENT_STATUS.COMPLETED),
              gte(appointments.startAt, range.gte),
              lt(appointments.startAt, range.lt),
            ),
          );

        return {
          _sum: {
            finalPrice: row?.finalPriceSum !== null ? Number(row.finalPriceSum) : null,
          },
        };
      };

      const [earningsToday, earningsYesterday, earningsWeekToDate, earningsTips] =
        await Promise.all([
          sumFinalPrice({ gte: todayStart, lt: todayEnd }),
          sumFinalPrice({ gte: yesterday, lt: yesterdayEnd }),
          sumFinalPrice({ gte: weekStart, lt: todayEnd }),
          Promise.resolve({ _sum: { finalPrice: 0 } }),
        ]);

      const trendDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(todayStart);
        d.setDate(d.getDate() - (6 - i));
        return d;
      });

      const trendStart = trendDays[0] ?? todayStart;
      const dailyEarningsRows = await tx
        .select({
          day: sql<string>`date(${appointments.startAt})`,
          total: sum(appointments.finalPrice),
        })
        .from(appointments)
        .where(
          and(
            eq(appointments.barberId, barberId),
            eq(appointments.status, APPOINTMENT_STATUS.COMPLETED),
            gte(appointments.startAt, trendStart),
            lt(appointments.startAt, todayEnd),
          ),
        )
        .groupBy(sql`date(${appointments.startAt})`);

      const earningsByDay = new Map(
        dailyEarningsRows.map((row) => [String(row.day), Number(row.total ?? 0)]),
      );

      const toLocalDateKey = (day: Date) => {
        const pad = (value: number) => String(value).padStart(2, "0");
        return `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`;
      };

      const earningsTrend = trendDays.map((day) => earningsByDay.get(toLocalDateKey(day)) ?? 0);

      const servedTodayCount = await tx.$count(
        appointments,
        and(
          eq(appointments.barberId, barberId),
          eq(appointments.status, APPOINTMENT_STATUS.COMPLETED),
          gte(appointments.startAt, todayStart),
          lt(appointments.startAt, todayEnd),
        ),
      );

      const allTodayCustomers = await tx
        .selectDistinct({ customerId: appointments.customerId })
        .from(appointments)
        .where(
          and(
            eq(appointments.barberId, barberId),
            gte(appointments.startAt, todayStart),
            lt(appointments.startAt, todayEnd),
          ),
        );

      const customerIds = allTodayCustomers.map((a) => a.customerId);

      let newClientsTodayCnt = 0;
      if (customerIds.length > 0) {
        const [row] = await tx
          .select({ cnt: count() })
          .from(users)
          .where(
            and(
              inArray(users.id, customerIds),
              notExists(
                tx
                  .select({ one: sql`1` })
                  .from(appointments)
                  .where(
                    and(
                      eq(appointments.customerId, users.id),
                      eq(appointments.barberId, barberId),
                      lt(appointments.startAt, todayStart),
                    ),
                  ),
              ),
            ),
          );

        newClientsTodayCnt = Number(row?.cnt ?? 0);
      }

      const reviewsThisWeek = await tx.$count(
        reviews,
        and(eq(reviews.barberId, barberId), gte(reviews.createdAt, weekStart)),
      );

      const rebookQuery = await tx.execute<{ rate: number }>(sql`
        SELECT ROUND(
          100.0 * COUNT(DISTINCT CASE WHEN total > 1 THEN customer_id END)
               / NULLIF(COUNT(DISTINCT customer_id), 0)
        , 0)::int AS rate
        FROM (
          SELECT customer_id, COUNT(*) AS total
          FROM appointments
          WHERE barber_id = ${barberId}
          GROUP BY customer_id
        ) sub
      `);

      return {
        barber: {
          firstName: barberInfo?.user.firstName ?? "",
          displayRole: barberInfo?.displayRole ?? "Barber",
          photoUrl: barberInfo?.user.photoUrl ?? null,
        },
        todayAppointments,
        pendingRequests,
        queueEntries: queueEntriesRows,
        chairs: chairsRows,
        earningsToday: earningsToday._sum.finalPrice ?? 0,
        earningsYesterday: earningsYesterday._sum.finalPrice ?? 0,
        earningsWeekToDate: earningsWeekToDate._sum.finalPrice ?? 0,
        earningsWeekTarget: 0,
        earningsTrend,
        earningsTips: earningsTips._sum.finalPrice ?? 0,
        servedToday: servedTodayCount,
        newClientsToday: newClientsTodayCnt,
        returningToday: customerIds.length - newClientsTodayCnt,
        avgRating: barberInfo?.averageRating ?? 0,
        reviewsThisWeek,
        rebookRate: Number(rebookQuery[0]?.rate ?? 0),
      };
    });
  },
};
