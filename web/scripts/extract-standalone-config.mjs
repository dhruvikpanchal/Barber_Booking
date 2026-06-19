import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");
const serverEntry = join(standaloneDir, "server.js");
const configDest = join(standaloneDir, "next-standalone-config.json");

if (!existsSync(serverEntry)) {
  console.warn("[extract-standalone-config] No standalone server found; skipping.");
  process.exit(0);
}

const serverJs = readFileSync(serverEntry, "utf8");
const marker = "const nextConfig = ";
const start = serverJs.indexOf(marker);

if (start === -1) {
  console.error("[extract-standalone-config] Could not locate nextConfig in server.js");
  process.exit(1);
}

const configStart = start + marker.length;
const configEnd = serverJs.indexOf("\n\nprocess.env.__NEXT_PRIVATE_STANDALONE_CONFIG", configStart);

if (configEnd === -1) {
  console.error("[extract-standalone-config] Could not locate config terminator in server.js");
  process.exit(1);
}

const configSource = serverJs.slice(configStart, configEnd);
const nextConfig = new Function(`return (${configSource})`)();

writeFileSync(configDest, JSON.stringify(nextConfig));
console.log("[extract-standalone-config] Wrote next-standalone-config.json");
