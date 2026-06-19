import { uploadImage, deleteImage } from "@/server/infra/storage/cloudinary";
import { appConfig, env } from "@/server/config";
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnprocessableError,
} from "@/server/modules/shared/helpers/AppError";
import {
  APPOINTMENT_STATUS,
  SERVICE_CHANGE_STATUS,
} from "@/server/modules/shared/constants/statuses";
import { NOTIFICATION_TYPE } from "@/server/modules/shared/constants/notificationTypes";
import {
  realtimeToBarber,
  realtimeToUser,
  realtimeSyncUser,
} from "@/server/modules/shared/realtime/emit";
import { buildPaginationMeta } from "@/server/modules/shared/helpers/pagination";
import {
  barberProfileRepository,
  barberServicesRepository,
  barberScheduleRepository,
  barberAppointmentsRepository,
  barberQueueRepository,
  syncOnlineAppointmentQueueEntry,
  barberWalkInsRepository,
  barberReviewsRepository,
  barberAnalyticsRepository,
  barberNotificationsRepository,
  barberDashboardRepository,
  prepareBarberQueue,
} from "@/server/modules/barber/repository";
import { barberNavBadgesRepository } from "@/server/modules/barber/navBadgesRepository";
import {
  toBarberProfileDto,
  toGalleryImageDto,
  experienceTierToYears,
  toBarberServiceDto,
  toServicesStatsDto,
  toScheduleDto,
  toAppointmentListItemDto,
  toAppointmentDetailDto,
  toAppointmentStatsDto,
  toServiceChangeInboxItemDto,
  toQueueSnapshotDto,
  toWalkInDto,
  toReviewListItemDto,
  toReviewDetailDto,
  toRatingBreakdownDto,
  toAnalyticsDto,
  toNotificationDto,
  toNotificationsSummaryDto,
  toDashboardDto,
  dollarsToCents,
} from "@/server/modules/barber/mapper";
import type { BarberServiceDbRow } from "@/server/modules/barber/mapper";
import {
  MAX_GALLERY_IMAGES,
  ALLOWED_IMAGE_TYPES,
  SERVICE_CHANGE_MIN_MS,
  BARBER_STATUS_TRANSITIONS,
  type AppointmentStatus,
} from "@/server/modules/barber/constants";
import type {
  UpdateProfileInput,
  AddGalleryImageInput,
  UpdateGalleryImageInput,
  CreateServiceInput,
  UpdateServiceInput,
  ToggleServiceInput,
  ServicesQuery,
  SaveScheduleInput,
  UpdateAppointmentStatusInput,
  RescheduleAppointmentInput,
  RespondServiceChangeInput,
  AppointmentsQuery,
  AddToQueueInput,
  UpdateQueueStatusInput,
  AssignChairInput,
  QueueQuery,
  CreateWalkInInput,
  UpdateWalkInStatusInput,
  WalkInsQuery,
  ReplyToReviewInput,
  ReviewsQuery,
  AnalyticsQuery,
  MarkNotificationReadInput,
  NotificationsQuery,
  DashboardQuery,
  MarkBarberNavSectionSeenInput,
} from "@/server/modules/barber/schema";

// SHARED HELPERS
/** Fire-and-forget side effects (email, notifications). Never throws to caller. */
function fireAndForget(promise: Promise<unknown>, label: string): void {
  promise.catch((err) => console.error(`[barber-service] ${label} failed`, err));
}

/** Resolve barberId from userId — throws NotFoundError if not found. */
async function requireBarberProfile(userId: string) {
  const profile = await barberProfileRepository.findIdByUserId(userId);
  if (!profile) throw new NotFoundError("Barber profile");
  return profile.id;
}

