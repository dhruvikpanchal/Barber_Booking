import { z } from "zod";
import {
  BARBER_AVAILABILITY,
  BARBER_EXPERIENCE_TIERS,
  BARBER_SPECIALTIES,
  ANALYTICS_PERIODS,
  APPOINTMENT_STATUSES,
  CANCELLED_BY_VALUES,
  DAYS_OF_WEEK,
  QUEUE_STATUSES,
  WALKIN_STATUSES,
  SERVICE_CHANGE_STATUSES,
  REVIEW_SORT_OPTIONS,
  REVIEW_STAR_FILTERS,
  REVIEWS_PAGE_SIZE,
  SERVICE_MIN_DURATION_MINUTES,
  SERVICE_MAX_PRICE_CENTS,
  SERVICE_MAX_NAME_LENGTH,
  SERVICE_MAX_DESC_LENGTH,
  MAX_BIO_LENGTH,
  MAX_GALLERY_IMAGES,
  MAX_BREAK_SLOTS,
  REVIEW_REPLY_MAX_LENGTH,
  DASHBOARD_PENDING_PREVIEW_COUNT,
} from "@/server/modules/barber/constants";

// SHARED PRIMITIVES

const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/; // "HH:MM" 24-hour
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/; // "YYYY-MM-DD"

const phoneField = z
  .string()
  .regex(PHONE_REGEX, "Invalid phone number")
  .optional()
  .or(z.literal(""));

const timeField = (label: string) =>
  z.string().regex(TIME_REGEX, `${label} must be HH:MM (24-hour format)`);

const dateField = (label: string) => z.string().regex(DATE_REGEX, `${label} must be YYYY-MM-DD`);

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// PROFILE  ·  /api/v1/barber/profile

