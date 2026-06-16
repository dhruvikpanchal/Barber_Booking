import type { NextRequest } from "next/server";
import { appConfig } from "@/server/config";
import { customerService } from "@/server/modules/customer/service";
import {
  availableSlotsQuerySchema,
  bookingBarbersQuerySchema,
  cancelAppointmentSchema,
  confirmBookingSchema,
  createAppointmentSchema,
  createReviewSchema,
  customerAppointmentsQuerySchema,
  customerNotificationsQuerySchema,
  customerReviewsQuerySchema,
  dashboardQuerySchema,
  favoritesQuerySchema,
  requestServiceChangeSchema,
  updateCustomerProfileSchema,
  updateReviewSchema,
} from "@/server/modules/customer/schema";
import { created, noContent, ok, paginated } from "@/server/modules/shared/responses";
import type { AuthedRequest } from "@/server/modules/shared/types/request";
import { parseBody, parseQuery } from "@/server/modules/shared/validation";
import { ValidationError } from "@/server/modules/shared/helpers/AppError";
import { userSettingsService } from "@/server/modules/shared/settings/service";
import { updatePasswordSchema } from "@/server/modules/shared/settings/schema";

const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function getUserId(req: NextRequest): string {
  const user = (req as AuthedRequest).user;
  if (!user?.id) throw new ValidationError("Authentication required");
  return user.id;
}

async function parseProfilePhoto(req: NextRequest) {
  const form = await req.formData();
  const photoFile = form.get("photo");
  if (!photoFile || !(photoFile instanceof File) || photoFile.size === 0) {
    throw new ValidationError("Photo file is required");
  }
  if (photoFile.size > appConfig.auth.maxPhotoBytes) {
    throw new ValidationError("Photo must be 4 MB or smaller");
  }
  if (!ALLOWED_PHOTO_TYPES.has(photoFile.type)) {
    throw new ValidationError("Photo must be JPG, PNG, or WEBP");
  }
  const buffer = Buffer.from(await photoFile.arrayBuffer());
  return { buffer, mimeType: photoFile.type };
}

export const customerController = {
  // Profile  ·  /customer/profile
  async getProfile(req: NextRequest) {
    const data = await customerService.getProfile(getUserId(req));
    return ok(data);
  },

  async updateProfile(req: NextRequest) {
    const input = await parseBody(req, updateCustomerProfileSchema);
    const data = await customerService.updateProfile(getUserId(req), input);
    return ok(data);
  },

  async uploadProfilePhoto(req: NextRequest) {
    const file = await parseProfilePhoto(req);
    const data = await customerService.uploadProfilePhoto(getUserId(req), file);
    return ok(data);
  },

  // Dashboard  ·  /customer/dashboard
  async getDashboard(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, dashboardQuerySchema);
    const data = await customerService.getDashboard(getUserId(req), query);
    return ok(data);
  },

  // Appointments  ·  /customer/appointments
  async listAppointments(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, customerAppointmentsQuerySchema);
    const { items, meta } = await customerService.listAppointments(getUserId(req), query);
    return paginated(items, meta);
  },

  async getAppointment(req: NextRequest, appointmentId: string) {
    const data = await customerService.getAppointment(getUserId(req), appointmentId);
    return ok(data);
  },

  async createAppointment(req: NextRequest) {
    const input = await parseBody(req, createAppointmentSchema);
    const data = await customerService.createAppointment(getUserId(req), input);
    return created(data);
  },

  async cancelAppointment(req: NextRequest, appointmentId: string) {
    const input = await parseBody(req, cancelAppointmentSchema);
    const data = await customerService.cancelAppointment(getUserId(req), appointmentId, input);
    return ok(data);
  },

  async requestServiceChange(req: NextRequest, appointmentId: string) {
    const input = await parseBody(req, requestServiceChangeSchema);
    const data = await customerService.requestServiceChange(getUserId(req), appointmentId, input);
    return created(data);
  },

  // Booking wizard  ·  /customer/booking/*
  async listBookingBarbers(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, bookingBarbersQuerySchema);
    const { items, meta } = await customerService.listBookingBarbers(query);
    return paginated(items, meta);
  },

  async listBookingServices(_req: NextRequest, slug: string) {
    const data = await customerService.listBookingServices(slug);
    return ok(data);
  },

  async getAvailableSlots(req: NextRequest, slug: string) {
    const query = parseQuery(req.nextUrl.searchParams, availableSlotsQuerySchema);
    const data = await customerService.getAvailableSlots(slug, query);
    return ok(data);
  },

  async confirmBooking(req: NextRequest) {
    const input = await parseBody(req, confirmBookingSchema);
    const data = await customerService.confirmBooking(getUserId(req), input);
    return created(data);
  },

  // Favorites  ·  /customer/favorites
  async listFavorites(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, favoritesQuerySchema);
    const data = await customerService.listFavorites(getUserId(req), query);
    return ok(data);
  },

  async addFavorite(req: NextRequest, barberId: string) {
    const data = await customerService.addFavorite(getUserId(req), barberId);
    return created(data);
  },

  async removeFavorite(req: NextRequest, barberId: string) {
    await customerService.removeFavorite(getUserId(req), barberId);
    return noContent();
  },

  // Reviews  ·  /customer/reviews
  async listReviews(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, customerReviewsQuerySchema);
    const { items, meta } = await customerService.listReviews(getUserId(req), query);
    return paginated(items, meta);
  },

  async createReview(req: NextRequest, appointmentId: string) {
    const input = await parseBody(req, createReviewSchema);
    const data = await customerService.createReviewForAppointment(
      getUserId(req),
      appointmentId,
      input,
    );
    return created(data);
  },

  async updateReview(req: NextRequest, reviewId: string) {
    const input = await parseBody(req, updateReviewSchema);
    const data = await customerService.updateReview(getUserId(req), reviewId, input);
    return ok(data);
  },

  async deleteReview(req: NextRequest, reviewId: string) {
    await customerService.deleteReview(getUserId(req), reviewId);
    return noContent();
  },

  // Notifications  ·  /customer/notifications
  async listNotifications(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, customerNotificationsQuerySchema);
    const { items, meta } = await customerService.listNotifications(getUserId(req), query);
    return paginated(items, meta);
  },

  async getUnreadNotificationCount(req: NextRequest) {
    const data = await customerService.getUnreadNotificationCount(getUserId(req));
    return ok(data);
  },

  async markNotificationRead(req: NextRequest, notificationId: string) {
    const data = await customerService.markNotificationRead(getUserId(req), notificationId);
    return ok(data);
  },

  async markAllNotificationsRead(req: NextRequest) {
    const data = await customerService.markAllNotificationsRead(getUserId(req));
    return ok(data);
  },

  async deleteNotification(req: NextRequest, notificationId: string) {
    await customerService.deleteNotification(getUserId(req), notificationId);
    return noContent();
  },

  // Settings  ·  /customer/settings
  async updatePassword(req: NextRequest) {
    const input = await parseBody(req, updatePasswordSchema);
    const data = await userSettingsService.updatePassword(getUserId(req), input);
    return ok(data);
  },

  async deleteAccount(req: NextRequest) {
    await userSettingsService.deleteAccount(getUserId(req));
    return noContent();
  },
};