function appUrl(path = ""): string {
  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

type AppointmentNotifyRow = {
  customerId?: string | null;
  customer?: { id?: string } | null;
  startAt: Date;
  services?: { name: string }[];
  barber?: { user?: { fullName?: string | null } | null } | null;
};

function appointmentCustomerUserId(row: AppointmentNotifyRow): string | null {
  return row.customerId ?? row.customer?.id ?? null;
}

function appointmentNotificationMeta(row: AppointmentNotifyRow, extra: Record<string, unknown> = {}) {
  const barberName = row.barber?.user?.fullName ?? null;
  return {
    service: row.services?.map((s) => s.name).join(" + ") ?? null,
    date: row.startAt.toISOString(),
    ...(barberName
      ? { barber: { name: barberName, initials: barberName.slice(0, 2).toUpperCase() } }
      : {}),
    ...extra,
  };
}

function notifyAppointmentCustomer(
  row: AppointmentNotifyRow,
  payload: {
    type: string;
    title: string;
    message: string;
    appointmentId: string;
    metadata?: Record<string, unknown>;
  },
  label: string,
) {
  const customerUserId = appointmentCustomerUserId(row);
  if (!customerUserId) return;

  fireAndForget(
    barberNotificationsRepository
      .createNotification({
        userId: customerUserId,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        appointmentId: payload.appointmentId,
        metadata: {
          ...appointmentNotificationMeta(row, payload.metadata),
        },
      })
      .then(() => {
        realtimeToUser(customerUserId, ["notifications", "appointments", "reviews"], {
          entityId: payload.appointmentId,
          toast: { title: payload.title, message: payload.message },
        });
      }),
    label,
  );
}

function notifyReviewRequest(row: AppointmentNotifyRow, appointmentId: string) {
  notifyAppointmentCustomer(
    row,
    {
      type: NOTIFICATION_TYPE.REVIEW_REQUEST,
      title: "Leave a review",
      message: "How was your visit? Share your experience with your barber.",
      appointmentId,
      metadata: {
        completedAt: new Date().toLocaleDateString(),
      },
    },
    "review request notification",
  );
}

// PROFILE
export const barberProfileService = {
  async getProfile(userId: string) {
    const row = await barberProfileRepository.findByUserId(userId);
    if (!row) throw new NotFoundError("Barber profile");
    return toBarberProfileDto(row);
  },

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const barberId = await requireBarberProfile(userId);

    const profileData: Record<string, unknown> = {};
    if (input.experience !== undefined) {
      profileData.experience = experienceTierToYears(input.experience);
    }
    if (input.bio !== undefined) profileData.bio = input.bio || null;

    const portfolioValue =
      input.portfolioUrl !== undefined
        ? input.portfolioUrl
        : input.instagram !== undefined
          ? input.instagram.trim()
            ? input.instagram.startsWith("http")
              ? input.instagram.trim()
              : `https://instagram.com/${input.instagram.replace(/^@/, "")}`
            : ""
          : undefined;
    if (portfolioValue !== undefined) profileData.portfolioUrl = portfolioValue || null;

    if (input.shopAbout !== undefined) profileData.availability = input.shopAbout || null;
    if (input.availableToday !== undefined) profileData.isAvailable = input.availableToday;

    const userData: Record<string, unknown> = {};
    if (input.firstName !== undefined) {
      userData.firstName = input.firstName;
      userData.lastName = input.lastName;
      userData.fullName = `${input.firstName} ${input.lastName}`.trim();
    }
    if (input.email !== undefined) userData.email = input.email;

    const phoneValue = input.phone?.trim() || input.shopPhone?.trim() || "";
    if (input.phone !== undefined || input.shopPhone !== undefined) {
      userData.phone = phoneValue || null;
    }
    if (input.city !== undefined) userData.city = input.city || null;

    if (Object.keys(profileData).length > 0 || Object.keys(userData).length > 0) {
      await barberProfileRepository.updateProfile(barberId, {
        profile: profileData,
        user: userData,
      });
    }

    if (input.specialties !== undefined) {
      await barberProfileRepository.syncSpecialties(barberId, input.specialties);
    }

    const hasShopFields =
      input.shopName !== undefined ||
      input.shopAddress !== undefined ||
      input.shopHours !== undefined ||
      input.shopPhone !== undefined ||
      input.city !== undefined;

    if (hasShopFields) {
      const shopName = input.shopName?.trim() || undefined;
      const shopPayload = {
        name: shopName,
        address: input.shopAddress ?? null,
        city: input.city?.trim() || undefined,
        openHoursSummary: input.shopHours ?? null,
      };

      if (shopName) {
        await barberProfileRepository.ensureShopForBarber(barberId, {
          name: shopName,
          address: shopPayload.address,
          city: shopPayload.city,
          openHoursSummary: shopPayload.openHoursSummary,
        });
      } else {
        await barberProfileRepository.updateShopForBarber(barberId, {
          address: shopPayload.address,
          openHoursSummary: shopPayload.openHoursSummary,
          city: shopPayload.city,
        });
      }
    }

    return barberProfileService.getProfile(userId);
  },

  async uploadProfilePhoto(userId: string, buffer: Buffer, mimeType: string) {
    if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(mimeType)) {
      throw new BadRequestError(`Unsupported image type: ${mimeType}`);
    }

    const barberId = await requireBarberProfile(userId);

    const uploaded = await uploadImage(buffer, `${appConfig.cloudinary.defaultFolder}/avatars`, {
      resource_type: "image",
      transformation: [{ width: 600, height: 600, crop: "fill", gravity: "face" }],
    });

    await barberProfileRepository.updatePhoto(barberId, uploaded.url);
    return { photoUrl: uploaded.url };
  },

  async uploadGalleryPhoto(
    userId: string,
    buffer: Buffer,
    mimeType: string,
    alt = "",
  ) {
    if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(mimeType)) {
      throw new BadRequestError(`Unsupported image type: ${mimeType}`);
    }

    const barberId = await requireBarberProfile(userId);

    const count = await barberProfileRepository.countGalleryImages(barberId);
    if (count >= MAX_GALLERY_IMAGES) {
      throw new UnprocessableError(`Gallery limit reached (max ${MAX_GALLERY_IMAGES} images)`);
    }

    const uploaded = await uploadImage(buffer, `${appConfig.cloudinary.defaultFolder}/gallery`, {
      resource_type: "image",
      transformation: [{ width: 1200, height: 1200, crop: "limit" }],
    });

    const row = await barberProfileRepository.addGalleryImage(barberId, {
      src: uploaded.url,
      alt: alt.trim() || undefined,
      sortOrder: count,
    });

    return toGalleryImageDto(row);
  },

  async addGalleryImage(userId: string, input: AddGalleryImageInput) {
    const barberId = await requireBarberProfile(userId);

    const count = await barberProfileRepository.countGalleryImages(barberId);
    if (count >= MAX_GALLERY_IMAGES) {
      throw new UnprocessableError(`Gallery limit reached (max ${MAX_GALLERY_IMAGES} images)`);
    }

    const row = await barberProfileRepository.addGalleryImage(barberId, input);
    return toGalleryImageDto(row);
  },

  async updateGalleryImage(userId: string, imageId: string, input: UpdateGalleryImageInput) {
    const barberId = await requireBarberProfile(userId);
    const existing = await barberProfileRepository.findGalleryImage(imageId, barberId);
    if (!existing) throw new NotFoundError("Gallery image");

    const updated = await barberProfileRepository.updateGalleryImage(imageId, input);
    return toGalleryImageDto(updated);
  },

  async deleteGalleryImage(userId: string, imageId: string) {
    const barberId = await requireBarberProfile(userId);
    const existing = await barberProfileRepository.findGalleryImage(imageId, barberId);
    if (!existing) throw new NotFoundError("Gallery image");

    // Best-effort Cloudinary delete — don't fail if CDN delete errors
    const publicId = existing.src.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)?.[1];
    if (publicId) {
      fireAndForget(deleteImage(publicId), "gallery cloudinary delete");
    }

    await barberProfileRepository.deleteGalleryImage(imageId);
    return { deleted: true };
  },
};

