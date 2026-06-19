/** Application-wide settings (not secrets). */
import { regionConfig } from "@/server/config/region";

export const appConfig = {
  name: "Iron & Oak",
  region: regionConfig,
  apiPrefix: "/api/v1",
  defaultPagination: {
    page: 1,
    limit: 20,
    maxLimit: 100,
  },
  cloudinary: {
    defaultFolder: "barber-booking",
  },
  mail: {
    passwordResetExpiresMinutes: 30,
    appointmentReminderHoursBefore: 24,
  },
  auth: {
    avatarFolder: "barber-booking/avatars",
    maxPhotoBytes: 4 * 1024 * 1024,
  },
} as const;
