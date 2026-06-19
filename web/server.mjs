import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import { initSocketServer } from "./src/server/infra/socket/server.ts";

const hostname = process.env.HOSTNAME ?? "0.0.0.0";
const port = Number.parseInt(process.env.PORT ?? "3000", 10);

const app = next({ dev: true, hostname, port, dir: process.cwd() });
const handle = app.getRequestHandler();

await app.prepare();

const httpServer = createServer(async (req, res) => {
  try {
    const parsedUrl = parse(req.url ?? "", true);
    await handle(req, res, parsedUrl);
  } catch (error) {
    console.error("[server] request error", req.url, error);
    res.statusCode = 500;
    res.end("Internal server error");
  }
});

initSocketServer(httpServer);

httpServer.listen(port, hostname, () => {
  console.log(`> Ready on http://${hostname}:${port} (development, socket.io enabled)`);
});
