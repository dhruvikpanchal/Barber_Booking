"use client";

import Link from "next/link";
import {
  MapPin,
  Clock,
  Eye,
  RotateCcw,
  XCircle,
  Star,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import ApptStatusBadge from "./ApptStatusBadge.jsx";
import {
  formatDateTime,
  getTotalDuration,
} from "../../../../data/customer/appointmentsData.js";

export default function AppointmentCard({
  appt,
  onView,
  onCancel,
  onRebook,
  onReview,
}) {
  const { date, time, relative } = formatDateTime(appt.startAt);
  const totalDuration = getTotalDuration(appt.services);
  const serviceNames = appt.services.map((s) => s.name).join(", ");

  return (
    <article className="group min-w-0 rounded-xl border border-outline-variant bg-surface-container-low transition-all hover:border-outline hover:shadow-sm">
      {/* Card header */}
      <div className="flex items-start gap-3.5 p-4">
        {/* Barber photo */}
        <div className="relative shrink-0">
          <div className="h-12 w-12 overflow-hidden rounded-xl border border-outline-variant">
            <img
              src={appt.barber.image}
              alt={appt.barber.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Main info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-semibold text-on-surface">
                {appt.barber.name}
              </p>
              <p className="text-xs text-on-surface-variant">
                {appt.barber.role}
              </p>
            </div>
            <ApptStatusBadge status={appt.status} size="sm" />
          </div>

          {/* Meta pills */}
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/60" />
              {appt.shop.name.replace("Iron & Oak — ", "")}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-primary/60" />
              {relative}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 shrink-0 text-primary/60" />
              {time} · {totalDuration} min
            </span>
          </div>
        </div>
      </div>

      <div className="mx-4 border-t border-outline-variant/60" />
      <p className="px-4 pt-3 text-xs text-on-surface-variant">
        <span className="font-medium text-on-surface">{date}</span>
        {" · "}
        <span className="truncate">{serviceNames}</span>
      </p>

      {/* Actions */}
      <div className="mx-4 border-t border-outline-variant/60" />
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <Link
          href={routes.customer.appointmentsDetail(appt.id)}
          onClick={() => onView?.(appt)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary/10 px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden />
          Details
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>

        {(appt.status === "pending" || appt.status === "confirmed") && (
          <button
            type="button"
            onClick={() => onCancel(appt)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-status-cancelled/30 bg-status-cancelled/8 px-3 text-xs font-semibold text-status-cancelled transition-colors hover:bg-status-cancelled/15"
          >
            <XCircle className="h-3.5 w-3.5" />
            Cancel
          </button>
        )}

        {appt.status === "completed" && !appt.reviewed && (
          <button
            type="button"
            onClick={() => onReview(appt)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-on-primary transition-all hover:opacity-90"
          >
            <Star className="h-3.5 w-3.5" />
            Leave Review
          </button>
        )}

        {appt.status === "completed" && appt.reviewed && (
          <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-outline-variant px-3 text-xs text-on-surface-variant">
            <Star className="h-3.5 w-3.5 text-status-pending" />
            Reviewed
          </span>
        )}

        {(appt.status === "completed" || appt.status === "cancelled") && (
          <button
            type="button"
            onClick={() => onRebook(appt)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-outline-variant px-3 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Rebook
          </button>
        )}
      </div>
    </article>
  );
}
