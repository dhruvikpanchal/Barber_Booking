import { BARBER_NAV_SECTION_ROUTES } from "@/client/modules/barber/constants/barberNavSeenConstants.js";

/**
 * Build route → count map from GET /barber/nav-badges response.
 * @param {{ counts?: Record<string, number> } | null | undefined} data
 */
export function barberNavBadgeCountsToRoutes(data) {
  const counts = data?.counts ?? {};
  const byRoute = {};

  for (const [section, route] of Object.entries(BARBER_NAV_SECTION_ROUTES)) {
    const value = Number(counts[section]);
    byRoute[route] = Number.isFinite(value) && value > 0 ? value : 0;
  }

  return byRoute;
}
