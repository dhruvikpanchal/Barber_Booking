import { BOOKING_BARBERS } from "@/modules/customer/data/bookingData.js";
import { SERVICE_CATALOG } from "@/config/catalog/services.js";
import { enrichBarberProfile } from "./barberProfiles.js";

function resolveServiceNames(serviceIds = []) {
  return serviceIds.map((id) => SERVICE_CATALOG.find((s) => s.id === id)?.name).filter(Boolean);
}

/** Public directory — aligned with booking barber records. */
export const barbers = BOOKING_BARBERS.map((b) => ({
  id: b.id,
  name: b.name,
  role: b.role,
  rating: b.rating,
  reviewCount: b.reviews,
  experience: b.experience,
  startingPrice: b.startingPrice,
  available: b.available,
  image: b.image,
  location: b.location,
  city: b.city,
  address: b.address,
  specialties: b.specialties,
  services: resolveServiceNames(b.services),
  serviceIds: b.services,
}));

/** @returns {ReturnType<typeof enrichBarberProfile> | undefined} */
export function getBarberById(id) {
  const base = barbers.find((b) => b.id === id);
  return base ? enrichBarberProfile(base) : undefined;
}
