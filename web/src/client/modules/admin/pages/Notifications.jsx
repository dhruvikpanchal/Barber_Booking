"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BellOff, CheckCheck, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/client/modules/shared/components/ui/EmptyState";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import { mapAdminNotification } from "@/client/modules/admin/helpers/adminMappers.js";
import { NOTIFICATIONS_PAGE_SIZE } from "@/client/modules/admin/constants/adminConstants.js";
import {
  groupByDate,
  TabBar,
  DateGroupLabel,
  StatsRow,
} from "@/client/modules/admin/components/Notifications/Primitives.jsx";
import { NotificationCard } from "@/client/modules/admin/components/Notifications/NotificationCard.jsx";
import {
  applyAdminNotificationReadInCache,
  applyAllAdminNotificationsReadInCache,
  applyAdminNotificationDeleteInCache,
  invalidateAdminNotificationQueries,
} from "@/client/modules/admin/helpers/adminNotificationCacheHelpers.js";

export default function Notifications() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);

  const listParams = useMemo(
    () => ({
      page,
      limit: NOTIFICATIONS_PAGE_SIZE,
      tab: activeTab === "all" ? undefined : activeTab,
    }),
    [page, activeTab],
  );

  const { data, isPending, isError, error, refetch } =
    adminHook.Notifications.useListNotifications(listParams);
  const unreadCountQuery = adminHook.Notifications.useUnreadNotificationCount();
  const markReadMutation = adminHook.Notifications.useMarkNotificationRead();
  const markAllReadMutation = adminHook.Notifications.useMarkAllNotificationsRead();
  const deleteMutation = adminHook.Notifications.useDeleteNotification();

  const busy =
    isPending ||
    markReadMutation.isPending ||
    markAllReadMutation.isPending ||
    deleteMutation.isPending;

  const notifications = useMemo(
    () => (data?.items ?? []).map(mapAdminNotification),
    [data?.items],
  );

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load notifications.");
    }
  }, [isError, error]);

  const totalPages = data?.meta?.totalPages ?? 1;
  const totalCount = data?.meta?.total ?? notifications.length;
  const unreadCount = unreadCountQuery.data?.count ?? 0;

  const counts = useMemo(
    () => ({
      all: activeTab === "all" ? totalCount : notifications.length,
      unread: activeTab === "unread" ? totalCount : unreadCount,
      system: activeTab === "system" ? totalCount : notifications.filter((n) => n.type === "system").length,
      appointments:
        activeTab === "appointments"
          ? totalCount
          : notifications.filter((n) => n.type === "appointments").length,
      barber:
        activeTab === "barber" ? totalCount : notifications.filter((n) => n.type === "barber").length,
      contact:
        activeTab === "contact" ? totalCount : notifications.filter((n) => n.type === "contact").length,
    }),
    [activeTab, totalCount, notifications, unreadCount],
  );

  const grouped = useMemo(() => groupByDate(notifications), [notifications]);

  async function handleMarkRead(id) {
    if (busy) return;
    try {
      await markReadMutation.mutateAsync({ id, isRead: true });
      applyAdminNotificationReadInCache(queryClient, id);
      await unreadCountQuery.refetch();
    } catch {
      toast.error("Could not mark notification as read.");
    }
  }

  async function handleMarkAllRead() {
    if (busy || unreadCount === 0) return;
    try {
      await toast.promise(markAllReadMutation.mutateAsync(), {
        loading: "Marking all as read…",
        success: "All notifications marked as read.",
        error: "Could not mark all as read.",
      });
      applyAllAdminNotificationsReadInCache(queryClient);
      await Promise.all([
        invalidateAdminNotificationQueries(queryClient),
        unreadCountQuery.refetch(),
      ]);
    } catch {
      /* toast handles error */
    }
  }

  async function handleDelete(id) {
    if (busy) return;
    try {
      await deleteMutation.mutateAsync(id);
      applyAdminNotificationDeleteInCache(queryClient, id);
      await unreadCountQuery.refetch();
    } catch {
      toast.error("Could not dismiss notification.");
    }
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    setPage(1);
  }

  if (isPending && notifications.length === 0) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 pb-4">
        <div className="bg-surface-container h-24 animate-pulse rounded-xl" />
        <div className="bg-surface-container h-64 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (isError && notifications.length === 0) {
    return (
      <div className="text-on-surface mx-auto max-w-7xl py-16 text-center">
        <p className="font-medium">Could not load notifications.</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={busy}
          className="text-primary mt-3 text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-4">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-label-caps text-primary text-[11px] tracking-widest uppercase">
            Admin Panel
          </p>
          <h1 className="text-on-surface mt-0.5 font-serif text-2xl font-bold md:text-3xl">
            Notifications
          </h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            {unreadCount > 0 ? (
              <>
                You have <span className="text-on-surface font-semibold">{unreadCount}</span> unread
                notification{unreadCount !== 1 ? "s" : ""}
              </>
            ) : (
              "All caught up — no unread notifications."
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={busy}
              className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high focus-visible:ring-primary/60 inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck className="text-primary h-3.5 w-3.5" aria-hidden />
              Mark all read
            </button>
          )}
        </div>
      </header>

      <StatsRow notifications={notifications} />

      <div className="border-outline-variant bg-surface-container-low rounded-xl border">
        <div className="border-outline-variant flex items-center gap-3 border-b px-4 py-3 sm:px-5">
          <span className="font-label-caps text-on-surface-variant inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase">
            <Filter className="h-3 w-3" aria-hidden />
            Filter
          </span>
          <TabBar active={activeTab} onChange={handleTabChange} counts={counts} />
        </div>

        <div className="p-4 sm:p-5">
          {notifications.length === 0 ? (
            <EmptyState
              icon={BellOff}
              title={activeTab === "unread" ? "You're all caught up" : "No notifications here"}
              message={
                activeTab === "unread"
                  ? "All notifications have been read."
                  : "Nothing matches the current filter."
              }
              className="border-outline-variant rounded-xl border border-dashed"
              action={
                activeTab !== "all" ? (
                  <button
                    type="button"
                    onClick={() => handleTabChange("all")}
                    className="text-primary text-sm font-semibold transition-opacity hover:opacity-75"
                  >
                    Show all notifications
                  </button>
                ) : null
              }
            />
          ) : (
            <div className="space-y-5">
              {grouped.map((group) => (
                <div key={group.label}>
                  <DateGroupLabel label={group.label} />
                  <ul className="mt-2 space-y-2">
                    {group.items.map((n) => (
                      <NotificationCard
                        key={n.id}
                        notification={n}
                        onMarkRead={handleMarkRead}
                        onDelete={handleDelete}
                        busy={busy}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="border-outline-variant flex items-center justify-between border-t px-4 py-3 sm:px-5">
            <p className="text-on-surface-variant text-xs">
              Showing {(page - 1) * NOTIFICATIONS_PAGE_SIZE + 1}–
              {Math.min(page * NOTIFICATIONS_PAGE_SIZE, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1 || busy}
                onClick={() => setPage((p) => p - 1)}
                className="border-outline-variant text-on-surface-variant hover:bg-surface-container flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  disabled={busy}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${n === page ? "bg-primary text-on-primary" : "border-outline-variant text-on-surface-variant hover:bg-surface-container border"}`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={page === totalPages || busy}
                onClick={() => setPage((p) => p + 1)}
                className="border-outline-variant text-on-surface-variant hover:bg-surface-container flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
