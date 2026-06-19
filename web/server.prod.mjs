import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { initSocketServer } from "./src/server/infra/socket/server.ts";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)));
const standaloneDir = join(projectRoot, ".next", "standalone");
const standaloneServer = join(standaloneDir, "server.js");
const standaloneConfig = join(standaloneDir, "next-standalone-config.json");

if (!existsSync(standaloneServer)) {
  console.error("[server] Standalone build missing. Run `npm run build` first.");
  process.exit(1);
}

if (!existsSync(standaloneConfig)) {
  console.error("[server] Standalone config missing. Run `npm run build` to regenerate.");
  process.exit(1);
}

process.env.NODE_ENV = "production";

const nextConfig = JSON.parse(readFileSync(standaloneConfig, "utf8"));
process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(nextConfig);

const standaloneRequire = createRequire(standaloneServer);
standaloneRequire("next");

const { getRequestHandlers } = standaloneRequire("next/dist/server/lib/start-server");

const hostname = process.env.HOSTNAME ?? "0.0.0.0";
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const keepAliveTimeout = Number.parseInt(process.env.KEEP_ALIVE_TIMEOUT ?? "", 10);

let handlersReady = () => {};
let handlersError = () => {};
const handlersPromise = new Promise((resolve, reject) => {
  handlersReady = resolve;
  handlersError = reject;
});

let requestHandler = async (req, res) => {
  if (handlersPromise) {
    await handlersPromise;
    return requestHandler(req, res);
  }
  res.statusCode = 503;
  res.end("Server not ready");
};

let upgradeHandler = async (req, socket, head) => {
  if (handlersPromise) {
    await handlersPromise;
    return upgradeHandler(req, socket, head);
  }
  socket.destroy();
};

const httpServer = createServer(async (req, res) => {
  try {
    await requestHandler(req, res);
  } catch (error) {
    console.error("[server] request error", req.url, error);
    res.statusCode = 500;
    res.end("Internal server error");
  }
});

if (Number.isFinite(keepAliveTimeout) && keepAliveTimeout >= 0) {
  httpServer.keepAliveTimeout = keepAliveTimeout;
}

httpServer.on("upgrade", async (req, socket, head) => {
  try {
    await upgradeHandler(req, socket, head);
  } catch (error) {
    console.error("[server] upgrade error", req.url, error);
    socket.destroy();
  }
});

initSocketServer(httpServer);

httpServer.on("listening", async () => {
  try {
    const initResult = await getRequestHandlers({
      dir: standaloneDir,
      port,
      isDev: false,
      server: httpServer,
      hostname,
      keepAliveTimeout: Number.isFinite(keepAliveTimeout) ? keepAliveTimeout : undefined,
    });

    requestHandler = initResult.requestHandler;
    upgradeHandler = initResult.upgradeHandler;
    handlersReady();

    const addr = httpServer.address();
    const boundPort = typeof addr === "object" && addr ? addr.port : port;
    console.log(`> Ready on http://${hostname}:${boundPort} (production/standalone, socket.io enabled)`);
  } catch (error) {
    handlersError(error);
    console.error("[server] failed to initialize Next.js handlers", error);
    process.exit(1);
  }
});

httpServer.on("error", (error) => {
  console.error("[server] failed to start", error);
  process.exit(1);
});

httpServer.listen(port, hostname);
