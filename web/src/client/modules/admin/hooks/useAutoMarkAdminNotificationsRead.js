"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import {
  applyAllAdminNotificationsReadInCache,
  invalidateAdminNotificationQueries,
} from "@/client/modules/admin/helpers/adminNotificationCacheHelpers.js";

/**
 * While the admin notifications page is open, mark every unread item as read in the DB.
 * Keeps the header bell accurate across navigation, refresh, and re-login.
 */
export function useAutoMarkAdminNotificationsRead(notifications = [], { isPending = false } = {}) {
  const queryClient = useQueryClient();
  const markAllReadMutation = adminHook.Notifications.useMarkAllNotificationsRead();
  const markAllReadAsync = markAllReadMutation.mutateAsync;
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (isPending || inFlightRef.current) return;

    const hasUnread = notifications.some((item) => !(item.read ?? item.isRead));
    if (!hasUnread) return;

    inFlightRef.current = true;
    applyAllAdminNotificationsReadInCache(queryClient);

    markAllReadAsync()
      .catch(async () => {
        await invalidateAdminNotificationQueries(queryClient);
      })
      .finally(() => {
        inFlightRef.current = false;
      });
  }, [isPending, notifications, queryClient, markAllReadAsync]);
}
