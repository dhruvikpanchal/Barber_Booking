import {
  and,
  asc,
  avg,
  count,
  desc,
  eq,
  exists,
  gt,
  gte,
  inArray,
  lt,
  lte,
  ne,
  or,
  type SQL,
} from "drizzle-orm";
import {
  db,
  appointmentActivity,
  appointmentModifications,
  appointmentOriginalServices,
  appointmentServices,
  appointments,
  barberProfiles,
  barberServices,
  barberSpecialties,
  favoriteBarbers,
  notifications,
  reviews,
  serviceChangeItems,
  serviceChangeRequests,
  services,
  shops,
  users,
  workingHours,
} from "@/server/db";
import {
  CUSTOMER_NOTIFICATION_TYPES,
  CUSTOMER_PAST_STATUSES,
  CUSTOMER_UPCOMING_STATUSES,
} from "@/server/modules/customer/constants";
import type { CustomerAppointmentsQuery } from "@/server/modules/customer/schema";
import { contains } from "@/server/shared/drizzle/helpers";
import { getPrismaSkipTake } from "@/server/shared/pagination";

type NotificationType = typeof notifications.$inferSelect.type;

// ─────────────────────────────────────────────────────────────────────────────
// Shared query shapes
// ─────────────────────────────────────────────────────────────────────────────

const bookingBarberWith = {
  user: { columns: { fullName: true, photoUrl: true } },
  shop: { columns: { id: true, name: true, city: true, address: true } },
  specialties: { columns: { name: true } },
  services: {
    where: (
      fields: { isActive: (typeof barberServices)["isActive"] },
      { eq: eqOp }: { eq: typeof eq },
    ) => eqOp(fields.isActive, true),
    with: {
      service: { columns: { slug: true } },
    },
  },
};

const appointmentWith = {
  barber: {
    with: {
      user: { columns: { fullName: true, photoUrl: true } },
      shop: { columns: { id: true, name: true, city: true, address: true } },
    },
  },
  services: { columns: { name: true, price: true, duration: true } },
  originalServices: { columns: { name: true, price: true, duration: true } },
  review: { columns: { id: true } },
  serviceChangeRequests: {
    orderBy: (
      fields: { requestedAt: (typeof serviceChangeRequests)["requestedAt"] },
      { desc: descOp }: { desc: typeof desc },
    ) => [descOp(fields.requestedAt)],
    with: { items: true as const },
  },
};

const reviewWith = {
  appointment: {
    columns: { id: true, completedAt: true },
    with: { services: { columns: { name: true } } },
  },
  barber: {
    with: { user: { columns: { fullName: true, photoUrl: true } } },
  },
} as const;

type AppointmentRecord = {
  id: string;
  status: string;
  startAt: Date;
  estimatedPrice: number;
  finalPrice: number | null;
  notes: string | null;
  barberNotes: string | null;
  bookedAt: Date;
  confirmedAt: Date | null;
  arrivedAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  cancelledBy: string | null;
  cancelReason: string | null;
  barber: {
    id: string;
    slug: string;
    displayRole: string;
    user: unknown;
    shop?: unknown;
  };
  services: unknown[];
  originalServices: unknown[];
  review?: unknown;
  serviceChangeRequests: {
    id: string;
    status: string;
    customerNote: string | null;
    rejectionNote: string | null;
    requestedAt: Date;
    resolvedAt: Date | null;
    items: unknown[];
  }[];
};

export type CustomerAppointmentRow = {
  id: string;
  status: string;
  startAt: Date;
  estimatedPrice: number;
  finalPrice: number | null;
  notes: string | null;
  barberNotes: string | null;
  bookedAt: Date;
  confirmedAt: Date | null;
  arrivedAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  cancelledBy: string | null;
  cancelReason: string | null;
  reviewId: string | null;
  barber: {
    id: string;
    slug: string;
    displayRole: string;
    user: { fullName: string; photoUrl: string | null };
  };
  shop: { name: string; city: string } | null;
  services: { name: string; price: number; duration: number }[];
  originalServices: { name: string; price: number; duration: number }[];
  updatedServices: { name: string; price: number; duration: number }[] | null;
  serviceChangeRequests: {
    id: string;
    status: string;
    customerNote: string | null;
    rejectionNote: string | null;
    requestedAt: Date;
    resolvedAt: Date | null;
    items: { side: string; name: string; price: number; duration: number }[];
  }[];
};

