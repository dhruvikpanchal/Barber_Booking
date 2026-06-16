import { db } from "@/server/db";
import { sql } from "drizzle-orm";

let lastCheck: { ok: boolean; checkedAt: number; message?: string } | null = null;
const CACHE_MS = 15_000;

export async function checkDatabaseHealth(force = false) {
  const now = Date.now();
  if (!force && lastCheck && now - lastCheck.checkedAt < CACHE_MS) {
    return lastCheck;
  }

  try {
    await db.execute(sql`SELECT 1`);
    lastCheck = { ok: true, checkedAt: now };
    return lastCheck;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    lastCheck = { ok: false, checkedAt: now, message };
    return lastCheck;
  }
}
