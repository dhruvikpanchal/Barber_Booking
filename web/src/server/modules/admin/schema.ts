import { z } from "zod";
import {
  ADMIN_APPOINTMENT_DATE_RANGES,
  ADMIN_APPOINTMENT_STATUS_FILTER_ORDER,
  ADMIN_BARBER_SORT_OPTIONS,
  ADMIN_DEFAULT_LIST_LIMIT,
  ADMIN_ALERT_PREFERENCE_KEYS,
  ADMIN_DIGEST_PREFERENCE_KEYS,
  ADMIN_MAX_LIST_LIMIT,
  ADMIN_NAV_SECTION_KEYS,
  ADMIN_NOTIFICATION_TABS,
  ADMIN_REPORT_DATE_RANGES,
  ADMIN_REPORT_EXPORT_FORMATS,
  ADMIN_REPORT_TYPES,
  ADMIN_SETTINGS_SECTIONS,
  ADMIN_USER_SORT_OPTIONS,
  ANALYTICS_PERIODS,
  APPOINTMENT_STATUSES,
  BARBER_REQUEST_TABS,
  CONTACT_MESSAGE_TABS,
  MAX_ADMIN_CANCEL_REASON_LENGTH,
  MAX_ADMIN_PROFILE_FULL_NAME_LENGTH,
  MAX_ADMIN_REPLY_LENGTH,
  MAX_BARBER_REQUEST_REJECTION_NOTE_LENGTH,
  MAX_CONTACT_INTERNAL_NOTE_LENGTH,
  DASHBOARD_RECENT_ACTIVITY_LIMIT,
  DASHBOARD_RECENT_REPORTS_LIMIT,
} from "@/server/modules/admin/constants";

// SHARED PRIMITIVES

const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const phoneField = z
  .string()
  .regex(PHONE_REGEX, "Invalid phone number")
  .optional()
  .or(z.literal(""));

const dateField = (label: string) => z.string().regex(DATE_REGEX, `${label} must be YYYY-MM-DD`);

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(ADMIN_MAX_LIST_LIMIT).default(ADMIN_DEFAULT_LIST_LIMIT),
});

const appointmentStatusFilterKeys = [...ADMIN_APPOINTMENT_STATUS_FILTER_ORDER] as [
  string,
  ...string[],
];
const appointmentDateRangeKeys = ADMIN_APPOINTMENT_DATE_RANGES.map((d) => d.key) as [
  string,
  ...string[],
];
const barberRequestTabKeys = BARBER_REQUEST_TABS.map((t) => t.key) as [string, ...string[]];
const contactMessageTabKeys = CONTACT_MESSAGE_TABS.map((t) => t.key) as [string, ...string[]];
const notificationTabKeys = ADMIN_NOTIFICATION_TABS.map((t) => t.key) as [string, ...string[]];
const userSortKeys = ADMIN_USER_SORT_OPTIONS.map((s) => s.key) as [string, ...string[]];
const barberSortKeys = ADMIN_BARBER_SORT_OPTIONS.map((s) => s.key) as [string, ...string[]];
const reportTypeKeys = ADMIN_REPORT_TYPES.map((r) => r.key) as [string, ...string[]];
const reportRangeKeys = ADMIN_REPORT_DATE_RANGES.map((r) => r.key) as [string, ...string[]];

// DASHBOARD  ·  GET /api/v1/admin/dashboard

export const adminDashboardQuerySchema = z.object({
  activityLimit: z.coerce
    .number()
    .int()
    .min(1)
    .max(20)
    .optional()
    .default(DASHBOARD_RECENT_ACTIVITY_LIMIT),
  reportsLimit: z.coerce
    .number()
    .int()
    .min(1)
    .max(10)
    .optional()
    .default(DASHBOARD_RECENT_REPORTS_LIMIT),
});

// ANALYTICS  ·  GET /api/v1/admin/analytics

export const adminAnalyticsQuerySchema = z
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

// REPORTS  ·  GET /api/v1/admin/reports, POST /api/v1/admin/reports/generate

export const adminReportsQuerySchema = paginationSchema.extend({
  type: z.enum(reportTypeKeys).optional(),
  range: z.enum(reportRangeKeys).optional().default("month"),
  start: dateField("Custom range start").optional(),
  end: dateField("Custom range end").optional(),
});