// SERVICES
export const barberServicesService = {
  async listServices(userId: string, query: ServicesQuery) {
    const barberId = await requireBarberProfile(userId);
    const rows = await barberServicesRepository.listServices(barberId, query.filter);
    const dtos = rows.map(toBarberServiceDto);
    return {
      services: dtos,
      stats: toServicesStatsDto(dtos),
    };
  },

  async createService(userId: string, input: CreateServiceInput) {
    const barberId = await requireBarberProfile(userId);
    const priceCents = dollarsToCents(input.price);
    const row = await barberServicesRepository.createService(barberId, {
      name: input.name,
      description: input.description || undefined,
      price: priceCents,
      duration: input.duration,
      active: input.active ?? true,
    });
    return toBarberServiceDto(row as unknown as BarberServiceDbRow);
  },

  async updateService(userId: string, serviceId: string, input: UpdateServiceInput) {
    const barberId = await requireBarberProfile(userId);
    const existing = await barberServicesRepository.findService(serviceId, barberId);
    if (!existing) throw new NotFoundError("Service");

    const priceCents = input.price !== undefined ? dollarsToCents(input.price) : undefined;
    const row = await barberServicesRepository.updateService(serviceId, {
      name: input.name,
      description: input.description,
      price: priceCents,
      duration: input.duration,
      active: input.active,
    });
    if (!row) throw new NotFoundError("Service");
    return toBarberServiceDto(row);
  },

  async toggleService(userId: string, serviceId: string, input: ToggleServiceInput) {
    const barberId = await requireBarberProfile(userId);
    const existing = await barberServicesRepository.findService(serviceId, barberId);
    if (!existing) throw new NotFoundError("Service");

    await barberServicesRepository.toggleService(serviceId, input.active);
    return { id: serviceId, active: input.active };
  },

  async deleteService(userId: string, serviceId: string) {
    const barberId = await requireBarberProfile(userId);
    const result = await barberServicesRepository.deleteService(serviceId, barberId);
    if (result.count === 0) throw new NotFoundError("Service");
    return { deleted: true };
  },
};

