import { useQueryClient } from "@tanstack/react-query";
import { invalidateCustomerNotificationQueries } from "@/client/modules/customer/helpers/customerCacheHelpers.js";

export function useCustomerInvalidation() {
  const queryClient = useQueryClient();

  return {
    appointments: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["listAppointments"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]),
    appointment: (id) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["listAppointments"] }),
        queryClient.invalidateQueries({ queryKey: ["getAppointment", id] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]),
    notifications: () => invalidateCustomerNotificationQueries(queryClient),
    reviews: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["listReviews"] }),
        queryClient.invalidateQueries({ queryKey: ["listAppointments"] }),
      ]),
    favorites: () => queryClient.invalidateQueries({ queryKey: ["listFavorites"] }),
    dashboard: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["getUnreadNotificationCount"] }),
      ]),
    bookingFlow: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["listAppointments"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["listNotifications"] }),
        queryClient.invalidateQueries({ queryKey: ["getUnreadNotificationCount"] }),
      ]),
  };
}
