import { createQuery, createMutation } from "@/client/modules/shared/hooks/useTanstack.js";

import { adminServices } from "@/client/modules/admin/services/adminServices.jsx";

export const adminHook = {
  Dashboard: {
    useDashboard: (params) => createQuery("dashboard", adminServices.getDashboard, params),
  },

  Analytics: {
    useAnalytics: (params) => createQuery("analytics", adminServices.getAnalytics, params),
  },

  Reports: {
    useListReports: (params) => createQuery("reports", adminServices.listReports, params),

    useGenerateReport: () => createMutation("generateReport", adminServices.generateReport),
  },

  Appointments: {
    useAppointmentStats: () => createQuery("appointmentStats", adminServices.getAppointmentStats),

    useListAppointments: (params) =>
      createQuery("appointments", adminServices.listAppointments, params),

    useAppointment: (id) => createQuery("appointment", adminServices.getAppointment, id),

    useUpdateAppointmentStatus: () =>
      createMutation("updateAppointmentStatus", ({ id, ...data }) =>
        adminServices.updateAppointmentStatus(id, data),
      ),
  },

  BarberRequests: {
    useBarberRequestStats: () =>
      createQuery("barberRequestStats", adminServices.getBarberRequestStats),

    useListBarberRequests: (params) =>
      createQuery("barberRequests", adminServices.listBarberRequests, params),

    useBarberRequest: (id) => createQuery("barberRequest", adminServices.getBarberRequest, id),

    useApproveBarberRequest: () =>
      createMutation("approveBarberRequest", ({ id, ...data }) =>
        adminServices.approveBarberRequest(id, data),
      ),

    useRejectBarberRequest: () =>
      createMutation("rejectBarberRequest", ({ id, ...data }) =>
        adminServices.rejectBarberRequest(id, data),
      ),
  },

  Barbers: {
    useListBarbers: (params) => createQuery("barbers", adminServices.listBarbers, params),

    useBarber: (id) => createQuery("barber", adminServices.getBarber, id),

    useUpdateBarberStatus: () =>
      createMutation("updateBarberStatus", ({ id, ...data }) =>
        adminServices.updateBarberStatus(id, data),
      ),

    useDeleteBarber: () => createMutation("deleteBarber", (id) => adminServices.deleteBarber(id)),
  },

  Users: {
    useListUsers: (params) => createQuery("users", adminServices.listUsers, params),

    useUser: (id) => createQuery("user", adminServices.getUser, id),

    useUpdateUserStatus: () =>
      createMutation("updateUserStatus", ({ id, ...data }) =>
        adminServices.updateUserStatus(id, data),
      ),

    useDeleteUser: () => createMutation("deleteUser", (id) => adminServices.deleteUser(id)),
  },

  ContactMessages: {
    useContactMessageStats: () =>
      createQuery("contactMessageStats", adminServices.getContactMessageStats),

    useListContactMessages: (params) =>
      createQuery("contactMessages", adminServices.listContactMessages, params),

    useContactMessage: (id) => createQuery("contactMessage", adminServices.getContactMessage, id),

    useReplyContactMessage: () =>
      createMutation("replyContactMessage", ({ id, ...data }) =>
        adminServices.replyContactMessage(id, data),
      ),

    useUpdateContactMessage: () =>
      createMutation("updateContactMessage", ({ id, ...data }) =>
        adminServices.updateContactMessage(id, data),
      ),
  },

  Notifications: {
    useListNotifications: (params) =>
      createQuery("notifications", adminServices.listNotifications, params),

    useUnreadNotificationCount: () =>
      createQuery("unreadNotificationCount", adminServices.getUnreadNotificationCount),

    useMarkNotificationRead: () =>
      createMutation("markNotificationRead", ({ id, ...data }) =>
        adminServices.markNotificationRead(id, data),
      ),

    useMarkAllNotificationsRead: () =>
      createMutation("markAllNotificationsRead", adminServices.markAllNotificationsRead),
  },

  Profile: {
    useProfile: () => createQuery("profile", adminServices.getProfile),

    useUpdateProfile: () => createMutation("updateProfile", adminServices.updateProfile),
  },

  Settings: {
    useSettings: () => createQuery("settings", adminServices.getSettings),

    useUpdateMaintenanceSettings: () =>
      createMutation("updateMaintenanceSettings", adminServices.updateMaintenanceSettings),

    useUpdatePassword: () => createMutation("updatePassword", adminServices.updatePassword),

    useUpdateAlertPreferences: () =>
      createMutation("updateAlertPreferences", adminServices.updateAlertPreferences),
  },
};
