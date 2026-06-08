import type { NextRequest } from "next/server";
import { adminService } from "@/server/modules/admin/service";
import {
  adminAnalyticsQuerySchema,
  adminAppointmentsQuerySchema,
  adminBarberRequestsQuerySchema,
  adminBarbersQuerySchema,
  adminContactMessagesQuerySchema,
  adminDashboardQuerySchema,
  adminNotificationsQuerySchema,
  adminReportsQuerySchema,
  adminUpdateAppointmentStatusSchema,
  adminUpdateBarberStatusSchema,
  adminUpdateUserStatusSchema,
  adminUsersQuerySchema,
  approveBarberRequestSchema,
  generateReportSchema,
  markAdminNotificationReadSchema,
  rejectBarberRequestSchema,
  replyContactMessageSchema,
  updateAdminAlertPreferencesSchema,
  updateAdminPasswordSchema,
  updateAdminProfileSchema,
  updateContactMessageSchema,
  updateMaintenanceSettingsSchema,
} from "@/server/modules/admin/schema";
import { created, ok, paginated } from "@/server/shared/responses";
import type { AuthedRequest } from "@/server/shared/types/request";
import { parseBody, parseBodyOrEmpty, parseQuery } from "@/server/shared/validation";
import { ValidationError } from "@/server/shared/errors/AppError";

function getUserId(req: NextRequest): string {
  const user = (req as AuthedRequest).user;
  if (!user?.id) throw new ValidationError("Authentication required");
  return user.id;
}

