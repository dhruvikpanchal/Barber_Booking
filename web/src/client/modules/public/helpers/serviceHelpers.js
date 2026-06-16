import { Scissors } from "lucide-react";
import { CATEGORY_ICONS, SERVICE_ICONS } from "../constants/serviceConstants.js";
import { services } from "../data/servicesData.js";

/**
 * Enriches a service object with its corresponding category icon.
 * @param {object} service - The service object.
 * @returns {object} The service object enriched with an icon component.
 */
export function enrichService(service) {
  if (!service) return null;
  const Icon = CATEGORY_ICONS[service.category] ?? Scissors;
  return { ...service, icon: Icon };
}

/**
 * Attaches the specific or category icon to a service object.
 * @param {object} service - The service object.
 * @returns {object} The service object enriched with its icon component.
 */
export function attachIcon(service) {
  if (!service) return null;
  const Icon = SERVICE_ICONS[service.id] ?? CATEGORY_ICONS[service.category] ?? Scissors;
  return { ...service, icon: Icon };
}

/**
 * Retrieves a service by its unique slug/ID from the local mock services data.
 * @param {string} slug - The service ID.
 * @returns {object|null} The service object, or null if not found.
 */
export function getServiceById(slug) {
  return services.find((s) => s.id === slug) ?? null;
}
