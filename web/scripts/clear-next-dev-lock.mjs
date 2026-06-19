import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const devDir = join(root, ".next", "dev");
const lockFile = join(devDir, "lock");

if (existsSync(lockFile)) {
  try {
    rmSync(lockFile, { force: true });
    console.log("[predev] Cleared stale Next.js dev lock.");
  } catch (error) {
    console.warn("[predev] Could not clear dev lock:", error);
  }
}