export type UpdateUserInput = Partial<{
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  photoUrl: string | null;
  address: string | null;
}>;

export type CreateReviewInput = {
  appointmentId: string;
  customerId: string;
  barberId: string;
  rating: number;
  comment?: string | null;
};

export type UpdateReviewInput = Partial<{
  rating: number;
  comment: string | null;
}>;

export type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  appointmentId?: string | null;
  metadata?: unknown;
};

function mapAppointmentRow(row: AppointmentRecord): CustomerAppointmentRow {
  const barberUser = row.barber.user as { fullName: string; photoUrl: string | null };
  const barberShop = row.barber.shop as { name: string; city: string } | null | undefined;
  const services = row.services as { name: string; price: number; duration: number }[];
  const originalServices = row.originalServices as {
    name: string;
    price: number;
    duration: number;
  }[];
  const acceptedChange = row.serviceChangeRequests.find((r) => r.status === "ACCEPTED");
  const updatedServices = acceptedChange
    ? (acceptedChange.items as { side: string; name: string; price: number; duration: number }[])
        .filter((i) => i.side === "updated")
        .map((i) => ({ name: i.name, price: i.price, duration: i.duration }))
    : null;

  return {
    id: row.id,
    status: row.status,
    startAt: row.startAt,
    estimatedPrice: row.estimatedPrice,
    finalPrice: row.finalPrice,
    notes: row.notes,
    barberNotes: row.barberNotes,
    bookedAt: row.bookedAt,
    confirmedAt: row.confirmedAt,
    arrivedAt: row.arrivedAt,
    completedAt: row.completedAt,
    cancelledAt: row.cancelledAt,
    cancelledBy: row.cancelledBy,
    cancelReason: row.cancelReason,
    reviewId: (row.review as { id: string } | null | undefined)?.id ?? null,
    barber: {
      id: row.barber.id,
      slug: row.barber.slug,
      displayRole: row.barber.displayRole,
      user: barberUser,
    },
    shop: barberShop ? { name: barberShop.name, city: barberShop.city } : null,
    services,
    originalServices,
    updatedServices,
    serviceChangeRequests: row.serviceChangeRequests.map((sc) => ({
      id: sc.id,
      status: sc.status,
      customerNote: sc.customerNote,
      rejectionNote: sc.rejectionNote,
      requestedAt: sc.requestedAt,
      resolvedAt: sc.resolvedAt,
      items: (sc.items as { side: string; name: string; price: number; duration: number }[]).map(
        (i) => ({
          side: i.side,
          name: i.name,
          price: i.price,
          duration: i.duration,
        }),
      ),
    })),
  };
}

function buildAppointmentTabCondition(tab: CustomerAppointmentsQuery["tab"], now: Date): SQL {
  switch (tab) {
    case "cancelled":
      return eq(appointments.status, "CANCELLED");
    case "past":
      return inArray(appointments.status, [...CUSTOMER_PAST_STATUSES]);
    case "upcoming":
    default:
      return and(
        inArray(appointments.status, [...CUSTOMER_UPCOMING_STATUSES]),
        gt(appointments.startAt, now),
      )!;
  }
}

function buildListAppointmentsWhere(
  customerId: string,
  query: CustomerAppointmentsQuery,
  now: Date,
): SQL {
  const conditions: SQL[] = [
    eq(appointments.customerId, customerId),
    buildAppointmentTabCondition(query.tab, now),
  ];

  if (query.status) {
    conditions.push(eq(appointments.status, query.status));
  }

  if (query.from || query.to) {
    const dateParts: SQL[] = [];
    if (query.from) dateParts.push(gte(appointments.startAt, new Date(`${query.from}T00:00:00`)));
    if (query.to) dateParts.push(lte(appointments.startAt, new Date(`${query.to}T23:59:59`)));
    conditions.push(and(...dateParts)!);
  }

  if (query.q) {
    conditions.push(
      or(
        exists(
          db
            .select({ id: barberProfiles.id })
            .from(barberProfiles)
            .innerJoin(users, eq(barberProfiles.userId, users.id))
            .where(
              and(eq(barberProfiles.id, appointments.barberId), contains(users.fullName, query.q)),
            ),
        ),
        exists(
          db
            .select({ id: shops.id })
            .from(barberProfiles)
            .innerJoin(shops, eq(barberProfiles.shopId, shops.id))
            .where(
              and(eq(barberProfiles.id, appointments.barberId), contains(shops.name, query.q)),
            ),
        ),
        exists(
          db
            .select({ id: appointmentServices.id })
            .from(appointmentServices)
            .where(
              and(
                eq(appointmentServices.appointmentId, appointments.id),
                contains(appointmentServices.name, query.q),
              ),
            ),
        ),
      )!,
    );
  }

  return and(...conditions)!;
}

