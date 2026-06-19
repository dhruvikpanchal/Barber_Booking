import { routes } from "@/config/routes/routes.js";

/** Server nav-badge section keys (POST /admin/nav-badges/seen). */
export const ADMIN_NAV_SECTIONS = {
  barberRequests: "barber_requests",
  contactMessages: "contact_messages",
  users: "users",
  appointments: "appointments",
  barbers: "barbers",
};

/** Map admin routes (including detail pages) to nav-badge sections. */
export const ADMIN_NAV_ROUTE_SECTIONS = {
  [routes.admin.barberRequests]: ADMIN_NAV_SECTIONS.barberRequests,
  [routes.admin.contactMessages]: ADMIN_NAV_SECTIONS.contactMessages,
  [routes.admin.users]: ADMIN_NAV_SECTIONS.users,
  [routes.admin.appointments]: ADMIN_NAV_SECTIONS.appointments,
  [routes.admin.barbers]: ADMIN_NAV_SECTIONS.barbers,
};

/** Map nav-badge sections to sidebar route hrefs. */
export const ADMIN_NAV_SECTION_ROUTES = {
  [ADMIN_NAV_SECTIONS.barberRequests]: routes.admin.barberRequests,
  [ADMIN_NAV_SECTIONS.contactMessages]: routes.admin.contactMessages,
  [ADMIN_NAV_SECTIONS.users]: routes.admin.users,
  [ADMIN_NAV_SECTIONS.appointments]: routes.admin.appointments,
  [ADMIN_NAV_SECTIONS.barbers]: routes.admin.barbers,
};

/**
 * Resolve the nav-badge section for the current pathname.
 * Returns null when the route does not track actionable badges.
 */
export function resolveAdminNavSection(pathname = "") {
  if (!pathname) return null;

  const entries = Object.entries(ADMIN_NAV_ROUTE_SECTIONS).sort(
    (a, b) => b[0].length - a[0].length,
  );

  for (const [route, section] of entries) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return section;
    }
  }

  return null;
}
