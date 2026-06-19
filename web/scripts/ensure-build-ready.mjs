import { execSync } from "node:child_process";
import { closeSync, existsSync, openSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standaloneDir = join(root, ".next", "standalone");
const ports = [3000, 3001, 3002, 3003];

function findListeningPids(port) {
  if (process.platform !== "win32") return [];

  try {
    const output = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
    const pids = new Set();

    for (const line of output.split(/\r?\n/)) {
      if (!line.includes("LISTENING")) continue;
      const parts = line.trim().split(/\s+/);
      const pid = parts.at(-1);
      if (pid && /^\d+$/.test(pid) && pid !== "0") {
        pids.add(pid);
      }
    }

    return [...pids];
  } catch {
    return [];
  }
}

function stopListeningServers() {
  const pids = new Set();
  for (const port of ports) {
    for (const pid of findListeningPids(port)) {
      pids.add(pid);
    }
  }

  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
      console.log(`[prebuild] Stopped process ${pid} that was listening on a dev port.`);
    } catch {
      // Process may have already exited.
    }
  }
}

function standaloneDirIsLocked() {
  if (!existsSync(standaloneDir)) return false;

  const probe = join(standaloneDir, ".build-lock-probe");
  try {
    const fd = openSync(probe, "wx");
    closeSync(fd);
    unlinkSync(probe);
    return false;
  } catch (error) {
    return error && typeof error === "object" && "code" in error && error.code === "EBUSY";
  }
}

stopListeningServers();

if (standaloneDirIsLocked()) {
  console.error(
    "[prebuild] `.next/standalone` is locked (usually `npm run start` or `npm run dev` is still running).",
  );
  console.error("[prebuild] Stop the server (Ctrl+C), or run `npm run stop`, then retry `npm run build`.");
  process.exit(1);
}
