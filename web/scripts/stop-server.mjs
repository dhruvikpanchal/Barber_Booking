import { execSync } from "node:child_process";

const ports = [3000, 3001, 3002, 3003];
const stopped = new Set();

for (const port of ports) {
  if (process.platform !== "win32") continue;

  try {
    const output = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });

    for (const line of output.split(/\r?\n/)) {
      if (!line.includes("LISTENING")) continue;
      const pid = line.trim().split(/\s+/).at(-1);
      if (!pid || !/^\d+$/.test(pid) || pid === "0" || stopped.has(pid)) continue;

      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        stopped.add(pid);
        console.log(`[stop] Stopped PID ${pid} (port ${port}).`);
      } catch {
        // Already stopped.
      }
    }
  } catch {
    // No listener on this port.
  }
}

if (stopped.size === 0) {
  console.log("[stop] No local app server found on ports 3000–3003.");
} else {
  console.log("[stop] Server stopped. You can now run `npm run build`.");
}
