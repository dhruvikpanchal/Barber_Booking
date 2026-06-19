"use client";

import { Activity, Eye, History, MapPin, Scissors, Sparkles, User } from "lucide-react";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { formatMoney } from "@/client/lib/format/formatMoney.js";
import { APPOINTMENT_STATUSES } from "@/client/modules/admin/constants/adminConstants.js";

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

function AdminActions({ appt, compact, onView, onMonitor, onHistory, onServiceUpdated }) {
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
        title={serviceChanged ? "View service update" : "No service changes on this booking"}
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
    <tr className="border-outline-variant hover:bg-surface-container/40 border-t transition-colors">
      <td className="px-4 py-3">
        <p className="text-primary font-mono text-xs font-semibold">{appt.id}</p>
        <p className="text-on-surface-variant mt-0.5 text-[11px]">
          {new Date(appt.createdAt).toLocaleDateString()}
        </p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="bg-primary/15 text-primary flex h-10 w-10 items-center justify-center rounded-full font-serif text-sm font-bold">
            {initials(appt.customer.name)}
          </span>
          <div className="min-w-0">
            <p className="text-on-surface truncate font-semibold">{appt.customer.name}</p>
            <p className="text-on-surface-variant truncate text-xs">{appt.customer.phone}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-on-surface font-semibold">{appt.barberName}</p>
        <p className="text-on-surface-variant text-xs">{appt.shop}</p>
      </td>
      <td className="px-4 py-3">
        <span className="text-on-surface inline-flex items-center gap-1 text-sm">
          <MapPin className="text-on-surface-variant h-3.5 w-3.5" aria-hidden />
          {appt.city}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="text-on-surface flex items-center gap-2 text-sm">
          <Scissors className="text-on-surface-variant h-3.5 w-3.5" aria-hidden />
          {appt.service}
        </div>
        {hasServiceUpdate(appt) && (
          <p className="text-primary mt-0.5 text-[11px]">Service updated</p>
        )}
        <p className="text-on-surface-variant mt-0.5 text-xs">
          {formatMoney(appt.price)} · {appt.duration}m
        </p>
      </td>
      <td className="px-4 py-3 text-sm">
        <p className="text-on-surface font-semibold">{date}</p>
        <p className="text-on-surface-variant text-xs">{time}</p>
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
    <article className="border-outline-variant bg-surface-container-low rounded-xl border p-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
        <div className="flex min-w-0 items-start gap-3">
          <span className="bg-primary/15 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-sm font-bold">
            {initials(appt.customer.name)}
          </span>
          <div className="min-w-0">
            <p className="text-primary font-mono text-xs font-semibold">{appt.id}</p>
            <h3 className="text-on-surface font-serif text-base font-bold">{appt.customer.name}</h3>
            <p className="text-on-surface-variant text-xs">
              <User className="mr-1 inline h-3 w-3" aria-hidden />
              {appt.barberName} · {appt.shop}
            </p>
            <p className="text-on-surface-variant mt-1 text-xs">
              {appt.city} · {date} {time}
            </p>
          </div>
        </div>
        <StatusBadge status={appt.status} config={APPOINTMENT_STATUSES} />
      </div>
      <p className="text-on-surface mt-3 text-sm">
        {appt.service}
        <span className="text-on-surface-variant"> · {formatMoney(appt.price)}</span>
      </p>
      <div className="mt-3 flex justify-end">
        <AdminActions appt={appt} {...handlers} />
      </div>
    </article>
  );
}
