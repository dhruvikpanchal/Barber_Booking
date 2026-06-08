import type { NextRequest } from "next/server";
import { appConfig } from "@/server/config";
import { ok, created, noContent } from "@/server/shared/responses";
import { parseBody, parseQuery } from "@/server/shared/validation";
import { ValidationError } from "@/server/shared/errors/AppError";
import type { AuthedRequest } from "@/server/shared/types/request";
import {
  barberProfileService,
  barberServicesService,
  barberScheduleService,
  barberAppointmentsService,
  barberQueueService,
  barberWalkInsService,
  barberReviewsService,
  barberAnalyticsService,
  barberNotificationsService,
  barberDashboardService,
} from "@/server/modules/barber/service";
import {
  updateProfileSchema,
  addGalleryImageSchema,
  updateGalleryImageSchema,
  createServiceSchema,
  updateServiceSchema,
  toggleServiceSchema,
  servicesQuerySchema,
  saveScheduleSchema,
  addUnavailableDateSchema,
  unavailableDateParamSchema,
  updateAppointmentStatusSchema,
  rescheduleAppointmentSchema,
  respondServiceChangeSchema,
  appointmentsQuerySchema,
  addToQueueSchema,
  updateQueueStatusSchema,
  assignChairSchema,
  queueQuerySchema,
  createWalkInSchema,
  updateWalkInStatusSchema,
  walkInsQuerySchema,
  replyToReviewSchema,
  reviewsQuerySchema,
  analyticsQuerySchema,
  markNotificationReadSchema,
  notificationsQuerySchema,
  dashboardQuerySchema,
} from "@/server/modules/barber/schema";

// SHARED HELPERS
/** Extract the authenticated userId from the request — set by withAuth middleware. */
function getUserId(req: NextRequest): string {
  return (req as AuthedRequest).user!.id;
}

const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

async function parsePhotoUpload(
  req: NextRequest,
  field = "photo",
): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const formData = await req.formData();
  const file = formData.get(field);

  if (!file || !(file instanceof File) || file.size === 0) return null;

  if (file.size > appConfig.auth.maxPhotoBytes) {
    throw new ValidationError(
      `Photo must be ${appConfig.auth.maxPhotoBytes / (1024 * 1024)} MB or smaller`,
    );
  }

  if (!ALLOWED_PHOTO_TYPES.has(file.type)) {
    throw new ValidationError("Photo must be JPG, PNG, or WEBP");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return { buffer, mimeType: file.type };
}

