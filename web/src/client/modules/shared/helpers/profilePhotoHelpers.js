import { getStoredUser, patchStoredUser } from "@/client/lib/auth/session.js";
import { cacheBustUrl } from "@/client/lib/format/cacheBustUrl.js";
import {
  getProfileQueryKey,
  patchDashboardProfileCache,
  syncUserProfileEverywhere,
} from "@/client/lib/auth/profileCache.js";

export { cacheBustUrl } from "@/client/lib/format/cacheBustUrl.js";

export function extractPhotoUrl(result) {
  if (!result) return null;
  if (typeof result.photoUrl === "string") return result.photoUrl;
  if (typeof result.url === "string") return result.url;
  if (typeof result.data?.photoUrl === "string") return result.data.photoUrl;
  return null;
}

/** True only for a server-loaded customer profile (session placeholder lacks joinedAt). */
export function isCompleteCustomerProfile(data) {
  return Boolean(data?.id && data?.email && data?.joinedAt);
}

export function isCompleteAdminProfile(data) {
  return Boolean(data?.id && data?.email);
}

export function isCompleteBarberProfile(data) {
  return Boolean(data?.id && (data?.email || data?.userId));
}

export function mergeBarberProfileWithSession(dto) {
  if (!dto) return null;
  const stored = getStoredUser();
  return {
    ...dto,
    email: dto.email || stored?.email || "",
    firstName: dto.firstName || stored?.firstName || "",
    lastName: dto.lastName || stored?.lastName || "",
    fullName: dto.fullName || stored?.fullName || "",
    photoUrl: dto.photoUrl || stored?.photoUrl || "",
  };
}

export function mergeCustomerProfileWithSession(dto) {
  if (!dto) return null;
  const stored = getStoredUser();
  return {
    ...dto,
    email: dto.email || stored?.email || "",
    fullName: dto.fullName || stored?.fullName || "",
    phone: dto.phone ?? stored?.phone ?? "",
    address: dto.address ?? stored?.address ?? "",
  };
}

export function mergeAdminProfileWithSession(dto) {
  if (!dto) return null;
  const stored = getStoredUser();
  return {
    ...dto,
    email: dto.email || stored?.email || "",
    fullName: dto.fullName || stored?.fullName || "",
  };
}

export function patchProfilePhotoCache(queryClient, queryKey, photoUrl) {
  queryClient.setQueryData(queryKey, (current) =>
    current ? { ...current, photoUrl } : current,
  );
}

export function syncProfilePhotoEverywhere(queryClient, portalRole, photoUrl) {
  const displayUrl = cacheBustUrl(photoUrl);
  const queryKey = getProfileQueryKey(portalRole);
  const canonicalUrl = photoUrl.split("?")[0];

  let mergedProfile = null;
  queryClient.setQueryData(queryKey, (current) => {
    if (!current) return current;
    mergedProfile = { ...current, photoUrl: canonicalUrl };
    return mergedProfile;
  });

  patchStoredUser({ photoUrl: displayUrl });

  if (mergedProfile) {
    patchDashboardProfileCache(queryClient, portalRole, mergedProfile);
  }

  return displayUrl;
}

export function syncProfileAfterMutation(queryClient, portalRole, apiProfile) {
  syncUserProfileEverywhere(queryClient, portalRole, apiProfile);
}