// SCHEDULE
export const barberScheduleService = {
  async getSchedule(userId: string) {
    const barberId = await requireBarberProfile(userId);
    const { workingHours, breaks, unavailableDates } =
      await barberScheduleRepository.getSchedule(barberId);
    return toScheduleDto(workingHours, breaks, unavailableDates);
  },

  async saveSchedule(userId: string, input: SaveScheduleInput) {
    const barberId = await requireBarberProfile(userId);

    // Validate no break overlaps
    const sorted = [...input.breaks].sort((a, b) => a.start.localeCompare(b.start));
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i]!.end > sorted[i + 1]!.start) {
        throw new BadRequestError(
          `Break "${sorted[i]!.label}" overlaps with "${sorted[i + 1]!.label}"`,
        );
      }
    }

    // Map days object to array for repository
    const daysArray = Object.entries(input.days).map(([key, day]) => {
      const meta = [
        { key: "sun", dayIndex: 0 },
        { key: "mon", dayIndex: 1 },
        { key: "tue", dayIndex: 2 },
        { key: "wed", dayIndex: 3 },
        { key: "thu", dayIndex: 4 },
        { key: "fri", dayIndex: 5 },
        { key: "sat", dayIndex: 6 },
      ].find((d) => d.key === key);
      return {
        dayIndex: meta?.dayIndex ?? 0,
        enabled: day.enabled,
        openTime: day.openTime ?? null,
        closeTime: day.closeTime ?? null,
      };
    });

    await barberScheduleRepository.saveWorkingHours(barberId, daysArray);
    await barberScheduleRepository.syncBreaks(barberId, input.breaks);

    return barberScheduleService.getSchedule(userId);
  },

  async addUnavailableDate(userId: string, date: string) {
    const barberId = await requireBarberProfile(userId);
    await barberScheduleRepository.addUnavailableDate(barberId, date);
    return { added: date };
  },

  async removeUnavailableDate(userId: string, date: string) {
    const barberId = await requireBarberProfile(userId);
    await barberScheduleRepository.removeUnavailableDate(barberId, date);
    return { removed: date };
  },
};