export const barberController = {
  // PROFILE  ·  /api/v1/barber/profile
  async getProfile(req: NextRequest) {
    const userId = getUserId(req);
    const data = await barberProfileService.getProfile(userId);
    return ok(data);
  },

  async updateProfile(req: NextRequest) {
    const userId = getUserId(req);
    const input = await parseBody(req, updateProfileSchema);
    const data = await barberProfileService.updateProfile(userId, input);
    return ok(data);
  },

  async uploadPhoto(req: NextRequest) {
    const userId = getUserId(req);
    const photo = await parsePhotoUpload(req, "photo");

    if (!photo) {
      throw new ValidationError("No photo file attached");
    }

    const data = await barberProfileService.uploadProfilePhoto(
      userId,
      photo.buffer,
      photo.mimeType,
    );
    return ok(data);
  },

  async addGalleryImage(req: NextRequest) {
    const userId = getUserId(req);
    const input = await parseBody(req, addGalleryImageSchema);
    const data = await barberProfileService.addGalleryImage(userId, input);
    return created(data);
  },

  async updateGalleryImage(req: NextRequest, id: string) {
    const userId = getUserId(req);
    const input = await parseBody(req, updateGalleryImageSchema);
    const data = await barberProfileService.updateGalleryImage(userId, id, input);
    return ok(data);
  },

  async deleteGalleryImage(req: NextRequest, id: string) {
    const userId = getUserId(req);
    await barberProfileService.deleteGalleryImage(userId, id);
    return noContent();
  },

  // SERVICES  ·  /api/v1/barber/services
  async listServices(req: NextRequest) {
    const userId = getUserId(req);
    const query = parseQuery(req.nextUrl.searchParams, servicesQuerySchema);
    const data = await barberServicesService.listServices(userId, query);
    return ok(data);
  },

  async createService(req: NextRequest) {
    const userId = getUserId(req);
    const input = await parseBody(req, createServiceSchema);
    const data = await barberServicesService.createService(userId, input);
    return created(data);
  },

  async updateService(req: NextRequest, id: string) {
    const userId = getUserId(req);
    const input = await parseBody(req, updateServiceSchema);
    const data = await barberServicesService.updateService(userId, id, input);
    return ok(data);
  },

  async toggleService(req: NextRequest, id: string) {
    const userId = getUserId(req);
    const input = await parseBody(req, toggleServiceSchema);
    const data = await barberServicesService.toggleService(userId, id, input);
    return ok(data);
  },

  async deleteService(req: NextRequest, id: string) {
    const userId = getUserId(req);
    await barberServicesService.deleteService(userId, id);
    return noContent();
  },

  // SCHEDULE  ·  /api/v1/barber/schedule
  async getSchedule(req: NextRequest) {
    const userId = getUserId(req);
    const data = await barberScheduleService.getSchedule(userId);
    return ok(data);
  },

  async saveSchedule(req: NextRequest) {
    const userId = getUserId(req);
    const input = await parseBody(req, saveScheduleSchema);
    const data = await barberScheduleService.saveSchedule(userId, input);
    return ok(data);
  },

  async addUnavailableDate(req: NextRequest) {
    const userId = getUserId(req);
    const input = await parseBody(req, addUnavailableDateSchema);
    const data = await barberScheduleService.addUnavailableDate(userId, input.date);
    return ok(data);
  },

  async removeUnavailableDate(req: NextRequest, date: string) {
    const userId = getUserId(req);
    const { date: validDate } = unavailableDateParamSchema.parse({ date });
    const data = await barberScheduleService.removeUnavailableDate(userId, validDate);
    return ok(data);
  },

  // APPOINTMENTS  ·  /api/v1/barber/appointments
  async listAppointments(req: NextRequest) {
    const userId = getUserId(req);
    const query = parseQuery(req.nextUrl.searchParams, appointmentsQuerySchema);
    const data = await barberAppointmentsService.listAppointments(userId, query);
    return ok(data);
  },

  async getAppointment(req: NextRequest, id: string) {
    const userId = getUserId(req);
    const data = await barberAppointmentsService.getAppointmentDetail(userId, id);
    return ok(data);
  },

  async updateAppointementStatus(req: NextRequest, id: string) {
    const userId = getUserId(req);
    const input = await parseBody(req, updateAppointmentStatusSchema);
    const data = await barberAppointmentsService.updateStatus(userId, id, input);
    return ok(data);
  },

  async reschedule(req: NextRequest, id: string) {
    const userId = getUserId(req);
    const input = await parseBody(req, rescheduleAppointmentSchema);
    const data = await barberAppointmentsService.rescheduleAppointment(userId, id, input);
    return ok(data);
  },

  async respondServiceChange(req: NextRequest, id: string, reqId: string) {
    const userId = getUserId(req);
    const input = await parseBody(req, respondServiceChangeSchema);
    const data = await barberAppointmentsService.respondToServiceChange(userId, id, reqId, input);
    return ok(data);
  },

  // QUEUE  ·  /api/v1/barber/queue
  async getQueue(req: NextRequest) {
    const userId = getUserId(req);
    const query = parseQuery(req.nextUrl.searchParams, queueQuerySchema);
    const data = await barberQueueService.getQueue(userId, query);
    return ok(data);
  },

  async addToQueue(req: NextRequest) {
    const userId = getUserId(req);
    const input = await parseBody(req, addToQueueSchema);
    const data = await barberQueueService.addToQueue(userId, input);
    return created(data);
  },

  async updateQueueStatus(req: NextRequest, id: string) {
    const userId = getUserId(req);
    const input = await parseBody(req, updateQueueStatusSchema);
    const data = await barberQueueService.updateQueueStatus(userId, id, input);
    return ok(data);
  },

  async assignChair(req: NextRequest, id: string) {
    const userId = getUserId(req);
    const input = await parseBody(req, assignChairSchema);
    const data = await barberQueueService.assignChair(userId, id, input);
    return ok(data);
  },

  async removeFromQueue(req: NextRequest, id: string) {
    const userId = getUserId(req);
    await barberQueueService.removeFromQueue(userId, id);
    return noContent();
  },

  // WALK-INS  ·  /api/v1/barber/walk-ins
  async listWalkIns(req: NextRequest) {
    const userId = getUserId(req);
    const query = parseQuery(req.nextUrl.searchParams, walkInsQuerySchema);
    const data = await barberWalkInsService.listWalkIns(userId, query);
    return ok(data);
  },

  async createWalkIn(req: NextRequest) {
    const userId = getUserId(req);
    const input = await parseBody(req, createWalkInSchema);
    const data = await barberWalkInsService.createWalkIn(userId, input);
    return created(data);
  },

  async updateWalkInStatus(req: NextRequest, id: string) {
    const userId = getUserId(req);
    const input = await parseBody(req, updateWalkInStatusSchema);
    const data = await barberWalkInsService.updateWalkInStatus(userId, id, input);
    return ok(data);
  },

  // REVIEWS  ·  /api/v1/barber/reviews
  async listReviews(req: NextRequest) {
    const userId = getUserId(req);
    const query = parseQuery(req.nextUrl.searchParams, reviewsQuerySchema);
    const data = await barberReviewsService.listReviews(userId, query);
    return ok(data);
  },

  async getReview(req: NextRequest, id: string) {
    const userId = getUserId(req);
    const data = await barberReviewsService.getReviewDetail(userId, id);
    return ok(data);
  },

  async replyToReview(req: NextRequest, id: string) {
    const userId = getUserId(req);
    const input = await parseBody(req, replyToReviewSchema);
    const data = await barberReviewsService.replyToReview(userId, id, input);
    return ok(data);
  },

  // ANALYTICS  ·  /api/v1/barber/analytics
  async getAnalytics(req: NextRequest) {
    const userId = getUserId(req);
    const query = parseQuery(req.nextUrl.searchParams, analyticsQuerySchema);
    const data = await barberAnalyticsService.getAnalytics(userId, query);
    return ok(data);
  },

  // NOTIFICATIONS  ·  /api/v1/barber/notifications
  async listNotifications(req: NextRequest) {
    const userId = getUserId(req);
    const query = parseQuery(req.nextUrl.searchParams, notificationsQuerySchema);
    const data = await barberNotificationsService.listNotifications(userId, query);
    return ok(data);
  },

  async markRead(req: NextRequest, id: string) {
    const userId = getUserId(req);
    const input = await parseBody(req, markNotificationReadSchema);
    const data = await barberNotificationsService.markRead(userId, id, input);
    return ok(data);
  },

  async markAllRead(req: NextRequest) {
    const userId = getUserId(req);
    const data = await barberNotificationsService.markAllRead(userId);
    return ok(data);
  },

  // DASHBOARD  ·  /api/v1/barber/dashboard
  async getDashboard(req: NextRequest) {
    const userId = getUserId(req);
    const query = parseQuery(req.nextUrl.searchParams, dashboardQuerySchema);
    const data = await barberDashboardService.getDashboard(userId, query);
    return ok(data);
  },
};
