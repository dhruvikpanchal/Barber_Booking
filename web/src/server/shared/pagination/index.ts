import { z } from "zod";
import { appConfig } from "@/server/config";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(appConfig.defaultPagination.page),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(appConfig.defaultPagination.maxLimit)
    .default(appConfig.defaultPagination.limit),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export function parsePagination(searchParams: URLSearchParams): PaginationParams {
  return paginationSchema.parse({
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });
}

/** @alias parsePagination */
export const getPaginationParams = parsePagination;

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): { total: number; page: number; limit: number; totalPages: number } {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 0,
  };
}

export function getPrismaSkipTake(page: number, limit: number): { skip: number; take: number } {
  return { skip: (page - 1) * limit, take: limit };
}
