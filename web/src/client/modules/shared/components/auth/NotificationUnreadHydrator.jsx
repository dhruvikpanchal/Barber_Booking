"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { hasValidSession } from "@/client/lib/auth/session.js";
import { customerServices } from "@/client/modules/customer/services/customerServices.jsx";
import { adminServices } from "@/client/modules/admin/services/adminServices.jsx";

const UNREAD_STALE_TIME = 30_000;

const PREFETCHERS = {
  customer: {
    queryKey: ["getUnreadNotificationCount"],
    queryFn: () => customerServices.getUnreadNotificationCount(),
  },
  admin: {
    queryKey: ["unreadNotificationCount"],
    queryFn: () => adminServices.getUnreadNotificationCount(),
  },
};

/**
 * Prefetches the DB-backed unread notification count for the header bell on login.
 */
export default function NotificationUnreadHydrator({ role }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const config = PREFETCHERS[role];
    if (!config || !hasValidSession(role)) return undefined;

    function prefetchUnreadCount() {
      void queryClient.prefetchQuery({
        queryKey: config.queryKey,
        queryFn: config.queryFn,
        staleTime: UNREAD_STALE_TIME,
      });
    }

    prefetchUnreadCount();

    function handleAuthUpdated() {
      if (!hasValidSession(role)) return;
      prefetchUnreadCount();
    }

    window.addEventListener("io:auth-updated", handleAuthUpdated);
    return () => window.removeEventListener("io:auth-updated", handleAuthUpdated);
  }, [queryClient, role]);

  return null;
}
