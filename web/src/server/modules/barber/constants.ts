// PROFILE
export const BARBER_EXPERIENCE_TIERS = ["0-2", "2-5", "5-10", "10+"] as const;

export type BarberExperienceTier = (typeof BARBER_EXPERIENCE_TIERS)[number];

export const BARBER_AVAILABILITY = ["full-time", "part-time", "weekends", "flexible"] as const;
export type BarberAvailability = (typeof BARBER_AVAILABILITY)[number];

export const BARBER_SPECIALTIES = [
  "Classic Cuts",
  "Fade & Taper",
  "Beard Trim",
  "Hot Towel Shave",
  "Skin Fades",
  "Razor Fades",
  "Line-ups",
  "Hair Design",
  "Colour & Highlights",
  "Keratin Treatment",
  "Kids Cuts",
  "Grey Blending",
] as const;
export type BarberSpecialty = (typeof BARBER_SPECIALTIES)[number];

export const MAX_GALLERY_IMAGES = 20;

export const MAX_BIO_LENGTH = 200;

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

// BARBER STATUS
export const BARBER_STATUSES = ["ACTIVE", "INACTIVE", "DISABLED"] as const;

export type BarberStatus = (typeof BARBER_STATUSES)[number];

// SERVICES
export const SERVICE_MIN_DURATION_MINUTES = 5;

export const SERVICE_MAX_PRICE_CENTS = 99999;

export const SERVICE_MAX_NAME_LENGTH = 100;

export const SERVICE_MAX_DESC_LENGTH = 300;

// SCHEDULE
export const DAYS_OF_WEEK = [
  { key: "mon", label: "Monday", short: "Mon", dayIndex: 1 },
  { key: "tue", label: "Tuesday", short: "Tue", dayIndex: 2 },
  { key: "wed", label: "Wednesday", short: "Wed", dayIndex: 3 },
  { key: "thu", label: "Thursday", short: "Thu", dayIndex: 4 },
  { key: "fri", label: "Friday", short: "Fri", dayIndex: 5 },
  { key: "sat", label: "Saturday", short: "Sat", dayIndex: 6 },
  { key: "sun", label: "Sunday", short: "Sun", dayIndex: 0 },
] as const;

export type DayKey = (typeof DAYS_OF_WEEK)[number]["key"];

export const DEFAULT_OPEN_TIME = "09:00";

export const DEFAULT_CLOSE_TIME = "18:00";

export const DEFAULT_BREAK_SLOT = { label: "Lunch", start: "13:00", end: "14:00" } as const;

export const MAX_BREAK_SLOTS = 5;

// APPOINTMENTS
export const APPOINTMENT_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "IN_SERVICE",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const APPOINTMENT_STATUS_RANK: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  rescheduled: 2,
  "in-service": 3,
  completed: 4,
  cancelled: 5,
  "no-show": 6,
};

export const APPOINTMENT_TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "all", label: "All" },
] as const;

export type AppointmentTabKey = (typeof APPOINTMENT_TABS)[number]["key"];

export const BARBER_STATUS_TRANSITIONS: Record<string, AppointmentStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_SERVICE", "CANCELLED", "NO_SHOW", "COMPLETED"],
  IN_SERVICE: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

export const CANCELLED_BY_VALUES = ["CUSTOMER", "BARBER", "ADMIN", "SYSTEM"] as const;

export type CancelledBy = (typeof CANCELLED_BY_VALUES)[number];

export const APPOINTMENT_TIMELINE_STEPS = [
  { key: "created", label: "Booking Created" },
  { key: "accepted", label: "Booking Accepted" },
  { key: "arrived", label: "Customer Arrived" },
  { key: "inService", label: "In Service" },
  { key: "completed", label: "Completed" },
] as const;

export type TimelineStepKey = (typeof APPOINTMENT_TIMELINE_STEPS)[number]["key"];

const TIMELINE_STEP_STATES = ["done", "current", "upcoming", "cancelled"] as const;

export type TimelineStepState = (typeof TIMELINE_STEP_STATES)[number];

export const SERVICE_CHANGE_MIN_MS = 5 * 60 * 60 * 1000;

export const SERVICE_CHANGE_STATUSES = ["PENDING", "ACCEPTED", "REJECTED"] as const;

export type ServiceChangeStatus = (typeof SERVICE_CHANGE_STATUSES)[number];

// QUEUE
export const DEFAULT_BARBER_CHAIR_LABELS = ["Chair 1", "Chair 2", "Chair 3"] as const;

