"use client";

import { useState } from "react";
import { Bell, CheckCheck, Search } from "lucide-react";
import { INITIAL_NOTIFICATIONS } from "@/data/customer/notificationsData.js";
import {
  FILTERS,
  TYPE_META,
  matchesFilter,
  unreadCountForFilter,
  APPOINTMENT_TYPES,
} from "@/constants/customer/notifications.js";
import AppointmentNotificationCard from "./components/Notifications/AppointmentNotificationCard.jsx";
import ServiceChangeCard from "./components/Notifications/ServiceChangeCard.jsx";
import ReviewRequestCard from "./components/Notifications/ReviewRequestCard.jsx";
import PromotionCard from "./components/Notifications/PromotionCard.jsx";
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

  const filtered = notifications.filter((n) => {
    if (!matchesFilter(n, filter)) return false;
    if (showUnreadOnly && n.read) return false;
    if (search) {
      const q = search.toLowerCase();
      const haystack = [
        n.message,
        n.barber?.name,
        n.service,
        n.title,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const renderCard = (notif) => {
    const props = { key: notif.id, notif, onRead: markRead, onDelete: deleteNotif };

    if (APPOINTMENT_TYPES.includes(notif.type)) {
      return <AppointmentNotificationCard {...props} />;
    }
    switch (notif.type) {
      case "service_change":
        return <ServiceChangeCard {...props} />;
      case "review_request":
        return <ReviewRequestCard {...props} />;
      case "promotion":
        return <PromotionCard {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 bg-background pb-4 text-on-surface">
      <header className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <p className="font-label-caps text-primary">Customer · Notifications</p>
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
              Booking confirmations, reminders, service updates, and review prompts
              for your appointments.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-outline-variant px-4 py-2 text-xs font-medium text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface active:scale-95"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>
      </header>

      <StatsBar notifications={notifications} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[180px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications…"
            className="w-full rounded-md border border-outline-variant bg-surface-container-low py-2 pl-8 pr-3 text-sm text-on-surface transition-colors placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowUnreadOnly((v) => !v)}
          className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-all
            ${
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
          const typeMeta =
            f.id === "appointments"
              ? TYPE_META.booking_confirmed
              : TYPE_META[f.id];
          const count = unreadCountForFilter(notifications, f.id);

          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-md border px-3 py-2 text-xs font-medium transition-all
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
  );
}
