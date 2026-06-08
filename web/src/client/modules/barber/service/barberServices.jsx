import { get, patch, post, put, del } from "@/client/modules/shared/helpers/servicesHelper";

export const barberServices = {
  // Profile
  getProfile: () => get("/barber/profile"), //

  updateProfile: (data) => patch("/barber/profile", data), //

  uploadPhoto: (file) => {
    const form = new FormData();
    form.append("photo", file);
    return post("/barber/profile/photo", form);
  }, //

  addGalleryImage: (data) => post("/barber/profile/gallery", data), //

  updateGalleryImage: (id, data) => patch(`/barber/profile/gallery/${id}`, data), //

  deleteGalleryImage: (id) => del(`/barber/profile/gallery/${id}`), //

  // Services
  listServices: (params) => get("/barber/services", params), //

  createService: (data) => post("/barber/services", data), //

  updateService: (id, data) => patch(`/barber/services/${id}`, data), //

  toggleService: (id, data) => patch(`/barber/services/${id}/toggle`, data), //

  deleteService: (id) => del(`/barber/services/${id}`), //

  // Schedule
  getSchedule: () => get("/barber/schedule"), //

  saveSchedule: (data) => put("/barber/schedule", data), //

  addUnavailableDate: (data) => post("/barber/schedule/unavailable-dates", data), //

  removeUnavailableDate: (date) => del(`/barber/schedule/unavailable-dates/${date}`), //

  // Appointments — { appointments, stats, meta }
  listAppointments: (params) => get("/barber/appointments", params), //

  getAppointment: (id) => get(`/barber/appointments/${id}`), //

  updateAppointmentStatus: (id, data) => patch(`/barber/appointments/${id}/status`, data), //

  rescheduleAppointment: (id, data) => patch(`/barber/appointments/${id}/reschedule`, data), //

  respondServiceChange: (appointmentId, reqId, data) =>
    patch(`/barber/appointments/${appointmentId}/service-change/${reqId}`, data), //

  // Queue — snapshot DTO
  getQueue: (params) => get("/barber/queue", params), //

  addToQueue: (data) => post("/barber/queue", data), //

  updateQueueStatus: (id, data) => patch(`/barber/queue/${id}/status`, data), //

  assignChair: (id, data) => patch(`/barber/queue/${id}/chair`, data), //

  removeFromQueue: (id) => del(`/barber/queue/${id}`), //

  // Walk-ins — array of walk-in DTOs
  listWalkIns: (params) => get("/barber/walk-ins", params), //

  createWalkIn: (data) => post("/barber/walk-ins", data), //

  updateWalkInStatus: (id, data) => patch(`/barber/walk-ins/${id}/status`, data), //

  // Reviews — { reviews, ratingBreakdown, meta }
  listReviews: (params) => get("/barber/reviews", params), //

  getReview: (id) => get(`/barber/reviews/${id}`), //

  replyToReview: (id, data) => patch(`/barber/reviews/${id}/reply`, data), //

  // Analytics
  getAnalytics: (params) => get("/barber/analytics", params), //

  // Notifications — { notifications, summary, meta }
  listNotifications: (params) => get("/barber/notifications", params), //

  markNotificationRead: (id, data = {}) => patch(`/barber/notifications/${id}/read`, data), //

  markAllNotificationsRead: () => post("/barber/notifications/read-all"), //

  // Dashboard
  getDashboard: (params) => get("/barber/dashboard", params), //
};

export default barberServices;
