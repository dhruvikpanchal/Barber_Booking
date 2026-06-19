import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);
process.env.NODE_ENV = "production";

const standaloneServer = join(root, ".next", "standalone", "server.js");
const standaloneConfig = join(root, ".next", "standalone", "next-standalone-config.json");

if (!existsSync(standaloneServer) || !existsSync(standaloneConfig)) {
  console.error("[start] Standalone production build missing. Run `npm run build` first.");
  process.exit(1);
}

await import(pathToFileURL(join(root, "server.prod.mjs")).href);
