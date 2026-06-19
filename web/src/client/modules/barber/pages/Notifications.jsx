"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, CheckCheck, Search, Scissors } from "lucide-react";
import { toast } from "sonner";
import { getNotificationDestination } from "@/client/modules/barber/helpers/notificationNavigation.js";
import EmptyState from "@/client/modules/shared/components/ui/EmptyState";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";
import { TYPE_META, FILTERS } from "@/client/modules/barber/constants/notificationsConstants.js";
import BookingCard from "@/client/modules/barber/components/Notifications/BookingCard.jsx";
import ModificationCard from "@/client/modules/barber/components/Notifications/ModificationCard.jsx";
import ReviewCard from "@/client/modules/barber/components/Notifications/ReviewCard.jsx";
import CancellationCard from "@/client/modules/barber/components/Notifications/CancellationCard.jsx";
import GenericNotificationCard from "@/client/modules/barber/components/Notifications/GenericNotificationCard.jsx";
import StatsBar from "@/client/modules/barber/components/Notifications/StatsBar.jsx";
import { barberHook } from "@/client/modules/barber/hooks/barberQuery.jsx";
import { mapNotification } from "@/client/modules/barber/helpers/barberMappers.js";
import { BARBER_NOTIFICATION_LIST_PARAMS } from "@/client/modules/barber/constants/barberQueryConstants.js";
import {
  markAllBarberNotificationsReadInCache,
  patchBarberNotificationInCache,
} from "@/client/modules/barber/helpers/notificationCacheHelpers.js";

export default function Notifications() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isPending, isError, error, refetch } =
    barberHook.Notifications.useListNotifications(BARBER_NOTIFICATION_LIST_PARAMS);
  const { data: unreadData } = barberHook.Notifications.useUnreadNotificationCount();
  const markReadMutation = barberHook.Notifications.useMarkNotificationRead();
  const markAllReadMutation = barberHook.Notifications.useMarkAllNotificationsRead();

  const [filter, setFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [search, setSearch] = useState("");

  const busy = isPending || markReadMutation.isPending || markAllReadMutation.isPending;

  const notifications = useMemo(
    () => (data?.notifications ?? []).map(mapNotification),
    [data?.notifications],
  );

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load notifications.");
    }
  }, [isError, error]);

  const unreadCount = unreadData?.count ?? 0;

  const patchReadInCache = useCallback(
    (id) => {
      patchBarberNotificationInCache(queryClient, id, { read: true });
      queryClient.invalidateQueries({ queryKey: ["barberUnreadNotificationCount"] });
    },
    [queryClient],
  );

  const markRead = async (id) => {
    if (busy) return;
    try {
      await markReadMutation.mutateAsync({ id });
      patchReadInCache(id);
    } catch {
      toast.error("Could not mark notification as read.");
    }
  };

  const markAllRead = async () => {
    if (busy) return;
    try {
      await toast.promise(markAllReadMutation.mutateAsync(), {
        loading: "Marking all as read…",
        success: "All notifications marked as read.",
        error: "Could not mark all as read.",
      });
      markAllBarberNotificationsReadInCache(queryClient);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["barberUnreadNotificationCount"] }),
        queryClient.invalidateQueries({ queryKey: ["barberListNotifications"] }),
      ]);
    } catch {
      /* toast handles error */
    }
  };

  const deleteNotif = async (id) => {
    if (busy) return;
    await markRead(id);
  };

  const handleNavigate = async (notif) => {
    if (busy) return;
    try {
      if (!notif.read) {
        await markReadMutation.mutateAsync({ id: notif.id });
        patchReadInCache(notif.id);
      }
      router.push(getNotificationDestination(notif));
    } catch {
      toast.error("Could not open notification.");
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter !== "all" && n.type !== filter) return false;
    if (showUnreadOnly && n.read) return false;
    if (
      search &&
      !n.message.toLowerCase().includes(search.toLowerCase()) &&
      !n.client.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const renderCard = (notif) => {
    const cardProps = {
      notif,
      onRead: markRead,
      onDelete: deleteNotif,
      onNavigate: () => handleNavigate(notif),
      disabled: busy,
    };
    switch (notif.type) {
      case "booking_request":
        return <BookingCard key={notif.id} {...cardProps} />;
      case "modification":
        return <ModificationCard key={notif.id} {...cardProps} />;
      case "review":
        return <ReviewCard key={notif.id} {...cardProps} />;
      case "cancellation":
        return <CancellationCard key={notif.id} {...cardProps} />;
      default:
        return <GenericNotificationCard key={notif.id} {...cardProps} />;
    }
  };

  if (isPending && notifications.length === 0) {
    return <PageLoader label="Loading notifications..." className="mx-auto max-w-6xl" />;
  }

  if (isError && notifications.length === 0) {
    return (
      <div className="text-on-surface mx-auto max-w-6xl py-16 text-center">
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
    <div className="bg-background text-on-surface mx-auto max-w-6xl space-y-8 pb-4">
      <header className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Scissors className="text-primary h-4 w-4" />
              <p className="font-label-caps text-primary">Barber · Notifications</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span className="bg-primary text-on-primary rounded-full px-2.5 py-0.5 text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </div>

            <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
              Booking requests, cancellations, schedule updates, and client activity in your barber
              workspace.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              disabled={busy}
              className="border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <StatsBar notifications={notifications} />

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[180px] flex-1">
            <Search className="text-on-surface-variant pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications…"
              disabled={busy}
              className="border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary w-full rounded-md border py-2 pr-3 pl-8 text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <button
            onClick={() => !busy && setShowUnreadOnly((v) => !v)}
            disabled={busy}
            className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
              showUnreadOnly
                ? "border-primary bg-primary/10 text-primary"
                : "border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            Unread only
          </button>
        </div>

        <div className="scrollbar-thin mb-6 flex items-center gap-1 overflow-x-auto pb-1">
          {FILTERS.map((f) => {
            const typeMeta = TYPE_META[f.id];
            const count =
              f.id === "all"
                ? notifications.filter((n) => !n.read).length
                : notifications.filter((n) => n.type === f.id && !n.read).length;
            return (
              <button
                key={f.id}
                onClick={() => !busy && setFilter(f.id)}
                disabled={busy}
                className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium whitespace-nowrap transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                  filter === f.id
                    ? f.id === "all"
                      ? "border-primary bg-primary/10 text-primary"
                      : `${typeMeta.border} ${typeMeta.bg} ${typeMeta.color}`
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border-transparent"
                }`}
              >
                {f.label}
                {count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${filter === f.id ? "bg-current/20" : "bg-surface-container-high text-on-surface-variant"}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={BellOff}
            title="No notifications"
            message={
              filter === "all"
                ? "You're all caught up. New activity will appear here."
                : `No ${TYPE_META[filter]?.filterLabel.toLowerCase() || filter} at the moment.`
            }
          />
        ) : (
          <div className="space-y-3">{filtered.map(renderCard)}</div>
        )}
      </div>
    </div>
  );
}
