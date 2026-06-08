
import { appConfig } from "@/server/config";
import { uploadImage } from "@/server/infrastructure/storage/cloudinary";
import {
  BOOKING_MIN_LEAD_MINUTES,
  BOOKING_SLOT_INTERVAL_MINUTES,
  REVIEW_EDIT_WINDOW_MS,
  SERVICE_CHANGE_MIN_MS,
} from "@/server/modules/customer/constants";
import {
  buildDashboardActivity,
  buildPaginationMeta,
  matchesCustomerNotificationFilter,
  toAvailableSlotDto,
  toBookingBarberDto,
  type BookingBarberDbRow,
  toBookingServiceDto,
  toCreateAppointmentResultDto,
  toCustomerAppointmentDetailDto,
  toCustomerAppointmentListItemDto,
  toCustomerNotificationDto,
  toCustomerProfileDto,
  toCustomerReviewDto,
  toDashboardStatsDto,
  toFavoriteBarberDto,
  toFavoriteToggleResultDto,
} from "@/server/modules/customer/mapper";
import { customerRepository } from "@/server/modules/customer/repository";
import type {
  AvailableSlotsQuery,
  BookingBarbersQuery,
  CancelAppointmentInput,
  ConfirmBookingInput,
  CreateAppointmentInput,
  CreateReviewInput,
  CustomerAppointmentsQuery,
  CustomerNotificationsQuery,
  CustomerReviewsQuery,
  DashboardQuery,
  FavoritesQuery,
  RequestServiceChangeInput,
  UpdateCustomerProfileInput,
  UpdateReviewInput,
} from "@/server/modules/customer/schema";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnprocessableError,
} from "@/server/shared/errors/AppError";
import { NOTIFICATION_TYPE } from "@/server/shared/constants/notificationTypes";
import { ROLES } from "@/server/shared/constants/roles";

function fireAndForget(promise: Promise<unknown>): void {
  promise.catch((err) => console.error("[customer] async side-effect failed", err));
}

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m ?? 0);
}

function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function appointmentEndMs(startAt: Date, durationMinutes: number): number {
  return startAt.getTime() + durationMinutes * 60_000;
}

function rangesOverlap(startA: number, endA: number, startB: number, endB: number): boolean {
  return startA < endB && endA > startB;
}

function notificationTypesForFilter(filter: string): string[] | undefined {
  switch (filter) {
    case "appointments":
      return [
        NOTIFICATION_TYPE.BOOKING_CONFIRMED,
        NOTIFICATION_TYPE.BOOKING_CANCELLED,
        NOTIFICATION_TYPE.BOOKING_REMINDER,
      ];
    case "service_change":
      return [NOTIFICATION_TYPE.SERVICE_CHANGE_ACCEPTED, NOTIFICATION_TYPE.SERVICE_CHANGE_REJECTED];
    case "review_request":
      return [NOTIFICATION_TYPE.REVIEW_REQUEST];
    case "promotion":
      return [NOTIFICATION_TYPE.PROMOTION];
    default:
      return undefined;
  }
}

async function getCustomerContext(userId: string) {
  const user = await customerRepository.findUserById(userId);
  if (!user) throw new NotFoundError("User");
  if (user.role !== ROLES.CUSTOMER) {
    throw new ForbiddenError("Customer access only");
  }
  return user;
}

