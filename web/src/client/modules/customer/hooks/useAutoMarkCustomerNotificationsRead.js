"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { customerHook } from "@/client/modules/customer/hooks/customerQuery.jsx";
import {
  applyAllNotificationsReadInCache,
  invalidateCustomerNotificationQueries,
} from "@/client/modules/customer/helpers/customerCacheHelpers.js";

/**
 * While the customer notifications page is open, mark every unread item as read in the DB.
 * Keeps the header badge at zero until the user leaves and a brand-new notification arrives.
 */
export function useAutoMarkCustomerNotificationsRead(notifications = [], { isPending = false } = {}) {
  const queryClient = useQueryClient();
  const markAllReadMutation = customerHook.Notifications.useMarkAllNotificationsRead();
  const markAllReadAsync = markAllReadMutation.mutateAsync;
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (isPending || inFlightRef.current) return;

    const hasUnread = notifications.some((item) => !item.read);
    if (!hasUnread) return;

    inFlightRef.current = true;
    applyAllNotificationsReadInCache(queryClient);

    markAllReadAsync()
      .catch(async () => {
        await invalidateCustomerNotificationQueries(queryClient);
      })
      .finally(() => {
        inFlightRef.current = false;
      });
  }, [isPending, notifications, queryClient, markAllReadAsync]);
}