export const QUEUE_STATUSES = ["WAITING", "IN_SERVICE", "DONE", "CANCELLED"] as const;

export type QueueStatus = (typeof QUEUE_STATUSES)[number];

export const QUEUE_SOURCES = ["ONLINE", "WALK_IN"] as const;

export type QueueSource = (typeof QUEUE_SOURCES)[number];

export const QUEUE_TABS = [
  { key: "active", label: "Active" },
  { key: "waiting", label: "Waiting" },
  { key: "in-service", label: "In service" },
  { key: "done", label: "Done" },
  { key: "cancelled", label: "Cancelled" },
  { key: "all", label: "All" },
] as const;

export type QueueTabKey = (typeof QUEUE_TABS)[number]["key"];

export const QUEUE_SOURCE_TABS = [
  { key: "all", label: "All sources" },
  { key: "online", label: "Online" },
  { key: "walk-in", label: "Walk-in" },
] as const;

// WALK-INS
export const WALKIN_STATUSES = ["WAITING", "IN_SERVICE", "DONE", "CANCELLED"] as const;

export type WalkInStatus = (typeof WALKIN_STATUSES)[number];

// REVIEWS
export const REVIEW_RATING_MIN = 1;

export const REVIEW_RATING_MAX = 5;

export const REVIEW_REPLY_MAX_LENGTH = 500;

const REVIEW_CATEGORY_LABELS = {
  service: "Service quality",
  ambiance: "Shop ambiance",
  professionalism: "Professionalism",
  value: "Value for money",
} as const;

export type ReviewCategoryKey = keyof typeof REVIEW_CATEGORY_LABELS;

export const REVIEW_SORT_OPTIONS = [
  { key: "recent", label: "Most Recent" },
  { key: "highest", label: "Highest Rated" },
  { key: "lowest", label: "Lowest Rated" },
  { key: "helpful", label: "Most Helpful" },
] as const;

export type ReviewSortKey = (typeof REVIEW_SORT_OPTIONS)[number]["key"];

export const REVIEW_STAR_FILTERS = [
  { key: "all", label: "All Stars" },
  { key: "5", label: "5 Stars" },
  { key: "4", label: "4 Stars" },
  { key: "3", label: "3 Stars" },
  { key: "2", label: "2 Stars" },
  { key: "1", label: "1 Star" },
] as const;

export type ReviewStarFilterKey = (typeof REVIEW_STAR_FILTERS)[number]["key"];

export const REVIEWS_PAGE_SIZE = 6;

// ANALYTICS
export const ANALYTICS_PERIODS = ["today", "week", "month", "year", "custom"] as const;

export type AnalyticsPeriod = (typeof ANALYTICS_PERIODS)[number];

export const ANALYTICS_STAT_KEYS = [
  "totalRevenue",
  "totalAppointments",
  "completedAppointments",
  "totalCustomers",
  "averageRating",
] as const;

export type AnalyticsStatKey = (typeof ANALYTICS_STAT_KEYS)[number];

// NOTIFICATIONS
export const BARBER_NOTIFICATION_TYPES = [
  "NEW_BOOKING_REQUEST",
  "BOOKING_MODIFICATION_REQUEST",
  "SERVICE_CHANGE_REQUESTED",
  "BOOKING_CANCELLED_BY_CUSTOMER",
] as const;

export type BarberNotificationType = (typeof BARBER_NOTIFICATION_TYPES)[number];

export const BARBER_NOTIFICATION_TYPE_LABELS: Record<BarberNotificationType, string> = {
  NEW_BOOKING_REQUEST: "New Booking Request",
  BOOKING_MODIFICATION_REQUEST: "Modification Request",
  SERVICE_CHANGE_REQUESTED: "Service Change Request",
  BOOKING_CANCELLED_BY_CUSTOMER: "Cancellation",
};

export const BARBER_NOTIFICATION_ACTIONABLE: Record<BarberNotificationType, boolean> = {
  NEW_BOOKING_REQUEST: true,
  BOOKING_MODIFICATION_REQUEST: true,
  SERVICE_CHANGE_REQUESTED: true,
  BOOKING_CANCELLED_BY_CUSTOMER: false,
};

export const NOTIFICATION_FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "actionable", label: "Action needed" },
] as const;

export type NotificationFilterKey = (typeof NOTIFICATION_FILTER_TABS)[number]["key"];

// DASHBOARD
export const DASHBOARD_EARNINGS_TREND_DAYS = 7;

export const DASHBOARD_QUEUE_PREVIEW_COUNT = 3;

export const DASHBOARD_PENDING_PREVIEW_COUNT = 5;
