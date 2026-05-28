"use client";

import { useState } from "react";
import {
  Star,
  MapPin,
  CalendarCheck,
  MessageSquare,
  X,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Ban,
  Trash2,
  Activity,
  TrendingUp,
  XCircle,
  Scissors,
  Calendar,
} from "lucide-react";
import {
  fmtDate,
  fmtRelative,
  StatusBadge,
  ActivityBadge,
} from "./helpers.jsx";
import {
  USER_STATUS_CONFIG,
  BOOKING_STATUS_CONFIG,
} from "@/constants/admin/admin.js";

export default function DetailDrawer({ user, onClose, onAction }) {
  const [histTab, setHistTab] = useState("bookings");
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-black/60"
      onClick={onClose}
    >
      <aside
        className="scrollbar-thin h-full w-full max-w-md overflow-y-auto border-l border-outline-variant bg-surface-container-low shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-outline-variant bg-surface-container-low/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="font-label-caps text-primary">Admin · User Details</p>
            <p className="text-xs text-on-surface-variant">ID: {user.id}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="space-y-6 p-5">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/20 font-serif text-xl font-bold text-primary">
                {user.initials}
              </div>
              <span
                className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface-container-low ${USER_STATUS_CONFIG[user.status]?.dot ?? "bg-outline"}`}
              />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                {user.name}
              </h2>
              <p className="mt-0.5 text-sm text-on-surface-variant">
                Member since {fmtDate(user.joinedAt)}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={user.status} />
                <ActivityBadge level={user.activity} />
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="rounded-xl border border-outline-variant bg-surface-container px-4">
            {[
              { Icon: Mail, label: "Email", value: user.email },
              { Icon: Phone, label: "Phone", value: user.phone },
              { Icon: MapPin, label: "Location", value: user.city },
              {
                Icon: Clock,
                label: "Last Active",
                value: fmtRelative(user.lastActive),
              },
            ].map(({ Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 border-b border-outline-variant/60 py-3 last:border-b-0"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-container-high text-on-surface-variant">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="font-label-caps text-on-surface-variant">
                    {label}
                  </p>
                  <p className="text-sm text-on-surface">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                Icon: CalendarCheck,
                label: "Total Bookings",
                value: user.bookingsTotal,
                sub: `${user.bookingsThisMonth} this month`,
              },
              {
                Icon: MessageSquare,
                label: "Reviews Given",
                value: user.reviewsGiven,
                sub: `Avg ${user.avgRatingGiven.toFixed(1)} ★`,
              },
              {
                Icon: TrendingUp,
                label: "Total Spent",
                value: `$${user.totalSpent.toLocaleString()}`,
                sub: "lifetime value",
              },
              {
                Icon: XCircle,
                label: "Cancellations",
                value: user.cancelledBookings,
                sub: "all time",
              },
            ].map(({ Icon, label, value, sub }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low p-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="font-label-caps text-on-surface-variant">
                    {label}
                  </p>
                  <p className="font-serif text-lg font-bold leading-tight text-on-surface">
                    {value}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Favourite barber/shop */}
          <div className="rounded-xl border border-outline-variant bg-surface-container px-4 py-3 space-y-2">
            <p className="font-label-caps text-on-surface-variant">
              Preferences
            </p>
            <div className="flex items-center gap-3">
              <Scissors className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="text-sm text-on-surface">
                Favourite barber:{" "}
                <span className="font-medium">{user.favoriteBarber}</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="text-sm text-on-surface">
                Favourite shop:{" "}
                <span className="font-medium">{user.favoriteShop}</span>
              </span>
            </div>
          </div>

          {/* History tabs */}
          <div>
            <div className="mb-3 flex gap-1 rounded-lg border border-outline-variant bg-surface-container p-1">
              {[
                { key: "bookings", label: "Booking History", Icon: Calendar },
                { key: "activity", label: "Activity Monitor", Icon: Activity },
              ].map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setHistTab(key)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors ${histTab === key ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"}`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  {label}
                </button>
              ))}
            </div>

            {histTab === "bookings" && (
              <div className="space-y-2">
                {user.bookingHistory.length === 0 ? (
                  <p className="py-6 text-center text-sm text-on-surface-variant">
                    No bookings yet.
                  </p>
                ) : (
                  user.bookingHistory.map((bk) => {
                    const bkCfg =
                      BOOKING_STATUS_CONFIG[bk.status]
                      ?? BOOKING_STATUS_CONFIG.pending;
                    return (
                      <div
                        key={bk.id}
                        className="flex items-start justify-between gap-3 rounded-lg border border-outline-variant bg-surface-container px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-on-surface">
                            {bk.service}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {bk.barber} · {fmtDate(bk.date)}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${bkCfg.cls}`}
                          >
                            {bkCfg.label}
                          </span>
                          <span className="text-xs font-semibold text-on-surface">
                            ${bk.price}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {histTab === "activity" && (
              <div className="space-y-3">
                {/* Activity breakdown */}
                {[
                  {
                    label: "Bookings this month",
                    value: user.bookingsThisMonth,
                    max: 10,
                    icon: CalendarCheck,
                  },
                  {
                    label: "Reviews written",
                    value: user.reviewsGiven,
                    max: 40,
                    icon: MessageSquare,
                  },
                  {
                    label: "Cancellation rate",
                    value: user.bookingsTotal
                      ? Math.round(
                          (user.cancelledBookings / user.bookingsTotal) * 100,
                        )
                      : 0,
                    max: 100,
                    suffix: "%",
                    icon: XCircle,
                  },
                  {
                    label: "Avg rating given",
                    value: user.avgRatingGiven * 20,
                    max: 100,
                    display: `${user.avgRatingGiven.toFixed(1)} / 5`,
                    icon: Star,
                  },
                ].map(({ label, value, max, suffix, display, icon: Icon }) => (
                  <div key={label}>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                        <Icon className="h-3.5 w-3.5" aria-hidden />
                        {label}
                      </span>
                      <span className="text-xs font-semibold text-on-surface">
                        {display ?? `${value}${suffix ?? ""}`}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
                      <div
                        className="h-2 rounded-full bg-primary transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (value / max) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-2 rounded-lg border border-outline-variant bg-surface-container px-3 py-2.5">
                  <p className="font-label-caps text-on-surface-variant">
                    Last seen
                  </p>
                  <p className="mt-0.5 text-sm text-on-surface">
                    {fmtDate(user.lastActive)} · {fmtRelative(user.lastActive)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Admin actions */}
          <div className="space-y-2 border-t border-outline-variant pt-4">
            <p className="font-label-caps mb-3 text-on-surface-variant">
              Admin Actions
            </p>
            {user.status === "disabled" ? (
              <button
                onClick={() => onAction("enable", user)}
                className="flex w-full items-center gap-3 rounded-lg border border-status-confirmed/30 bg-status-confirmed/8 px-4 py-3 text-sm font-medium text-status-confirmed transition-colors hover:bg-status-confirmed/15"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden />
                Re-enable User
              </button>
            ) : (
              <button
                onClick={() => onAction("disable", user)}
                className="flex w-full items-center gap-3 rounded-lg border border-status-pending/30 bg-status-pending/8 px-4 py-3 text-sm font-medium text-status-pending transition-colors hover:bg-status-pending/15"
              >
                <Ban className="h-4 w-4" aria-hidden />
                Disable User
              </button>
            )}
            <button
              onClick={() => onAction("delete", user)}
              className="flex w-full items-center gap-3 rounded-lg border border-status-cancelled/30 bg-status-cancelled/8 px-4 py-3 text-sm font-medium text-status-cancelled transition-colors hover:bg-status-cancelled/15"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Delete User
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