export const generateReportSchema = z
  .object({
    type: z.enum(reportTypeKeys),
    range: z.enum(reportRangeKeys).default("month"),
    start: dateField("Custom range start").optional(),
    end: dateField("Custom range end").optional(),
    format: z.enum(ADMIN_REPORT_EXPORT_FORMATS).optional().default("csv"),
  })
  .refine((d) => d.range !== "custom" || (!!d.start && !!d.end), {
    message: "start and end are required when range is 'custom'",
  });

// APPOINTMENTS  ·  GET /api/v1/admin/appointments, GET/PATCH …/appointments/:id

export const adminAppointmentsQuerySchema = paginationSchema.extend({
  status: z.enum(appointmentStatusFilterKeys).optional().default("all"),
  dateRange: z.enum(appointmentDateRangeKeys).optional().default("all"),
  city: z.string().trim().optional(),
  barberId: z.string().trim().optional(),
  q: z.string().trim().optional(),
});

export const adminUpdateAppointmentStatusSchema = z.object({
  status: z.enum(APPOINTMENT_STATUSES),
  cancelReason: z.string().trim().max(MAX_ADMIN_CANCEL_REASON_LENGTH).optional().or(z.literal("")),
  barberNotes: z.string().trim().max(500).optional().or(z.literal("")),
});

export const adminAppointmentIdParamSchema = z.object({
  id: z.string().min(1, "Appointment ID is required"),
});

// BARBER REQUESTS  ·  GET /api/v1/admin/barber-requests, …/barber-requests/:id

export const adminBarberRequestsQuerySchema = paginationSchema.extend({
  tab: z.enum(barberRequestTabKeys).optional().default("pending"),
  q: z.string().trim().optional(),
});

export const adminBarberRequestIdParamSchema = z.object({
  id: z.string().min(1, "Request ID is required"),
});

export const approveBarberRequestSchema = z
  .object({
    /** Optional note stored on approval audit trail */
    note: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .default({ note: "" });

export const rejectBarberRequestSchema = z.object({
  rejectionNote: z
    .string()
    .trim()
    .min(1, "Rejection reason is required")
    .max(
      MAX_BARBER_REQUEST_REJECTION_NOTE_LENGTH,
      `Reason must be ${MAX_BARBER_REQUEST_REJECTION_NOTE_LENGTH} characters or fewer`,
    ),
});

// BARBERS  ·  GET /api/v1/admin/barbers, GET/PATCH …/barbers/:id

export const adminBarbersQuerySchema = paginationSchema.extend({
  status: z
    .enum(["all", "active", "inactive", "disabled"] as const)
    .optional()
    .default("all"),
  sort: z.enum(barberSortKeys).optional().default("name_asc"),
  q: z.string().trim().optional(),
  city: z.string().trim().optional(),
});

export const adminBarberIdParamSchema = z.object({
  id: z.string().min(1, "Barber ID is required"),
});

export const adminUpdateBarberStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "DISABLED"] as const),
});

// USERS  ·  GET /api/v1/admin/users, GET/PATCH …/users/:id

export const adminUsersQuerySchema = paginationSchema.extend({
  status: z
    .enum(["all", "active", "inactive", "disabled"] as const)
    .optional()
    .default("all"),
  activity: z
    .enum(["all", "high", "medium", "low"] as const)
    .optional()
    .default("all"),
  sort: z.enum(userSortKeys).optional().default("name_asc"),
  q: z.string().trim().optional(),
});

export const adminUserIdParamSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

export const adminUpdateUserStatusSchema = z.object({
  isActive: z.boolean(),
});

// CONTACT MESSAGES  ·  GET /api/v1/admin/contact-messages, …/contact-messages/:id

export const adminContactMessagesQuerySchema = paginationSchema.extend({
  tab: z.enum(contactMessageTabKeys).optional().default("all"),
  q: z.string().trim().optional(),
});

export const adminContactMessageIdParamSchema = z.object({
  id: z.string().min(1, "Message ID is required"),
});

