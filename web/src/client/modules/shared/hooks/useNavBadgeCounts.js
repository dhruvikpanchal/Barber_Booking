"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { routes } from "@/config/routes/routes.js";
import { ADMIN, BARBER, CUSTOMER } from "@/client/modules/shared/constants/roles.js";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import { adminNavBadgeCountsToRoutes } from "@/client/modules/admin/helpers/adminNavBadgeHelpers.js";
import { barberHook } from "@/client/modules/barber/hooks/barberQuery.jsx";
import { barberNavBadgeCountsToRoutes } from "@/client/modules/barber/helpers/barberNavBadgeHelpers.js";
import { customerHook } from "@/client/modules/customer/hooks/customerQuery.jsx";
import {
  countCustomerNewAppointments,
  countCustomerNewReviewItems,
} from "@/client/modules/customer/helpers/customerNavBadgeHelpers.js";
import {
  resolveCustomerNavUserId,
  useCustomerNavSeenRevision,
} from "@/client/modules/customer/helpers/customerNavSeenStore.js";
import { usePageVisible } from "@/client/modules/shared/hooks/usePageVisible.js";
import { useSocketConnected } from "@/client/lib/providers/SocketProvider.jsx";

const NAV_POLL_MS = 60_000;
const NAV_FALLBACK_POLL_MS = 5 * 60_000;
const NAV_STALE_MS = 45_000;

function isRouteActive(pathname, href) {
  if (!href || href === "#") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function positiveCount(value) {
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? count : 0;
}

function badgeCountForRoute(pathname, href, count) {
  if (isRouteActive(pathname, href)) return 0;
  return positiveCount(count);
}

export function useNavBadgeCounts(role = CUSTOMER) {
  const pathname = usePathname() || "";
  const pageVisible = usePageVisible();
  const socketConnected = useSocketConnected();
  const queryClient = useQueryClient();
  const poll = pageVisible ? (socketConnected ? NAV_FALLBACK_POLL_MS : NAV_POLL_MS) : false;
  useCustomerNavSeenRevision();
  const customerUserId = role === CUSTOMER ? resolveCustomerNavUserId() : null;

  const cachedAdminNavBadges = queryClient.getQueryData(["adminNavBadges"]);
  const cachedBarberNavBadges = queryClient.getQueryData(["barberNavBadges"]);
  const cachedCustomerReviews = queryClient.getQueryData(["listReviews", { limit: 100 }]);
  const cachedPastAppointments = queryClient.getQueryData(["listAppointments", { tab: "past", limit: 50 }]);
  const cachedUpcomingAppointments = queryClient.getQueryData([
    "listAppointments",
    { tab: "upcoming", limit: 100 },
  ]);
  const cachedCustomerUnread = queryClient.getQueryData(["getUnreadNotificationCount"])?.count;

  const { data: adminNavBadges } = adminHook.NavBadges.useNavBadges({
    enabled: role === ADMIN,
    refetchInterval: poll,
    staleTime: NAV_STALE_MS,
    placeholderData: cachedAdminNavBadges,
  });

  const { data: barberNavBadges } = barberHook.NavBadges.useNavBadges({
    enabled: role === BARBER,
    refetchInterval: poll,
    staleTime: NAV_STALE_MS,
    placeholderData: cachedBarberNavBadges,
  });

  const onCustomerReviewsPage = isRouteActive(pathname, routes.customer.reviews);
  const onCustomerAppointmentsPage = isRouteActive(pathname, routes.customer.myAppointments);
  const onCustomerNotificationsPage = isRouteActive(pathname, routes.customer.notifications);

  const { data: customerUnreadCount } = customerHook.Notifications.useGetUnreadNotificationCount({
    enabled: role === CUSTOMER,
    staleTime: NAV_STALE_MS,
    refetchInterval: onCustomerNotificationsPage ? false : poll,
    placeholderData:
      cachedCustomerUnread != null ? { count: cachedCustomerUnread } : undefined,
  });

  const { data: customerReviews } = customerHook.Reviews.useListReviews(
    { limit: 100 },
    {
      enabled: role === CUSTOMER,
      staleTime: NAV_STALE_MS,
      refetchInterval: onCustomerReviewsPage ? false : poll,
      placeholderData: cachedCustomerReviews,
    },
  );

  const { data: customerPastAppointments } = customerHook.Appointments.useListAppointments(
    { tab: "past", limit: 50 },
    {
      enabled: role === CUSTOMER,
      staleTime: NAV_STALE_MS,
      refetchInterval: onCustomerReviewsPage ? false : poll,
      placeholderData: cachedPastAppointments,
    },
  );

  const { data: customerUpcomingAppointments } = customerHook.Appointments.useListAppointments(
    { tab: "upcoming", limit: 100 },
    {
      enabled: role === CUSTOMER,
      staleTime: NAV_STALE_MS,
      refetchInterval: onCustomerAppointmentsPage ? false : poll,
      placeholderData: cachedUpcomingAppointments,
    },
  );

  return useMemo(() => {
    const counts = {};

    if (role === ADMIN) {
      const byRoute = adminNavBadgeCountsToRoutes(adminNavBadges);
      for (const [href, count] of Object.entries(byRoute)) {
        counts[href] = badgeCountForRoute(pathname, href, count);
      }
    }

    if (role === BARBER) {
      const byRoute = barberNavBadgeCountsToRoutes(barberNavBadges);
      for (const [href, count] of Object.entries(byRoute)) {
        counts[href] = badgeCountForRoute(pathname, href, count);
      }
    }

    if (role === CUSTOMER) {
      const upcoming = customerUpcomingAppointments?.items ?? [];
      const past = customerPastAppointments?.items ?? [];

      counts[routes.customer.notifications] = badgeCountForRoute(
        pathname,
        routes.customer.notifications,
        customerUnreadCount?.count ?? cachedCustomerUnread ?? 0,
      );
      counts[routes.customer.myAppointments] = badgeCountForRoute(
        pathname,
        routes.customer.myAppointments,
        countCustomerNewAppointments([upcoming, past], customerUserId),
      );
      counts[routes.customer.reviews] = badgeCountForRoute(
        pathname,
        routes.customer.reviews,
        countCustomerNewReviewItems(
          customerReviews?.items ?? [],
          past,
          customerUserId,
        ),
      );
    }

    return counts;
  }, [
    role,
    pathname,
    adminNavBadges,
    barberNavBadges,
    customerReviews?.items,
    customerPastAppointments?.items,
    customerUpcomingAppointments?.items,
    customerUnreadCount?.count,
    cachedCustomerUnread,
    customerUserId,
  ]);
}

export function getNavBadgeCount(counts, href) {
  if (!href || !counts) return 0;
  return counts[href] ?? 0;
}

export function sumNavBadgeCounts(counts, hrefs = []) {
  return hrefs.reduce((total, href) => total + getNavBadgeCount(counts, href), 0);
}
