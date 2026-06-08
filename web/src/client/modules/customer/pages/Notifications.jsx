"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, BellOff, CheckCheck, Search } from "lucide-react";
import EmptyState from "@/client/modules/shared/components/ui/EmptyState";
import customerServices from "@/client/modules/customer/services/customerServices.jsx";
import {
  FILTERS,
  TYPE_META,
  matchesFilter,
  unreadCountForFilter,
  APPOINTMENT_TYPES,
} from "@/client/modules/customer/constants/notifications.js";
import AppointmentNotificationCard from "@/client/modules/customer/components/Notifications/AppointmentNotificationCard.jsx";
import ServiceChangeCard from "@/client/modules/customer/components/Notifications/ServiceChangeCard.jsx";
import ReviewRequestCard from "@/client/modules/customer/components/Notifications/ReviewRequestCard.jsx";
import PromotionCard from "@/client/modules/customer/components/Notifications/PromotionCard.jsx";
import StatsBar from "@/client/modules/customer/components/Notifications/StatsBar.jsx";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [search, setSearch] = useState("");

  const loadNotifications = useCallback(() => {
    setLoading(true);
    customerServices
      .listNotifications({ limit: 100 })
      .then((result) => setNotifications(result.items ?? []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = async (id) => {
    try {
      await customerServices.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }
  };

  const markAllRead = async () => {
    try {
      await customerServices.markAllNotificationsRead();
    } catch {
      /* still update UI */
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotif = async (id) => {
    try {
      await customerServices.deleteNotification(id);
    } catch {
      /* remove locally anyway */
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (!matchesFilter(n, filter)) return false;
    if (showUnreadOnly && n.read) return false;
    if (search) {
      const q = search.toLowerCase();
      const haystack = [n.message, n.barber?.name, n.service, n.title]
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
    <div className="bg-background text-on-surface mx-auto max-w-6xl space-y-8 pb-4">
      <header className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bell className="text-primary h-4 w-4" />
              <p className="font-label-caps text-primary">Customer · Notifications</p>
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
              Booking confirmations, reminders, service updates, and review prompts for your
              appointments.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-all active:scale-95"
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
          type="button"
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
          const typeMeta = f.id === "appointments" ? TYPE_META.booking_confirmed : TYPE_META[f.id];
          const count = unreadCountForFilter(notifications, f.id);

          return (
            <button
              key={f.id}
              type="button"
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

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container h-24 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="No notifications"
          message={
            filter === "all"
              ? "You're all caught up. Booking updates and reminders will appear here."
              : `No ${FILTERS.find((f) => f.id === filter)?.label?.toLowerCase() ?? filter} notifications at the moment.`
          }
        />
      ) : (
        <div className="space-y-3">{filtered.map(renderCard)}</div>
      )}
    </div>
  );
}
