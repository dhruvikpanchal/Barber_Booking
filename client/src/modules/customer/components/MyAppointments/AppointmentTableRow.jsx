"use client";

import Link from "next/link";
import { Eye, RotateCcw, XCircle, Star } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import ApptStatusBadge from "./ApptStatusBadge.jsx";
import {
  formatDateTime,
  formatMoney,
  getTotalDuration,
} from "../../../../data/customer/appointmentsData.js";

export default function AppointmentTableRow({
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
    <tr className="group border-b border-outline-variant/60 transition-colors last:border-0 hover:bg-surface-container/40">
      {/* Barber */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-outline-variant">
            <img
              src={appt.barber.image}
              alt={appt.barber.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-on-surface truncate">
              {appt.barber.name}
            </p>
            <p className="text-xs text-on-surface-variant truncate">
              {appt.barber.role}
            </p>
          </div>
        </div>
      </td>

      {/* Shop */}
      <td className="px-4 py-3.5 text-sm">
        <p className="font-medium text-on-surface leading-snug">
          {appt.shop.name.replace("Iron & Oak — ", "")}
        </p>
        <p className="text-xs text-on-surface-variant">{appt.shop.city}</p>
      </td>

      {/* Services */}
      <td className="px-4 py-3.5 max-w-[160px]">
        <p className="truncate text-sm text-on-surface" title={serviceNames}>
          {serviceNames}
        </p>
        <p className="text-xs text-on-surface-variant">{totalDuration} min</p>
      </td>

      {/* Date & time */}
      <td className="px-4 py-3.5 text-sm">
        <p className="font-semibold text-on-surface">{date}</p>
        <p className="text-xs text-on-surface-variant">
          {time} · <span className="text-primary/80">{relative}</span>
        </p>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <ApptStatusBadge status={appt.status} />
      </td>

      {/* Prices */}
      <td className="px-4 py-3.5 text-sm">
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <span className="text-xs">Est.</span>
          <span className="font-medium text-on-surface">
            {formatMoney(appt.estimatedPrice)}
          </span>
        </div>
        {appt.finalPrice != null && (
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="text-xs">Final</span>
            <span className="font-semibold text-primary">
              {formatMoney(appt.finalPrice)}
            </span>
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <Link
            href={routes.customer.appointmentsDetail(appt.id)}
            onClick={() => onView?.(appt)}
            title="View details"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <Eye className="h-4 w-4" />
          </Link>

          {(appt.status === "pending" || appt.status === "confirmed") && (
            <button
              type="button"
              onClick={() => onCancel(appt)}
              title="Cancel booking"
              className="flex h-8 items-center gap-1 rounded-lg border border-status-cancelled/30 px-2.5 text-xs font-semibold text-status-cancelled transition-colors hover:bg-status-cancelled/10"
            >
              <XCircle className="h-3.5 w-3.5" />
              Cancel
            </button>
          )}

          {appt.status === "completed" && !appt.reviewed && (
            <button
              type="button"
              onClick={() => onReview(appt)}
              className="flex h-8 items-center gap-1 rounded-lg bg-primary px-2.5 text-xs font-semibold text-on-primary transition-all hover:opacity-90"
            >
              <Star className="h-3.5 w-3.5" />
              Review
            </button>
          )}

          {appt.status === "completed" && appt.reviewed && (
            <span className="flex h-8 items-center gap-1 rounded-lg border border-outline-variant px-2.5 text-xs text-on-surface-variant">
              <Star className="h-3.5 w-3.5 text-status-pending" />
              Reviewed
            </span>
          )}

          {(appt.status === "completed" || appt.status === "cancelled") && (
            <button
              type="button"
              onClick={() => onRebook(appt)}
              title="Rebook"
              className="flex h-8 items-center gap-1 rounded-lg border border-outline-variant px-2.5 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Rebook
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
