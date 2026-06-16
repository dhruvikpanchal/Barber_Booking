import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");
const serverEntry = join(standaloneDir, "server.js");

if (!existsSync(serverEntry)) {
  console.warn("[prepare-standalone] No standalone server found; skipping asset copy.");
  process.exit(0);
}

const staticSrc = join(root, ".next", "static");
const staticDest = join(standaloneDir, ".next", "static");
const publicSrc = join(root, "public");
const publicDest = join(standaloneDir, "public");
const envSrc = join(root, ".env");
const envDest = join(standaloneDir, ".env");

if (!existsSync(staticSrc)) {
  console.error("[prepare-standalone] Missing .next/static. Run `npm run build` first.");
  process.exit(1);
}

mkdirSync(join(standaloneDir, ".next"), { recursive: true });
cpSync(staticSrc, staticDest, { recursive: true });

if (existsSync(publicSrc)) {
  cpSync(publicSrc, publicDest, { recursive: true });
}

if (existsSync(envSrc)) {
  cpSync(envSrc, envDest);
}

console.log("[prepare-standalone] Copied static assets into standalone output.");
