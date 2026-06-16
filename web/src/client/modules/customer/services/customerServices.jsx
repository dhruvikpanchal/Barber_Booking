import {
  get,
  patch,
  post,
  del,
  getPaginated,
} from "@/client/modules/shared/helpers/servicesHelper";

export const customerServices = {
  // Profile
  getProfile: () => get("/customer/profile"),

  updateProfile: (data) => patch("/customer/profile", data),

  uploadProfilePhoto: (file) => {
    const form = new FormData();
    form.append("photo", file);
    return post("/customer/profile/photo", form);
  },

  // Dashboard
  getDashboard: (params) => get("/customer/dashboard", params),

  // Appointments
  listAppointments: (params) => getPaginated("/customer/appointments", params),

  getAppointment: (id) => get(`/customer/appointments/${id}`),

  cancelAppointment: (id, body = {}) => post(`/customer/appointments/${id}/cancel`, body),

  requestServiceChange: (id, body) => post(`/customer/appointments/${id}/service-change`, body),

  createReviewForAppointment: (id, body) => post(`/customer/appointments/${id}/review`, body),

  // Booking
  listBookingBarbers: (params) => getPaginated("/customer/booking/barbers", params),

  listBookingServices: (slug) => get(`/customer/booking/barbers/${slug}/services`),

  getAvailableSlots: (slug, params) =>
    get(`/customer/booking/barbers/${slug}/available-slots`, params),

  confirmBooking: (body) => post("/customer/booking/confirm", body),

  // Favorites
  listFavorites: (params) => get("/customer/favorites", params),

  addFavorite: (barberId) => post(`/customer/favorites/${barberId}`),

  removeFavorite: (barberId) => del(`/customer/favorites/${barberId}`),

  // Reviews
  listReviews: (params) => getPaginated("/customer/reviews", params),

  updateReview: (id, body) => patch(`/customer/reviews/${id}`, body),

  deleteReview: (id) => del(`/customer/reviews/${id}`),

  // Notifications
  listNotifications: (params) => getPaginated("/customer/notifications", params),

  getUnreadNotificationCount: () => get("/customer/notifications/unread-count"),

  markNotificationRead: (id) => patch(`/customer/notifications/${id}/read`),

  markAllNotificationsRead: () => post("/customer/notifications/read-all"),

  deleteNotification: (id) => del(`/customer/notifications/${id}`),

  updatePassword: (data) => patch("/customer/settings/password", data),

  deleteAccount: () => del("/customer/settings/account"),
};

export default customerServices;
