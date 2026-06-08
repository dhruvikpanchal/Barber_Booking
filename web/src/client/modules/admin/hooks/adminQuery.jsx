import { createQuery, createMutation } from "@/client/modules/shared/hooks/useTanstack.js";
import { adminServices } from "@/client/modules/admin/service/adminServices.jsx";

export const adminHook = {
  Dashboard: {
    useDashboard: () => createQuery("dashboard", adminServices.getDashboard),
  },

  Analytics: {
    useAnalytics: () => createQuery("analytics", adminServices.getAnalytics),
  },

  Reports: {
    useListReports: (params) => createQuery("reports", adminServices.listReports, params),

    useGenerateReport: (data) =>
      createMutation("generateReport", adminServices.generateReport, data),
  },

  Appointments: {
    useAppointmentStats: () => createQuery("appointmentStats", adminServices.getAppointmentStats),

    useListAppointments: (params) =>
      createQuery("appointments", adminServices.listAppointments, params),

    useAppointment: (id) => createQuery("appointment", adminServices.getAppointment, id),

    useUpdateAppointmentStatus: (id, data) =>
      createMutation("updateAppointmentStatus", adminServices.updateAppointmentStatus, id, data),
  },

  BarberRequests: {
    useBarberRequestStats: () =>
      createQuery("barberRequestStats", adminServices.getBarberRequestStats),

    useListBarberRequests: (params) =>
      createQuery("barberRequests", adminServices.listBarberRequests, params),

    useBarberRequest: (id) => createQuery("barberRequest", adminServices.getBarberRequest, id),

    useApproveBarberRequest: (id, data) =>
      createMutation("approveBarberRequest", adminServices.approveBarberRequest, id, data),

    useRejectBarberRequest: (id, data) =>
      createMutation("rejectBarberRequest", adminServices.rejectBarberRequest, id, data),
  },

  Barbers: {
    useListBarbers: (params) => createQuery("barbers", adminServices.listBarbers, params),

    useBarber: (id) => createQuery("barber", adminServices.getBarber, id),

    useUpdateBarberStatus: (id, data) =>
      createMutation("updateBarberStatus", adminServices.updateBarberStatus, id, data),

    useDeleteBarber: (id) => createMutation("deleteBarber", adminServices.deleteBarber, id),
  },

  Users: {
    useListUsers: (params) => createQuery("users", adminServices.listUsers, params),

    useUser: (id) => createQuery("user", adminServices.getUser, id),

    useUpdateUserStatus: (id, data) =>
      createMutation("updateUserStatus", adminServices.updateUserStatus, id, data),

    useDeleteUser: (id) => createMutation("deleteUser", adminServices.deleteUser, id),
  },

  ContactMessages: {
    useContactMessageStats: () =>
      createQuery("contactMessageStats", adminServices.getContactMessageStats),

    useListContactMessages: (params) =>
      createQuery("contactMessages", adminServices.listContactMessages, params),

    useContactMessage: (id) => createQuery("contactMessage", adminServices.getContactMessage, id),

    useReplyContactMessage: (id, data) =>
      createMutation("replyContactMessage", adminServices.replyContactMessage, id, data),

    useUpdateContactMessage: (id, data) =>
      createMutation("updateContactMessage", adminServices.updateContactMessage, id, data),
  },

  Notifications: {
    useListNotifications: (params) =>
      createQuery("notifications", adminServices.listNotifications, params),

    useUnreadNotificationCount: () =>
      createQuery("unreadNotificationCount", adminServices.getUnreadNotificationCount),

    useMarkNotificationRead: (id, data) =>
      createMutation("markNotificationRead", adminServices.markNotificationRead, id, data),

    useMarkAllNotificationsRead: () =>
      createMutation("markAllNotificationsRead", adminServices.markAllNotificationsRead),
  },

  Profile: {
    useProfile: () => createQuery("profile", adminServices.getProfile),

    useUpdateProfile: (data) => createMutation("updateProfile", adminServices.updateProfile, data),
  },

  Settings: {
    useSettings: () => createQuery("settings", adminServices.getSettings),

    useUpdateMaintenanceSettings: (data) =>
      createMutation("updateMaintenanceSettings", adminServices.updateMaintenanceSettings, data),

    useUpdatePassword: (data) =>
      createMutation("updatePassword", adminServices.updatePassword, data),

    useUpdateAlertPreferences: (data) =>
      createMutation("updateAlertPreferences", adminServices.updateAlertPreferences, data),
  },
};
