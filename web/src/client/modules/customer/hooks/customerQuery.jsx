import { createQuery, createMutation } from "@/client/modules/shared/hooks/useTanstack.js";
import { customerServices } from "@/client/modules/customer/services/customerServices.jsx";

export const customerHook = {
  Profile: {
    useGetProfile: () => createQuery("getProfile", customerServices.getProfile),

    useUpdateProfile: (data) =>
      createMutation("updateProfile", customerServices.updateProfile, data),

    useUploadProfilePhoto: (file) =>
      createMutation("uploadProfilePhoto", customerServices.uploadProfilePhoto, file),
  },

  Dashboard: {
    useDashboard: (params) => createQuery("dashboard", customerServices.getDashboard, params),
  },

  Appointments: {
    useListAppointments: (params) =>
      createQuery("listAppointments", customerServices.listAppointments, params),

    useGetAppointment: (id) => createQuery("getAppointment", customerServices.getAppointment, id),

    useCancelAppointment: (id, body = {}) =>
      createMutation("cancelAppointment", customerServices.cancelAppointment, id, body),

    useRequestServiceChange: (id, body) =>
      createMutation("requestServiceChange", customerServices.requestServiceChange, id, body),

    useCreateReviewForAppointment: (id, body) =>
      createMutation(
        "createReviewForAppointment",
        customerServices.createReviewForAppointment,
        id,
        body,
      ),
  },

  Booking: {
    useListBookingBarbers: (params) =>
      createQuery("listBookingBarbers", customerServices.listBookingBarbers, params),

    useListBookingServices: (slug) =>
      createQuery("listBookingServices", customerServices.listBookingServices, slug),

    useGetAvailableSlots: (slug, params) =>
      createQuery("getAvailableSlots", customerServices.getAvailableSlots, slug, params),

    useConfirmBooking: (body) =>
      createMutation("confirmBooking", customerServices.confirmBooking, body),
  },

  Favorites: {
    useListFavorites: (params) =>
      createQuery("listFavorites", customerServices.listFavorites, params),

    useAddFavorite: (barberId) =>
      createMutation("addFavorite", customerServices.addFavorite, barberId),

    useRemoveFavorite: (barberId) =>
      createMutation("removeFavorite", customerServices.removeFavorite, barberId),
  },

  Reviews: {
    useListReviews: (params) => createQuery("listReviews", customerServices.listReviews, params),

    useUpdateReview: (id, body) =>
      createMutation("updateReview", customerServices.updateReview, id, body),

    useDeleteReview: (id) => createMutation("deleteReview", customerServices.deleteReview, id),
  },

  Notifications: {
    useListNotifications: (params) =>
      createQuery("listNotifications", customerServices.listNotifications, params),

    useGetUnreadNotificationCount: () =>
      createQuery("getUnreadNotificationCount", customerServices.getUnreadNotificationCount),

    useMarkNotificationRead: (id) =>
      createMutation("markNotificationRead", customerServices.markNotificationRead, id),

    useMarkAllNotificationsRead: () =>
      createMutation("markAllNotificationsRead", customerServices.markAllNotificationsRead),

    useDeleteNotification: (id) =>
      createMutation("deleteNotification", customerServices.deleteNotification, id),
  },
};
