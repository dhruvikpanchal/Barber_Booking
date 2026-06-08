"use client";

import { useMemo, useState } from "react";
import { BellOff, CheckCheck, Filter, Trash2 } from "lucide-react";
import EmptyState from "@/client/modules/shared/components/ui/EmptyState";
import Modal from "@/client/modules/shared/components/ui/Modal";
import { INITIAL_NOTIFICATIONS } from "@/client/modules/admin/data/notifucationsData.js";
import {
  groupByDate,
  TabBar,
  DateGroupLabel,
  StatsRow,
} from "@/client/modules/admin/components/Notifications/Primitives.jsx";
import { NotificationCard } from "@/client/modules/admin/components/Notifications/NotificationCard.jsx";

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("all");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Derived counts for tab badges
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

  // Filtered & sorted list
  const filtered = useMemo(() => {
    let list = [...notifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (activeTab === "unread") return list.filter((n) => !n.read);
    if (activeTab === "system") return list.filter((n) => n.type === "system");
    if (activeTab === "appointments") return list.filter((n) => n.type === "appointments");
    if (activeTab === "barber") return list.filter((n) => n.type === "barber");
    if (activeTab === "contact") return list.filter((n) => n.type === "contact");
    return list;
  }, [notifications, activeTab]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  // Actions
  const handleMarkRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    if (activeTab === "all") {
      setNotifications([]);
    } else {
      const typeMap = {
        unread: (n) => !n.read,
        system: (n) => n.type === "system",
        appointments: (n) => n.type === "appointments",
        barber: (n) => n.type === "barber",
        contact: (n) => n.type === "contact",
      };
      const predicate = typeMap[activeTab];
      setNotifications((prev) => (predicate ? prev.filter((n) => !predicate(n)) : prev));
    }
    setShowConfirmClear(false);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-4">
      {/* Page header */}
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
              className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high focus-visible:ring-primary/60 inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <CheckCheck className="text-primary h-3.5 w-3.5" aria-hidden />
              Mark all read
            </button>
          )}
          {filtered.length > 0 && (
            <button
              type="button"
              onClick={() => setShowConfirmClear(true)}
              className="border-outline-variant bg-surface-container text-on-surface-variant hover:border-status-cancelled/40 hover:bg-status-cancelled/8 hover:text-status-cancelled focus-visible:ring-status-cancelled/50 inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              Clear{activeTab !== "all" ? " filtered" : " all"}
            </button>
          )}
        </div>
      </header>

      {/* Stats */}
      <StatsRow notifications={notifications} />

      {/* Filter panel */}
      <div className="border-outline-variant bg-surface-container-low rounded-xl border">
        <div className="border-outline-variant flex items-center gap-3 border-b px-4 py-3 sm:px-5">
          <span className="font-label-caps text-on-surface-variant inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase">
            <Filter className="h-3 w-3" aria-hidden />
            Filter
          </span>
          <TabBar active={activeTab} onChange={setActiveTab} counts={counts} />
        </div>

        {/* Notification list */}
        <div className="p-4 sm:p-5">
          {filtered.length === 0 ? (
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

      {/* Confirm clear dialog */}
      <Modal
        open={showConfirmClear}
        onClose={() => setShowConfirmClear(false)}
        size="sm"
        panelClassName="border-outline-variant bg-surface-container-low rounded-xl border p-6 shadow-2xl"
      >
            <div className="bg-status-cancelled/15 text-status-cancelled flex h-11 w-11 items-center justify-center rounded-lg">
              <Trash2 className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="text-on-surface mt-4 font-serif text-lg font-bold">
              Clear {activeTab !== "all" ? `${activeTab} ` : "all "}
              notifications?
            </h2>
            <p className="text-on-surface-variant mt-2 text-sm">
              This will permanently delete{" "}
              <span className="text-on-surface font-semibold">{filtered.length}</span> notification
              {filtered.length !== 1 ? "s" : ""}. This action cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmClear(false)}
                className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high flex-1 rounded-md border py-2.5 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="bg-status-cancelled text-on-error flex-1 rounded-md py-2.5 text-sm font-bold transition-opacity hover:opacity-90"
              >
                Clear
              </button>
            </div>
      </Modal>
    </div>
  );
}
