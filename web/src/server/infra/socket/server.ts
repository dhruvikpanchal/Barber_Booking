import type { Server as HttpServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { verifyAccessToken } from "@/server/infra/auth/jwt";
import { barberProfileRepository } from "@/server/modules/barber/repository";
import { ROLES, type Role } from "@/server/modules/shared/constants/roles";
import { setSocketIO } from "@/server/infra/socket/store";

function isRole(value: string): value is Role {
  return value === ROLES.ADMIN || value === ROLES.BARBER || value === ROLES.CUSTOMER;
}

export function initSocketServer(httpServer: HttpServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    path: "/socket.io",
    cors: {
      origin: false,
    },
    transports: ["websocket", "polling"],
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token || typeof token !== "string") {
      next(new Error("Authentication required"));
      return;
    }

    try {
      const payload = verifyAccessToken(token);
      if (!isRole(payload.role)) {
        next(new Error("Invalid role"));
        return;
      }

      socket.data.user = { id: payload.sub, role: payload.role };
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const user = socket.data.user as { id: string; role: Role };
    socket.join(`user:${user.id}`);
    socket.join(`role:${user.role}`);

    if (user.role === ROLES.BARBER) {
      const handshakeBarberId = socket.handshake.auth?.barberId;
      let barberId =
        typeof handshakeBarberId === "string" && handshakeBarberId ? handshakeBarberId : null;

      if (!barberId) {
        try {
          const profile = await barberProfileRepository.findIdByUserId(user.id);
          barberId = profile?.id ?? null;
        } catch (error) {
          console.error("[socket] failed to resolve barber profile", error);
        }
      }

      if (barberId) socket.join(`barber:${barberId}`);
    }
  });

  setSocketIO(io);
  return io;
}
