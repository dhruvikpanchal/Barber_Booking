export const PUBLIC_HOME_STALE_MS = 60_000;
export const PUBLIC_LIST_STALE_MS = 30_000;
export const PUBLIC_DETAIL_STALE_MS = 30_000;
export const PUBLIC_CONTACT_STALE_MS = 60 * 60_000;

/** Reuse server-fetched React Query data without an immediate client refetch. */
export function ssrQueryOptions(initialData, overrides = {}) {
  if (initialData === undefined || initialData === null) {
    return overrides;
  }

  return {
    initialData,
    initialDataUpdatedAt: Date.now(),
    staleTime: PUBLIC_LIST_STALE_MS,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...overrides,
  };
}
