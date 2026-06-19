import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);
process.env.NODE_ENV = "development";

await import(pathToFileURL(join(root, "server.mjs")).href);