export const updateProfileSchema = z.object({
  // Shop section
  shopName: z.string().trim().min(1, "Shop name is required").max(120).optional(),
  shopAddress: z.string().trim().max(200).optional().or(z.literal("")),
  shopPhone: phoneField,
  shopAbout: z.string().trim().max(500).optional().or(z.literal("")),

  // Barber personal section
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email address").toLowerCase(),
  phone: phoneField,
  city: z.string().trim().max(100).optional().or(z.literal("")),
  instagram: z.string().trim().max(60).optional().or(z.literal("")),
  availableToday: z.boolean().optional(),

  // Professional section
  experience: z.enum(BARBER_EXPERIENCE_TIERS),
  bio: z
    .string()
    .trim()
    .max(MAX_BIO_LENGTH, `Bio must be ${MAX_BIO_LENGTH} characters or fewer`)
    .optional()
    .or(z.literal("")),
  specialties: z
    .array(z.enum(BARBER_SPECIALTIES))
    .max(BARBER_SPECIALTIES.length, "Too many specialties selected")
    .optional()
    .default([]),
  portfolioUrl: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
  availability: z
    .union([z.enum(BARBER_AVAILABILITY), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
});

/** PATCH /api/v1/barber/profile/photo  (multipart — validated separately in controller) */
export const uploadProfilePhotoSchema = z.object({
  /** Cloudinary public_id after upload — set by service layer, not client */
  photoUrl: z.string().url("Invalid photo URL"),
});

/** POST /api/v1/barber/profile/gallery */
export const addGalleryImageSchema = z.object({
  src: z.string().url("Invalid image URL"),
  alt: z.string().trim().max(120).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
});

/** PATCH /api/v1/barber/profile/gallery/:id  — caption edit only */
export const updateGalleryImageSchema = z.object({
  alt: z.string().trim().max(120).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

/** Validates the gallery will not exceed the limit after an add */
export const galleryLimitGuard = (currentCount: number) => {
  if (currentCount >= MAX_GALLERY_IMAGES) {
    throw new Error(`Gallery limit reached (max ${MAX_GALLERY_IMAGES} images)`);
  }
};

// SERVICES  ·  /api/v1/barber/services

export const createServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Service name is required")
    .max(SERVICE_MAX_NAME_LENGTH, `Name must be ${SERVICE_MAX_NAME_LENGTH} characters or fewer`),
  description: z
    .string()
    .trim()
    .max(
      SERVICE_MAX_DESC_LENGTH,
      `Description must be ${SERVICE_MAX_DESC_LENGTH} characters or fewer`,
    )
    .optional()
    .or(z.literal("")),
  price: z
    .number()
    .refine((v) => v !== undefined, { message: "Price must be a number" })
    .int("Price must be a whole number of cents")
    .min(0, "Price cannot be negative")
    .max(SERVICE_MAX_PRICE_CENTS, "Price exceeds maximum allowed"),
  duration: z
    .number()
    .refine((v) => v !== undefined, { message: "Duration must be a number" })
    .int("Duration must be a whole number of minutes")
    .min(
      SERVICE_MIN_DURATION_MINUTES,
      `Duration must be at least ${SERVICE_MIN_DURATION_MINUTES} minutes`,
    ),
  active: z.boolean().optional().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

/** PATCH /api/v1/barber/services/:id/toggle */
export const toggleServiceSchema = z.object({
  active: z.boolean().refine((v) => v !== undefined, { message: "active is required" }),
});

/** GET /api/v1/barber/services — query params */
export const servicesQuerySchema = z.object({
  filter: z.enum(["all", "active", "hidden"]).optional().default("all"),
});

// SCHEDULE  ·  /api/v1/barber/schedule

const DAY_KEYS = DAYS_OF_WEEK.map((d) => d.key) as [string, ...string[]];

export const workingDaySchema = z
  .object({
    enabled: z.boolean(),
    openTime: timeField("Open time").optional().nullable(),
    closeTime: timeField("Close time").optional().nullable(),
  })
  .refine((d) => !d.enabled || (!!d.openTime && !!d.closeTime), {
    message: "Open and close times are required for working days",
  })
  .refine((d) => !d.enabled || !d.openTime || !d.closeTime || d.openTime < d.closeTime, {
    message: "Open time must be before close time",
  });

export const breakSlotSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().trim().min(1, "Break label is required").max(40),
    start: timeField("Break start"),
    end: timeField("Break end"),
  })
  .refine((b) => b.start < b.end, { message: "Break start must be before break end" });

/** POST /api/v1/barber/schedule  — full schedule save (bulk upsert) */
export const saveScheduleSchema = z.object({
  days: z
    .record(z.enum(DAY_KEYS as [string, ...string[]]), workingDaySchema)
    .refine((d) => Object.keys(d).length === DAYS_OF_WEEK.length, {
      message: "All 7 days must be provided",
    }),
  breaks: z
    .array(breakSlotSchema)
    .max(MAX_BREAK_SLOTS, `Maximum ${MAX_BREAK_SLOTS} break slots allowed`),
});

/** POST /api/v1/barber/schedule/unavailable */
export const addUnavailableDateSchema = z.object({
  date: dateField("Unavailable date"),
});

/** DELETE /api/v1/barber/schedule/unavailable/:date  — param validation */
export const unavailableDateParamSchema = z.object({
  date: dateField("Date"),
});

// APPOINTMENTS  ·  /api/v1/barber/appointments

/** PATCH /api/v1/barber/appointments/:id/status */
export const updateAppointmentStatusSchema = z.object({
  status: z.enum(APPOINTMENT_STATUSES),
  cancelReason: z.string().trim().max(300).optional().or(z.literal("")),
  cancelledBy: z.enum(CANCELLED_BY_VALUES).optional().default("BARBER"),
  barberNotes: z.string().trim().max(500).optional().or(z.literal("")),
});

/** PATCH /api/v1/barber/appointments/:id/reschedule */
export const rescheduleAppointmentSchema = z
  .object({
    date: dateField("Reschedule date"),
    time: timeField("Reschedule time"),
    reason: z.string().trim().max(300).optional().or(z.literal("")),
  })
  .transform(({ date, time, reason }) => ({
    startAt: new Date(`${date}T${time}`),
    reason,
  }))
  .refine(({ startAt }) => startAt > new Date(), {
    message: "Reschedule date must be in the future",
  });

/** PATCH /api/v1/barber/appointments/:id/service-change/:reqId */
export const respondServiceChangeSchema = z.object({
  decision: z.enum(["ACCEPTED", "REJECTED"] as const),
  rejectionNote: z.string().trim().max(300).optional().or(z.literal("")),
});

/** GET /api/v1/barber/appointments — query params */
export const appointmentsQuerySchema = paginationSchema.extend({
  tab: z
    .enum(["upcoming", "pending", "confirmed", "completed", "cancelled", "all"])
    .optional()
    .default("upcoming"),
  q: z.string().trim().optional(),
  date: dateField("Filter date").optional(),
});

// QUEUE  ·  /api/v1/barber/queue

/** POST /api/v1/barber/queue  — add a walk-in directly to the live queue */
export const addToQueueSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required").max(100),
  phone: phoneField,
  serviceName: z.string().trim().min(1, "Service is required").max(SERVICE_MAX_NAME_LENGTH),
  duration: z
    .number()
    .refine((v) => v !== undefined, { message: "Duration must be a number" })
    .int()
    .min(
      SERVICE_MIN_DURATION_MINUTES,
      `Duration must be at least ${SERVICE_MIN_DURATION_MINUTES} minutes`,
    ),
  notes: z.string().trim().max(300).optional().or(z.literal("")),
  source: z
    .enum(["ONLINE", "WALK_IN"] as const)
    .optional()
    .default("WALK_IN"),
});