export const adminController = {
  // Dashboard  ·  GET /api/v1/admin/dashboard
  async getDashboard(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, adminDashboardQuerySchema);
    const data = await adminService.getDashboard(getUserId(req), query);
    return ok(data);
  },

  // Analytics  ·  GET /api/v1/admin/analytics
  async getAnalytics(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, adminAnalyticsQuerySchema);
    const data = await adminService.getAnalytics(getUserId(req), query);
    return ok(data);
  },

  // Reports  ·  GET /api/v1/admin/reports
  async listReports(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, adminReportsQuerySchema);
    const { items, meta } = await adminService.listReports(getUserId(req), query);
    return paginated(items, meta);
  },

  async generateReport(req: NextRequest) {
    const input = await parseBody(req, generateReportSchema);
    const data = await adminService.generateReport(getUserId(req), input);
    return created(data);
  },

  // Appointments  ·  GET /api/v1/admin/appointments
  async getAppointmentStats(req: NextRequest) {
    void req;
    const data = await adminService.getAppointmentStats();
    return ok(data);
  },

  async listAppointments(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, adminAppointmentsQuerySchema);
    const { items, meta } = await adminService.listAppointments(getUserId(req), query);
    return paginated(items, meta);
  },

  async getAppointment(req: NextRequest, id: string) {
    const data = await adminService.getAppointment(getUserId(req), id);
    return ok(data);
  },

  async updateAppointmentStatus(req: NextRequest, id: string) {
    const input = await parseBody(req, adminUpdateAppointmentStatusSchema);
    const data = await adminService.updateAppointmentStatus(getUserId(req), id, input);
    return ok(data);
  },

  // Barber requests  ·  /api/v1/admin/barber-requests
  async getBarberRequestStats(req: NextRequest) {
    void req;
    const data = await adminService.getBarberRequestStats();
    return ok(data);
  },

  async listBarberRequests(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, adminBarberRequestsQuerySchema);
    const { items, meta } = await adminService.listBarberRequests(getUserId(req), query);
    return paginated(items, meta);
  },

  async getBarberRequest(req: NextRequest, id: string) {
    const data = await adminService.getBarberRequest(getUserId(req), id);
    return ok(data);
  },

  async approveBarberRequest(req: NextRequest, id: string) {
    const input = await parseBodyOrEmpty(req, approveBarberRequestSchema, { note: "" });
    const data = await adminService.approveBarberRequest(getUserId(req), id, input);
    return ok(data);
  },

  async rejectBarberRequest(req: NextRequest, id: string) {
    const input = await parseBody(req, rejectBarberRequestSchema);
    const data = await adminService.rejectBarberRequest(getUserId(req), id, input);
    return ok(data);
  },

  // Barbers  ·  /api/v1/admin/barbers
  async listBarbers(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, adminBarbersQuerySchema);
    const { items, meta } = await adminService.listBarbers(getUserId(req), query);
    return paginated(items, meta);
  },

  async getBarber(req: NextRequest, id: string) {
    const data = await adminService.getBarber(getUserId(req), id);
    return ok(data);
  },

  async updateBarberStatus(req: NextRequest, id: string) {
    const input = await parseBody(req, adminUpdateBarberStatusSchema);
    const data = await adminService.updateBarberStatus(getUserId(req), id, input);
    return ok(data);
  },

  async deleteBarber(req: NextRequest, id: string) {
    const data = await adminService.deleteBarber(getUserId(req), id);
    return ok(data);
  },

  // Users  ·  /api/v1/admin/users
  async listUsers(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, adminUsersQuerySchema);
    const { items, meta } = await adminService.listUsers(getUserId(req), query);
    return paginated(items, meta);
  },

  async getUser(req: NextRequest, id: string) {
    const data = await adminService.getUser(getUserId(req), id);
    return ok(data);
  },

  async updateUserStatus(req: NextRequest, id: string) {
    const input = await parseBody(req, adminUpdateUserStatusSchema);
    const data = await adminService.updateUserStatus(getUserId(req), id, input);
    return ok(data);
  },

  async deleteUser(req: NextRequest, id: string) {
    const data = await adminService.deleteUser(getUserId(req), id);
    return ok(data);
  },

  // Contact messages  ·  /api/v1/admin/contact-messages
  async getContactMessageStats(req: NextRequest) {
    void req;
    const data = await adminService.getContactMessageStats();
    return ok(data);
  },

  async listContactMessages(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, adminContactMessagesQuerySchema);
    const { items, meta } = await adminService.listContactMessages(getUserId(req), query);
    return paginated(items, meta);
  },

  async getContactMessage(req: NextRequest, id: string) {
    const data = await adminService.getContactMessage(getUserId(req), id);
    return ok(data);
  },

  async replyContactMessage(req: NextRequest, id: string) {
    const input = await parseBody(req, replyContactMessageSchema);
    const data = await adminService.replyContactMessage(getUserId(req), id, input);
    return ok(data);
  },

  async updateContactMessage(req: NextRequest, id: string) {
    const input = await parseBody(req, updateContactMessageSchema);
    const data = await adminService.updateContactMessage(getUserId(req), id, input);
    return ok(data);
  },

  // Notifications  ·  /api/v1/admin/notifications
  async listNotifications(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, adminNotificationsQuerySchema);
    const { items, meta } = await adminService.listNotifications(getUserId(req), query);
    return paginated(items, meta);
  },

  async getUnreadNotificationCount(req: NextRequest) {
    const data = await adminService.getUnreadNotificationCount(getUserId(req));
    return ok(data);
  },

  async markNotificationRead(req: NextRequest, id: string) {
    const input = await parseBody(req, markAdminNotificationReadSchema);
    const data = await adminService.markNotificationRead(getUserId(req), id, input);
    return ok(data);
  },

  async markAllNotificationsRead(req: NextRequest) {
    const data = await adminService.markAllNotificationsRead(getUserId(req));
    return ok(data);
  },

  // Profile  ·  /api/v1/admin/profile
  async getProfile(req: NextRequest) {
    const data = await adminService.getProfile(getUserId(req));
    return ok(data);
  },

  async updateProfile(req: NextRequest) {
    const input = await parseBody(req, updateAdminProfileSchema);
    const data = await adminService.updateProfile(getUserId(req), input);
    return ok(data);
  },

  // Settings  ·  /api/v1/admin/settings
  async getSettings(req: NextRequest) {
    void req;
    const data = adminService.getSettings();
    return ok(data);
  },

  async updateMaintenanceSettings(req: NextRequest) {
    const input = await parseBody(req, updateMaintenanceSettingsSchema);
    const data = adminService.updateMaintenanceSettings(input);
    return ok(data);
  },

  async updatePassword(req: NextRequest) {
    const input = await parseBody(req, updateAdminPasswordSchema);
    const data = await adminService.updatePassword(getUserId(req), input);
    return ok(data);
  },

  async updateAlertPreferences(req: NextRequest) {
    const input = await parseBody(req, updateAdminAlertPreferencesSchema);
    const data = adminService.updateAlertPreferences(input);
    return ok(data);
  },
};
