import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function normalizeDatabaseUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "localhost") {
      parsed.hostname = "127.0.0.1";
    }
    return parsed.toString();
  } catch {
    return url.replace(/@localhost([:/])/g, "@127.0.0.1$1");
  }
}

const connectionString = process.env.DATABASE_URL
  ? normalizeDatabaseUrl(process.env.DATABASE_URL)
  : undefined;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const useSsl =
  connectionString.includes("neon.tech") || connectionString.includes("sslmode=require");

/**
 * Neon + postgres.js client.
 * `prepare: false` is recommended for serverless / pooled connections.
 */
const client = postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 30,
  max_lifetime: 60 * 30,
  ...(useSsl ? { ssl: "require" } : {}),
});

export const db = drizzle(client, { schema });

/** Close the pooled connection (for scripts such as seed). */
export async function closeDb() {
  await client.end({ timeout: 5 });
}

export * from "./schema";
export * from "./enums";
