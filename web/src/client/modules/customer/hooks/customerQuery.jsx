import { createQuery, createMutation } from "@/client/modules/shared/hooks/useTanstack.js";

import { customerServices } from "@/client/modules/customer/services/customerServices.jsx";
import { isCompleteCustomerProfile } from "@/client/modules/shared/helpers/profilePhotoHelpers.js";
import { getProfilePlaceholderData } from "@/client/lib/auth/profileCache.js";

const PROFILE_STALE_TIME = 5 * 60_000;
const DASHBOARD_STALE_TIME = 60_000;
const LIST_STALE_TIME = 60_000;
const BOOKING_STALE_TIME = 2 * 60_000;
const SLOTS_STALE_TIME = 30_000;

export const customerHook = {
  Profile: {
    useGetProfile: () =>
      createQuery("getProfile", customerServices.getProfile, {
        staleTime: PROFILE_STALE_TIME,
        placeholderData: () => getProfilePlaceholderData("customer"),
        refetchOnMount: (query) => !isCompleteCustomerProfile(query.state.data),
      }),

    useUpdateProfile: () => createMutation("updateProfile", customerServices.updateProfile),

    useUploadProfilePhoto: () =>
      createMutation("uploadProfilePhoto", customerServices.uploadProfilePhoto),
  },

  Dashboard: {
    useDashboard: (params) =>
      createQuery("dashboard", customerServices.getDashboard, params, {
        staleTime: DASHBOARD_STALE_TIME,
      }),
  },

  Appointments: {
    useListAppointments: (params, options = {}) =>
      createQuery("listAppointments", customerServices.listAppointments, params, {
        staleTime: LIST_STALE_TIME,
        ...options,
      }),

    useGetAppointment: (id) =>
      createQuery("getAppointment", customerServices.getAppointment, id, {
        staleTime: LIST_STALE_TIME,
      }),

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
      createQuery("listBookingBarbers", customerServices.listBookingBarbers, params, {
        staleTime: BOOKING_STALE_TIME,
      }),

    useListBookingServices: (slug, options = {}) =>
      createQuery("listBookingServices", customerServices.listBookingServices, slug, {
        staleTime: BOOKING_STALE_TIME,
        ...options,
      }),

    useGetAvailableSlots: (slug, params, options = {}) =>
      createQuery("getAvailableSlots", customerServices.getAvailableSlots, slug, params, {
        staleTime: SLOTS_STALE_TIME,
        ...options,
      }),

    useConfirmBooking: () => createMutation("confirmBooking", customerServices.confirmBooking),
  },

  Favorites: {
    useListFavorites: (params, options = {}) =>
      createQuery("listFavorites", customerServices.listFavorites, params, {
        staleTime: LIST_STALE_TIME,
        ...options,
      }),

    useAddFavorite: () =>
      createMutation("addFavorite", (barberId) => customerServices.addFavorite(barberId)),

    useRemoveFavorite: () =>
      createMutation("removeFavorite", (barberId) => customerServices.removeFavorite(barberId)),
  },

  Reviews: {
    useListReviews: (params, options = {}) =>
      createQuery("listReviews", customerServices.listReviews, params, {
        staleTime: LIST_STALE_TIME,
        ...options,
      }),

    useUpdateReview: () =>
      createMutation("updateReview", ({ id, ...body }) => customerServices.updateReview(id, body)),

    useDeleteReview: () =>
      createMutation("deleteReview", (id) => customerServices.deleteReview(id)),
  },

  Notifications: {
    useListNotifications: (params, options = {}) =>
      createQuery("listNotifications", customerServices.listNotifications, params, {
        staleTime: LIST_STALE_TIME,
        ...options,
      }),

    useGetUnreadNotificationCount: (options = {}) =>
      createQuery("getUnreadNotificationCount", customerServices.getUnreadNotificationCount, {
        staleTime: LIST_STALE_TIME,
        ...options,
      }),

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
