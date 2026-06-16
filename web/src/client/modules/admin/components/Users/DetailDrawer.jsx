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
import { ActivityBadge, UserStatusBadge } from "@/client/modules/shared/components/ui/badges.jsx";
import { formatShortDate, formatRelativeAge } from "@/client/lib/format/formatDateTime.js";
import {
  USER_STATUS_CONFIG,
  BOOKING_STATUS_CONFIG,
} from "@/client/modules/admin/constants/adminConstants.js";
import Drawer from "@/client/modules/shared/components/ui/Drawer";

export default function DetailDrawer({ user, onClose, onAction }) {
  const [histTab, setHistTab] = useState("bookings");
  if (!user) return null;

  return (
    <Drawer
      open
      onClose={onClose}
      zIndex="z-40"
      panelClassName="scrollbar-thin border-outline-variant bg-surface-container-low w-full max-w-md overflow-y-auto"
    >
      {/* Header */}
      <header className="border-outline-variant bg-surface-container-low/95 sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur">
        <div>
          <p className="font-label-caps text-primary">Admin · User Details</p>
          <p className="text-on-surface-variant text-xs">ID: {user.id}</p>
        </div>
        <button
          onClick={onClose}
          className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-9 w-9 items-center justify-center rounded-md"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </header>

      <div className="space-y-6 p-5">
        {/* Identity */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="bg-primary/20 text-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-serif text-xl font-bold">
              {user.initials}
            </div>
            <span
              className={`border-surface-container-low absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border-2 ${USER_STATUS_CONFIG[user.status]?.dot ?? "bg-outline"}`}
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-on-surface font-serif text-2xl font-bold">{user.name}</h2>
            <p className="text-on-surface-variant mt-0.5 text-sm">
              Member since {formatShortDate(user.joinedAt)}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <UserStatusBadge status={user.status} />
              <ActivityBadge level={user.activity} />
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="border-outline-variant bg-surface-container rounded-xl border px-4">
          {[
            { Icon: Mail, label: "Email", value: user.email },
            { Icon: Phone, label: "Phone", value: user.phone },
            { Icon: MapPin, label: "Location", value: user.city },
            {
              Icon: Clock,
              label: "Last Active",
              value: formatRelativeAge(user.lastActive),
            },
          ].map(({ Icon, label, value }) => (
            <div
              key={label}
              className="border-outline-variant/60 flex items-start gap-3 border-b py-3 last:border-b-0"
            >
              <span className="bg-surface-container-high text-on-surface-variant mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="font-label-caps text-on-surface-variant">{label}</p>
                <p className="text-on-surface text-sm">{value}</p>
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
              className="border-outline-variant bg-surface-container-low flex items-center gap-3 rounded-xl border p-3"
            >
              <span className="bg-primary/15 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="font-label-caps text-on-surface-variant">{label}</p>
                <p className="text-on-surface font-serif text-lg leading-tight font-bold">
                  {value}
                </p>
                <p className="text-on-surface-variant text-[10px]">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Favourite barber/shop */}
        <div className="border-outline-variant bg-surface-container space-y-2 rounded-xl border px-4 py-3">
          <p className="font-label-caps text-on-surface-variant">Preferences</p>
          <div className="flex items-center gap-3">
            <Scissors className="text-primary h-4 w-4 shrink-0" aria-hidden />
            <span className="text-on-surface text-sm">
              Favourite barber: <span className="font-medium">{user.favoriteBarber}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Star className="text-primary h-4 w-4 shrink-0" aria-hidden />
            <span className="text-on-surface text-sm">
              Favourite shop: <span className="font-medium">{user.favoriteShop}</span>
            </span>
          </div>
        </div>

        {/* History tabs */}
        <div>
          <div className="border-outline-variant bg-surface-container mb-3 flex gap-1 rounded-lg border p-1">
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
                <p className="text-on-surface-variant py-6 text-center text-sm">No bookings yet.</p>
              ) : (
                user.bookingHistory.map((bk) => {
                  const bkCfg = BOOKING_STATUS_CONFIG[bk.status] ?? BOOKING_STATUS_CONFIG.pending;
                  return (
                    <div
                      key={bk.id}
                      className="border-outline-variant bg-surface-container flex items-start justify-between gap-3 rounded-lg border px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-on-surface truncate text-sm font-medium">{bk.service}</p>
                        <p className="text-on-surface-variant text-xs">
                          {bk.barber} · {formatShortDate(bk.date)}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${bkCfg.cls}`}
                        >
                          {bkCfg.label}
                        </span>
                        <span className="text-on-surface text-xs font-semibold">${bk.price}</span>
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
                    ? Math.round((user.cancelledBookings / user.bookingsTotal) * 100)
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
                    <span className="text-on-surface-variant flex items-center gap-1.5 text-xs">
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                      {label}
                    </span>
                    <span className="text-on-surface text-xs font-semibold">
                      {display ?? `${value}${suffix ?? ""}`}
                    </span>
                  </div>
                  <div className="bg-surface-container-high h-2 w-full overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (value / max) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="border-outline-variant bg-surface-container mt-2 rounded-lg border px-3 py-2.5">
                <p className="font-label-caps text-on-surface-variant">Last seen</p>
                <p className="text-on-surface mt-0.5 text-sm">
                  {formatShortDate(user.lastActive)} · {formatRelativeAge(user.lastActive)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Admin actions */}
        <div className="border-outline-variant space-y-2 border-t pt-4">
          <p className="font-label-caps text-on-surface-variant mb-3">Admin Actions</p>
          {user.status === "disabled" ? (
            <button
              onClick={() => onAction("enable", user)}
              className="border-status-confirmed/30 bg-status-confirmed/8 text-status-confirmed hover:bg-status-confirmed/15 flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Re-enable User
            </button>
          ) : (
            <button
              onClick={() => onAction("disable", user)}
              className="border-status-pending/30 bg-status-pending/8 text-status-pending hover:bg-status-pending/15 flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors"
            >
              <Ban className="h-4 w-4" aria-hidden />
              Disable User
            </button>
          )}
          <button
            onClick={() => onAction("delete", user)}
            className="border-status-cancelled/30 bg-status-cancelled/8 text-status-cancelled hover:bg-status-cancelled/15 flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Delete User
          </button>
        </div>
      </div>
    </Drawer>
  );
}
