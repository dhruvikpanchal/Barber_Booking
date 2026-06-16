import { createQuery, createMutation } from "@/client/modules/shared/hooks/useTanstack.js";
import { barberServices } from "@/client/modules/barber/services/barberServices.jsx";

export { useBarberInvalidation } from "@/client/modules/barber/hooks/useBarberInvalidation.js";

export const barberHook = {
  Profile: {
    useGetProfile: () => createQuery("barberGetProfile", barberServices.getProfile),

    useUpdateProfile: () => createMutation("barberUpdateProfile", barberServices.updateProfile),

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
    useListServices: (params) =>
      createQuery("barberListServices", barberServices.listServices, params),

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
    useGetSchedule: () => createQuery("barberGetSchedule", barberServices.getSchedule),

    useSaveSchedule: () => createMutation("barberSaveSchedule", barberServices.saveSchedule),

    useAddUnavailableDate: () =>
      createMutation("barberAddUnavailableDate", barberServices.addUnavailableDate),

    useRemoveUnavailableDate: () =>
      createMutation("barberRemoveUnavailableDate", (date) =>
        barberServices.removeUnavailableDate(date),
      ),
  },

  Appointments: {
    useListAppointments: (params) =>
      createQuery("barberListAppointments", barberServices.listAppointments, params),

    useGetAppointment: (id) =>
      createQuery("barberGetAppointment", barberServices.getAppointment, id),

    useUpdateAppointmentStatus: () =>
      createMutation("barberUpdateAppointmentStatus", ({ id, ...data }) =>
        barberServices.updateAppointmentStatus(id, data),
      ),

    useRescheduleAppointment: () =>
      createMutation("barberRescheduleAppointment", ({ id, ...data }) =>
        barberServices.rescheduleAppointment(id, data),
      ),

    useRespondServiceChange: () =>
      createMutation("barberRespondServiceChange", ({ appointmentId, reqId, ...data }) =>
        barberServices.respondServiceChange(appointmentId, reqId, data),
      ),
  },

  Queue: {
    useGetQueue: (params) => createQuery("barberGetQueue", barberServices.getQueue, params),

    useAddToQueue: () => createMutation("barberAddToQueue", barberServices.addToQueue),

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
    useListWalkIns: (params) =>
      createQuery("barberListWalkIns", barberServices.listWalkIns, params),

    useCreateWalkIn: () => createMutation("barberCreateWalkIn", barberServices.createWalkIn),

    useUpdateWalkInStatus: () =>
      createMutation("barberUpdateWalkInStatus", ({ id, ...data }) =>
        barberServices.updateWalkInStatus(id, data),
      ),
  },

  Reviews: {
    useListReviews: (params) =>
      createQuery("barberListReviews", barberServices.listReviews, params),

    useGetReview: (id) => createQuery("barberGetReview", barberServices.getReview, id),

    useReplyToReview: () =>
      createMutation("barberReplyToReview", ({ id, ...data }) =>
        barberServices.replyToReview(id, data),
      ),
  },

  Analytics: {
    useGetAnalytics: (params) =>
      createQuery("barberGetAnalytics", barberServices.getAnalytics, params),
  },

  Notifications: {
    useListNotifications: (params) =>
      createQuery("barberListNotifications", barberServices.listNotifications, params),

    useMarkNotificationRead: () =>
      createMutation("barberMarkNotificationRead", ({ id, ...data }) =>
        barberServices.markNotificationRead(id, data),
      ),

    useMarkAllNotificationsRead: () =>
      createMutation("barberMarkAllNotificationsRead", barberServices.markAllNotificationsRead),

    useUnreadNotificationCount: (options) =>
      createQuery(
        "barberUnreadNotificationCount",
        barberServices.getUnreadNotificationCount,
        options,
      ),
  },

  Dashboard: {
    useGetDashboard: (params) =>
      createQuery("barberGetDashboard", barberServices.getDashboard, params),
  },

  Settings: {
    useUpdatePassword: () => createMutation("barberUpdatePassword", barberServices.updatePassword),

    useDeleteAccount: () => createMutation("barberDeleteAccount", barberServices.deleteAccount),
  },
};
