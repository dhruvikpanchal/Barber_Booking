"use client";

import Link from "next/link";
import { Eye, RotateCcw, XCircle, Star } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { CUSTOMER_APPOINTMENT_STATUSES } from "@/client/modules/customer/constants/appointmentStatusesConstants.js";
import {
  formatDateTime,
  formatShopCity,
  formatShopLabel,
  getServiceNames,
  getTotalDuration,
} from "@/client/modules/customer/helpers/appointmentsHelpers.js";
import { formatMoney } from "@/client/lib/format/formatMoney.js";

export default function AppointmentTableRow({
  appt,
  onView,
  onCancel,
  onRebook,
  onReview,
  disabled = false,
}) {
  const { date, time, relative } = formatDateTime(appt.startAt);
  const totalDuration = getTotalDuration(appt.services);
  const serviceNames = getServiceNames(appt.services);

  return (
    <tr className="group border-outline-variant/60 hover:bg-surface-container/40 border-b transition-colors last:border-0">
      {/* Barber */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="border-outline-variant h-10 w-10 shrink-0 overflow-hidden rounded-lg border">
            <img
              src={appt.barber.image}
              alt={appt.barber.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="min-w-0">
            <p className="text-on-surface truncate font-semibold">{appt.barber.name}</p>
            <p className="text-on-surface-variant truncate text-xs">{appt.barber.role}</p>
          </div>
        </div>
      </td>

      {/* Shop */}
      <td className="px-4 py-3.5 text-sm">
        <p className="text-on-surface leading-snug font-medium">{formatShopLabel(appt.shop)}</p>
        {formatShopCity(appt.shop) ? (
          <p className="text-on-surface-variant text-xs">{formatShopCity(appt.shop)}</p>
        ) : null}
      </td>

      {/* Services */}
      <td className="max-w-[160px] px-4 py-3.5">
        <p className="text-on-surface truncate text-sm" title={serviceNames}>
          {serviceNames}
        </p>
        <p className="text-on-surface-variant text-xs">{totalDuration} min</p>
      </td>

      {/* Date & time */}
      <td className="px-4 py-3.5 text-sm">
        <p className="text-on-surface font-semibold">{date}</p>
        <p className="text-on-surface-variant text-xs">
          {time} · <span className="text-primary/80">{relative}</span>
        </p>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <StatusBadge status={appt.status} config={CUSTOMER_APPOINTMENT_STATUSES} />
      </td>

      {/* Prices */}
      <td className="px-4 py-3.5 text-sm">
        <div className="text-on-surface-variant flex items-center gap-1.5">
          <span className="text-xs">Est.</span>
          <span className="text-on-surface font-medium">{formatMoney(appt.estimatedPrice)}</span>
        </div>
        {appt.finalPrice != null && (
          <div className="text-on-surface-variant flex items-center gap-1.5">
            <span className="text-xs">Final</span>
            <span className="text-primary font-semibold">{formatMoney(appt.finalPrice)}</span>
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
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : undefined}
            className="border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-8 w-8 items-center justify-center rounded-lg border transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            <Eye className="h-4 w-4" />
          </Link>

          {(appt.status === "pending" || appt.status === "confirmed") && (
            <button
              type="button"
              onClick={() => onCancel(appt)}
              disabled={disabled}
              title="Cancel booking"
              className="border-status-cancelled/30 text-status-cancelled hover:bg-status-cancelled/10 flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XCircle className="h-3.5 w-3.5" />
              Cancel
            </button>
          )}

          {appt.status === "completed" && !appt.reviewed && (
            <button
              type="button"
              onClick={() => onReview(appt)}
              disabled={disabled}
              className="bg-primary text-on-primary flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Star className="h-3.5 w-3.5" />
              Review
            </button>
          )}

          {appt.status === "completed" && appt.reviewed && (
            <span className="border-outline-variant text-on-surface-variant flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs">
              <Star className="text-status-pending h-3.5 w-3.5" />
              Reviewed
            </span>
          )}

          {(appt.status === "completed" || appt.status === "cancelled") && (
            <button
              type="button"
              onClick={() => onRebook(appt)}
              disabled={disabled}
              title="Rebook"
              className="border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
