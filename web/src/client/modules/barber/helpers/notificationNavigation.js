import { routes } from "@/client/config/routes/routes.js";

export function getNotificationDestination(notif) {
  switch (notif.type) {
    case "booking_request":
    case "modification":
    case "cancellation":
      return notif.appointmentId
        ? routes.barber.appointmentsDetail(notif.appointmentId)
        : routes.barber.appointments;
    case "review":
      return routes.barber.reviews;
    default:
      return routes.barber.appointments;
  }
}

export function getNotificationActionLabel(notif) {
  switch (notif.type) {
    case "booking_request":
      return "Manage booking";
    case "modification":
      return "View update";
    case "cancellation":
      return "View appointment";
    case "review":
      return "View reviews";
    default:
      return "View details";
  }
}
