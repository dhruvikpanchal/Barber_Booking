"use client";

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import { barberHook } from "@/client/modules/barber/hooks/barberQuery.jsx";
import { customerHook } from "@/client/modules/customer/hooks/customerQuery.jsx";
import { usePageVisible } from "@/client/modules/shared/hooks/usePageVisible.js";
import { useSocketConnected } from "@/client/lib/providers/SocketProvider.jsx";

const CUSTOMER_UNREAD_POLL_MS = 60_000;
const BARBER_UNREAD_POLL_MS = 5 * 60_000;
const ADMIN_UNREAD_POLL_MS = 60_000;
const SOCKET_CONNECTED_FALLBACK_POLL_MS = 10 * 60_000;
const UNREAD_STALE_MS = 30_000;

function positiveCount(value) {
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? count : 0;
}

export function useDashboardUnreadCount(role = "customer") {
  const pageVisible = usePageVisible();
  const socketConnected = useSocketConnected();
  const queryClient = useQueryClient();
  const fallbackPoll = socketConnected ? SOCKET_CONNECTED_FALLBACK_POLL_MS : null;

  const cachedCustomerUnread = queryClient.getQueryData(["getUnreadNotificationCount"])?.count;
  const cachedBarberUnread = queryClient.getQueryData(["barberUnreadNotificationCount"])?.count;
  const cachedAdminUnread = queryClient.getQueryData(["unreadNotificationCount"])?.count;

  const { data: customerUnread } = customerHook.Notifications.useGetUnreadNotificationCount({
    enabled: role === "customer",
    refetchInterval: pageVisible ? (fallbackPoll ?? CUSTOMER_UNREAD_POLL_MS) : false,
    staleTime: UNREAD_STALE_MS,
    placeholderData:
      cachedCustomerUnread != null ? { count: cachedCustomerUnread } : undefined,
  });

  const { data: barberUnread } = barberHook.Notifications.useUnreadNotificationCount({
    enabled: role === "barber",
    refetchInterval: pageVisible ? (fallbackPoll ?? BARBER_UNREAD_POLL_MS) : false,
    staleTime: UNREAD_STALE_MS,
    placeholderData:
      cachedBarberUnread != null ? { count: cachedBarberUnread } : undefined,
  });

  const { data: adminUnread } = adminHook.Notifications.useUnreadNotificationCount({
    enabled: role === "admin",
    refetchInterval: pageVisible ? (fallbackPoll ?? ADMIN_UNREAD_POLL_MS) : false,
    staleTime: UNREAD_STALE_MS,
    placeholderData: cachedAdminUnread != null ? { count: cachedAdminUnread } : undefined,
  });

  return useMemo(() => {
    if (role === "customer") {
      return positiveCount(customerUnread?.count ?? cachedCustomerUnread);
    }
    if (role === "barber") {
      return positiveCount(barberUnread?.count ?? cachedBarberUnread);
    }
    if (role === "admin") {
      return positiveCount(adminUnread?.count ?? cachedAdminUnread);
    }
    return 0;
  }, [
    role,
    customerUnread?.count,
    barberUnread?.count,
    adminUnread?.count,
    cachedCustomerUnread,
    cachedBarberUnread,
    cachedAdminUnread,
  ]);
}
