import "dotenv/config";
import postgres from "postgres";

function normalizeDatabaseUrl(url) {
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
  console.error("[check-db] DATABASE_URL is not set.");
  process.exit(1);
}

const strict = process.env.CHECK_DB_STRICT === "1";

const sql = postgres(connectionString, {
  prepare: false,
  max: 1,
  connect_timeout: 30,
});

try {
  const [row] = await sql`SELECT 1 AS ok`;
  console.log("[check-db] Connection successful.", row);
  await sql.end({ timeout: 5 });
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("[check-db] Connection failed:", message);
  console.error(
    "[check-db] Verify DATABASE_URL points to your PostgreSQL/Neon database and the instance is running.",
  );

  if (strict) {
    process.exit(1);
  }

  console.warn("[check-db] Starting without a confirmed database connection.");
}
