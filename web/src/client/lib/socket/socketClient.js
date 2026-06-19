import { getAccessToken } from "@/lib/axios";
import { getStoredUser, getPortalRoleFromToken, isTokenExpired } from "@/client/lib/auth/session.js";

let socket = null;
let connectPromise = null;
let connectedToken = null;

function resolveBarberId() {
  const user = getStoredUser();
  return user?.barberId ?? user?.barber?.id ?? user?.profile?.id ?? null;
}

function buildAuthPayload(token) {
  const barberId = getPortalRoleFromToken(token) === "barber" ? resolveBarberId() : null;
  return {
    token,
    ...(barberId ? { barberId } : {}),
  };
}

export function isSocketConnected() {
  return Boolean(socket?.connected);
}

export function disconnectSocket() {
  if (!socket) {
    connectedToken = null;
    return;
  }
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
  connectPromise = null;
  connectedToken = null;
}

export async function connectSocket() {
  const token = getAccessToken();
  if (!token || isTokenExpired(token)) {
    disconnectSocket();
    return null;
  }

  if (socket?.connected && connectedToken === token) return socket;

  if (socket && connectedToken !== token) {
    disconnectSocket();
  }

  if (connectPromise) return connectPromise;

  connectPromise = import("socket.io-client")
    .then(({ io }) => {
      socket = io({
        path: "/socket.io",
        auth: (cb) => {
          const currentToken = getAccessToken();
          if (!currentToken || isTokenExpired(currentToken)) {
            cb({ token: null });
            return;
          }
          cb(buildAuthPayload(currentToken));
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      socket.on("connect", () => {
        connectedToken = getAccessToken();
      });

      socket.on("connect_error", (error) => {
        if (
          error?.message === "Authentication required" ||
          error?.message === "Invalid token" ||
          error?.message === "Invalid role"
        ) {
          disconnectSocket();
        }
      });

      return socket;
    })
    .finally(() => {
      connectPromise = null;
    });

  return connectPromise;
}

export function getSocket() {
  return socket;
}
