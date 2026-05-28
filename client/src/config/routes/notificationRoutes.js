import { routes } from "@/config/routes/routes";

/** Notifications inbox per dashboard role. */
export function getNotificationsHref(role) {
  switch (role) {
    case "barber":
      return routes.barber.notifications;
    case "admin":
      return routes.admin.notifications;
    case "customer":
      return routes.customer.notifications;
    default:
      return "#";
  }
}

/** Deep link target for a customer notification card. */
export function getNotificationDeepLink(notif) {
  if (!notif) return routes.customer.notifications;

  if (notif.appointmentId) {
    return routes.customer.appointmentsDetail(notif.appointmentId);
  }

  if (notif.type === "review_request") {
    return routes.customer.reviews;
  }

  return routes.customer.notifications;
}
