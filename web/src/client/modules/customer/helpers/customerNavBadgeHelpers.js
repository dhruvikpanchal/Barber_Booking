import { isReviewableAppointment } from "@/client/modules/customer/components/Reviews/Primitives.jsx";
import { CUSTOMER_NAV_SECTIONS } from "@/client/modules/customer/constants/customerNavSeenConstants.js";
import { countCustomerItemsNewerThan } from "@/client/modules/customer/helpers/customerNavSeenStore.js";

export function countCustomerNewNotifications(notifications = [], userId) {
  return countCustomerItemsNewerThan(
    notifications,
    (item) => item.timestamp,
    userId,
    CUSTOMER_NAV_SECTIONS.notifications,
  );
}

export function countCustomerNewAppointments(appointmentGroups = [], userId) {
  const items = appointmentGroups.flat();
  return countCustomerItemsNewerThan(
    items,
    (item) => item.bookedAt,
    userId,
    CUSTOMER_NAV_SECTIONS.appointments,
  );
}

export function countCustomerNewReviewItems(reviews = [], pastAppointments = [], userId) {
  const reviewedIds = new Set(reviews.map((review) => review.appointmentId));

  const reviewable = pastAppointments.filter((appointment) =>
    isReviewableAppointment(appointment, reviewedIds),
  );

  return countCustomerItemsNewerThan(
    reviewable,
    (item) => item.completedAt ?? item.startAt,
    userId,
    CUSTOMER_NAV_SECTIONS.reviews,
  );
}