function buildListBookingBarbersWhere(params: {
  q?: string;
  city?: string;
  specialty?: string;
  availableOnly?: boolean;
}): SQL {
  const conditions: SQL[] = [eq(barberProfiles.barberStatus, "ACTIVE")];

  if (params.availableOnly) {
    conditions.push(eq(barberProfiles.isAvailable, true));
  }

  if (params.city) {
    conditions.push(
      exists(
        db
          .select({ id: shops.id })
          .from(shops)
          .where(and(eq(shops.id, barberProfiles.shopId), contains(shops.city, params.city))),
      ),
    );
  }

  if (params.specialty) {
    conditions.push(
      exists(
        db
          .select({ id: barberSpecialties.id })
          .from(barberSpecialties)
          .where(
            and(
              eq(barberSpecialties.barberId, barberProfiles.id),
              contains(barberSpecialties.name, params.specialty),
            ),
          ),
      ),
    );
  }

  if (params.q) {
    conditions.push(
      or(
        contains(barberProfiles.slug, params.q),
        contains(barberProfiles.displayRole, params.q),
        exists(
          db
            .select({ id: users.id })
            .from(users)
            .where(and(eq(users.id, barberProfiles.userId), contains(users.fullName, params.q))),
        ),
        exists(
          db
            .select({ id: barberSpecialties.id })
            .from(barberSpecialties)
            .where(
              and(
                eq(barberSpecialties.barberId, barberProfiles.id),
                contains(barberSpecialties.name, params.q),
              ),
            ),
        ),
      )!,
    );
  }

  return and(...conditions)!;
}

