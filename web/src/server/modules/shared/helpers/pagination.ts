export function getSkipTake(page: number, limit: number) {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}

/** @deprecated Use getSkipTake — kept for incremental migration */
export const getPrismaSkipTake = getSkipTake;

export function buildPaginationMeta(total: number, page: number, limit: number) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
