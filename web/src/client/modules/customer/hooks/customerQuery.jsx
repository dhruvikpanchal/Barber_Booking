import { createQuery, createMutation } from "@/client/modules/shared/hooks/useTanstack.js";

import { customerServices } from "@/client/modules/customer/services/customerServices.jsx";

export const customerHook = {
  Profile: {
    useGetProfile: () => createQuery("getProfile", customerServices.getProfile),

    useUpdateProfile: () => createMutation("updateProfile", customerServices.updateProfile),

    useUploadProfilePhoto: () =>
      createMutation("uploadProfilePhoto", customerServices.uploadProfilePhoto),
  },

  Dashboard: {
    useDashboard: (params) => createQuery("dashboard", customerServices.getDashboard, params),
  },

  Appointments: {
    useListAppointments: (params) =>
      createQuery("listAppointments", customerServices.listAppointments, params),

    useGetAppointment: (id) => createQuery("getAppointment", customerServices.getAppointment, id),

    useCancelAppointment: () =>
      createMutation("cancelAppointment", ({ id, ...body }) =>
        customerServices.cancelAppointment(id, body),
      ),

    useRequestServiceChange: () =>
      createMutation("requestServiceChange", ({ id, ...body }) =>
        customerServices.requestServiceChange(id, body),
      ),

    useCreateReviewForAppointment: () =>
      createMutation("createReviewForAppointment", ({ id, ...body }) =>
        customerServices.createReviewForAppointment(id, body),
      ),
  },

  Booking: {
    useListBookingBarbers: (params) =>
      createQuery("listBookingBarbers", customerServices.listBookingBarbers, params),

    useListBookingServices: (slug) =>
      createQuery("listBookingServices", customerServices.listBookingServices, slug),

    useGetAvailableSlots: (slug, params) =>
      createQuery("getAvailableSlots", customerServices.getAvailableSlots, slug, params),

    useConfirmBooking: () => createMutation("confirmBooking", customerServices.confirmBooking),
  },

  Favorites: {
    useListFavorites: (params) =>
      createQuery("listFavorites", customerServices.listFavorites, params),

    useAddFavorite: () =>
      createMutation("addFavorite", (barberId) => customerServices.addFavorite(barberId)),

    useRemoveFavorite: () =>
      createMutation("removeFavorite", (barberId) => customerServices.removeFavorite(barberId)),
  },

  Reviews: {
    useListReviews: (params) => createQuery("listReviews", customerServices.listReviews, params),

    useUpdateReview: () =>
      createMutation("updateReview", ({ id, ...body }) => customerServices.updateReview(id, body)),

    useDeleteReview: () =>
      createMutation("deleteReview", (id) => customerServices.deleteReview(id)),
  },

  Notifications: {
    useListNotifications: (params) =>
      createQuery("listNotifications", customerServices.listNotifications, params),

    useGetUnreadNotificationCount: () =>
      createQuery("getUnreadNotificationCount", customerServices.getUnreadNotificationCount),

    useMarkNotificationRead: () =>
      createMutation("markNotificationRead", (id) => customerServices.markNotificationRead(id)),

    useMarkAllNotificationsRead: () =>
      createMutation("markAllNotificationsRead", customerServices.markAllNotificationsRead),

    useDeleteNotification: () =>
      createMutation("deleteNotification", (id) => customerServices.deleteNotification(id)),
  },

  Settings: {
    useUpdatePassword: () =>
      createMutation("customerUpdatePassword", customerServices.updatePassword),

    useDeleteAccount: () =>
      createMutation("customerDeleteAccount", customerServices.deleteAccount),
  },
};
