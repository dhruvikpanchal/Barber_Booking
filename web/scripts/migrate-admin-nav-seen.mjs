import "dotenv/config";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL?.replace(/@localhost([:/])/g, "@127.0.0.1$1");
if (!connectionString) throw new Error("DATABASE_URL is not set");

const sql = postgres(connectionString, {
  prepare: false,
  ssl: connectionString.includes("neon.tech") ? "require" : undefined,
});

try {
  await sql`
    CREATE TABLE IF NOT EXISTS admin_nav_seen (
      id text PRIMARY KEY NOT NULL,
      admin_user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      section text NOT NULL,
      last_seen_at timestamptz NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL,
      CONSTRAINT admin_nav_seen_admin_user_id_section_unique UNIQUE(admin_user_id, section)
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS admin_nav_seen_admin_user_id_idx
    ON admin_nav_seen (admin_user_id)
  `;
  console.log("[migrate-admin-nav-seen] Table ready.");
} finally {
  await sql.end({ timeout: 5 });
}
