"use client";

import {
  Activity,
  Eye,
  History,
  MapPin,
  Scissors,
  Sparkles,
  User,
} from "lucide-react";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { APPOINTMENT_STATUSES } from "@/modules/admin/constants/admin.js";

export function formatWhen(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return { date, time };
}

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function hasServiceUpdate(appt) {
  return Boolean(appt.originalService);
}

function AdminActions({
  appt,
  compact,
  onView,
  onMonitor,
  onHistory,
  onServiceUpdated,
}) {
  const btn =
    "inline-flex items-center justify-center gap-1 rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface";
  const size = compact ? "h-8 px-2 text-[11px]" : "h-9 px-2.5 text-xs";
  const serviceChanged = hasServiceUpdate(appt);

  return (
    <div className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        onClick={() => onView(appt)}
        className={`${btn} ${size} font-semibold`}
        title="View details"
      >
        <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className={compact ? "sr-only sm:not-sr-only" : ""}>Details</span>
      </button>
      <button
        type="button"
        onClick={() => onMonitor(appt)}
        className={`${btn} ${size}`}
        title="Monitor updates"
      >
        <Activity className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="hidden xl:inline">Monitor</span>
      </button>
      <button
        type="button"
        onClick={() => onHistory(appt)}
        className={`${btn} ${size}`}
        title="Modification history"
      >
        <History className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="hidden xl:inline">History</span>
      </button>
      <button
        type="button"
        onClick={() => onServiceUpdated(appt)}
        disabled={!serviceChanged}
        className={`${btn} ${size} ${
          serviceChanged
            ? "border-primary/40 text-primary hover:bg-primary/10"
            : "cursor-not-allowed opacity-40"
        }`}
        title={
          serviceChanged
            ? "View service update"
            : "No service changes on this booking"
        }
      >
        <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="hidden xl:inline">Service</span>
      </button>
    </div>
  );
}

export function AppointmentTableRow({ appt, ...handlers }) {
  const { date, time } = formatWhen(appt.startAt);
  return (
    <tr className="border-t border-outline-variant transition-colors hover:bg-surface-container/40">
      <td className="px-4 py-3">
        <p className="font-mono text-xs font-semibold text-primary">
          {appt.id}
        </p>
        <p className="mt-0.5 text-[11px] text-on-surface-variant">
          {new Date(appt.createdAt).toLocaleDateString()}
        </p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-serif text-sm font-bold text-primary">
            {initials(appt.customer.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-on-surface">
              {appt.customer.name}
            </p>
            <p className="truncate text-xs text-on-surface-variant">
              {appt.customer.phone}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="font-semibold text-on-surface">{appt.barberName}</p>
        <p className="text-xs text-on-surface-variant">{appt.shop}</p>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 text-sm text-on-surface">
          <MapPin className="h-3.5 w-3.5 text-on-surface-variant" aria-hidden />
          {appt.city}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-on-surface">
          <Scissors
            className="h-3.5 w-3.5 text-on-surface-variant"
            aria-hidden
          />
          {appt.service}
        </div>
        {hasServiceUpdate(appt) && (
          <p className="mt-0.5 text-[11px] text-primary">Service updated</p>
        )}
        <p className="mt-0.5 text-xs text-on-surface-variant">
          ${appt.price} · {appt.duration}m
        </p>
      </td>
      <td className="px-4 py-3 text-sm">
        <p className="font-semibold text-on-surface">{date}</p>
        <p className="text-xs text-on-surface-variant">{time}</p>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={appt.status} config={APPOINTMENT_STATUSES} />
      </td>
      <td className="px-4 py-3">
        <AdminActions appt={appt} compact {...handlers} />
      </td>
    </tr>
  );
}

export function AppointmentCard({ appt, ...handlers }) {
  const { date, time } = formatWhen(appt.startAt);
  return (
    <article className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
      <div className="flex items-start justify-between gap-3 flex-col sm:flex-row">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 font-serif text-sm font-bold text-primary">
            {initials(appt.customer.name)}
          </span>
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold text-primary">
              {appt.id}
            </p>
            <h3 className="font-serif text-base font-bold text-on-surface">
              {appt.customer.name}
            </h3>
            <p className="text-xs text-on-surface-variant">
              <User className="mr-1 inline h-3 w-3" aria-hidden />
              {appt.barberName} · {appt.shop}
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">
              {appt.city} · {date} {time}
            </p>
          </div>
        </div>
        <StatusBadge status={appt.status} config={APPOINTMENT_STATUSES} />
      </div>
      <p className="mt-3 text-sm text-on-surface">
        {appt.service}
        <span className="text-on-surface-variant"> · ${appt.price}</span>
      </p>
      <div className="mt-3 flex justify-end">
        <AdminActions appt={appt} {...handlers} />
      </div>
    </article>
  );
}