function splitFullName(fullName: string): {
  firstName: string;
  lastName: string;
  fullName: string;
} {
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { firstName: "Guest", lastName: "", fullName: "Guest" };
  }
  if (parts.length === 1) {
    return { firstName: parts[0]!, lastName: "", fullName: trimmed };
  }
  return {
    firstName: parts[0]!,
    lastName: parts.slice(1).join(" "),
    fullName: trimmed,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Repository
// ─────────────────────────────────────────────────────────────────────────────

export const customerRepository = {
  findUserById(userId: string) {
    return db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        email: true,
        fullName: true,
        firstName: true,
        lastName: true,
        phone: true,
        photoUrl: true,
        address: true,
        createdAt: true,
        role: true,
      },
    });
  },

  findUserByEmail(email: string, excludeUserId?: string) {
    const conditions = [eq(users.email, email.toLowerCase())];
    if (excludeUserId) {
      conditions.push(ne(users.id, excludeUserId));
    }
    return db.query.users.findFirst({
      where: and(...conditions),
      columns: { id: true },
    });
  },

  async updateUser(userId: string, data: UpdateUserInput) {
    const [user] = await db.update(users).set(data).where(eq(users.id, userId)).returning({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      photoUrl: users.photoUrl,
      address: users.address,
      createdAt: users.createdAt,
    });
    return user!;
  },

  findBarberByIdOrSlug(barberIdOrSlug: string) {
    return db.query.barberProfiles.findFirst({
      where: and(
        or(eq(barberProfiles.id, barberIdOrSlug), eq(barberProfiles.slug, barberIdOrSlug)),
        eq(barberProfiles.barberStatus, "ACTIVE"),
      ),
      with: {
        user: { columns: { id: true, fullName: true } },
        shop: { columns: { id: true, name: true } },
        workingHours: true,
      },
    });
  },

  async listBookingBarbers(params: {
    page: number;
    limit: number;
    q?: string;
    city?: string;
    specialty?: string;
    availableOnly?: boolean;
  }) {
    const where = buildListBookingBarbersWhere(params);
    const { skip, take } = getPrismaSkipTake(params.page, params.limit);

    const [totalResult, idRows] = await Promise.all([
      db.select({ total: count() }).from(barberProfiles).where(where),
      db
        .select({ id: barberProfiles.id })
        .from(barberProfiles)
        .where(where)
        .orderBy(desc(barberProfiles.isAvailable), desc(barberProfiles.averageRating))
        .offset(skip)
        .limit(take),
    ]);

    const ids = idRows.map((r) => r.id);
    if (ids.length === 0) {
      return { total: totalResult[0]?.total ?? 0, rows: [] };
    }

    const rowsUnordered = await db.query.barberProfiles.findMany({
      where: inArray(barberProfiles.id, ids),
      with: bookingBarberWith,
    });
    const byId = new Map(rowsUnordered.map((r) => [r.id, r]));
    const rows = ids.map((id) => byId.get(id)!);

    return { total: totalResult[0]?.total ?? 0, rows };
  },

  findBarberForBooking(slug: string) {
    return db.query.barberProfiles.findFirst({
      where: and(eq(barberProfiles.slug, slug), eq(barberProfiles.barberStatus, "ACTIVE")),
      with: bookingBarberWith,
    });
  },

  listBarberBookingServices(barberId: string) {
    return db
      .select({ barberService: barberServices, service: services })
      .from(barberServices)
      .innerJoin(services, eq(barberServices.serviceId, services.id))
      .where(
        and(
          eq(barberServices.barberId, barberId),
          eq(barberServices.isActive, true),
          eq(services.isActive, true),
        ),
      )
      .orderBy(asc(services.name))
      .then((rows) => rows.map((r) => ({ ...r.barberService, service: r.service })));
  },

  resolveBarberServices(barberId: string, serviceIds: string[]) {
    return db
      .select({ barberService: barberServices, service: services })
      .from(barberServices)
      .innerJoin(services, eq(barberServices.serviceId, services.id))
      .where(
        and(
          eq(barberServices.barberId, barberId),
          eq(barberServices.isActive, true),
          inArray(barberServices.serviceId, serviceIds),
          eq(services.isActive, true),
        ),
      )
      .then((rows) => rows.map((r) => ({ ...r.barberService, service: r.service })));
  },

  findAppointmentsForSlotCheck(barberId: string, dayStart: Date, dayEnd: Date) {
    return db.query.appointments.findMany({
      where: and(
        eq(appointments.barberId, barberId),
        gte(appointments.startAt, dayStart),
        lt(appointments.startAt, dayEnd),
        inArray(appointments.status, ["PENDING", "CONFIRMED", "IN_SERVICE"]),
      ),
      with: { services: { columns: { duration: true } } },
    });
  },

  getWorkingHoursForDay(barberId: string, dayIndex: number) {
    return db.query.workingHours.findFirst({
      where: and(eq(workingHours.barberId, barberId), eq(workingHours.day, dayIndex)),
    });
  },

  async listAppointments(customerId: string, query: CustomerAppointmentsQuery) {
    const now = new Date();
    const where = buildListAppointmentsWhere(customerId, query, now);
    const { skip, take } = getPrismaSkipTake(query.page, query.limit);
    const orderBy =
      query.tab === "upcoming" ? asc(appointments.startAt) : desc(appointments.startAt);

    const [totalResult, idRows] = await Promise.all([
      db.select({ total: count() }).from(appointments).where(where),
      db
        .select({ id: appointments.id })
        .from(appointments)
        .where(where)
        .orderBy(orderBy)
        .offset(skip)
        .limit(take),
    ]);

    const ids = idRows.map((r) => r.id);
    if (ids.length === 0) {
      return { total: totalResult[0]?.total ?? 0, rows: [] };
    }

    const rowsUnordered = await db.query.appointments.findMany({
      where: inArray(appointments.id, ids),
      with: appointmentWith,
    });
    const byId = new Map(rowsUnordered.map((r) => [r.id, r]));
    const rows = ids.map((id) => mapAppointmentRow(byId.get(id)!));

    return { total: totalResult[0]?.total ?? 0, rows };
  },

  async listAllAppointmentsForCustomer(customerId: string) {
    const rows = await db.query.appointments.findMany({
      where: eq(appointments.customerId, customerId),
      orderBy: desc(appointments.startAt),
      with: appointmentWith,
    });
    return rows.map(mapAppointmentRow);
  },

  async findAppointmentById(customerId: string, appointmentId: string) {
    const row = await db.query.appointments.findFirst({
      where: and(eq(appointments.id, appointmentId), eq(appointments.customerId, customerId)),
      with: appointmentWith,
    });
    return row ? mapAppointmentRow(row) : null;
  },

  async createAppointment(params: {
    customerId: string;
    barberId: string;
    startAt: Date;
    notes: string | null;
    services: { serviceId: string; name: string; price: number; duration: number }[];
    estimatedPrice: number;
  }) {
    const snapshots = params.services.map((s) => ({
      serviceId: s.serviceId,
      name: s.name,
      price: s.price,
      duration: s.duration,
    }));

    return db.transaction(async (tx) => {
      const [appointment] = await tx
        .insert(appointments)
        .values({
          customerId: params.customerId,
          barberId: params.barberId,
          startAt: params.startAt,
          estimatedPrice: params.estimatedPrice,
          notes: params.notes,
          status: "PENDING",
        })
        .returning();

      await tx.insert(appointmentServices).values(
        snapshots.map((s) => ({
          appointmentId: appointment!.id,
          serviceId: s.serviceId,
          name: s.name,
          price: s.price,
          duration: s.duration,
        })),
      );

      await tx.insert(appointmentOriginalServices).values(
        snapshots.map(({ name, price, duration }) => ({
          appointmentId: appointment!.id,
          name,
          price,
          duration,
        })),
      );

      await tx.insert(appointmentModifications).values({
        appointmentId: appointment!.id,
        actor: "Customer",
        field: "Booking",
        previousValue: "—",
        updatedValue: "Submitted",
        summary: "Booking submitted",
      });

      await tx.insert(appointmentActivity).values({
        appointmentId: appointment!.id,
        message: "Booking created online",
      });

      const row = await tx.query.appointments.findFirst({
        where: eq(appointments.id, appointment!.id),
        with: appointmentWith,
      });

      return mapAppointmentRow(row!);
    });
  },

  async cancelAppointment(customerId: string, appointmentId: string, reason: string | null) {
    return db.transaction(async (tx) => {
      const existing = await tx.query.appointments.findFirst({
        where: and(eq(appointments.id, appointmentId), eq(appointments.customerId, customerId)),
        columns: { status: true },
      });
      if (!existing) return null;

      await tx
        .update(appointments)
        .set({
          status: "CANCELLED",
          cancelledBy: "CUSTOMER",
          cancelReason: reason || null,
          cancelledAt: new Date(),
        })
        .where(and(eq(appointments.id, appointmentId), eq(appointments.customerId, customerId)));

      await tx.insert(appointmentModifications).values({
        appointmentId,
        actor: "Customer",
        field: "Status",
        previousValue: existing.status,
        updatedValue: "Cancelled",
        summary: "Booking cancelled by customer",
        reason,
      });

      await tx.insert(appointmentActivity).values({
        appointmentId,
        message: "Customer cancelled appointment",
      });

      const row = await tx.query.appointments.findFirst({
        where: eq(appointments.id, appointmentId),
        with: appointmentWith,
      });

      return mapAppointmentRow(row!);
    });
  },

  async createServiceChangeRequest(params: {
    appointmentId: string;
    customerNote: string | null;
    originalServices: { name: string; price: number; duration: number }[];
    requestedServices: {
      serviceId: string | null;
      name: string;
      price: number;
      duration: number;
    }[];
  }) {
    return db.transaction(async (tx) => {
      const [request] = await tx
        .insert(serviceChangeRequests)
        .values({
          appointmentId: params.appointmentId,
          customerNote: params.customerNote,
        })
        .returning();

      await tx.insert(serviceChangeItems).values([
        ...params.originalServices.map((s) => ({
          requestId: request!.id,
          side: "original",
          name: s.name,
          price: s.price,
          duration: s.duration,
        })),
        ...params.requestedServices.map((s) => ({
          requestId: request!.id,
          side: "updated",
          serviceId: s.serviceId,
          name: s.name,
          price: s.price,
          duration: s.duration,
        })),
      ]);

      await tx.insert(appointmentModifications).values({
        appointmentId: params.appointmentId,
        actor: "Customer",
        field: "Service",
        summary: "Service change requested",
        reason: params.customerNote,
      });

      await tx.insert(appointmentActivity).values({
        appointmentId: params.appointmentId,
        message: "Customer requested a service change",
      });

      return tx.query.serviceChangeRequests.findFirst({
        where: eq(serviceChangeRequests.id, request!.id),
        with: { items: true },
      });
    });
  },

  findPendingServiceChange(appointmentId: string) {
    return db.query.serviceChangeRequests.findFirst({
      where: and(
        eq(serviceChangeRequests.appointmentId, appointmentId),
        eq(serviceChangeRequests.status, "PENDING"),
      ),
    });
  },

  async listFavorites(userId: string, sort: string) {
    const orderClause = (() => {
      switch (sort) {
        case "rating":
          return desc(barberProfiles.averageRating);
        case "visits":
          return desc(favoriteBarbers.totalVisits);
        case "price":
          return asc(barberProfiles.startingPrice);
        case "available":
          return desc(barberProfiles.isAvailable);
        default:
          return desc(favoriteBarbers.savedAt);
      }
    })();

    const idRows = await db
      .select({ id: favoriteBarbers.id })
      .from(favoriteBarbers)
      .innerJoin(barberProfiles, eq(favoriteBarbers.barberId, barberProfiles.id))
      .where(eq(favoriteBarbers.userId, userId))
      .orderBy(orderClause);

    const ids = idRows.map((r) => r.id);
    if (ids.length === 0) return [];

    const favorites = await db.query.favoriteBarbers.findMany({
      where: inArray(favoriteBarbers.id, ids),
      with: { barber: { with: bookingBarberWith } },
    });

    const byId = new Map(favorites.map((f) => [f.id, f]));
    return ids.map((id) => byId.get(id)!);
  },

  findFavorite(userId: string, barberId: string) {
    return db.query.favoriteBarbers.findFirst({
      where: and(eq(favoriteBarbers.userId, userId), eq(favoriteBarbers.barberId, barberId)),
    });
  },

  async addFavorite(userId: string, barberId: string) {
    const [row] = await db.insert(favoriteBarbers).values({ userId, barberId }).returning();
    return row!;
  },

  async removeFavorite(userId: string, barberId: string) {
    const [row] = await db
      .delete(favoriteBarbers)
      .where(and(eq(favoriteBarbers.userId, userId), eq(favoriteBarbers.barberId, barberId)))
      .returning();
    return row!;
  },

  async listReviews(
    customerId: string,
    params: {
      page: number;
      limit: number;
      sort: string;
      rating?: number;
    },
  ) {
    const conditions: SQL[] = [eq(reviews.customerId, customerId)];
    if (params.rating) {
      conditions.push(eq(reviews.rating, params.rating));
    }
    const where = and(...conditions)!;

    const orderBy =
      params.sort === "oldest"
        ? asc(reviews.createdAt)
        : params.sort === "rating"
          ? desc(reviews.rating)
          : desc(reviews.createdAt);

    const { skip, take } = getPrismaSkipTake(params.page, params.limit);

    const [totalResult, idRows] = await Promise.all([
      db.select({ total: count() }).from(reviews).where(where),
      db
        .select({ id: reviews.id })
        .from(reviews)
        .where(where)
        .orderBy(orderBy)
        .offset(skip)
        .limit(take),
    ]);

    const ids = idRows.map((r) => r.id);
    if (ids.length === 0) {
      return { total: totalResult[0]?.total ?? 0, rows: [] };
    }

    const rowsUnordered = await db.query.reviews.findMany({
      where: inArray(reviews.id, ids),
      with: reviewWith,
    });
    const byId = new Map(rowsUnordered.map((r) => [r.id, r]));
    const rows = ids.map((id) => byId.get(id)!);

    return { total: totalResult[0]?.total ?? 0, rows };
  },

  findReviewById(customerId: string, reviewId: string) {
    return db.query.reviews.findFirst({
      where: and(eq(reviews.id, reviewId), eq(reviews.customerId, customerId)),
      with: {
        appointment: true,
        barber: true,
      },
    });
  },

  findReviewByAppointmentId(appointmentId: string) {
    return db.query.reviews.findFirst({
      where: eq(reviews.appointmentId, appointmentId),
    });
  },

  async createReview(data: CreateReviewInput) {
    const [review] = await db
      .insert(reviews)
      .values({
        appointmentId: data.appointmentId,
        customerId: data.customerId,
        barberId: data.barberId,
        rating: data.rating,
        comment: data.comment ?? null,
      })
      .returning();

    return db.query.reviews.findFirst({
      where: eq(reviews.id, review!.id),
      with: reviewWith,
    });
  },

  async updateReview(reviewId: string, data: UpdateReviewInput) {
    await db.update(reviews).set(data).where(eq(reviews.id, reviewId));

    return db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
      with: reviewWith,
    });
  },

  async deleteReview(reviewId: string) {
    const [row] = await db.delete(reviews).where(eq(reviews.id, reviewId)).returning();
    return row!;
  },

  async listNotifications(
    userId: string,
    params: {
      page: number;
      limit: number;
      types?: string[];
      isRead?: boolean;
    },
  ) {
    const typeFilter = params.types?.length ? params.types : [...CUSTOMER_NOTIFICATION_TYPES];
    const conditions: SQL[] = [
      eq(notifications.userId, userId),
      inArray(notifications.type, typeFilter as NotificationType[]),
    ];
    if (params.isRead !== undefined) {
      conditions.push(eq(notifications.isRead, params.isRead));
    }
    const where = and(...conditions)!;

    const { skip, take } = getPrismaSkipTake(params.page, params.limit);

    const [totalResult, rows] = await Promise.all([
      db.select({ total: count() }).from(notifications).where(where),
      db.query.notifications.findMany({
        where,
        orderBy: desc(notifications.createdAt),
        offset: skip,
        limit: take,
      }),
    ]);

    return { total: totalResult[0]?.total ?? 0, rows };
  },

  listRecentNotifications(userId: string, limit: number) {
    return db.query.notifications.findMany({
      where: and(
        eq(notifications.userId, userId),
        inArray(notifications.type, [...CUSTOMER_NOTIFICATION_TYPES]),
      ),
      orderBy: desc(notifications.createdAt),
      limit,
    });
  },

  async countUnreadNotifications(userId: string) {
    const [result] = await db
      .select({ total: count() })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false),
          inArray(notifications.type, [...CUSTOMER_NOTIFICATION_TYPES]),
        ),
      );
    return result?.total ?? 0;
  },

  findNotificationById(userId: string, notificationId: string) {
    return db.query.notifications.findFirst({
      where: and(
        eq(notifications.id, notificationId),
        eq(notifications.userId, userId),
        inArray(notifications.type, [...CUSTOMER_NOTIFICATION_TYPES]),
      ),
    });
  },

  async markNotificationRead(userId: string, notificationId: string) {
    const row = await db.query.notifications.findFirst({
      where: and(eq(notifications.id, notificationId), eq(notifications.userId, userId)),
    });
    if (!row) return null;

    const [updated] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId))
      .returning();
    return updated ?? null;
  },

  markAllNotificationsRead(userId: string) {
    return db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false),
          inArray(notifications.type, [...CUSTOMER_NOTIFICATION_TYPES]),
        ),
      );
  },

  async deleteNotification(userId: string, notificationId: string) {
    const row = await db.query.notifications.findFirst({
      where: and(eq(notifications.id, notificationId), eq(notifications.userId, userId)),
    });
    if (!row) return false;

    await db.delete(notifications).where(eq(notifications.id, notificationId));
    return true;
  },

  async createNotification(data: CreateNotificationInput) {
    const [row] = await db
      .insert(notifications)
      .values({
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        appointmentId: data.appointmentId ?? null,
        metadata: data.metadata ?? null,
      })
      .returning();
    return row!;
  },

  getBarberUserId(barberId: string) {
    return db.query.barberProfiles.findFirst({
      where: eq(barberProfiles.id, barberId),
      columns: { userId: true },
      with: {
        user: { columns: { fullName: true } },
        shop: { columns: { name: true } },
      },
    });
  },

  async recalculateBarberRating(barberId: string) {
    const [agg] = await db
      .select({
        avgRating: avg(reviews.rating),
        reviewCount: count(reviews.id),
      })
      .from(reviews)
      .where(eq(reviews.barberId, barberId));

    await db
      .update(barberProfiles)
      .set({
        averageRating: Number(agg?.avgRating ?? 0),
        reviewCount: agg?.reviewCount ?? 0,
      })
      .where(eq(barberProfiles.id, barberId));
  },

  splitFullName(fullName: string) {
    return splitFullName(fullName);
  },
};
