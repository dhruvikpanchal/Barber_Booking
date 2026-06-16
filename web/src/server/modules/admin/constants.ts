import { NOTIFICATION_TYPE } from "@/server/modules/shared/constants/notificationTypes";

// Re-export shared enums used across admin operations
export {
  APPOINTMENT_STATUSES,
  APPOINTMENT_STATUS_RANK,
  BARBER_EXPERIENCE_TIERS,
  BARBER_STATUSES,
  CANCELLED_BY_VALUES,
  ANALYTICS_PERIODS,
} from "@/server/modules/barber/constants";
export type {
  AppointmentStatus,
  BarberExperienceTier,
  BarberStatus,
  CancelledBy,
  AnalyticsPeriod,
} from "@/server/modules/barber/constants";

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION & LIMITS
// Matches PAGE_SIZE in client/modules/admin/constants/admin.js & barber.js
// ─────────────────────────────────────────────────────────────────────────────
export const ADMIN_DEFAULT_LIST_LIMIT = 20;

export const ADMIN_MAX_LIST_LIMIT = 100;

export const MAX_ADMIN_PROFILE_FULL_NAME_LENGTH = 100;

export const MAX_ADMIN_REPLY_LENGTH = 2000;

export const MAX_CONTACT_INTERNAL_NOTE_LENGTH = 1000;

export const MAX_BARBER_REQUEST_REJECTION_NOTE_LENGTH = 500;

export const MAX_ADMIN_CANCEL_REASON_LENGTH = 500;

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD  ·  /admin/dashboard
// client: data/dashboardData.js
// ─────────────────────────────────────────────────────────────────────────────

export const DASHBOARD_BOOKING_TREND_DAYS = 7;

export const DASHBOARD_RECENT_ACTIVITY_LIMIT = 8;

export const DASHBOARD_RECENT_REPORTS_LIMIT = 5;

export const DASHBOARD_QUEUE_PREVIEW_COUNT = 6;

export const DASHBOARD_CITY_GROWTH_LIMIT = 5;

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS  ·  /admin/analytics
// client: data/analyticsData.js, REPORT_DATE_RANGES in constants/admin.js
// ─────────────────────────────────────────────────────────────────────────────

export const ADMIN_ANALYTICS_STAT_KEYS = [
  "totalRevenue",
  "totalAppointments",
  "completedAppointments",
  "activeBarbers",
  "activeCustomers",
  "averageRating",
] as const;

export type AdminAnalyticsStatKey = (typeof ADMIN_ANALYTICS_STAT_KEYS)[number];

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS  ·  /admin/reports
// client: constants/admin.js REPORT_TYPES, REPORT_DATE_RANGES
// ─────────────────────────────────────────────────────────────────────────────

export const ADMIN_REPORT_DATE_RANGES = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "year", label: "This Year" },
  { key: "custom", label: "Custom Range" },
] as const;

export type AdminReportDateRangeKey = (typeof ADMIN_REPORT_DATE_RANGES)[number]["key"];

export const ADMIN_REPORT_TYPES = [
  { key: "appointments", label: "Appointment Report", category: "Appointments" },
  { key: "customer-activity", label: "Customer Activity Report", category: "Customers" },
  { key: "barber-activity", label: "Barber Activity Report", category: "Barbers" },
  { key: "service-usage", label: "Service Usage Report", category: "Services" },
  { key: "registrations", label: "Registration Report", category: "Registrations" },
  { key: "platform-activity", label: "Platform Activity Report", category: "Platform" },
] as const;

export type AdminReportTypeKey = (typeof ADMIN_REPORT_TYPES)[number]["key"];

export const ADMIN_REPORT_EXPORT_FORMATS = ["csv", "pdf"] as const;

export type AdminReportExportFormat = (typeof ADMIN_REPORT_EXPORT_FORMATS)[number];

// ─────────────────────────────────────────────────────────────────────────────
// APPOINTMENTS  ·  /admin/appointments, /admin/appointments/[id]
// client: constants/admin.js APPOINTMENT_STATUSES, components/Appointments/helpers.jsx
// ─────────────────────────────────────────────────────────────────────────────

