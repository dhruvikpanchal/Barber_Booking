import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

const url = process.env.DATABASE_URL?.replace("@localhost", "@127.0.0.1");
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const migrationsDir = join(process.cwd(), "src/server/db/migrations");
const journal = JSON.parse(
  readFileSync(join(migrationsDir, "meta/_journal.json"), "utf8"),
);

function migrationHash(tag) {
  const sql = readFileSync(join(migrationsDir, `${tag}.sql`), "utf8");
  return createHash("sha256").update(sql).digest("hex");
}

const APPLIED_CHECKS = {
  "0000_init": async (sql) => {
    const [row] = await sql`
      SELECT 1 AS ok
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'users'
      LIMIT 1
    `;
    return Boolean(row);
  },
  "0001_admin_nav_seen": async (sql) => {
    const [row] = await sql`
      SELECT 1 AS ok
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'admin_nav_seen'
      LIMIT 1
    `;
    return Boolean(row);
  },
  "0002_barber_nav_seen": async (sql) => {
    const [row] = await sql`
      SELECT 1 AS ok
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'barber_nav_seen'
      LIMIT 1
    `;
    return Boolean(row);
  },
  "0003_new_customer_review_notification": async (sql) => {
    const [row] = await sql`
      SELECT 1 AS ok
      FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'notification_type'
        AND e.enumlabel = 'NEW_CUSTOMER_REVIEW'
      LIMIT 1
    `;
    return Boolean(row);
  },
};

async function applyMigrationFile(sql, tag) {
  const content = readFileSync(join(migrationsDir, `${tag}.sql`), "utf8");
  const statements = content
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.unsafe(statement);
  }
}

const db = postgres(url);

try {
  await db`CREATE SCHEMA IF NOT EXISTS drizzle`;
  await db`
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `;

  const applied = await db`
    SELECT hash FROM drizzle.__drizzle_migrations ORDER BY created_at
  `;
  const appliedHashes = new Set(applied.map((row) => row.hash));

  for (const entry of journal.entries) {
    const tag = entry.tag;
    const hash = migrationHash(tag);
    if (appliedHashes.has(hash)) {
      console.log(`skip ${tag} (already recorded)`);
      continue;
    }

    const check = APPLIED_CHECKS[tag];
    const isApplied = check ? await check(db) : false;
    if (!isApplied) {
      console.log(`apply ${tag}...`);
      await applyMigrationFile(db, tag);
    } else {
      console.log(`baseline ${tag} (schema already present)`);
    }

    await db`
      INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
      VALUES (${hash}, ${Date.now()})
    `;
    appliedHashes.add(hash);
    console.log(`recorded ${tag}`);
  }

  console.log("Migration baseline complete.");
} catch (error) {
  console.error("baseline failed:", error);
  process.exit(1);
} finally {
  await db.end();
}
