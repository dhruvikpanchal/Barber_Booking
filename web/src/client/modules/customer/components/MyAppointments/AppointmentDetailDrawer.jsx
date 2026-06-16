"use client";

import {
  X,
  MapPin,
  Clock,
  Calendar,
  Scissors,
  DollarSign,
  StickyNote,
  AlertCircle,
  User,
} from "lucide-react";
import Drawer from "@/client/modules/shared/components/ui/Drawer";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { CUSTOMER_APPOINTMENT_STATUSES } from "@/client/modules/customer/constants/appointmentStatusesConstants.js";
import {
  formatDateTime,
  formatShopCity,
  formatShopLabel,
  getTotalDuration,
} from "@/client/modules/customer/helpers/appointmentsHelpers.js";
import { formatMoney } from "@/client/lib/format/formatMoney.js";

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="border-outline-variant/60 flex items-start gap-3 border-b py-3.5 last:border-0">
      <div className="border-outline-variant bg-surface-container text-on-surface-variant flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-label-caps text-on-surface-variant text-[10px]">{label}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

export default function AppointmentDetailDrawer({ appt, onClose, onCancel, onRebook, onReview }) {
  if (!appt) return null;

  const { date, time, relative } = formatDateTime(appt.startAt);
  const totalDuration = getTotalDuration(appt.services);
  const bookedAt = new Date(appt.bookedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Drawer
      open
      onClose={onClose}
      backdropClassName="bg-black/60 backdrop-blur-sm"
      panelClassName="scrollbar-thin w-full max-w-md overflow-y-auto border-outline-variant bg-surface-container-low shadow-2xl"
    >
      {/* Header */}
      <header className="border-outline-variant bg-surface-container-low/95 sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur">
        <div>
          <p className="font-label-caps text-primary text-xs">Booking details</p>
          <p className="text-on-surface-variant mt-0.5 font-mono text-xs">#{appt.id}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-9 w-9 items-center justify-center rounded-lg border transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="flex-1 space-y-5 p-5">
        {/* Barber hero */}
        <div className="border-outline-variant bg-surface-container flex items-center gap-4 rounded-xl border p-4">
          <div className="border-primary/30 h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2">
            <img
              src={appt.barber.image}
              alt={appt.barber.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-on-surface font-semibold">{appt.barber.name}</p>
              <StatusBadge status={appt.status} config={CUSTOMER_APPOINTMENT_STATUSES} size="sm" />
            </div>
            <p className="text-on-surface-variant text-xs">{appt.barber.role}</p>
            {formatShopLabel(appt.shop) !== "—" ? (
              <p className="text-on-surface-variant text-xs">{formatShopLabel(appt.shop)}</p>
            ) : null}
          </div>
        </div>

        {/* Info rows */}
        <div className="border-outline-variant bg-surface-container rounded-xl border px-4">
          <InfoRow icon={MapPin} label="Location">
            <p className="text-on-surface text-sm">{formatShopLabel(appt.shop)}</p>
            {formatShopCity(appt.shop) ? (
              <p className="text-on-surface-variant text-xs">{formatShopCity(appt.shop)}</p>
            ) : null}
          </InfoRow>

          <InfoRow icon={Calendar} label="Date">
            <p className="text-on-surface text-sm font-semibold">{date}</p>
            <p className="text-on-surface-variant text-xs">{relative}</p>
          </InfoRow>

          <InfoRow icon={Clock} label="Time">
            <p className="text-on-surface text-sm">{time}</p>
            <p className="text-on-surface-variant text-xs">{totalDuration} min total</p>
          </InfoRow>

          <InfoRow icon={Scissors} label="Services">
            <div className="space-y-1">
              {appt.services.map((s) => (
                <div key={s.name} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-on-surface">{s.name}</span>
                  <div className="text-on-surface-variant flex items-center gap-3 text-xs">
                    <span>{s.duration} min</span>
                    <span className="text-on-surface font-semibold">{formatMoney(s.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </InfoRow>

          <InfoRow icon={DollarSign} label="Price">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-on-surface-variant text-[10px]">Estimated</p>
                <p className="text-on-surface font-semibold">{formatMoney(appt.estimatedPrice)}</p>
              </div>
              {appt.finalPrice != null && (
                <>
                  <span className="text-on-surface-variant">→</span>
                  <div>
                    <p className="text-on-surface-variant text-[10px]">Final</p>
                    <p className="text-primary font-semibold">{formatMoney(appt.finalPrice)}</p>
                  </div>
                </>
              )}
            </div>
          </InfoRow>

          {appt.notes && (
            <InfoRow icon={StickyNote} label="Notes">
              <p className="text-on-surface text-sm">{appt.notes}</p>
            </InfoRow>
          )}

          {appt.cancelReason && (
            <InfoRow icon={AlertCircle} label="Cancellation reason">
              <p className="text-on-surface text-sm">{appt.cancelReason}</p>
              {appt.cancelledBy && (
                <p className="text-on-surface-variant text-xs">
                  Cancelled by: <span className="capitalize">{appt.cancelledBy}</span>
                </p>
              )}
            </InfoRow>
          )}

          <InfoRow icon={User} label="Booked on">
            <p className="text-on-surface-variant text-sm">{bookedAt}</p>
          </InfoRow>
        </div>
      </div>

      {/* Footer actions */}
      <div className="border-outline-variant bg-surface-container-low/95 sticky bottom-0 border-t p-4 backdrop-blur">
        <div className="flex flex-col gap-2.5">
          {(appt.status === "pending" || appt.status === "confirmed") && (
            <button
              type="button"
              onClick={() => onCancel(appt)}
              className="border-status-cancelled/30 bg-status-cancelled/10 text-status-cancelled hover:bg-status-cancelled/20 flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all"
            >
              Cancel Booking
            </button>
          )}
          {appt.status === "completed" && !appt.reviewed && (
            <button
              type="button"
              onClick={() => onReview(appt)}
              className="bg-primary text-on-primary flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            >
              Leave a Review
            </button>
          )}
          {(appt.status === "completed" || appt.status === "cancelled") && (
            <button
              type="button"
              onClick={() => onRebook(appt)}
              className="border-outline-variant text-on-surface hover:bg-surface-container-high flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all"
            >
              Rebook
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface flex h-10 w-full items-center justify-center rounded-xl text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Drawer>
  );
}
