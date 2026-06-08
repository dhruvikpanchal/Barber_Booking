import { z } from "zod";
import {
  APPOINTMENT_STATUSES,
  BOOKING_MAX_SERVICES_PER_APPOINTMENT,
  CUSTOMER_APPOINTMENT_TABS,
  CUSTOMER_NOTIFICATION_FILTER_TABS,
  DASHBOARD_ACTIVITY_PREVIEW_COUNT,
  DASHBOARD_NOTIFICATION_PREVIEW_COUNT,
  DASHBOARD_UPCOMING_PREVIEW_COUNT,
  FAVORITE_SORT_OPTIONS,
  MAX_APPOINTMENT_NOTES_LENGTH,
  MAX_CANCEL_REASON_LENGTH,
  MAX_PROFILE_ADDRESS_LENGTH,
  MAX_PROFILE_FULL_NAME_LENGTH,
  MAX_SERVICE_CHANGE_NOTE_LENGTH,
  REVIEW_COMMENT_MAX_LENGTH,
  REVIEW_RATING_MAX,
  REVIEW_RATING_MIN,
  REVIEW_SORT_OPTIONS,
  REVIEWS_PAGE_SIZE,
} from "@/server/modules/customer/constants";

// SHARED PRIMITIVES

const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const phoneField = z
  .string()
  .regex(PHONE_REGEX, "Invalid phone number")
  .optional()
  .or(z.literal(""));

const dateField = (label: string) => z.string().regex(DATE_REGEX, `${label} must be YYYY-MM-DD`);

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const appointmentTabKeys = CUSTOMER_APPOINTMENT_TABS.map((t) => t.key) as [string, ...string[]];
const favoriteSortKeys = FAVORITE_SORT_OPTIONS.map((s) => s.key) as [string, ...string[]];
const reviewSortKeys = REVIEW_SORT_OPTIONS.map((s) => s.key) as [string, ...string[]];
const notificationFilterKeys = CUSTOMER_NOTIFICATION_FILTER_TABS.map((f) => f.key) as [
  string,
  ...string[],
];

// PROFILE  ·  GET/PATCH /api/v1/customer/profile  (wraps /api/v1/me for customer UI)

export const updateCustomerProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(MAX_PROFILE_FULL_NAME_LENGTH),
  email: z.string().email("Invalid email address").toLowerCase(),
  phone: phoneField,
  address: z.string().trim().max(MAX_PROFILE_ADDRESS_LENGTH).optional().or(z.literal("")),
});

/** POST /api/v1/customer/profile/photo  (multipart — validated in controller) */
export const uploadCustomerPhotoSchema = z.object({
  photoUrl: z.string().url("Invalid photo URL"),
});

// DASHBOARD  ·  GET /api/v1/customer/dashboard

export const dashboardQuerySchema = z.object({
  upcomingLimit: z.coerce
    .number()
    .int()
    .min(1)
    .max(10)
    .optional()
    .default(DASHBOARD_UPCOMING_PREVIEW_COUNT),
  activityLimit: z.coerce
    .number()
    .int()
    .min(1)
    .max(20)
    .optional()
    .default(DASHBOARD_ACTIVITY_PREVIEW_COUNT),
  notificationLimit: z.coerce
    .number()
    .int()
    .min(1)
    .max(20)
    .optional()
    .default(DASHBOARD_NOTIFICATION_PREVIEW_COUNT),
});

// APPOINTMENTS  ·  /api/v1/customer/appointments

export const createAppointmentSchema = z.object({
  barberId: z.string().min(1, "Barber is required"),
  serviceIds: z
    .array(z.string().min(1))
    .min(1, "Select at least one service")
    .max(
      BOOKING_MAX_SERVICES_PER_APPOINTMENT,
      `Maximum ${BOOKING_MAX_SERVICES_PER_APPOINTMENT} services per booking`,
    ),
  startAt: z.coerce.date().refine((d) => d > new Date(), {
    message: "Appointment must be scheduled in the future",
  }),
  notes: z.string().trim().max(MAX_APPOINTMENT_NOTES_LENGTH).optional().or(z.literal("")),
});

export const cancelAppointmentSchema = z.object({
  reason: z.string().trim().max(MAX_CANCEL_REASON_LENGTH).optional().or(z.literal("")),
});

export const requestServiceChangeSchema = z.object({
  serviceIds: z
    .array(z.string().min(1))
    .min(1, "Select at least one service")
    .max(BOOKING_MAX_SERVICES_PER_APPOINTMENT),
  customerNote: z.string().trim().max(MAX_SERVICE_CHANGE_NOTE_LENGTH).optional().or(z.literal("")),
});

