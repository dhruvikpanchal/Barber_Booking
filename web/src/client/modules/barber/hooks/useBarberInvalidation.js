import { useQueryClient } from "@tanstack/react-query";

export function useBarberInvalidation() {
  const queryClient = useQueryClient();

  return {
    appointments: () =>
      queryClient.invalidateQueries({ queryKey: ["barberListAppointments"] }),
    appointment: (id) =>
      queryClient.invalidateQueries({ queryKey: ["barberGetAppointment", id] }),
    queue: () => queryClient.invalidateQueries({ queryKey: ["barberGetQueue"] }),
    walkIns: () => queryClient.invalidateQueries({ queryKey: ["barberListWalkIns"] }),
    services: () => queryClient.refetchQueries({ queryKey: ["barberListServices"] }),
    notifications: () =>
      queryClient.invalidateQueries({ queryKey: ["barberListNotifications"] }),
    notificationCount: () =>
      queryClient.invalidateQueries({ queryKey: ["barberUnreadNotificationCount"] }),
    dashboard: () => queryClient.invalidateQueries({ queryKey: ["barberGetDashboard"] }),
    workflow: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["barberListAppointments"] }),
        queryClient.invalidateQueries({ queryKey: ["barberGetQueue"] }),
        queryClient.invalidateQueries({ queryKey: ["barberListWalkIns"] }),
        queryClient.invalidateQueries({ queryKey: ["barberGetDashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["barberUnreadNotificationCount"] }),
      ]),
  };
}