/** PATCH /api/v1/barber/queue/:id/status */
export const updateQueueStatusSchema = z.object({
  status: z.enum(QUEUE_STATUSES),
});

/** PATCH /api/v1/barber/queue/:id/chair */
export const assignChairSchema = z.object({
  chairId: z.string().min(1, "Chair ID is required").nullable(),
});

/** GET /api/v1/barber/queue — query params */
export const queueQuerySchema = z.object({
  tab: z
    .enum(["active", "waiting", "in-service", "done", "cancelled", "all"] as const)
    .optional()
    .default("active"),
  source: z
    .enum(["all", "online", "walk-in"] as const)
    .optional()
    .default("all"),
});

// WALK-INS  ·  /api/v1/barber/walk-ins

/** POST /api/v1/barber/walk-ins */
export const createWalkInSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required").max(100),
  phone: phoneField,
  serviceName: z.string().trim().min(1, "Service is required").max(SERVICE_MAX_NAME_LENGTH),
  duration: z
    .number()
    .refine((v) => v !== undefined, { message: "Duration must be a number" })
    .int()
    .min(
      SERVICE_MIN_DURATION_MINUTES,
      `Duration must be at least ${SERVICE_MIN_DURATION_MINUTES} minutes`,
    ),
  notes: z.string().trim().max(300).optional().or(z.literal("")),
});

/** PATCH /api/v1/barber/walk-ins/:id/status */
export const updateWalkInStatusSchema = z.object({
  status: z.enum(WALKIN_STATUSES),
});

/** GET /api/v1/barber/walk-ins — query params */
export const walkInsQuerySchema = z.object({
  status: z
    .enum(["all", "waiting", "in-service", "done", "cancelled"] as const)
    .optional()
    .default("all"),
  date: dateField("Filter date").optional(),
});

// REVIEWS  ·  /api/v1/barber/reviews

/** POST /api/v1/barber/reviews/:id/reply */
export const replyToReviewSchema = z.object({
  reply: z
    .string()
    .trim()
    .min(1, "Reply cannot be empty")
    .max(REVIEW_REPLY_MAX_LENGTH, `Reply must be ${REVIEW_REPLY_MAX_LENGTH} characters or fewer`),
});

const REVIEW_SORT_KEYS = REVIEW_SORT_OPTIONS.map((o) => o.key) as [string, ...string[]];
const REVIEW_STAR_KEYS = REVIEW_STAR_FILTERS.map((o) => o.key) as [string, ...string[]];