// APPOINTMENTS
export const barberAppointmentsService = {
  async listAppointments(userId: string, query: AppointmentsQuery) {
    const barberId = await requireBarberProfile(userId);
    const [rows, total, stats] = await barberAppointmentsRepository.listAppointments(
      barberId,
      query,
    );
    const dtos = rows.map(toAppointmentListItemDto);
    return {
      appointments: dtos,
      stats,
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  },

  async getAppointmentDetail(userId: string, appointmentId: string) {
    const barberId = await requireBarberProfile(userId);
    const row = await barberAppointmentsRepository.findAppointmentDetail(appointmentId, barberId);
    if (!row) throw new NotFoundError("Appointment");
    return toAppointmentDetailDto(row);
  },

  async listPendingServiceChanges(userId: string) {
    const barberId = await requireBarberProfile(userId);
    const rows = await barberAppointmentsRepository.listPendingServiceChanges(barberId);
    return { requests: rows.map(toServiceChangeInboxItemDto) };
  },

  async updateStatus(userId: string, appointmentId: string, input: UpdateAppointmentStatusInput) {
    const barberId = await requireBarberProfile(userId);
    const row = await barberAppointmentsRepository.findAppointmentDetail(appointmentId, barberId);
    if (!row) throw new NotFoundError("Appointment");

    const currentStatus = row.status.toUpperCase() as AppointmentStatus;
    const newStatus = input.status;
    const allowed = BARBER_STATUS_TRANSITIONS[currentStatus] ?? [];

    if (!allowed.includes(newStatus)) {
      throw new UnprocessableError(
        `Cannot transition appointment from ${currentStatus} to ${newStatus}`,
      );
    }

    // Timestamps to set based on new status
    const timestamps: Record<string, Date> = {};
    if (newStatus === APPOINTMENT_STATUS.CONFIRMED) timestamps.confirmedAt = new Date();
    if (newStatus === APPOINTMENT_STATUS.IN_SERVICE) timestamps.arrivedAt = new Date();
    if (newStatus === APPOINTMENT_STATUS.COMPLETED) timestamps.completedAt = new Date();

    await barberAppointmentsRepository.updateStatus(appointmentId, barberId, {
      status: newStatus,
      cancelReason: input.cancelReason || undefined,
      cancelledBy: input.cancelledBy || undefined,
      barberNotes: input.barberNotes || undefined,
      timestamps,
    });

    await prepareBarberQueue(barberId);

    const statusLabels: Record<string, string> = {
      CONFIRMED: "confirmed",
      IN_SERVICE: "started",
      COMPLETED: "completed",
      CANCELLED: "cancelled",
      NO_SHOW: "marked as no-show",
    };

    await barberAppointmentsRepository.addModification({
      appointmentId,
      actor: "Barber",
      field: "Status",
      previousValue: currentStatus,
      updatedValue: newStatus,
      summary: `Status ${statusLabels[newStatus] ?? "updated"} by barber`,
      reason: input.cancelReason || undefined,
    });

    // Notify customer
    const notifType =
      newStatus === APPOINTMENT_STATUS.CONFIRMED
        ? NOTIFICATION_TYPE.BOOKING_CONFIRMED
        : newStatus === APPOINTMENT_STATUS.CANCELLED
          ? NOTIFICATION_TYPE.BOOKING_CANCELLED
          : null;

    if (notifType) {
      notifyAppointmentCustomer(
        row,
        {
          type: notifType,
          title:
            newStatus === APPOINTMENT_STATUS.CONFIRMED
              ? "Booking confirmed"
              : "Booking cancelled",
          message:
            newStatus === APPOINTMENT_STATUS.CONFIRMED
              ? `Your appointment on ${new Date(row.startAt).toLocaleDateString()} has been confirmed.`
              : `Your appointment on ${new Date(row.startAt).toLocaleDateString()} was cancelled.`,
          appointmentId,
          metadata: {
            cancelledBy: input.cancelledBy,
            reason: input.cancelReason,
          },
        },
        "appointment status notification",
      );
    }

    if (newStatus === APPOINTMENT_STATUS.COMPLETED) {
      notifyReviewRequest(row, appointmentId);
    }

    fireAndForget(
      syncOnlineAppointmentQueueEntry(barberId, appointmentId),
      "online appointment queue sync",
    );

    realtimeToBarber(barberId, ["appointments", "queue", "dashboard"], appointmentId);
    const customerUserId = appointmentCustomerUserId(row);
    if (customerUserId) {
      realtimeToUser(customerUserId, ["appointments", "notifications", "reviews"], appointmentId);
    }

    return { id: appointmentId, status: newStatus.toLowerCase().replace(/_/g, "-") };
  },

  async rescheduleAppointment(
    userId: string,
    appointmentId: string,
    input: RescheduleAppointmentInput,
  ) {
    const barberId = await requireBarberProfile(userId);
    const row = await barberAppointmentsRepository.findAppointmentDetail(appointmentId, barberId);
    if (!row) throw new NotFoundError("Appointment");

    const result = await barberAppointmentsRepository.rescheduleAppointment(
      appointmentId,
      barberId,
      input.startAt,
      input.reason,
    );
    if (!result) throw new NotFoundError("Appointment");

    notifyAppointmentCustomer(
      row,
      {
        type: NOTIFICATION_TYPE.BOOKING_MODIFICATION_REQUEST,
        title: "Appointment rescheduled",
        message: `Your barber has rescheduled your appointment to ${input.startAt.toLocaleDateString()}.`,
        appointmentId,
        metadata: {
          newDate: input.startAt.toISOString(),
          reason: input.reason,
        },
      },
      "reschedule notification",
    );

    realtimeToBarber(barberId, ["appointments", "queue", "dashboard"], appointmentId);
    const customerUserId = appointmentCustomerUserId(row);
    if (customerUserId) {
      realtimeToUser(customerUserId, ["appointments", "notifications"], appointmentId);
    }

    return { id: appointmentId, startAt: input.startAt.toISOString() };
  },

  async respondToServiceChange(
    userId: string,
    appointmentId: string,
    reqId: string,
    input: RespondServiceChangeInput,
  ) {
    const barberId = await requireBarberProfile(userId);

    const req = await barberAppointmentsRepository.findServiceChangeRequest(
      reqId,
      appointmentId,
      barberId,
    );
    if (!req) throw new NotFoundError("Service change request");

    if (req.status !== SERVICE_CHANGE_STATUS.PENDING) {
      throw new UnprocessableError("Service change request is already resolved");
    }

    await barberAppointmentsRepository.resolveServiceChangeRequest(
      reqId,
      input.decision,
      input.rejectionNote,
    );

    // Notify customer
    const notifType =
      input.decision === "ACCEPTED"
        ? NOTIFICATION_TYPE.SERVICE_CHANGE_ACCEPTED
        : NOTIFICATION_TYPE.SERVICE_CHANGE_REJECTED;

    const appt = await barberAppointmentsRepository.findAppointmentDetail(appointmentId, barberId);
    if (appt) {
      const change = appt.serviceChangeRequests?.find((r) => r.id === reqId);
      const original = change?.items
        ?.filter((i) => i.side === "original")
        .map((i) => i.name)
        .join(" + ");
      const updated = change?.items
        ?.filter((i) => i.side === "updated")
        .map((i) => i.name)
        .join(" + ");

      notifyAppointmentCustomer(
        appt,
        {
          type: notifType,
          title:
            input.decision === "ACCEPTED" ? "Service change accepted" : "Service change rejected",
          message:
            input.decision === "ACCEPTED"
              ? "Your service change request has been accepted by your barber."
              : `Your service change request was declined. ${input.rejectionNote ?? ""}`.trim(),
          appointmentId,
          metadata: {
            previousServices: original ?? null,
            updatedServices: updated ?? null,
          },
        },
        "service change response notification",
      );

      realtimeToBarber(barberId, ["appointments", "queue", "dashboard"], appointmentId);
      const customerUserId = appointmentCustomerUserId(appt);
      if (customerUserId) {
        realtimeToUser(customerUserId, ["appointments", "notifications"], appointmentId);
      }
    }

    return { id: reqId, decision: input.decision };
  },
};

function mapQueueStatusToAppointmentStatus(queueStatus: string): AppointmentStatus | null {
  switch (queueStatus.toUpperCase()) {
    case "IN_SERVICE":
      return APPOINTMENT_STATUS.IN_SERVICE;
    case "DONE":
      return APPOINTMENT_STATUS.COMPLETED;
    case "CANCELLED":
      return APPOINTMENT_STATUS.CANCELLED;
    default:
      return null;
  }
}

async function syncAppointmentFromQueue(
  barberId: string,
  appointmentId: string,
  queueStatus: string,
) {
  const targetStatus = mapQueueStatusToAppointmentStatus(queueStatus);
  if (!targetStatus) return;

  const row = await barberAppointmentsRepository.findAppointmentDetail(appointmentId, barberId);
  if (!row) return;

  const currentStatus = row.status.toUpperCase() as AppointmentStatus;
  if (currentStatus === targetStatus) return;

  const allowed = BARBER_STATUS_TRANSITIONS[currentStatus] ?? [];
  if (!allowed.includes(targetStatus)) return;

  const timestamps: Partial<{ confirmedAt: Date; arrivedAt: Date; completedAt: Date }> = {};
  if (targetStatus === APPOINTMENT_STATUS.IN_SERVICE) timestamps.arrivedAt = new Date();
  if (targetStatus === APPOINTMENT_STATUS.COMPLETED) timestamps.completedAt = new Date();

  await barberAppointmentsRepository.updateStatus(appointmentId, barberId, {
    status: targetStatus,
    timestamps,
  });

  await barberAppointmentsRepository.addModification({
    appointmentId,
    actor: "Barber",
    field: "Status",
    previousValue: currentStatus,
    updatedValue: targetStatus,
    summary: "Status updated from queue",
  });

  if (targetStatus === APPOINTMENT_STATUS.COMPLETED) {
    notifyReviewRequest(row, appointmentId);
  }
}

// QUEUE
export const barberQueueService = {
  async getQueue(userId: string, query: QueueQuery) {
    const barberId = await requireBarberProfile(userId);
    await prepareBarberQueue(barberId);
    const [entries, chairs] = await barberQueueRepository.getLiveQueue(barberId, query);
    return toQueueSnapshotDto(entries, chairs);
  },

  async addToQueue(userId: string, input: AddToQueueInput) {
    const barberId = await requireBarberProfile(userId);
    const entry = await barberQueueRepository.addToQueue(barberId, {
      source: input.source,
      customerName: input.customerName,
      phone: input.phone,
      serviceName: input.serviceName,
      duration: input.duration,
      notes: input.notes,
    });
    // Re-fetch snapshot so caller gets full queue state
    const [entries, chairs] = await barberQueueRepository.getLiveQueue(barberId, {
      tab: "active",
      source: "all",
    });
    realtimeToBarber(barberId, ["queue", "dashboard", "walk_ins"]);
    return { entry, snapshot: toQueueSnapshotDto(entries, chairs) };
  },

  async updateQueueStatus(userId: string, entryId: string, input: UpdateQueueStatusInput) {
    const barberId = await requireBarberProfile(userId);
    const entry = await barberQueueRepository.findQueueEntry(entryId, barberId);
    if (!entry) throw new NotFoundError("Queue entry");

    await barberQueueRepository.updateQueueStatus(entryId, barberId, input.status);

    if (entry.appointmentId) {
      await syncAppointmentFromQueue(barberId, entry.appointmentId, input.status);
    }

    if (entry.walkInId) {
      const walkInStatus = input.status.toUpperCase();
      if (["WAITING", "IN_SERVICE", "DONE", "CANCELLED"].includes(walkInStatus)) {
        await barberWalkInsRepository.updateWalkInStatus(entry.walkInId, barberId, walkInStatus);
      }
    }

    const updated = await barberQueueRepository.findQueueEntry(entryId, barberId);
    realtimeToBarber(barberId, ["queue", "dashboard", "walk_ins", "appointments"]);
    return updated;
  },

  async assignChair(userId: string, entryId: string, input: AssignChairInput) {
    const barberId = await requireBarberProfile(userId);
    const entry = await barberQueueRepository.assignChair(entryId, barberId, input.chairId);
    realtimeToBarber(barberId, ["queue", "dashboard"]);
    return entry;
  },

  async removeFromQueue(userId: string, entryId: string) {
    const barberId = await requireBarberProfile(userId);
    await barberQueueRepository.removeFromQueue(entryId, barberId);
    realtimeToBarber(barberId, ["queue", "dashboard", "walk_ins", "appointments"]);
    return { deleted: true };
  },
};

// WALK-INS
export const barberWalkInsService = {
  async listWalkIns(userId: string, query: WalkInsQuery) {
    const barberId = await requireBarberProfile(userId);
    const rows = await barberWalkInsRepository.listWalkIns(barberId, query);
    return rows.map(toWalkInDto);
  },

  async createWalkIn(userId: string, input: CreateWalkInInput) {
    const barberId = await requireBarberProfile(userId);
    const row = await barberWalkInsRepository.createWalkIn(barberId, input);

    await barberQueueRepository.addToQueue(barberId, {
      source: "WALK_IN",
      customerName: input.customerName,
      phone: input.phone,
      serviceName: input.serviceName,
      duration: input.duration,
      notes: input.notes,
      walkInId: row.id,
    });

    realtimeToBarber(barberId, ["walk_ins", "queue", "dashboard"]);

    return toWalkInDto(row);
  },

  async updateWalkInStatus(userId: string, walkInId: string, input: UpdateWalkInStatusInput) {
    const barberId = await requireBarberProfile(userId);
    const row = await barberWalkInsRepository.listWalkIns(barberId, { status: "all" });
    const existing = row.find((w) => w.id === walkInId);
    if (!existing) throw new NotFoundError("Walk-in");

    // Validate transition
    const allowed: Record<string, string[]> = {
      waiting: ["in-service", "cancelled"],
      "in-service": ["done", "cancelled"],
      done: [],
      cancelled: [],
    };
    const current = existing.status.toLowerCase().replace("_", "-");
    const next = input.status.toLowerCase().replace("_", "-");
    if (!allowed[current]?.includes(next)) {
      throw new UnprocessableError(`Cannot change walk-in status from ${current} to ${next}`);
    }

    const updated = await barberWalkInsRepository.updateWalkInStatus(
      walkInId,
      barberId,
      input.status,
    );

    await barberQueueRepository.syncQueueEntryStatus(walkInId, barberId, input.status);

    realtimeToBarber(barberId, ["walk_ins", "queue", "dashboard"]);

    return toWalkInDto(updated);
  },
};

// REVIEWS
export const barberReviewsService = {
  async listReviews(userId: string, query: ReviewsQuery) {
    const barberId = await requireBarberProfile(userId);
    const [rows, total] = await barberReviewsRepository.listReviews(barberId, query);
    const [breakdown, replySummary] = await Promise.all([
      barberReviewsRepository.getRatingBreakdown(barberId),
      barberReviewsRepository.getReviewReplySummary(barberId),
    ]);

    return {
      reviews: rows.map(toReviewListItemDto),
      ratingBreakdown: toRatingBreakdownDto(breakdown),
      replySummary,
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  },

  async getReviewDetail(userId: string, reviewId: string) {
    const barberId = await requireBarberProfile(userId);
    const row = await barberReviewsRepository.findReview(reviewId, barberId);
    if (!row) throw new NotFoundError("Review");
    return toReviewDetailDto(row);
  },

  async replyToReview(userId: string, reviewId: string, input: ReplyToReviewInput) {
    const barberId = await requireBarberProfile(userId);
    const row = await barberReviewsRepository.findReview(reviewId, barberId);
    if (!row) throw new NotFoundError("Review");

    if (row.barberReply) {
      throw new ConflictError("You have already replied to this review");
    }

    await barberReviewsRepository.addReply(reviewId, input.reply);

    // Update denormalised average rating on the barber profile
    fireAndForget(barberReviewsRepository.updateBarberAverageRating(barberId), "rating sync");

    realtimeToUser(row.customerId, ["reviews"], {
      entityId: reviewId,
      toast: {
        title: "Barber replied to your review",
        message: "Your barber responded to a review you left.",
      },
    });
    realtimeToBarber(barberId, ["reviews"], reviewId);

    return { id: reviewId, replied: true };
  },
};

// ANALYTICS
function sqlRows<T>(result: unknown): T[] {
  if (Array.isArray(result)) return result as T[];
  if (
    result &&
    typeof result === "object" &&
    "rows" in result &&
    Array.isArray((result as { rows: unknown }).rows)
  ) {
    return (result as { rows: T[] }).rows;
  }
  return [];
}

/** Compute period window dates from a validated query */
function resolvePeriodWindow(query: AnalyticsQuery): {
  start: Date;
  end: Date;
  label: string;
  granularity: "hour" | "day" | "month";
} {
  const now = new Date();

  if (query.period === "custom" && query.start && query.end) {
    const start = new Date(`${query.start}T00:00:00`);
    const end = new Date(`${query.end}T23:59:59`);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / 86_400_000);
    return {
      start,
      end,
      label: `${query.start} – ${query.end}`,
      granularity: diffDays <= 2 ? "hour" : diffDays <= 60 ? "day" : "month",
    };
  }

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  if (query.period === "today") {
    return {
      start: todayStart,
      end: new Date(todayStart.getTime() + 86_400_000 - 1),
      label: "Today",
      granularity: "hour",
    };
  }

  if (query.period === "week") {
    const start = new Date(todayStart);
    start.setDate(start.getDate() - start.getDay());
    return { start, end: now, label: "This Week", granularity: "day" };
  }

  if (query.period === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start, end: now, label: "This Month", granularity: "day" };
  }

  if (query.period === "year") {
    const start = new Date(now.getFullYear(), 0, 1);
    return { start, end: now, label: "This Year", granularity: "month" };
  }

  // Fallback — last 30 days
  const start = new Date(now.getTime() - 30 * 86_400_000);
  return { start, end: now, label: "Last 30 Days", granularity: "day" };
}

