import {
  get,
  patch,
  post,
  del,
  getPaginated,
} from "@/client/modules/shared/helpers/servicesHelper";

export const adminServices = {
  // Dashboard & analytics
  getDashboard: (params) => get("/admin/dashboard", params),

  getAnalytics: (params) => get("/admin/analytics", params),

  // Reports
  listReports: (params) => getPaginated("/admin/reports", params),

  generateReport: (data) => post("/admin/reports/generate", data),

  // Appointments
  getAppointmentStats: () => get("/admin/appointments/stats"),

  listAppointments: (params) => getPaginated("/admin/appointments", params),

  getAppointment: (id) => get(`/admin/appointments/${id}`),

  updateAppointmentStatus: (id, data) => patch(`/admin/appointments/${id}/status`, data),

  // Barber requests
  getBarberRequestStats: () => get("/admin/barber-requests/stats"),

  listBarberRequests: (params) => getPaginated("/admin/barber-requests", params),

  getBarberRequest: (id) => get(`/admin/barber-requests/${id}`),

  approveBarberRequest: (id, data = {}) => post(`/admin/barber-requests/${id}/approve`, data),

  rejectBarberRequest: (id, data) => post(`/admin/barber-requests/${id}/reject`, data),

  // Barbers
  listBarbers: (params) => getPaginated("/admin/barbers", params),

  getBarber: (id) => get(`/admin/barbers/${id}`),

  updateBarberStatus: (id, data) => patch(`/admin/barbers/${id}`, data),

  deleteBarber: (id) => del(`/admin/barbers/${id}`),

  // Users
  listUsers: (params) => getPaginated("/admin/users", params),

  getUser: (id) => get(`/admin/users/${id}`),

  updateUserStatus: (id, data) => patch(`/admin/users/${id}`, data),

  deleteUser: (id) => del(`/admin/users/${id}`),

  // Contact messages
  getContactMessageStats: () => get("/admin/contact-messages/stats"),

  listContactMessages: (params) => getPaginated("/admin/contact-messages", params),

  getContactMessage: (id) => get(`/admin/contact-messages/${id}`),

  replyContactMessage: (id, data) => post(`/admin/contact-messages/${id}/reply`, data),

  updateContactMessage: (id, data) => patch(`/admin/contact-messages/${id}`, data),

  // Notifications
  listNotifications: (params) => getPaginated("/admin/notifications", params),

  getUnreadNotificationCount: () => get("/admin/notifications/unread-count"),

  markNotificationRead: (id, data) => patch(`/admin/notifications/${id}/read`, data),

  markAllNotificationsRead: () => post("/admin/notifications/read-all"),

  deleteNotification: (id) => del(`/admin/notifications/${id}`),

  // Profile
  getProfile: () => get("/admin/profile"),

  updateProfile: (data) => patch("/admin/profile", data),

  uploadProfilePhoto: (file) => {
    const form = new FormData();
    form.append("photo", file);
    return post("/admin/profile/photo", form);
  },

  // Settings
  getSettings: () => get("/admin/settings"),

  updatePassword: (data) => patch("/admin/settings/password", data),

  updateAlertPreferences: (data) => patch("/admin/settings/alerts", data),

  // Nav badges (sidebar actionable counts)
  getNavBadges: () => get("/admin/nav-badges"),

  markNavSectionSeen: (data) => post("/admin/nav-badges/seen", data),
};

export default adminServices;
