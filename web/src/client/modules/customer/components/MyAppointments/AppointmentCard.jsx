"use client";

import Link from "@/lib/AppLink";
import { MapPin, Clock, Eye, XCircle, Star, Calendar, ChevronRight } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { CUSTOMER_APPOINTMENT_STATUSES } from "@/client/modules/customer/constants/appointmentStatusesConstants.js";
import BarberImage from "@/client/modules/customer/components/shared/BarberImage.jsx";
import {
  formatDateTime,
  formatShopLabel,
  getServiceNames,
  getTotalDuration,
} from "@/client/modules/customer/helpers/appointmentsHelpers.js";

export default function AppointmentCard({
  appt,
  onView,
  onCancel,
  onReview,
  disabled = false,
}) {
  const { date, time, relative } = formatDateTime(appt.startAt);
  const totalDuration = getTotalDuration(appt.services);
  const serviceNames = getServiceNames(appt.services);

  return (
    <article className="group border-outline-variant bg-surface-container-low hover:border-outline min-w-0 rounded-xl border transition-all hover:shadow-sm">
      {/* Card header */}
      <div className="flex items-start gap-3.5 p-4">
        {/* Barber photo */}
        <div className="relative shrink-0">
          <BarberImage
            src={appt.barber.image}
            name={appt.barber.name}
            className="h-12 w-12 rounded-xl"
          />
        </div>

        {/* Main info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-on-surface truncate font-semibold">{appt.barber.name}</p>
              <p className="text-on-surface-variant text-xs">{appt.barber.role}</p>
            </div>
            <StatusBadge status={appt.status} config={CUSTOMER_APPOINTMENT_STATUSES} size="sm" />
          </div>

          {/* Meta pills */}
          <div className="text-on-surface-variant mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-xs">
            <span className="flex items-center gap-1">
              <MapPin className="text-primary/60 h-3.5 w-3.5 shrink-0" />
              {formatShopLabel(appt.shop)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="text-primary/60 h-3.5 w-3.5 shrink-0" />
              {relative}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="text-primary/60 h-3.5 w-3.5 shrink-0" />
              {time} · {totalDuration} min
            </span>
          </div>
        </div>
      </div>

      <div className="border-outline-variant/60 mx-4 border-t" />
      <p className="text-on-surface-variant px-4 pt-3 text-xs">
        <span className="text-on-surface font-medium">{date}</span>
        {" · "}
        <span className="truncate">{serviceNames}</span>
      </p>

      {/* Actions */}
      <div className="border-outline-variant/60 mx-4 border-t" />
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <Link
          href={routes.customer.appointmentsDetail(appt.id)}
          onClick={() => onView?.(appt)}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          className="bg-primary/10 text-primary hover:bg-primary/20 inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden />
          Details
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>

        {(appt.status === "pending" || appt.status === "confirmed") && (
          <button
            type="button"
            onClick={() => onCancel(appt)}
            disabled={disabled}
            className="border-status-cancelled/30 bg-status-cancelled/8 text-status-cancelled hover:bg-status-cancelled/15 inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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
            className="bg-primary text-on-primary inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Star className="h-3.5 w-3.5" />
            Leave Review
          </button>
        )}

        {appt.status === "completed" && appt.reviewed && (
          <span className="border-outline-variant text-on-surface-variant inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs">
            <Star className="text-status-pending h-3.5 w-3.5" />
            Reviewed
          </span>
        )}
      </div>
    </article>
  );
}
