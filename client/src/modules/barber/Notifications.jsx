"use client";

import { useState } from "react";
import { Bell, CheckCheck, Search, Scissors } from "lucide-react";
import { INITIAL_NOTIFICATIONS } from "../../data/barber/notificationsData.js";
import { TYPE_META, FILTERS } from "../../constants/barber/notifications.js";
import BookingCard from "./components/Notifications/BookingCard.jsx";
import ModificationCard from "./components/Notifications/ModificationCard.jsx";
import ReviewCard from "./components/Notifications/ReviewCard.jsx";
import CancellationCard from "./components/Notifications/CancellationCard.jsx";
import StatsBar from "./components/Notifications/StatsBar.jsx";
import EmptyState from "./components/Notifications/EmptyState.jsx";

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [search, setSearch] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const deleteNotif = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const handleAction = (id, action) => {
    setTimeout(() => markRead(id), 800);
  };

  const filtered = notifications.filter((n) => {
    if (filter !== "all" && n.type !== filter) return false;
    if (showUnreadOnly && n.read) return false;
    if (
      search
      && !n.message.toLowerCase().includes(search.toLowerCase())
      && !n.client.toLowerCase().includes(search.toLowerCase())
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
    <div className="mx-auto max-w-6xl space-y-8 pb-4 bg-background text-on-surface">
      <header className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Scissors className="h-4 w-4 text-primary" />
              <p className="font-label-caps text-primary">
                Barber · Notifications
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-on-primary">
                  {unreadCount}
                </span>
              )}
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant">
              Booking requests, cancellations, schedule updates, and client
              activity in your barber workspace.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="
          inline-flex items-center justify-center gap-1.5
          rounded-full border border-outline-variant
          px-4 py-2 text-xs font-medium
          text-on-surface-variant
          transition-all hover:bg-surface-container-high
          hover:text-on-surface active:scale-95
        "
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <StatsBar notifications={notifications} />

        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications…"
              className="w-full rounded-md border border-outline-variant bg-surface-container-low pl-8 pr-3 py-2
                text-sm text-on-surface placeholder:text-on-surface-variant/50
                focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <button
            onClick={() => setShowUnreadOnly((v) => !v)}
            className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-all
              ${
                showUnreadOnly
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Unread only
          </button>
        </div>

        <div className="flex items-center gap-1 mb-6 overflow-x-auto scrollbar-thin pb-1">
          {FILTERS.map((f) => {
            const typeMeta = TYPE_META[f.id];
            const count =
              f.id === "all"
                ? notifications.filter((n) => !n.read).length
                : notifications.filter((n) => n.type === f.id && !n.read)
                    .length;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap
                  border transition-all
                  ${
                    filter === f.id
                      ? f.id === "all"
                        ? "border-primary bg-primary/10 text-primary"
                        : `${typeMeta.border} ${typeMeta.bg} ${typeMeta.color}`
                      : "border-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
              >
                {f.label}
                {count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold
                    ${filter === f.id ? "bg-current/20" : "bg-surface-container-high text-on-surface-variant"}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="space-y-3">{filtered.map(renderCard)}</div>
        )}
      </div>
    </div>
  );
}
