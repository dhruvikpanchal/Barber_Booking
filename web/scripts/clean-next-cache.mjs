import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const targets = [
  join(root, ".next", "cache"),
  join(root, ".next", "dev"),
];

for (const target of targets) {
  if (!existsSync(target)) continue;
  try {
    rmSync(target, { recursive: true, force: true });
    console.log(`[clean] Removed ${target}`);
  } catch (error) {
    console.warn(`[clean] Could not remove ${target}:`, error);
  }
}

console.log("[clean] Next.js cache cleared. Run `npm run build` before `npm run start`.");
