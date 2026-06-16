"use client";

import { useEffect, useMemo, useState } from "react";
import { BellOff, CheckCheck, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/client/modules/shared/components/ui/EmptyState";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import { mapAdminNotification } from "@/client/modules/admin/helpers/adminMappers.js";
import {
  groupByDate,
  TabBar,
  DateGroupLabel,
  StatsRow,
} from "@/client/modules/admin/components/Notifications/Primitives.jsx";
import { NotificationCard } from "@/client/modules/admin/components/Notifications/NotificationCard.jsx";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("all");

  const listParams = useMemo(
    () => ({
      tab: activeTab,
      page: 1,
      limit: 100,
    }),
    [activeTab],
  );

  const { data, isPending, isError, error, refetch } =
    adminHook.Notifications.useListNotifications(listParams);
  const markReadMutation = adminHook.Notifications.useMarkNotificationRead();
  const markAllReadMutation = adminHook.Notifications.useMarkAllNotificationsRead();

  const busy = isPending || markReadMutation.isPending || markAllReadMutation.isPending;

  const notifications = useMemo(
    () => (data?.items ?? []).map(mapAdminNotification),
    [data?.items],
  );

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load notifications.");
    }
  }, [isError, error]);

  const counts = useMemo(() => {
    const unread = notifications.filter((n) => !n.read);
    return {
      all: notifications.length,
      unread: unread.length,
      system: notifications.filter((n) => n.type === "system").length,
      appointments: notifications.filter((n) => n.type === "appointments").length,
      barber: notifications.filter((n) => n.type === "barber").length,
      contact: notifications.filter((n) => n.type === "contact").length,
    };
  }, [notifications]);

  const unreadCount = counts.unread;
  const filtered = notifications;
  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  async function handleMarkRead(id) {
    if (busy) return;
    try {
      await markReadMutation.mutateAsync({ id, isRead: true });
      await refetch();
    } catch {
      toast.error("Could not mark notification as read.");
    }
  }

  async function handleDelete(id) {
    await handleMarkRead(id);
  }

  async function handleMarkAllRead() {
    if (busy || unreadCount === 0) return;
    try {
      await toast.promise(markAllReadMutation.mutateAsync(), {
        loading: "Marking all as read…",
        success: "All notifications marked as read.",
        error: "Could not mark all as read.",
      });
      await refetch();
    } catch {
      /* toast handles error */
    }
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
          <TabBar active={activeTab} onChange={setActiveTab} counts={counts} />
        </div>

        <div className="p-4 sm:p-5">
          {busy && notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="text-primary h-8 w-8 animate-spin" aria-hidden />
              <p className="text-on-surface-variant mt-3 text-sm">Loading notifications…</p>
            </div>
          ) : filtered.length === 0 ? (
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
                    onClick={() => setActiveTab("all")}
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
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
