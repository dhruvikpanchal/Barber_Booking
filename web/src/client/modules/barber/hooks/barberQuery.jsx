import { createQuery, createMutation } from "@/client/modules/shared/hooks/useTanstack.js";
import { barberServices } from "@/client/modules/barber/service/barberServices.jsx";

export const barberHook = {
  Profile: {
    useGetProfile: () => createQuery("getProfile", barberServices.getProfile),

    useUpdateProfile: (data) => createMutation("updateProfile", barberServices.updateProfile, data),

    useUploadPhoto: (file) => createMutation("uploadPhoto", barberServices.uploadPhoto, file),

    useAddGalleryImage: (data) =>
      createMutation("addGalleryImage", barberServices.addGalleryImage, data),

    useUpdateGalleryImage: (id, data) =>
      createMutation("updateGalleryImage", barberServices.updateGalleryImage, id, data),

    useDeleteGalleryImage: (id) =>
      createMutation("deleteGalleryImage", barberServices.deleteGalleryImage, id),
  },

  Services: {
    useListServices: (params) => createQuery("listServices", barberServices.listServices, params),

    useCreateService: (data) => createMutation("createService", barberServices.createService, data),

    useUpdateService: (id, data) =>
      createMutation("updateService", barberServices.updateService, id, data),

    useToggleService: (id, data) =>
      createMutation("toggleService", barberServices.toggleService, id, data),

    useDeleteService: (id) => createMutation("deleteService", barberServices.deleteService, id),
  },

  Schedule: {
    useGetSchedule: () => createQuery("getSchedule", barberServices.getSchedule),

    useSaveSchedule: (data) => createMutation("saveSchedule", barberServices.saveSchedule, data),

    useAddUnavailableDate: (data) =>
      createMutation("addUnavailableDate", barberServices.addUnavailableDate, data),

    useRemoveUnavailableDate: (date) =>
      createMutation("removeUnavailableDate", barberServices.removeUnavailableDate, date),
  },

  Appointments: {
    useListAppointments: (params) =>
      createQuery("listAppointments", barberServices.listAppointments, params),

    useGetAppointment: (id) => createQuery("getAppointment", barberServices.getAppointment, id),

    useUpdateAppointmentStatus: (id, data) =>
      createMutation("updateAppointmentStatus", barberServices.updateAppointmentStatus, id, data),

    useRescheduleAppointment: (id, data) =>
      createMutation("rescheduleAppointment", barberServices.rescheduleAppointment, id, data),

    useRespondServiceChange: (appointmentId, reqId, data) =>
      createMutation(
        "respondServiceChange",
        barberServices.respondServiceChange,
        appointmentId,
        reqId,
        data,
      ),
  },

  Queue: {
    useGetQueue: (params) => createQuery("getQueue", barberServices.getQueue, params),

    useAddToQueue: (data) => createMutation("addToQueue", barberServices.addToQueue, data),

    useUpdateQueueStatus: (id, data) =>
      createMutation("updateQueueStatus", barberServices.updateQueueStatus, id, data),

    useAssignChair: (id, data) =>
      createMutation("assignChair", barberServices.assignChair, id, data),

    useRemoveFromQueue: (id) =>
      createMutation("removeFromQueue", barberServices.removeFromQueue, id),
  },

  WalkIns: {
    useListWalkIns: (params) => createQuery("listWalkIns", barberServices.listWalkIns, params),

    useCreateWalkIn: (data) => createMutation("createWalkIn", barberServices.createWalkIn, data),

    useUpdateWalkInStatus: (id, data) =>
      createMutation("updateWalkInStatus", barberServices.updateWalkInStatus, id, data),
  },

  Reviews: {
    useListReviews: (params) => createQuery("listReviews", barberServices.listReviews, params),

    useGetReview: (id) => createQuery("getReview", barberServices.getReview, id),

    useReplyToReview: (id, data) =>
      createMutation("replyToReview", barberServices.replyToReview, id, data),
  },

  Analytics: {
    useGetAnalytics: (params) => createQuery("getAnalytics", barberServices.getAnalytics, params),
  },

  Notifications: {
    useListNotifications: (params) =>
      createQuery("listNotifications", barberServices.listNotifications, params),

    useMarkNotificationRead: (id, data) =>
      createMutation("markNotificationRead", barberServices.markNotificationRead, id, data),

    useMarkAllNotificationsRead: () =>
      createMutation("markAllNotificationsRead", barberServices.markAllNotificationsRead),
  },

  Dashboard: {
    useGetDashboard: (params) => createQuery("getDashboard", barberServices.getDashboard, params),
  },
};
