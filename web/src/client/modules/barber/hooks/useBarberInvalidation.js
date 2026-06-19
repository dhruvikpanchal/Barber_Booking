import { useQueryClient } from "@tanstack/react-query";

export function useBarberInvalidation() {
  const queryClient = useQueryClient();

  const invalidateAll = (keys) => Promise.all(keys.map((key) => queryClient.invalidateQueries({ queryKey: key })));

  return {
    appointments: () => queryClient.invalidateQueries({ queryKey: ["barberListAppointments"] }),
    appointment: (id) =>
      queryClient.invalidateQueries({ queryKey: ["barberGetAppointment", id] }),
    queue: () => queryClient.invalidateQueries({ queryKey: ["barberGetQueue"] }),
    walkIns: () => queryClient.invalidateQueries({ queryKey: ["barberListWalkIns"] }),
    services: () => queryClient.invalidateQueries({ queryKey: ["barberListServices"] }),
    notifications: () =>
      queryClient.invalidateQueries({ queryKey: ["barberListNotifications"] }),
    notificationCount: () =>
      queryClient.invalidateQueries({ queryKey: ["barberUnreadNotificationCount"] }),
    dashboard: () => queryClient.invalidateQueries({ queryKey: ["barberGetDashboard"] }),
    navBadges: () => queryClient.invalidateQueries({ queryKey: ["barberNavBadges"] }),
    reviews: () => queryClient.invalidateQueries({ queryKey: ["barberListReviews"] }),
    analytics: () => queryClient.invalidateQueries({ queryKey: ["barberGetAnalytics"] }),
    /** After appointment / queue / service-change updates. */
    operations: () =>
      invalidateAll([
        ["barberListAppointments"],
        ["barberListPendingServiceChanges"],
        ["barberGetQueue"],
        ["barberListWalkIns"],
        ["barberGetDashboard"],
        ["barberNavBadges"],
        ["barberListNotifications"],
        ["barberUnreadNotificationCount"],
        ["barberGetAnalytics"],
      ]),
    /** After reschedule — includes appointment detail when id is known. */
    reschedule: (appointmentId) =>
      Promise.all([
        invalidateAll([
          ["barberListAppointments"],
          ["barberListPendingServiceChanges"],
          ["barberGetQueue"],
          ["barberListWalkIns"],
          ["barberGetDashboard"],
          ["barberNavBadges"],
          ["barberListNotifications"],
          ["barberUnreadNotificationCount"],
          ["barberGetAnalytics"],
        ]),
        ...(appointmentId
          ? [queryClient.invalidateQueries({ queryKey: ["barberGetAppointment", appointmentId] })]
          : []),
      ]),
    /** After walk-in create/status changes. */
    walkInFlow: () =>
      invalidateAll([
        ["barberListWalkIns"],
        ["barberGetQueue"],
        ["barberGetDashboard"],
        ["barberNavBadges"],
      ]),
    workflow: () =>
      invalidateAll([
        ["barberListAppointments"],
        ["barberGetQueue"],
        ["barberGetDashboard"],
      ]),
  };
}