function prevWindow(start: Date, end: Date): { prevStart: Date; prevEnd: Date } {
  const diff = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - diff);
  return { prevStart, prevEnd };
}

export const barberAnalyticsService = {
  async getAnalytics(userId: string, query: AnalyticsQuery) {
    const barberId = await requireBarberProfile(userId);
    const { start, end, label, granularity } = resolvePeriodWindow(query);
    const { prevStart, prevEnd } = prevWindow(start, end);

    const [
      currentStats,
      prevStats,
      revenueTrend,
      appointmentTrend,
      servicePopularity,
      customerGrowth,
      monthlySummary,
    ] = await Promise.all([
      barberAnalyticsRepository.getAggregateStats(barberId, start, end),
      barberAnalyticsRepository.getPrevPeriodStats(barberId, prevStart, prevEnd),
      barberAnalyticsRepository.getRevenueTrend(barberId, start, end, granularity),
      barberAnalyticsRepository.getAppointmentTrend(barberId, start, end, granularity),
      barberAnalyticsRepository.getServicePopularity(barberId, start, end),
      barberAnalyticsRepository.getCustomerGrowth(barberId, start, end, granularity),
      barberAnalyticsRepository.getMonthlySummary(barberId),
    ]);

    // Build simple text insights
    const insights = [];
    if (currentStats.averageRating >= 4.5) {
      insights.push({
        title: "Top-rated performance",
        body: `Your average rating of ${currentStats.averageRating.toFixed(1)} is excellent.`,
        trend: 0,
      });
    }
    if (currentStats.completedAppointments > 0 && currentStats.totalAppointments > 0) {
      const completionRate = Math.round(
        (currentStats.completedAppointments / currentStats.totalAppointments) * 100,
      );
      insights.push({
        title: "Completion rate",
        body: `${completionRate}% of appointments completed this period.`,
        trend: completionRate,
      });
    }

    return toAnalyticsDto({
      period: query.period ?? "month",
      label,
      ...currentStats,
      ...prevStats,
      revenueTrend: sqlRows(revenueTrend),
      appointmentTrend: sqlRows(appointmentTrend),
      servicePopularity: sqlRows(servicePopularity),
      customerGrowth: sqlRows(customerGrowth),
      monthlySummary: sqlRows(monthlySummary),
      insights,
      periodStart: start,
      periodEnd: end,
    });
  },
};

