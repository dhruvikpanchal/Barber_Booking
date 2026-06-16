import { unstable_cache } from "next/cache";
import { NotFoundError } from "@/server/modules/shared/helpers/AppError";
import { isDatabaseUnavailable } from "@/server/modules/shared/helpers/errorHandler";
import { publicService } from "@/server/modules/public/service";

const EMPTY_HOME = {
  shops: [],
  barbers: [],
  services: [],
  testimonials: [],
};

const EMPTY_BARBERS_LIST = {
  items: [],
  meta: { total: 0, page: 1, limit: 50, totalPages: 1 },
};

async function withDatabaseFallback<T>(
  label: string,
  fn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      console.warn(`[serverFetch] ${label}: database unavailable, using fallback data.`);
      return fallback;
    }
    throw error;
  }
}

export const getCachedHome = unstable_cache(
  () => withDatabaseFallback("getCachedHome", () => publicService.getHome(), EMPTY_HOME),
  ["public-home"],
  { revalidate: 60 },
);

export const getCachedBarbersList = unstable_cache(
  () =>
    withDatabaseFallback(
      "getCachedBarbersList",
      () => publicService.listBarbers({ page: 1, limit: 50, sort: "rating", available: undefined }),
      EMPTY_BARBERS_LIST,
    ),
  ["public-barbers-list"],
  { revalidate: 30 },
);

export function getCachedBarberBySlug(slug: string) {
  return unstable_cache(
    async () => {
      try {
        return await publicService.getBarberBySlug(slug);
      } catch (error) {
        if (error instanceof NotFoundError) return null;
        if (isDatabaseUnavailable(error)) {
          console.warn(`[serverFetch] getCachedBarberBySlug(${slug}): database unavailable.`);
          return null;
        }
        throw error;
      }
    },
    ["public-barber", slug],
    { revalidate: 30 },
  )();
}
