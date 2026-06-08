/** Canonical appointment status keys used across admin, barber, and customer apps. */
export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  IN_SERVICE: "in-service",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

/** Barber account / listing status keys (admin barbers module). */
export const BARBER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DISABLED: "disabled",
};

/** Barber onboarding request status keys (admin review flow). */
export const REQUEST_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};
