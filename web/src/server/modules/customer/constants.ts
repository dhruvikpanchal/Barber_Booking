import { NOTIFICATION_TYPE } from "@/server/shared/constants/notificationTypes";

// Re-export shared appointment / service-change enums used across roles
export {
  APPOINTMENT_STATUSES,
  CANCELLED_BY_VALUES,
  SERVICE_CHANGE_MIN_MS,
  SERVICE_CHANGE_STATUSES,
} from "@/server/modules/barber/constants";
export type {
  AppointmentStatus,
  CancelledBy,
  ServiceChangeStatus,
} from "@/server/modules/barber/constants";

// PROFILE  ·  /customer/profile  (also PATCH /api/v1/me)

export const MAX_PROFILE_FULL_NAME_LENGTH = 100;

export const MAX_PROFILE_ADDRESS_LENGTH = 255;

export const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

// MY APPOINTMENTS  ·  /customer/my-appointments

/** Tabs on MyAppointments.jsx — maps to status groups in the service layer */
export const CUSTOMER_APPOINTMENT_TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "cancelled", label: "Cancelled" },
] as const;

export type CustomerAppointmentTabKey = (typeof CUSTOMER_APPOINTMENT_TABS)[number]["key"];

/** Statuses shown as “upcoming” in the customer UI */
export const CUSTOMER_UPCOMING_STATUSES = ["PENDING", "CONFIRMED", "IN_SERVICE"] as const;

/** Statuses shown as “past” in the customer UI */
export const CUSTOMER_PAST_STATUSES = ["COMPLETED", "NO_SHOW"] as const;

export const CUSTOMER_APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  "in-service": "In service",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No show",
};

/** Progress tracker steps on appointment detail — matches appointmentsData.buildTimeline */
export const CUSTOMER_TIMELINE_STEPS = [
  { key: "created", label: "Booking Created" },
  { key: "accepted", label: "Barber Accepted" },
  { key: "arrived", label: "Customer Arrived" },
  { key: "servicesUpdated", label: "Services Updated" },
  { key: "completed", label: "Completed" },
] as const;

export type CustomerTimelineStepKey = (typeof CUSTOMER_TIMELINE_STEPS)[number]["key"];

export const CUSTOMER_TIMELINE_STEP_STATES = ["done", "current", "upcoming", "cancelled"] as const;

export type CustomerTimelineStepState = (typeof CUSTOMER_TIMELINE_STEP_STATES)[number];

export const MAX_APPOINTMENT_NOTES_LENGTH = 500;

export const MAX_CANCEL_REASON_LENGTH = 500;

export const MAX_SERVICE_CHANGE_NOTE_LENGTH = 500;

// BOOK APPOINTMENT  ·  /customer/book-appointment

export const BOOKING_SLOT_INTERVAL_MINUTES = 30;

export const BOOKING_MIN_LEAD_MINUTES = 60;

export const BOOKING_MAX_SERVICES_PER_APPOINTMENT = 8;

export const BOOKING_BARBERS_PAGE_SIZE = 24;

// FAVORITES  ·  /customer/favorites

export const FAVORITE_SORT_OPTIONS = [
  { key: "savedAt", label: "Recently Saved" },
  { key: "rating", label: "Highest Rated" },
  { key: "visits", label: "Most Visited" },
  { key: "price", label: "Price: Low–High" },
  { key: "available", label: "Available First" },
] as const;

export type FavoriteSortKey = (typeof FAVORITE_SORT_OPTIONS)[number]["key"];

// REVIEWS  ·  /customer/reviews

export const REVIEW_RATING_MIN = 1;

export const REVIEW_RATING_MAX = 5;

export const REVIEW_COMMENT_MAX_LENGTH = 1000;

/** 24-hour edit window — matches REVIEW_EDIT_MS in customer Reviews/Primitives.jsx */
export const REVIEW_EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

export const REVIEW_SORT_OPTIONS = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "rating", label: "Highest rated" },
] as const;

export type CustomerReviewSortKey = (typeof REVIEW_SORT_OPTIONS)[number]["key"];

export const REVIEWS_PAGE_SIZE = 20;

// NOTIFICATIONS  ·  /customer/notifications

export const CUSTOMER_NOTIFICATION_TYPES = [
  NOTIFICATION_TYPE.BOOKING_CONFIRMED,
  NOTIFICATION_TYPE.BOOKING_CANCELLED,
  NOTIFICATION_TYPE.BOOKING_REMINDER,
  NOTIFICATION_TYPE.SERVICE_CHANGE_ACCEPTED,
  NOTIFICATION_TYPE.SERVICE_CHANGE_REJECTED,
  NOTIFICATION_TYPE.REVIEW_REQUEST,
  NOTIFICATION_TYPE.PROMOTION,
] as const;

export type CustomerNotificationType = (typeof CUSTOMER_NOTIFICATION_TYPES)[number];

/** API / DB enum → snake_case keys used in customer UI (notificationsData.js) */
export const CUSTOMER_NOTIFICATION_CLIENT_TYPES: Record<CustomerNotificationType, string> = {
  BOOKING_CONFIRMED: "booking_confirmed",
  BOOKING_CANCELLED: "booking_cancelled",
  BOOKING_REMINDER: "booking_reminder",
  SERVICE_CHANGE_ACCEPTED: "service_change",
  SERVICE_CHANGE_REJECTED: "service_change",
  REVIEW_REQUEST: "review_request",
  PROMOTION: "promotion",
};

export const CUSTOMER_NOTIFICATION_FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "appointments", label: "Appointments" },
  { key: "service_change", label: "Updates" },
  { key: "review_request", label: "Reviews" },
  { key: "promotion", label: "Offers" },
] as const;

export type CustomerNotificationFilterKey =
  (typeof CUSTOMER_NOTIFICATION_FILTER_TABS)[number]["key"];

/** Types grouped under the “Appointments” filter chip */
export const CUSTOMER_APPOINTMENT_NOTIFICATION_CLIENT_TYPES = [
  "booking_confirmed",
  "booking_reminder",
  "booking_cancelled",
] as const;

// DASHBOARD  ·  /customer/dashboard

export const DASHBOARD_UPCOMING_PREVIEW_COUNT = 3;

export const DASHBOARD_ACTIVITY_PREVIEW_COUNT = 6;

export const DASHBOARD_NOTIFICATION_PREVIEW_COUNT = 4;
