import "dotenv/config";
import { ensureDefaultBarberChairs } from "../src/server/modules/barber/repository.ts";
import { closeDb } from "../src/server/db/index.ts";

const barberId = process.argv[2] ?? "3a83d17f-4f7e-468f-94af-b1d272d79ad7";

try {
  await ensureDefaultBarberChairs(barberId);
  console.log("Default chairs ensured for", barberId);
} finally {
  await closeDb();
}