async function notifyBarber(
  barberId: string,
  payload: {
    type: (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
    title: string;
    message: string;
    appointmentId?: string;
    metadata?: Record<string, unknown>;
  },
) {
  const barber = await customerRepository.getBarberUserId(barberId);
  if (!barber) return;

  fireAndForget(
    customerRepository.createNotification({
      userId: barber.userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      ...(payload.appointmentId ? { appointment: { connect: { id: payload.appointmentId } } } : {}),
      metadata: (payload.metadata ?? undefined) as unknown,
    }),
  );
}

export const customerService = {
  async getProfile(userId: string) {
    const user = await getCustomerContext(userId);
    return toCustomerProfileDto(user);
  },

  async updateProfile(userId: string, input: UpdateCustomerProfileInput) {
    await getCustomerContext(userId);

    const emailTaken = await customerRepository.findUserByEmail(input.email, userId);
    if (emailTaken) throw new ConflictError("Email is already in use");

    const { firstName, lastName, fullName } = customerRepository.splitFullName(input.fullName);
    const updated = await customerRepository.updateUser(userId, {
      fullName,
      firstName,
      lastName,
      email: input.email,
      phone: input.phone || null,
      address: input.address || null,
    });

    return toCustomerProfileDto(updated);
  },

  async uploadProfilePhoto(userId: string, file: { buffer: Buffer; mimeType: string }) {
    await getCustomerContext(userId);
    const uploaded = await uploadImage(file.buffer, appConfig.auth.avatarFolder, {
      resource_type: "image",
    });
    const updated = await customerRepository.updateUser(userId, { photoUrl: uploaded.url });
    return { photoUrl: updated.photoUrl };
  },

  async getDashboard(userId: string, query: DashboardQuery) {
    const user = await getCustomerContext(userId);
    const allRows = await customerRepository.listAllAppointmentsForCustomer(userId);
    const customerCtx = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    };

    const listDtos = allRows.map((row) => toCustomerAppointmentListItemDto(row));
    const detailDtos = allRows.map((row) => toCustomerAppointmentDetailDto(row, customerCtx));

    const now = Date.now();
    const upcoming = listDtos
      .filter(
        (a) =>
          (a.status === "pending" || a.status === "confirmed" || a.status === "in-service") &&
          new Date(a.startAt).getTime() > now,
      )
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());

    const nextAppointment = upcoming[0] ?? null;
    const upcomingPreview = upcoming.slice(0, query.upcomingLimit);
    const recentActivity = buildDashboardActivity(detailDtos, query.activityLimit);

    const [unreadCount, notificationRows] = await Promise.all([
      customerRepository.countUnreadNotifications(userId),
      customerRepository.listRecentNotifications(userId, query.notificationLimit),
    ]);

    return {
      profile: {
        fullName: user.fullName,
        firstName: user.firstName,
        photoUrl: user.photoUrl,
      },
      stats: toDashboardStatsDto(listDtos),
      nextAppointment,
      upcoming: upcomingPreview,
      recentActivity,
      notifications: {
        unreadCount,
        preview: notificationRows.map(toCustomerNotificationDto),
      },
    };
  },

  async listAppointments(userId: string, query: CustomerAppointmentsQuery) {
    await getCustomerContext(userId);
    const { total, rows } = await customerRepository.listAppointments(userId, query);
    const items = rows.map(toCustomerAppointmentListItemDto);
    return { items, meta: buildPaginationMeta(total, query.page, query.limit) };
  },

  async getAppointment(userId: string, appointmentId: string) {
    const user = await getCustomerContext(userId);
    const row = await customerRepository.findAppointmentById(userId, appointmentId);
    if (!row) throw new NotFoundError("Appointment");
    return toCustomerAppointmentDetailDto(row, {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    });
  },

  async createAppointment(userId: string, input: CreateAppointmentInput) {
    await getCustomerContext(userId);
    return this.bookAppointment(userId, input);
  },

  async confirmBooking(userId: string, input: ConfirmBookingInput) {
    await getCustomerContext(userId);
    return this.bookAppointment(userId, input);
  },

  async bookAppointment(userId: string, input: CreateAppointmentInput) {
    const barber = await customerRepository.findBarberByIdOrSlug(input.barberId);
    if (!barber || !barber.isAvailable) {
      throw new NotFoundError("Barber");
    }

    const barberServices = await customerRepository.resolveBarberServices(
      barber.id,
      input.serviceIds,
    );
    if (barberServices.length !== input.serviceIds.length) {
      throw new UnprocessableError("One or more services are invalid for this barber");
    }

    const snapshots = barberServices.map((bs) => ({
      serviceId: bs.serviceId,
      name: bs.service.name,
      price: bs.priceOverride ?? bs.service.price,
      duration: bs.service.duration,
    }));

    const totalDuration = snapshots.reduce((s, x) => s + x.duration, 0);
    const estimatedPrice = snapshots.reduce((s, x) => s + x.price, 0);

    const leadMs = BOOKING_MIN_LEAD_MINUTES * 60_000;
    if (input.startAt.getTime() < Date.now() + leadMs) {
      throw new UnprocessableError(
        `Appointments must be booked at least ${BOOKING_MIN_LEAD_MINUTES} minutes in advance`,
      );
    }

    await this.assertSlotAvailable(barber.id, input.startAt, totalDuration);

    const customer = await customerRepository.findUserById(userId);
    const row = await customerRepository.createAppointment({
      customerId: userId,
      barberId: barber.id,
      startAt: input.startAt,
      notes: input.notes || null,
      services: snapshots,
      estimatedPrice,
    });

    const serviceLabel = snapshots.map((s) => s.name).join(" + ");
    fireAndForget(
      notifyBarber(barber.id, {
        type: NOTIFICATION_TYPE.NEW_BOOKING_REQUEST,
        title: "New Booking Request",
        message: `New booking request for ${serviceLabel}.`,
        appointmentId: row.id,
        metadata: {
          client: customer?.fullName ?? "Customer",
          service: serviceLabel,
          date: input.startAt.toISOString(),
        },
      }),
    );

    return toCreateAppointmentResultDto(row);
  },

  async cancelAppointment(userId: string, appointmentId: string, input: CancelAppointmentInput) {
    await getCustomerContext(userId);
    const existing = await customerRepository.findAppointmentById(userId, appointmentId);
    if (!existing) throw new NotFoundError("Appointment");

    if (existing.status === "COMPLETED" || existing.status === "CANCELLED") {
      throw new UnprocessableError("This appointment cannot be cancelled");
    }

    const row = await customerRepository.cancelAppointment(
      userId,
      appointmentId,
      input.reason || null,
    );
    if (!row) throw new NotFoundError("Appointment");

    fireAndForget(
      notifyBarber(row.barber.id, {
        type: NOTIFICATION_TYPE.BOOKING_CANCELLED_BY_CUSTOMER,
        title: "Booking Cancelled",
        message: "A customer cancelled their appointment.",
        appointmentId: row.id,
        metadata: {
          cancelledBy: "customer",
          reason: input.reason ?? null,
        },
      }),
    );

    return toCustomerAppointmentListItemDto(row);
  },

  async requestServiceChange(
    userId: string,
    appointmentId: string,
    input: RequestServiceChangeInput,
  ) {
    await getCustomerContext(userId);
    const appointment = await customerRepository.findAppointmentById(userId, appointmentId);
    if (!appointment) throw new NotFoundError("Appointment");

    if (appointment.status !== "PENDING" && appointment.status !== "CONFIRMED") {
      throw new UnprocessableError("Service changes are only available for upcoming bookings");
    }

    const msUntil = appointment.startAt.getTime() - Date.now();
    if (msUntil <= SERVICE_CHANGE_MIN_MS) {
      throw new UnprocessableError(
        "Service changes are not available within 5 hours of the appointment",
      );
    }

    const pending = await customerRepository.findPendingServiceChange(appointmentId);
    if (pending) {
      throw new ConflictError("A pending change request already exists for this appointment");
    }

    const barberServices = await customerRepository.resolveBarberServices(
      appointment.barber.id,
      input.serviceIds,
    );
    if (barberServices.length !== input.serviceIds.length) {
      throw new UnprocessableError("One or more services are invalid for this barber");
    }

    const requestedServices = barberServices.map((bs) => ({
      serviceId: bs.serviceId,
      name: bs.service.name,
      price: bs.priceOverride ?? bs.service.price,
      duration: bs.service.duration,
    }));

    const request = await customerRepository.createServiceChangeRequest({
      appointmentId,
      customerNote: input.customerNote || null,
      originalServices: appointment.services,
      requestedServices,
    });

    fireAndForget(
      notifyBarber(appointment.barber.id, {
        type: NOTIFICATION_TYPE.SERVICE_CHANGE_REQUESTED,
        title: "Service Change Requested",
        message: "A customer requested to change services on an upcoming appointment.",
        appointmentId,
        metadata: { customerNote: input.customerNote ?? null },
      }),
    );

    return {
      id: request?.id ?? "",
      status: request?.status?.toLowerCase() ?? "",
      requestedAt: request?.requestedAt?.toISOString() ?? "",
      customerNote: request?.customerNote ?? "",
    };
  },

  async listBookingBarbers(query: BookingBarbersQuery) {
    const { total, rows } = await customerRepository.listBookingBarbers(query);
    return {
      items: rows.map((row) => toBookingBarberDto(row as unknown as BookingBarberDbRow)),
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  },

  async listBookingServices(slug: string) {
    const barber = await customerRepository.findBarberForBooking(slug);
    if (!barber) throw new NotFoundError("Barber");

    const services = await customerRepository.listBarberBookingServices(barber.id);
    return services.map((bs) =>
      toBookingServiceDto({
        id: bs.service.id,
        slug: bs.service.slug,
        name: bs.service.name,
        description: bs.service.description,
        price: bs.priceOverride ?? bs.service.price,
        duration: bs.service.duration,
        isActive: bs.isActive && bs.service.isActive,
      }),
    );
  },

  async getAvailableSlots(slug: string, query: AvailableSlotsQuery) {
    const barber = await customerRepository.findBarberForBooking(slug);
    if (!barber || !barber.isAvailable) {
      return [];
    }

    let totalDuration = query.duration ?? 30;
    if (query.serviceIds?.length) {
      const services = await customerRepository.resolveBarberServices(barber.id, query.serviceIds);
      if (services.length !== query.serviceIds.length) {
        throw new UnprocessableError("One or more services are invalid for this barber");
      }
      totalDuration = services.reduce((s, x) => s + x.service.duration, 0);
    }

    const dayDate = new Date(`${query.date}T00:00:00`);
    const dayIndex = dayDate.getDay();
    const hours = await customerRepository.getWorkingHoursForDay(barber.id, dayIndex);

    if (!hours || hours.isClosed || !hours.openTime || !hours.closeTime) {
      return [];
    }

    const dayStart = new Date(`${query.date}T00:00:00`);
    const dayEnd = new Date(`${query.date}T23:59:59`);
    const busy = await customerRepository.findAppointmentsForSlotCheck(barber.id, dayStart, dayEnd);

    const openMin = parseTimeToMinutes(hours.openTime);
    const closeMin = parseTimeToMinutes(hours.closeTime);
    const interval = BOOKING_SLOT_INTERVAL_MINUTES;
    const slots: ReturnType<typeof toAvailableSlotDto>[] = [];

    for (let cursor = openMin; cursor + totalDuration <= closeMin; cursor += interval) {
      const time = minutesToTime(cursor);
      const slotStart = new Date(`${query.date}T${time}:00`);
      const slotStartMs = slotStart.getTime();
      const slotEndMs = appointmentEndMs(slotStart, totalDuration);

      if (slotStartMs < Date.now() + BOOKING_MIN_LEAD_MINUTES * 60_000) {
        slots.push(toAvailableSlotDto(time, false));
        continue;
      }

      const conflict = busy.some((appt) => {
        const apptDuration = appt.services.reduce((s, x) => s + x.duration, 0);
        const apptStart = appt.startAt.getTime();
        const apptEnd = appointmentEndMs(appt.startAt, apptDuration);
        return rangesOverlap(slotStartMs, slotEndMs, apptStart, apptEnd);
      });

      slots.push(toAvailableSlotDto(time, !conflict));
    }

    return slots;
  },

  async assertSlotAvailable(barberId: string, startAt: Date, durationMinutes: number) {
    const dateStr = startAt.toISOString().slice(0, 10);
    const timeStr = `${String(startAt.getHours()).padStart(2, "0")}:${String(startAt.getMinutes()).padStart(2, "0")}`;

    const dayStart = new Date(`${dateStr}T00:00:00`);
    const dayEnd = new Date(`${dateStr}T23:59:59`);
    const busy = await customerRepository.findAppointmentsForSlotCheck(barberId, dayStart, dayEnd);

    const slotStartMs = startAt.getTime();
    const slotEndMs = appointmentEndMs(startAt, durationMinutes);

    const conflict = busy.some((appt) => {
      const apptDuration = appt.services.reduce((s, x) => s + x.duration, 0);
      const apptStart = appt.startAt.getTime();
      const apptEnd = appointmentEndMs(appt.startAt, apptDuration);
      return rangesOverlap(slotStartMs, slotEndMs, apptStart, apptEnd);
    });

    if (conflict) {
      throw new ConflictError("This time slot is no longer available");
    }

    const dayIndex = startAt.getDay();
    const hours = await customerRepository.getWorkingHoursForDay(barberId, dayIndex);
    if (!hours || hours.isClosed || !hours.openTime || !hours.closeTime) {
      throw new UnprocessableError("Barber is not available on this date");
    }

    const startMin = parseTimeToMinutes(timeStr);
    const endMin = startMin + durationMinutes;
    const openMin = parseTimeToMinutes(hours.openTime);
    const closeMin = parseTimeToMinutes(hours.closeTime);

    if (startMin < openMin || endMin > closeMin) {
      throw new UnprocessableError("Selected time is outside working hours");
    }
  },

  async listFavorites(userId: string, query: FavoritesQuery) {
    await getCustomerContext(userId);
    const rows = await customerRepository.listFavorites(userId, query.sort);
    return rows.map((fav) =>
      toFavoriteBarberDto({
        savedAt: fav.savedAt,
        lastVisitedAt: fav.lastVisitedAt,
        totalVisits: fav.totalVisits,
        lastService: fav.lastService,
        yourRating: fav.yourRating,
        barber: {
          ...(fav.barber as unknown as BookingBarberDbRow),
          nextAvailableLabel: null as unknown as string | null,
        },
      }),
    );
  },

  async addFavorite(userId: string, barberIdOrSlug: string) {
    await getCustomerContext(userId);
    const barber = await customerRepository.findBarberByIdOrSlug(barberIdOrSlug);
    if (!barber) throw new NotFoundError("Barber");

    const existing = await customerRepository.findFavorite(userId, barber.id);
    if (existing) throw new ConflictError("Barber is already in your favorites");

    const fav = await customerRepository.addFavorite(userId, barber.id);
    return toFavoriteToggleResultDto(barber.id, fav.savedAt);
  },

  async removeFavorite(userId: string, barberIdOrSlug: string) {
    await getCustomerContext(userId);
    const barber = await customerRepository.findBarberByIdOrSlug(barberIdOrSlug);
    if (!barber) throw new NotFoundError("Barber");

    const existing = await customerRepository.findFavorite(userId, barber.id);
    if (!existing) throw new NotFoundError("Favorite");

    await customerRepository.removeFavorite(userId, barber.id);
  },

  async listReviews(userId: string, query: CustomerReviewsQuery) {
    await getCustomerContext(userId);
    const { total, rows } = await customerRepository.listReviews(userId, query);
    return {
      items: rows.map(toCustomerReviewDto),
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  },

  async createReviewForAppointment(
    userId: string,
    appointmentId: string,
    input: CreateReviewInput,
  ) {
    await getCustomerContext(userId);
    const appointment = await customerRepository.findAppointmentById(userId, appointmentId);
    if (!appointment) throw new NotFoundError("Appointment");

    if (appointment.status !== "COMPLETED") {
      throw new UnprocessableError("Only completed appointments can be reviewed");
    }

    const existing = await customerRepository.findReviewByAppointmentId(appointmentId);
    if (existing) throw new ConflictError("A review already exists for this appointment");

    const review = await customerRepository.createReview({
      rating: input.rating,
      comment: input.comment || null,
      customerId: userId,
      barberId: appointment.barber.id,
      appointmentId,
    });
    if (!review) throw new NotFoundError("Review");

    fireAndForget(customerRepository.recalculateBarberRating(appointment.barber.id));

    return toCustomerReviewDto(review);
  },

  async updateReview(userId: string, reviewId: string, input: UpdateReviewInput) {
    await getCustomerContext(userId);
    const review = await customerRepository.findReviewById(userId, reviewId);
    if (!review) throw new NotFoundError("Review");

    const ageMs = Date.now() - review.createdAt.getTime();
    if (ageMs > REVIEW_EDIT_WINDOW_MS) {
      throw new ForbiddenError("Reviews can only be edited within 24 hours of posting");
    }

    const updated = await customerRepository.updateReview(reviewId, {
      ...(input.rating !== undefined ? { rating: input.rating } : {}),
      ...(input.comment !== undefined ? { comment: input.comment || null } : {}),
    });
    if (!updated) throw new NotFoundError("Review");

    fireAndForget(customerRepository.recalculateBarberRating(review.barberId));

    return toCustomerReviewDto(updated);
  },

  async deleteReview(userId: string, reviewId: string) {
    await getCustomerContext(userId);
    const review = await customerRepository.findReviewById(userId, reviewId);
    if (!review) throw new NotFoundError("Review");

    const ageMs = Date.now() - review.createdAt.getTime();
    if (ageMs > REVIEW_EDIT_WINDOW_MS) {
      throw new ForbiddenError("Reviews can only be deleted within 24 hours of posting");
    }

    const barberId = review.barberId;
    await customerRepository.deleteReview(reviewId);
    fireAndForget(customerRepository.recalculateBarberRating(barberId));
  },

  async listNotifications(userId: string, query: CustomerNotificationsQuery) {
    await getCustomerContext(userId);
    const types = notificationTypesForFilter(query.filter);

    const { total, rows } = await customerRepository.listNotifications(userId, {
      page: query.page,
      limit: query.limit,
      types,
      isRead: query.isRead,
    });

    let items = rows.map(toCustomerNotificationDto);
    if (query.filter !== "all") {
      items = items.filter((n) => matchesCustomerNotificationFilter(n, query.filter));
    }
    if (query.q) {
      const q = query.q.toLowerCase();
      items = items.filter((n) => {
        const haystack = [n.message, n.barber?.name, n.service, n.title]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    return { items, meta: buildPaginationMeta(total, query.page, query.limit) };
  },

  async getUnreadNotificationCount(userId: string) {
    await getCustomerContext(userId);
    const count = await customerRepository.countUnreadNotifications(userId);
    return { count };
  },

  async markNotificationRead(userId: string, notificationId: string) {
    await getCustomerContext(userId);
    const row = await customerRepository.findNotificationById(userId, notificationId);
    if (!row) throw new NotFoundError("Notification");

    const updated = await customerRepository.markNotificationRead(userId, notificationId);
    if (!updated) throw new NotFoundError("Notification");
    return { id: updated.id, isRead: updated.isRead };
  },

  async markAllNotificationsRead(userId: string) {
    await getCustomerContext(userId);
    await customerRepository.markAllNotificationsRead(userId);
    return { message: "All notifications marked as read" };
  },

  async deleteNotification(userId: string, notificationId: string) {
    await getCustomerContext(userId);
    const row = await customerRepository.findNotificationById(userId, notificationId);
    if (!row) throw new NotFoundError("Notification");
    const deleted = await customerRepository.deleteNotification(userId, notificationId);
    if (!deleted) throw new NotFoundError("Notification");
  },
};