export const replyContactMessageSchema = z.object({
  replyText: z
    .string()
    .trim()
    .min(1, "Reply cannot be empty")
    .max(MAX_ADMIN_REPLY_LENGTH, `Reply must be ${MAX_ADMIN_REPLY_LENGTH} characters or fewer`),
});

const contactWorkflowStatusKeys = ["new", "in_progress", "replied", "closed"] as const;

export const updateContactMessageSchema = z.object({
  isRead: z.boolean().optional(),
  workflowStatus: z.enum(contactWorkflowStatusKeys).optional(),
  internalNote: z
    .string()
    .trim()
    .max(MAX_CONTACT_INTERNAL_NOTE_LENGTH)
    .optional()
    .or(z.literal("")),
  assignedTo: z.string().trim().max(120).optional().or(z.literal("")),
});

// NOTIFICATIONS  ·  GET /api/v1/admin/notifications

export const adminNotificationsQuerySchema = paginationSchema.extend({
  tab: z.enum(notificationTabKeys).optional().default("all"),
});

export const markAdminNotificationReadSchema = z.object({
  isRead: z.boolean().optional().default(true),
});

export const adminNotificationIdParamSchema = z.object({
  id: z.string().min(1, "Notification ID is required"),
});

// PROFILE  ·  GET/PATCH /api/v1/admin/profile

export const updateAdminProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(MAX_ADMIN_PROFILE_FULL_NAME_LENGTH),
  phone: phoneField,
});

// SETTINGS  ·  GET/PATCH /api/v1/admin/settings

export const updateAdminPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export const updateAdminAlertPreferencesSchema = z.object({
  alerts: z.record(z.enum(ADMIN_ALERT_PREFERENCE_KEYS), z.boolean()).optional(),
  digests: z.record(z.enum(ADMIN_DIGEST_PREFERENCE_KEYS), z.boolean()).optional(),
});

// NAV BADGES  ·  GET /api/v1/admin/nav-badges, POST /api/v1/admin/nav-badges/seen

export const markAdminNavSectionSeenSchema = z.object({
  section: z.enum(ADMIN_NAV_SECTION_KEYS),
});

// INFERRED TYPES

export type AdminDashboardQuery = z.infer<typeof adminDashboardQuerySchema>;
export type AdminAnalyticsQuery = z.infer<typeof adminAnalyticsQuerySchema>;
export type AdminReportsQuery = z.infer<typeof adminReportsQuerySchema>;
export type GenerateReportInput = z.infer<typeof generateReportSchema>;
export type AdminAppointmentsQuery = z.infer<typeof adminAppointmentsQuerySchema>;
export type AdminUpdateAppointmentStatusInput = z.infer<typeof adminUpdateAppointmentStatusSchema>;
export type AdminBarberRequestsQuery = z.infer<typeof adminBarberRequestsQuerySchema>;
export type ApproveBarberRequestInput = z.infer<typeof approveBarberRequestSchema>;
export type RejectBarberRequestInput = z.infer<typeof rejectBarberRequestSchema>;
export type AdminBarbersQuery = z.infer<typeof adminBarbersQuerySchema>;
export type AdminUpdateBarberStatusInput = z.infer<typeof adminUpdateBarberStatusSchema>;
export type AdminUsersQuery = z.infer<typeof adminUsersQuerySchema>;
export type AdminUpdateUserStatusInput = z.infer<typeof adminUpdateUserStatusSchema>;
export type AdminContactMessagesQuery = z.infer<typeof adminContactMessagesQuerySchema>;
export type ReplyContactMessageInput = z.infer<typeof replyContactMessageSchema>;
export type UpdateContactMessageInput = z.infer<typeof updateContactMessageSchema>;
export type AdminNotificationsQuery = z.infer<typeof adminNotificationsQuerySchema>;
export type MarkAdminNotificationReadInput = z.infer<typeof markAdminNotificationReadSchema>;
export type UpdateAdminProfileInput = z.infer<typeof updateAdminProfileSchema>;
export type UpdateAdminPasswordInput = z.infer<typeof updateAdminPasswordSchema>;
export type UpdateAdminAlertPreferencesInput = z.infer<typeof updateAdminAlertPreferencesSchema>;
export type MarkAdminNavSectionSeenInput = z.infer<typeof markAdminNavSectionSeenSchema>;