/** GET /api/v1/customer/appointments — query params */
export const customerAppointmentsQuerySchema = paginationSchema.extend({
  tab: z.enum(appointmentTabKeys).optional().default("upcoming"),
  status: z.enum(APPOINTMENT_STATUSES).optional(),
  from: dateField("From date").optional(),
  to: dateField("To date").optional(),
  q: z.string().trim().optional(),
});

// BOOKING WIZARD  ·  /api/v1/customer/booking/*

/** GET /api/v1/customer/booking/barbers */
export const bookingBarbersQuerySchema = paginationSchema.extend({
  q: z.string().trim().optional(),
  city: z.string().trim().optional(),
  specialty: z.string().trim().optional(),
  availableOnly: z.coerce.boolean().optional().default(false),
});

/** GET /api/v1/customer/booking/barbers/:slug/available-slots */
export const availableSlotsQuerySchema = z.object({
  date: dateField("Date"),
  duration: z.coerce.number().int().min(5).max(480).optional(),
  serviceIds: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => {
      if (!v) return undefined;
      return Array.isArray(v) ? v : [v];
    }),
});

/** POST /api/v1/customer/booking/confirm — alias of createAppointmentSchema */
export const confirmBookingSchema = createAppointmentSchema;

// FAVORITES  ·  /api/v1/customer/favorites

export const favoritesQuerySchema = z.object({
  sort: z.enum(favoriteSortKeys).optional().default("savedAt"),
});

export const favoriteBarberIdParamSchema = z.object({
  barberId: z.string().min(1, "Barber ID is required"),
});

// REVIEWS  ·  /api/v1/customer/reviews

export const createReviewSchema = z.object({
  rating: z.coerce
    .number()
    .int()
    .min(REVIEW_RATING_MIN, `Rating must be at least ${REVIEW_RATING_MIN}`)
    .max(REVIEW_RATING_MAX, `Rating must be at most ${REVIEW_RATING_MAX}`),
  comment: z.string().trim().max(REVIEW_COMMENT_MAX_LENGTH).optional().or(z.literal("")),
});

export const updateReviewSchema = z
  .object({
    rating: z.coerce.number().int().min(REVIEW_RATING_MIN).max(REVIEW_RATING_MAX).optional(),
    comment: z.string().trim().max(REVIEW_COMMENT_MAX_LENGTH).optional().or(z.literal("")),
  })
  .refine((data) => data.rating !== undefined || data.comment !== undefined, {
    message: "At least one of rating or comment must be provided",
  });

/** GET /api/v1/customer/reviews — query params */
export const customerReviewsQuerySchema = paginationSchema
  .extend({
    sort: z.enum(reviewSortKeys).optional().default("newest"),
    rating: z.coerce.number().int().min(1).max(5).optional(),
  })
  .transform((data) => ({
    ...data,
    limit: data.limit ?? REVIEWS_PAGE_SIZE,
  }));

// NOTIFICATIONS  ·  /api/v1/customer/notifications

export const markNotificationReadSchema = z.object({
  isRead: z.boolean().optional().default(true),
});

/** GET /api/v1/customer/notifications — query params */
export const customerNotificationsQuerySchema = paginationSchema.extend({
  filter: z.enum(notificationFilterKeys).optional().default("all"),
  isRead: z.coerce.boolean().optional(),
  q: z.string().trim().optional(),
});

// INFERRED TYPES

export type UpdateCustomerProfileInput = z.infer<typeof updateCustomerProfileSchema>;
export type UploadCustomerPhotoInput = z.infer<typeof uploadCustomerPhotoSchema>;
export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>;
export type RequestServiceChangeInput = z.infer<typeof requestServiceChangeSchema>;
export type CustomerAppointmentsQuery = z.infer<typeof customerAppointmentsQuerySchema>;
export type BookingBarbersQuery = z.infer<typeof bookingBarbersQuerySchema>;
export type AvailableSlotsQuery = z.infer<typeof availableSlotsQuerySchema>;
export type ConfirmBookingInput = z.infer<typeof confirmBookingSchema>;
export type FavoritesQuery = z.infer<typeof favoritesQuerySchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type CustomerReviewsQuery = z.infer<typeof customerReviewsQuerySchema>;
export type MarkNotificationReadInput = z.infer<typeof markNotificationReadSchema>;
export type CustomerNotificationsQuery = z.infer<typeof customerNotificationsQuerySchema>;