export const ADMIN_APPOINTMENT_STATUS_KEYS = [
  "pending",
  "confirmed",
  "in-service",
  "completed",
  "cancelled",
] as const;

export type AdminAppointmentStatusKey = (typeof ADMIN_APPOINTMENT_STATUS_KEYS)[number];

export const ADMIN_APPOINTMENT_STATUS_FILTER_ORDER = [
  "all",
  "pending",
  "confirmed",
  "in-service",
  "completed",
  "cancelled",
] as const;

export const ADMIN_APPOINTMENT_DATE_RANGES = [
  { key: "all", label: "All dates" },
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "week", label: "This week" },
  { key: "past", label: "Past" },
] as const;

export type AdminAppointmentDateRangeKey = (typeof ADMIN_APPOINTMENT_DATE_RANGES)[number]["key"];

/** Admin may force any valid lifecycle transition (broader than barber transitions) */
export const ADMIN_APPOINTMENT_ADMIN_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_SERVICE", "CANCELLED", "NO_SHOW"],
  IN_SERVICE: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

// ─────────────────────────────────────────────────────────────────────────────
// BARBER REQUESTS  ·  /admin/barber-requests, /admin/barber-requests/[id]
// client: constants/admin.js BARBER_REQUEST_TABS, data/barberRequestsData.js
// ─────────────────────────────────────────────────────────────────────────────

export const BARBER_REQUEST_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

export type BarberRequestStatus = (typeof BARBER_REQUEST_STATUSES)[number];

export const BARBER_REQUEST_TABS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
] as const;

export type BarberRequestTabKey = (typeof BARBER_REQUEST_TABS)[number]["key"];

// ─────────────────────────────────────────────────────────────────────────────
// BARBERS  ·  /admin/barbers, /admin/barbers/[id]
// client: constants/barber.js STATUS_CONFIG, SORT_OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const ADMIN_BARBER_STATUS_KEYS = ["active", "inactive", "disabled"] as const;

export type AdminBarberStatusKey = (typeof ADMIN_BARBER_STATUS_KEYS)[number];

export const ADMIN_BARBER_SORT_OPTIONS = [
  { key: "name_asc", label: "Name A–Z" },
  { key: "name_desc", label: "Name Z–A" },
  { key: "rating_desc", label: "Highest Rated" },
  { key: "rating_asc", label: "Lowest Rated" },
  { key: "reviews_desc", label: "Most Reviews" },
  { key: "appts_desc", label: "Most Appointments" },
  { key: "joined_desc", label: "Newest Joined" },
  { key: "joined_asc", label: "Oldest Joined" },
] as const;

export type AdminBarberSortKey = (typeof ADMIN_BARBER_SORT_OPTIONS)[number]["key"];

// ─────────────────────────────────────────────────────────────────────────────
// USERS  ·  /admin/users, /admin/users/[id]
// client: constants/admin.js USER_STATUS_CONFIG, USER_SORT_OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const ADMIN_USER_STATUS_KEYS = ["active", "inactive", "disabled"] as const;

export type AdminUserStatusKey = (typeof ADMIN_USER_STATUS_KEYS)[number];

export const ADMIN_USER_ACTIVITY_LEVELS = ["high", "medium", "low"] as const;

export type AdminUserActivityLevel = (typeof ADMIN_USER_ACTIVITY_LEVELS)[number];

export const ADMIN_USER_SORT_OPTIONS = [
  { key: "name_asc", label: "Name A–Z" },
  { key: "name_desc", label: "Name Z–A" },
  { key: "bookings_desc", label: "Most Bookings" },
  { key: "reviews_desc", label: "Most Reviews" },
  { key: "spent_desc", label: "Highest Spend" },
  { key: "activity", label: "Most Active" },
  { key: "joined_desc", label: "Newest Joined" },
  { key: "joined_asc", label: "Oldest Joined" },
  { key: "last_active", label: "Recently Active" },
] as const;

