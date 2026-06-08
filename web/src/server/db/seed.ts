import "dotenv/config";

import { eq } from "drizzle-orm";
import { hashPassword } from "@/server/infrastructure/auth/password";
import { closeDb, db } from "@/server/db";
import { users } from "@/server/db/schema";
import { ROLES } from "@/server/shared/constants/roles";

const ADMIN_EMAIL = "admin@test.com";
const ADMIN_PASSWORD = "D1234567";

async function seed() {
  console.log("Seeding database...");

  const existing = await db.query.users.findFirst({
    where: eq(users.email, ADMIN_EMAIL),
  });

  if (existing) {
    console.log(`Admin user already exists (${ADMIN_EMAIL}), skipping.`);
    return;
  }

  const passwordHash = await hashPassword(ADMIN_PASSWORD);

  await db.insert(users).values({
    firstName: "AdminFirst",
    lastName: "AdminLast",
    fullName: "AdminFirst AdminLast",
    email: ADMIN_EMAIL,
    role: ROLES.ADMIN,
    passwordHash,
    emailVerified: true,
    isActive: true,
  });

  console.log("Seed completed.");
  console.log(`Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

seed()
  .then(() => closeDb())
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error(err);
    await closeDb();
    process.exit(1);
  });
