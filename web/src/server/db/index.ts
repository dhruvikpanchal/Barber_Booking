import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

/**
 * Neon + postgres.js client.
 * `prepare: false` is recommended for serverless / pooled connections.
 */
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });

/** Close the pooled connection (for scripts such as seed). */
export async function closeDb() {
  await client.end({ timeout: 5 });
}

export * from "./schema";
export * from "./enums";