// NOTIFICATIONS
export const barberNotificationsService = {
  async listNotifications(userId: string, query: NotificationsQuery) {
    const [rows, total] = await barberNotificationsRepository.listNotifications(userId, query);
    const dtos = rows.map(toNotificationDto);

    return {
      notifications: dtos,
      summary: toNotificationsSummaryDto(rows),
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  },

  async markRead(userId: string, notificationId: string, input: MarkNotificationReadInput) {
    const result = await barberNotificationsRepository.markRead(notificationId, userId);
    if (result.count === 0) throw new NotFoundError("Notification");
    realtimeSyncUser(userId, ["notifications"]);
    return { id: notificationId, isRead: input.isRead ?? true };
  },

  async markAllRead(userId: string) {
    const result = await barberNotificationsRepository.markAllRead(userId);
    realtimeSyncUser(userId, ["notifications"]);
    return { updated: result.count };
  },

  async getUnreadCount(userId: string) {
    const count = await barberNotificationsRepository.countUnread(userId);
    return { count };
  },
};

// DASHBOARD
export const barberDashboardService = {
  async getDashboard(userId: string, query: DashboardQuery) {
    const barberId = await requireBarberProfile(userId);
    await prepareBarberQueue(barberId);
    const raw = await barberDashboardRepository.getDashboardData(
      barberId,
      userId,
      query.pendingLimit,
    );
    return toDashboardDto(raw);
  },
};

// NAV BADGES (sidebar actionable counts — separate from notification bell)
export const barberNavBadgesService = {
  async getNavBadges(userId: string) {
    const barberId = await requireBarberProfile(userId);
    const counts = await barberNavBadgesRepository.getBadgeCounts(userId, barberId);
    return { counts };
  },

  async markNavSectionSeen(userId: string, input: MarkBarberNavSectionSeenInput) {
    const lastSeenAt = await barberNavBadgesRepository.markSectionSeen(userId, input.section);
    realtimeSyncUser(userId, ["nav_badges"]);
    return { section: input.section, lastSeenAt: lastSeenAt.toISOString() };
  },
};
