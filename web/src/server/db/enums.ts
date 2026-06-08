import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["ADMIN", "BARBER", "CUSTOMER"]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "PENDING",
  "CONFIRMED",
  "IN_SERVICE",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

export const cancelledByEnum = pgEnum("cancelled_by", [
  "CUSTOMER",
  "BARBER",
  "ADMIN",
  "SYSTEM",
]);

export const serviceChangeStatusEnum = pgEnum("service_change_status", [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
]);

export const barberRequestStatusEnum = pgEnum("barber_request_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const walkInStatusEnum = pgEnum("walk_in_status", [
  "WAITING",
  "IN_SERVICE",
  "DONE",
  "CANCELLED",
]);

export const queueSourceEnum = pgEnum("queue_source", ["ONLINE", "WALK_IN"]);

export const barberStatusEnum = pgEnum("barber_status", [
  "ACTIVE",
  "INACTIVE",
  "DISABLED",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "BOOKING_CONFIRMED",
  "BOOKING_CANCELLED",
  "BOOKING_REMINDER",
  "SERVICE_CHANGE_ACCEPTED",
  "SERVICE_CHANGE_REJECTED",
  "REVIEW_REQUEST",
  "PROMOTION",
  "NEW_BOOKING_REQUEST",
  "BOOKING_MODIFICATION_REQUEST",
  "SERVICE_CHANGE_REQUESTED",
  "BOOKING_CANCELLED_BY_CUSTOMER",
  "BARBER_REQUEST_SUBMITTED",
  "BARBER_REQUEST_APPROVED",
  "BARBER_REQUEST_REJECTED",
  "NEW_CONTACT_MESSAGE",
]);

export const contactReplyStatusEnum = pgEnum("contact_reply_status", [
  "UNREPLIED",
  "REPLIED",
]);
