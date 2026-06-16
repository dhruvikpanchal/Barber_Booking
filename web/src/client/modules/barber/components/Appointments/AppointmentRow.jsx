"use client";

import Link from "next/link";
import { Check, X, CalendarClock, Eye, Scissors, Clock, Phone } from "lucide-react";
import { routes } from "@/client/config/routes/routes.js";
import { formatDateLabel, formatTimeLabel } from "@/client/lib/format/formatDateTime.js";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { STATUSES } from "@/client/modules/barber/constants/statusConstants.js";

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function formatWhen(iso) {
  const date = formatDateLabel(iso, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = formatTimeLabel(iso);
  return { date, time };
}

const BTN =
  "inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-40";

function Actions({
  appt,
  layout = "inline",
  onAccept,
  onReject,
  onReschedule,
  onView,
}) {
  const isPending = appt.status === "pending";
  const iconOnly = layout === "compact";

  const viewBtn = (
    <Link
      href={routes.barber.appointmentsDetail(appt.id)}
      onClick={() => onView?.(appt)}
      className={`${BTN} ${iconOnly ? "h-8 w-8" : "h-8 px-2.5"} border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface border`}
      aria-label="View details"
      title="View details"
    >
      <Eye className="h-3.5 w-3.5" aria-hidden />
      {!iconOnly && <span>View</span>}
    </Link>
  );

  if (layout === "pending") {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onAccept(appt.id)}
            className={`${BTN} bg-primary text-on-primary h-9 hover:opacity-90`}
          >
            <Check className="h-3.5 w-3.5" aria-hidden />
            Accept
          </button>
          <button
            type="button"
            onClick={() => onReject(appt.id)}
            className={`${BTN} border-outline-variant text-on-surface-variant hover:border-status-cancelled/50 hover:text-status-cancelled h-9 border`}
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Reject
          </button>
        </div>
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onReschedule(appt)}
            className={`${BTN} border-outline-variant text-on-surface-variant hover:bg-surface-container h-8 border px-2.5`}
            title="Reschedule"
          >
            <CalendarClock className="h-3.5 w-3.5" aria-hidden />
            Reschedule
          </button>
          {viewBtn}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {isPending && (
        <>
          <button
            type="button"
            onClick={() => onAccept(appt.id)}
            className={`${BTN} bg-primary text-on-primary h-8 px-2.5 hover:opacity-90`}
          >
            <Check className="h-3.5 w-3.5" aria-hidden />
            Accept
          </button>
          <button
            type="button"
            onClick={() => onReject(appt.id)}
            className={`${BTN} border-outline-variant text-on-surface-variant hover:border-status-cancelled/50 hover:text-status-cancelled h-8 border px-2.5`}
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Reject
          </button>
        </>
      )}
      {appt.status === "confirmed" && (
        <p className="text-on-surface-variant text-[11px] italic">
          Manage this visit from the Queue page.
        </p>
      )}
      {(appt.status === "pending" ||
        appt.status === "confirmed" ||
        appt.status === "rescheduled") && (
        <button
          type="button"
          onClick={() => onReschedule(appt)}
          className={`${BTN} border-outline-variant text-on-surface-variant hover:bg-surface-container h-8 border px-2.5`}
          title="Reschedule"
        >
          <CalendarClock className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">Reschedule</span>
        </button>
      )}
      {viewBtn}
    </div>
  );
}

function WhenBlock({ startAt, className = "" }) {
  const { date, time } = formatWhen(startAt);
  return (
    <p
      className={`text-on-surface-variant inline-flex flex-wrap items-center gap-x-1.5 ${className}`}
    >
      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span className="text-on-surface font-medium">{date}</span>
      <span aria-hidden>·</span>
      <span>{time}</span>
    </p>
  );
}

function cardSurfaceClass(status) {
  if (status === "pending") {
    return "border-status-pending/35 bg-status-pending/5";
  }
  return "border-outline-variant bg-surface-container-low";
}

/** Desktop table row */
export function AppointmentTableRow({ appt, ...handlers }) {
  const { date, time } = formatWhen(appt.startAt);
  const isPending = appt.status === "pending";

  return (
    <tr
      className={`border-outline-variant hover:bg-surface-container/40 border-t transition-colors ${
        isPending ? "bg-status-pending/5" : ""
      }`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="bg-primary/15 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-serif text-xs font-bold">
            {initials(appt.customer.name)}
          </span>
          <div className="min-w-0">
            <p className="text-on-surface truncate text-sm font-semibold">{appt.customer.name}</p>
            <p className="text-on-surface-variant truncate text-xs">{appt.customer.phone}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="text-on-surface flex items-center gap-1.5 truncate text-sm">
          <Scissors className="text-on-surface-variant h-3.5 w-3.5 shrink-0" aria-hidden />
          {appt.service}
        </p>
        <p className="text-on-surface-variant mt-0.5 text-xs">
          ${appt.price} · {appt.duration} min
        </p>
      </td>
      <td className="px-4 py-3">
        <p className="text-on-surface text-sm font-medium">{date}</p>
        <p className="text-on-surface-variant text-xs">{time}</p>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={appt.status} config={STATUSES} />
      </td>
      <td className="px-4 py-3">
        <Actions appt={appt} layout="inline" {...handlers} />
      </td>
    </tr>
  );
}

/** Mobile / narrow card — same hierarchy as table */
export function AppointmentCard({ appt, ...handlers }) {
  const isPending = appt.status === "pending";

  return (
    <article className={`rounded-lg border p-3 transition-colors ${cardSurfaceClass(appt.status)}`}>
      <div className="flex gap-3">
        <span className="bg-primary/15 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-serif text-xs font-bold">
          {initials(appt.customer.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-on-surface truncate text-sm font-semibold">
                {appt.customer.name}
              </h3>
              <p className="text-on-surface-variant mt-0.5 flex items-center gap-1 truncate text-xs">
                <Phone className="h-3 w-3 shrink-0" aria-hidden />
                {appt.customer.phone}
              </p>
            </div>
            <StatusBadge status={appt.status} config={STATUSES} />
          </div>

          <div className="border-outline-variant/60 bg-surface-container mt-2 rounded-md border px-2.5 py-2">
            <p className="text-on-surface flex items-center gap-1.5 truncate text-xs font-semibold">
              <Scissors className="text-primary/80 h-3.5 w-3.5 shrink-0" aria-hidden />
              {appt.service}
            </p>
            <div className="text-on-surface-variant mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 text-[11px]">
              <WhenBlock startAt={appt.startAt} className="text-[11px]" />
              <span className="text-on-surface shrink-0 font-medium">
                ${appt.price} · {appt.duration}m
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-outline-variant/60 mt-2.5 border-t pt-2.5">
        <Actions appt={appt} layout={isPending ? "pending" : "compact"} {...handlers} />
      </div>
    </article>
  );
}
