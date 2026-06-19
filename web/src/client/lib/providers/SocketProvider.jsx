"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  connectSocket,
  disconnectSocket,
  isSocketConnected,
} from "@/client/lib/socket/socketClient.js";
import { REALTIME_EVENT } from "@/client/lib/socket/events.js";
import { invalidateFromRealtime } from "@/client/lib/socket/realtimeInvalidation.js";
import { getNotificationsHref } from "@/client/config/routes/notificationRoutes.js";
import {
  getPortalRoleFromToken,
  hasValidSession,
} from "@/client/lib/auth/session.js";
import { getAccessToken } from "@/lib/axios";

const SocketContext = createContext({
  connected: false,
  reconnect: () => {},
});

function isOnNotificationsPage(pathname, role) {
  const href = getNotificationsHref(role);
  if (!href || href === "#") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function useSocketConnected() {
  return useContext(SocketContext).connected;
}

export function useSocketReconnect() {
  return useContext(SocketContext).reconnect;
}

export default function SocketProvider({ children }) {
  const pathname = usePathname() || "";
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const reconnect = useCallback(async () => {
    disconnectSocket();
    socketRef.current = null;
    const socket = await connectSocket();
    socketRef.current = socket;
    setConnected(Boolean(socket?.connected));
  }, []);

  useEffect(() => {
    let active = true;

    const teardownSocket = () => {
      const socket = socketRef.current;
      if (!socket) return;
      socket.off("connect");
      socket.off("disconnect");
      socket.off(REALTIME_EVENT.INVALIDATE);
      socketRef.current = null;
      disconnectSocket();
    };

    const bindSocket = async () => {
      teardownSocket();

      if (!hasValidSession()) {
        if (active) setConnected(false);
        return;
      }

      const socket = await connectSocket();
      if (!active || !socket) {
        if (active) setConnected(false);
        return;
      }

      socketRef.current = socket;

      const onConnect = () => {
        if (active) setConnected(true);
      };
      const onDisconnect = () => {
        if (active) setConnected(false);
      };
      const onInvalidate = (payload) => {
        const role = getPortalRoleFromToken(getAccessToken());
        if (!role) return;
        void invalidateFromRealtime(queryClient, role, payload);

        const toastPayload = payload?.toast;
        if (!toastPayload?.title) return;
        if (isOnNotificationsPage(pathnameRef.current, role)) return;

        toast.info(toastPayload.title, {
          description: toastPayload.message,
        });
      };

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on(REALTIME_EVENT.INVALIDATE, onInvalidate);
      setConnected(socket.connected);
    };

    void bindSocket();

    const onAuthChange = () => {
      void bindSocket();
    };

    window.addEventListener("storage", onAuthChange);
    window.addEventListener("io:user-updated", onAuthChange);
    window.addEventListener("io:auth-updated", onAuthChange);

    return () => {
      active = false;
      window.removeEventListener("storage", onAuthChange);
      window.removeEventListener("io:user-updated", onAuthChange);
      window.removeEventListener("io:auth-updated", onAuthChange);
      teardownSocket();
      setConnected(false);
    };
  }, [queryClient]);

  const value = useMemo(
    () => ({
      connected,
      reconnect,
    }),
    [connected, reconnect],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useRealtimeReady() {
  return isSocketConnected();
}
