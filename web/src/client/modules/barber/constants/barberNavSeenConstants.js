import { routes } from "@/config/routes/routes.js";

/** Server nav-badge section keys (POST /barber/nav-badges/seen). */
export const BARBER_NAV_SECTIONS = {
  appointments: "appointments",
  queue: "queue",
  reviews: "reviews",
};

/** Map barber routes (including detail pages) to nav-badge sections. */
export const BARBER_NAV_ROUTE_SECTIONS = {
  [routes.barber.appointments]: BARBER_NAV_SECTIONS.appointments,
  [routes.barber.queue]: BARBER_NAV_SECTIONS.queue,
  [routes.barber.reviews]: BARBER_NAV_SECTIONS.reviews,
};

/** Map nav-badge sections to sidebar route hrefs. */
export const BARBER_NAV_SECTION_ROUTES = {
  [BARBER_NAV_SECTIONS.appointments]: routes.barber.appointments,
  [BARBER_NAV_SECTIONS.queue]: routes.barber.queue,
  [BARBER_NAV_SECTIONS.reviews]: routes.barber.reviews,
};

/**
 * Resolve the nav-badge section for the current pathname.
 * Returns null when the route does not track actionable badges.
 */
export function resolveBarberNavSection(pathname = "") {
  if (!pathname) return null;

  const entries = Object.entries(BARBER_NAV_ROUTE_SECTIONS).sort(
    (a, b) => b[0].length - a[0].length,
  );

  for (const [route, section] of entries) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return section;
    }
  }

  return null;
}
