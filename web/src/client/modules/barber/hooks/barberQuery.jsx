import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { createQuery, createMutation } from "@/client/modules/shared/hooks/useTanstack.js";
import { barberServices } from "@/client/modules/barber/services/barberServices.jsx";
import {
  isCompleteBarberProfile,
  syncProfileAfterMutation,
} from "@/client/modules/shared/helpers/profilePhotoHelpers.js";
import { getProfilePlaceholderData } from "@/client/lib/auth/profileCache.js";

export { useBarberInvalidation } from "@/client/modules/barber/hooks/useBarberInvalidation.js";

const PROFILE_STALE_TIME = 5 * 60_000;
const LIST_STALE_TIME = 60_000;
const DASHBOARD_STALE_TIME = 45_000;
const QUEUE_STALE_TIME = 20_000;

export const barberHook = {
  Profile: {
    useGetProfile: () =>
      createQuery("barberGetProfile", barberServices.getProfile, {
        staleTime: PROFILE_STALE_TIME,
        placeholderData: () => getProfilePlaceholderData("barber"),
        refetchOnMount: (query) => !isCompleteBarberProfile(query.state.data),
      }),

    useUpdateProfile: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationKey: ["barberUpdateProfile"],
        mutationFn: barberServices.updateProfile,
        onSuccess: (data) => syncProfileAfterMutation(queryClient, "barber", data),
      });
    },

    useUploadPhoto: () => createMutation("barberUploadPhoto", barberServices.uploadPhoto),

    useUploadGalleryPhoto: () =>
      createMutation("barberUploadGalleryPhoto", ({ file, alt = "" }) =>
        barberServices.uploadGalleryPhoto(file, alt),
      ),

    useAddGalleryImage: () =>
      createMutation("barberAddGalleryImage", barberServices.addGalleryImage),

    useUpdateGalleryImage: () =>
      createMutation("barberUpdateGalleryImage", ({ id, ...data }) =>
        barberServices.updateGalleryImage(id, data),
      ),

    useDeleteGalleryImage: () =>
      createMutation("barberDeleteGalleryImage", (id) => barberServices.deleteGalleryImage(id)),
  },

  Services: {
    useListServices: (params, options = {}) =>
      createQuery("barberListServices", barberServices.listServices, params, {
        staleTime: LIST_STALE_TIME,
        ...options,
      }),

    useCreateService: () => createMutation("barberCreateService", barberServices.createService),

    useUpdateService: () =>
      createMutation("barberUpdateService", ({ id, ...data }) =>
        barberServices.updateService(id, data),
      ),

    useToggleService: () =>
      createMutation("barberToggleService", ({ id, ...data }) =>
        barberServices.toggleService(id, data),
      ),

    useDeleteService: () =>
      createMutation("barberDeleteService", (id) => barberServices.deleteService(id)),
  },

  Schedule: {
    useGetSchedule: () =>
      createQuery("barberGetSchedule", barberServices.getSchedule, {
        staleTime: LIST_STALE_TIME,
      }),

    useSaveSchedule: () => createMutation("barberSaveSchedule", barberServices.saveSchedule),

    useAddUnavailableDate: () =>
      createMutation("barberAddUnavailableDate", barberServices.addUnavailableDate),

    useRemoveUnavailableDate: () =>
      createMutation("barberRemoveUnavailableDate", (date) =>
        barberServices.removeUnavailableDate(date),
      ),
  },

  Appointments: {
    useListAppointments: (params, options = {}) =>
      createQuery("barberListAppointments", barberServices.listAppointments, params, {
        staleTime: LIST_STALE_TIME,
        ...options,
      }),

    useGetAppointment: (id) =>
      createQuery("barberGetAppointment", barberServices.getAppointment, id),

    useListPendingServiceChanges: (options = {}) =>
      createQuery(
        "barberListPendingServiceChanges",
        barberServices.listPendingServiceChanges,
        undefined,
        { staleTime: LIST_STALE_TIME, ...options },
      ),

    useUpdateAppointmentStatus: () =>
      createMutation("barberUpdateAppointmentStatus", ({ id, ...data }) =>
        barberServices.updateAppointmentStatus(id, data),
      ),

    useRescheduleAppointment: () =>
      createMutation("barberRescheduleAppointment", ({ id, ...data }) =>
        barberServices.rescheduleAppointment(id, data),
      ),

    useRespondServiceChange: () => {
      const queryClient = useQueryClient();
      return useMutation({
        mutationKey: ["barberRespondServiceChange"],
        mutationFn: ({ appointmentId, reqId, ...data }) =>
          barberServices.respondServiceChange(appointmentId, reqId, data),
        onSuccess: (_data, variables) => {
          queryClient.invalidateQueries({ queryKey: ["barberListPendingServiceChanges"] });
          queryClient.invalidateQueries({ queryKey: ["barberListAppointments"] });
          queryClient.invalidateQueries({ queryKey: ["barberGetDashboard"] });
          queryClient.invalidateQueries({ queryKey: ["barberGetQueue"] });
          if (variables?.appointmentId) {
            queryClient.invalidateQueries({
              queryKey: ["barberGetAppointment", variables.appointmentId],
            });
          }
        },
      });
    },
  },

  Queue: {
    useGetQueue: (params, options = {}) =>
      createQuery("barberGetQueue", barberServices.getQueue, params, {
        staleTime: QUEUE_STALE_TIME,
        ...options,
      }),

    useUpdateQueueStatus: () =>
      createMutation("barberUpdateQueueStatus", ({ id, ...data }) =>
        barberServices.updateQueueStatus(id, data),
      ),

    useAssignChair: () =>
      createMutation("barberAssignChair", ({ id, ...data }) =>
        barberServices.assignChair(id, data),
      ),

    useRemoveFromQueue: () =>
      createMutation("barberRemoveFromQueue", (id) => barberServices.removeFromQueue(id)),
  },

  WalkIns: {
    useListWalkIns: (params, options = {}) =>
      createQuery("barberListWalkIns", barberServices.listWalkIns, params, {
        staleTime: LIST_STALE_TIME,
        ...options,
      }),

    useCreateWalkIn: () => createMutation("barberCreateWalkIn", barberServices.createWalkIn),

    useUpdateWalkInStatus: () =>
      createMutation("barberUpdateWalkInStatus", ({ id, ...data }) =>
        barberServices.updateWalkInStatus(id, data),
      ),
  },

  Reviews: {
    useListReviews: (params, options = {}) =>
      createQuery("barberListReviews", barberServices.listReviews, params, {
        staleTime: LIST_STALE_TIME,
        ...options,
      }),

    useGetReview: (id) => createQuery("barberGetReview", barberServices.getReview, id),

    useReplyToReview: () =>
      createMutation("barberReplyToReview", ({ id, ...data }) =>
        barberServices.replyToReview(id, data),
      ),
  },

  Analytics: {
    useGetAnalytics: (params, options = {}) =>
      createQuery("barberGetAnalytics", barberServices.getAnalytics, params, {
        staleTime: LIST_STALE_TIME,
        ...options,
      }),
  },

  Notifications: {
    useListNotifications: (params, options = {}) =>
      createQuery("barberListNotifications", barberServices.listNotifications, params, {
        staleTime: LIST_STALE_TIME,
        ...options,
      }),

    useMarkNotificationRead: () =>
      createMutation("barberMarkNotificationRead", ({ id, ...data }) =>
        barberServices.markNotificationRead(id, data),
      ),

    useMarkAllNotificationsRead: () =>
      createMutation("barberMarkAllNotificationsRead", barberServices.markAllNotificationsRead),

    useUnreadNotificationCount: (options = {}) =>
      createQuery("barberUnreadNotificationCount", barberServices.getUnreadNotificationCount, {
        staleTime: LIST_STALE_TIME,
        ...options,
      }),
  },

  NavBadges: {
    useNavBadges: (options = {}) =>
      createQuery("barberNavBadges", barberServices.getNavBadges, {
        staleTime: 45_000,
        ...options,
      }),

    useMarkNavSectionSeen: () =>
      createMutation("markBarberNavSectionSeen", barberServices.markNavSectionSeen),
  },

  Dashboard: {
    useGetDashboard: (params, options = {}) =>
      createQuery("barberGetDashboard", barberServices.getDashboard, params, {
        staleTime: DASHBOARD_STALE_TIME,
        ...options,
      }),
  },

  Settings: {
    useUpdatePassword: () => createMutation("barberUpdatePassword", barberServices.updatePassword),

    useDeleteAccount: () => createMutation("barberDeleteAccount", barberServices.deleteAccount),
  },
};
