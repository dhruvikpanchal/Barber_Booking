import { useQueryClient } from "@tanstack/react-query";

export function useAdminInvalidation() {
  const queryClient = useQueryClient();

  return {
    barberRequests: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["barberRequestStats"] }),
        queryClient.invalidateQueries({ queryKey: ["barberRequests"] }),
        queryClient.invalidateQueries({ queryKey: ["barberRequest"] }),
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] }),
        queryClient.invalidateQueries({ queryKey: ["adminNavBadges"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]),
    contactMessages: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["contactMessageStats"] }),
        queryClient.invalidateQueries({ queryKey: ["contactMessages"] }),
        queryClient.invalidateQueries({ queryKey: ["contactMessage"] }),
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] }),
        queryClient.invalidateQueries({ queryKey: ["adminNavBadges"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ]),
    notifications: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] }),
      ]),
  };
}