export type AdminUserSortKey = (typeof ADMIN_USER_SORT_OPTIONS)[number]["key"];

export const ADMIN_USER_ROLES = ["CUSTOMER", "BARBER", "ADMIN"] as const;

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT MESSAGES  ·  /admin/contact-messages, /admin/contact-messages/[id]
// client: constants/admin.js CONTACT_MESSAGE_TABS, data/contactMessagesData.js
// ─────────────────────────────────────────────────────────────────────────────

export const CONTACT_REPLY_STATUSES = ["UNREPLIED", "REPLIED"] as const;

export type ContactReplyStatus = (typeof CONTACT_REPLY_STATUSES)[number];

export const CONTACT_MESSAGE_TABS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "unreplied", label: "Pending Reply" },
  { key: "replied", label: "Replied" },
] as const;

export type ContactMessageTabKey = (typeof CONTACT_MESSAGE_TABS)[number]["key"];

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS  ·  /admin/notifications
// client: constants/admin.js NOTIFICATION_TABS, NOTIFICATION_VARIANT_CONFIG
//         data/notifucationsData.js
// ─────────────────────────────────────────────────────────────────────────────

export const ADMIN_NOTIFICATION_TYPES = [
  NOTIFICATION_TYPE.BARBER_REQUEST_SUBMITTED,
  NOTIFICATION_TYPE.BARBER_REQUEST_APPROVED,
  NOTIFICATION_TYPE.BARBER_REQUEST_REJECTED,
  NOTIFICATION_TYPE.NEW_CONTACT_MESSAGE,
  NOTIFICATION_TYPE.BOOKING_CONFIRMED,
  NOTIFICATION_TYPE.BOOKING_CANCELLED,
] as const;

export type AdminNotificationType = (typeof ADMIN_NOTIFICATION_TYPES)[number];

/** UI variant keys in NOTIFICATION_VARIANT_CONFIG (admin.js) */
const ADMIN_NOTIFICATION_VARIANTS = [
  "barber_request",
  "barber_approved",
  "booking",
  "cancellation",
  "contact",
  "system_info",
  "system_warning",
  "security",
  "user_signup",
] as const;

export type AdminNotificationVariant = (typeof ADMIN_NOTIFICATION_VARIANTS)[number];

export const ADMIN_NOTIFICATION_TABS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "system", label: "System" },
  { key: "appointments", label: "Appointments" },
  { key: "barber", label: "Barbers" },
  { key: "contact", label: "Contact" },
] as const;

export type AdminNotificationTabKey = (typeof ADMIN_NOTIFICATION_TABS)[number]["key"];

export const ADMIN_NOTIFICATION_TYPE_TO_VARIANT: Partial<
  Record<AdminNotificationType, AdminNotificationVariant>
> = {
  BARBER_REQUEST_SUBMITTED: "barber_request",
  BARBER_REQUEST_APPROVED: "barber_approved",
  BARBER_REQUEST_REJECTED: "barber_request",
  NEW_CONTACT_MESSAGE: "contact",
  BOOKING_CONFIRMED: "booking",
  BOOKING_CANCELLED: "cancellation",
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE & SETTINGS  ·  /admin/profile, /admin/settings
// client: data/profileData.js, constants/admin.js SETTINGS_TABS, ADMIN_ALERTS
// ─────────────────────────────────────────────────────────────────────────────

export const ADMIN_SETTINGS_SECTIONS = ["maintenance", "password"] as const;

export type AdminSettingsSection = (typeof ADMIN_SETTINGS_SECTIONS)[number];

export const ADMIN_ALERT_PREFERENCE_KEYS = [
  "new_user",
  "barber_request",
  "appointment_flag",
  "message_escalation",
  "security",
] as const;

export type AdminAlertPreferenceKey = (typeof ADMIN_ALERT_PREFERENCE_KEYS)[number];

export const ADMIN_DIGEST_PREFERENCE_KEYS = ["daily_digest", "weekly_report"] as const;

export type AdminDigestPreferenceKey = (typeof ADMIN_DIGEST_PREFERENCE_KEYS)[number];
