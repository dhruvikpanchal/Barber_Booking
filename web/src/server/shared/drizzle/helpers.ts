import { ilike, or, type SQL } from "drizzle-orm";
import type { AnyColumn } from "drizzle-orm";

export function contains(column: AnyColumn, value: string): SQL {
  return ilike(column, `%${escapeIlike(value)}%`);
}

export function containsAny(columns: AnyColumn[], value: string): SQL | undefined {
  if (!value) return undefined;
  const pattern = `%${escapeIlike(value)}%`;
  return or(...columns.map((column) => ilike(column, pattern)));
}

function escapeIlike(value: string): string {
  return value.replace(/[%_\\]/g, "\\$&");
}
