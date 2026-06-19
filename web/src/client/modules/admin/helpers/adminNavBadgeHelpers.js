import { ADMIN_NAV_SECTION_ROUTES } from "@/client/modules/admin/constants/adminNavSeenConstants.js";

/**
 * Build route → count map from GET /admin/nav-badges response.
 * @param {{ counts?: Record<string, number> } | null | undefined} data
 */
export function adminNavBadgeCountsToRoutes(data) {
  const counts = data?.counts ?? {};
  const byRoute = {};

  for (const [section, route] of Object.entries(ADMIN_NAV_SECTION_ROUTES)) {
    const value = Number(counts[section]);
    byRoute[route] = Number.isFinite(value) && value > 0 ? value : 0;
  }

  return byRoute;
}
