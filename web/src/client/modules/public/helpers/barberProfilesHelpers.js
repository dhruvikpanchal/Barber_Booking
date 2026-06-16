import { SERVICE_CATALOG } from "@/config/catalog/services.js";
import {
  BARBER_PROFILE_DETAILS,
  DEFAULT_PROFILE,
} from "@/client/modules/public/data/barberProfilesData.js";
/**
 * @param {{ serviceIds: string[] }} barber
 */
export function resolveOfferedServices(serviceIds) {
  return serviceIds.map((id) => SERVICE_CATALOG.find((s) => s.id === id)).filter(Boolean);
}

/**
 * @param {import('./barbersHelpers.js').barbers[number]} base
 */
export function enrichBarberProfile(base) {
  const details = BARBER_PROFILE_DETAILS[base.id] ?? DEFAULT_PROFILE;
  return {
    ...base,
    bio: details.bio,
    gallery: details.gallery,
    workingHours: details.workingHours,
    reviews: details.reviews,
    ratingBreakdown: details.ratingBreakdown,
    offeredServices: resolveOfferedServices(base.serviceIds),
  };
}
