import { MY_APPOINTMENTS } from "./appointmentsData.js";
import { INITIAL_NOTIFICATIONS } from "./notificationsData.js";

const UPCOMING_STATUSES = new Set(["pending", "confirmed"]);

/** @param {typeof MY_APPOINTMENTS} appointments */
export function isUpcoming(appt) {
  if (!UPCOMING_STATUSES.has(appt.status)) return false;
  return new Date(appt.startAt).getTime() > Date.now();
}

/** @param {typeof MY_APPOINTMENTS} [appointments] */
export function getDashboardStats(appointments = MY_APPOINTMENTS) {
  const upcoming = appointments.filter(isUpcoming);
  return {
    total: appointments.length,
    completed: appointments.filter((a) => a.status === "completed").length,
    upcoming: upcoming.length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };
}

/** @param {typeof MY_APPOINTMENTS} [appointments] */
export function getNextAppointment(appointments = MY_APPOINTMENTS) {
  return appointments
    .filter(isUpcoming)
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))[0] ?? null;
}

/** @param {typeof MY_APPOINTMENTS} [appointments] */
export function getUpcomingAppointments(appointments = MY_APPOINTMENTS, limit = 3) {
  return appointments
    .filter(isUpcoming)
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
    .slice(0, limit);
}

/** @param {typeof MY_APPOINTMENTS} [appointments] */
export function buildRecentActivity(appointments = MY_APPOINTMENTS, limit = 6) {
  const events = [];

  for (const appt of appointments) {
    const services = appt.services.map((s) => s.name).join(", ");
    const withBarber = `with ${appt.barber.name}`;

    if (appt.bookedAt) {
      events.push({
        id: `${appt.id}-booked`,
        type: "booked",
        at: appt.bookedAt,
        appointmentId: appt.id,
        title: "Booking placed",
        description: `${services} ${withBarber}`,
      });
    }

    const accepted = appt.timeline?.find((s) => s.key === "accepted" && s.at);
    if (accepted) {
      events.push({
        id: `${appt.id}-accepted`,
        type: "confirmed",
        at: accepted.at,
        appointmentId: appt.id,
        title: "Barber confirmed",
        description: `${appt.barber.name} accepted your appointment`,
      });
    }

    const completed = appt.timeline?.find((s) => s.key === "completed" && s.at);
    if (completed && appt.status === "completed") {
      events.push({
        id: `${appt.id}-completed`,
        type: "completed",
        at: completed.at,
        appointmentId: appt.id,
        title: "Visit completed",
        description: `${services} ${withBarber}`,
      });
    }

    if (appt.status === "cancelled") {
      const cancelledAt =
        appt.timeline?.findLast((s) => s.state === "cancelled")?.at ??
        appt.bookedAt;
      events.push({
        id: `${appt.id}-cancelled`,
        type: "cancelled",
        at: cancelledAt,
        appointmentId: appt.id,
        title: "Booking cancelled",
        description:
          appt.cancelReason ??
          `${services} ${withBarber}`,
      });
    }

    const serviceUpdate = appt.timeline?.find(
      (s) => s.key === "servicesUpdated" && s.at,
    );
    if (serviceUpdate) {
      events.push({
        id: `${appt.id}-services`,
        type: "update",
        at: serviceUpdate.at,
        appointmentId: appt.id,
        title: "Services updated",
        description: appt.barberNotes ?? `Services changed for ${appt.barber.name}`,
      });
    }
  }

  return events
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, limit);
}

/** Preview feed — newest first. */
export function getNotificationPreview(
  notifications = INITIAL_NOTIFICATIONS,
  limit = 4,
) {
  return [...notifications]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}
