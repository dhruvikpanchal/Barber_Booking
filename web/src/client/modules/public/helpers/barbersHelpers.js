import { SERVICE_CATALOG } from "@/config/catalog/services.js";
import { enrichBarberProfile } from "@/client/modules/public/helpers/barberProfilesHelpers.js";
import { barbers } from "@/client/modules/public/data/barbersData.js";

export function resolveServiceNames(serviceIds = []) {
  return serviceIds.map((id) => SERVICE_CATALOG.find((s) => s.id === id)?.name).filter(Boolean);
}

/** @returns {ReturnType<typeof enrichBarberProfile> | undefined} */
export function getBarberById(id) {
  const base = barbers.find((b) => b.id === id);
  return base ? enrichBarberProfile(base) : undefined;
}
