/**
 * Build a compact page list for pagination controls, e.g. [1, "…", 4, 5, 6, "…", 20].
 */
export function buildPaginationRange(page, totalPages, siblingCount = 1) {
  if (totalPages <= 1) return [1];

  const range = new Set([1, totalPages, page]);
  for (let i = page - siblingCount; i <= page + siblingCount; i += 1) {
    if (i >= 1 && i <= totalPages) range.add(i);
  }

  const sorted = [...range].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length; i += 1) {
    const current = sorted[i];
    const prev = sorted[i - 1];
    if (i > 0 && current - prev > 1) {
      result.push("…");
    }
    result.push(current);
  }

  return result;
}
