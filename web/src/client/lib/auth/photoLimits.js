/** Matches server `appConfig.auth.maxPhotoBytes` and allowed MIME types. */
export const PROFILE_PHOTO_MAX_BYTES = 4 * 1024 * 1024;
export const PROFILE_PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";

const PROFILE_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateProfilePhoto(file) {
  if (!file) return "Photo file is required";
  if (!PROFILE_PHOTO_TYPES.has(file.type)) return "Photo must be JPG, PNG, or WEBP";
  if (file.size > PROFILE_PHOTO_MAX_BYTES) return "Photo must be 4 MB or smaller";
  return null;
}