/** GET /api/v1/barber/reviews — query params */
export const reviewsQuerySchema = paginationSchema
  .extend({
    sort: z
      .enum(REVIEW_SORT_KEYS as [string, ...string[]])
      .optional()
      .default("recent"),
    rating: z
      .enum(REVIEW_STAR_KEYS as [string, ...string[]])
      .optional()
      .default("all"),
    service: z.string().trim().optional(),
    q: z.string().trim().optional(),
  })
  .transform((data) => ({
    ...data,
    limit: data.limit ?? REVIEWS_PAGE_SIZE,
    ratingFilter: data.rating === "all" ? undefined : Number(data.rating),
  }));

// ANALYTICS  ·  /api/v1/barber/analytics

/** GET /api/v1/barber/analytics — query params */
export const analyticsQuerySchema = z
  .object({
    period: z.enum(ANALYTICS_PERIODS).optional().default("month"),
    start: dateField("Custom range start").optional(),
    end: dateField("Custom range end").optional(),
  })
  .refine((d) => d.period !== "custom" || (!!d.start && !!d.end), {
    message: "start and end are required when period is 'custom'",
  })
  .refine((d) => !d.start || !d.end || d.start <= d.end, {
    message: "start must be before or equal to end",
  });

// NOTIFICATIONS  ·  /api/v1/barber/notifications

/** PATCH /api/v1/barber/notifications/:id/read */
export const markNotificationReadSchema = z.object({
  isRead: z.boolean().optional().default(true),
});

/** GET /api/v1/barber/notifications — query params */
export const notificationsQuerySchema = paginationSchema.extend({
  filter: z
    .enum(["all", "unread", "actionable"] as const)
    .optional()
    .default("all"),
  type: z.string().trim().optional(),
});

// DASHBOARD  ·  /api/v1/barber/dashboard

/** GET /api/v1/barber/dashboard — optional query params */
export const dashboardQuerySchema = z.object({
  pendingLimit: z.coerce
    .number()
    .int()
    .min(1)
    .max(20)
    .optional()
    .default(DASHBOARD_PENDING_PREVIEW_COUNT),
});

// INFERRED TYPES

// Profile
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UploadProfilePhotoInput = z.infer<typeof uploadProfilePhotoSchema>;
export type AddGalleryImageInput = z.infer<typeof addGalleryImageSchema>;
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;

// Services
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ToggleServiceInput = z.infer<typeof toggleServiceSchema>;
export type ServicesQuery = z.infer<typeof servicesQuerySchema>;

// Schedule
export type WorkingDayInput = z.infer<typeof workingDaySchema>;
export type BreakSlotInput = z.infer<typeof breakSlotSchema>;
export type SaveScheduleInput = z.infer<typeof saveScheduleSchema>;
export type AddUnavailableDateInput = z.infer<typeof addUnavailableDateSchema>;

// Appointments
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
export type RescheduleAppointmentInput = z.infer<typeof rescheduleAppointmentSchema>;
export type RespondServiceChangeInput = z.infer<typeof respondServiceChangeSchema>;
export type AppointmentsQuery = z.infer<typeof appointmentsQuerySchema>;

// Queue
export type AddToQueueInput = z.infer<typeof addToQueueSchema>;
export type UpdateQueueStatusInput = z.infer<typeof updateQueueStatusSchema>;
export type AssignChairInput = z.infer<typeof assignChairSchema>;
export type QueueQuery = z.infer<typeof queueQuerySchema>;

// Walk-ins
export type CreateWalkInInput = z.infer<typeof createWalkInSchema>;
export type UpdateWalkInStatusInput = z.infer<typeof updateWalkInStatusSchema>;
export type WalkInsQuery = z.infer<typeof walkInsQuerySchema>;

// Reviews
export type ReplyToReviewInput = z.infer<typeof replyToReviewSchema>;
export type ReviewsQuery = z.infer<typeof reviewsQuerySchema>;

// Analytics
export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;

// Notifications
export type MarkNotificationReadInput = z.infer<typeof markNotificationReadSchema>;
export type NotificationsQuery = z.infer<typeof notificationsQuerySchema>;

// Dashboard
export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
