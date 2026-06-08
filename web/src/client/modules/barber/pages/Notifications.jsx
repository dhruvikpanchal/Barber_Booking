"use client";

import { useState } from "react";
import { Bell, BellOff, CheckCheck, Search, Scissors } from "lucide-react";
import EmptyState from "@/client/modules/shared/components/ui/EmptyState";
import { INITIAL_NOTIFICATIONS } from "@/client/modules/barber/data/notificationsData.js";
import { TYPE_META, FILTERS } from "@/client/modules/barber/constants/notifications.js";
import BookingCard from "@/client/modules/barber/components/Notifications/BookingCard.jsx";
import ModificationCard from "@/client/modules/barber/components/Notifications/ModificationCard.jsx";
import ReviewCard from "@/client/modules/barber/components/Notifications/ReviewCard.jsx";
import CancellationCard from "@/client/modules/barber/components/Notifications/CancellationCard.jsx";
import StatsBar from "@/client/modules/barber/components/Notifications/StatsBar.jsx";
export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [search, setSearch] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const deleteNotif = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const handleAction = (id, action) => {
    setTimeout(() => markRead(id), 800);
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
    const props = {
      key: notif.id,
      notif,
      onRead: markRead,
      onDelete: deleteNotif,
      onAction: handleAction,
    };
    switch (notif.type) {
      case "booking_request":
        return <BookingCard {...props} />;
      case "modification":
        return <ModificationCard {...props} />;
      case "review":
        return <ReviewCard {...props} />;
      case "cancellation":
        return <CancellationCard {...props} />;
      default:
        return null;
    }
  };

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
              className="border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-all active:scale-95"
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
              className="border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary w-full rounded-md border py-2 pr-3 pl-8 text-sm transition-colors focus:outline-none"
            />
          </div>

          <button
            onClick={() => setShowUnreadOnly((v) => !v)}
            className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-all ${
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
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium whitespace-nowrap transition-all ${
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
