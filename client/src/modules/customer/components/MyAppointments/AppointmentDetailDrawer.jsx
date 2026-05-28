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
import ApptStatusBadge from "./ApptStatusBadge.jsx";
import {
  formatDateTime,
  formatMoney,
  getTotalDuration,
} from "../../../../data/customer/appointmentsData.js";

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 border-b border-outline-variant/60 py-3.5 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface-container text-on-surface-variant">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-label-caps text-[10px] text-on-surface-variant">
          {label}
        </p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

export default function AppointmentDetailDrawer({
  appt,
  onClose,
  onCancel,
  onRebook,
  onReview,
}) {
  if (!appt) return null;

  const { date, time, relative } = formatDateTime(appt.startAt);
  const totalDuration = getTotalDuration(appt.services);
  const bookedAt = new Date(appt.bookedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Appointment details"
    >
      <aside
        className="scrollbar-thin flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-outline-variant bg-surface-container-low shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-outline-variant bg-surface-container-low/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="font-label-caps text-xs text-primary">
              Booking details
            </p>
            <p className="mt-0.5 font-mono text-xs text-on-surface-variant">
              #{appt.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-5 p-5">
          {/* Barber hero */}
          <div className="flex items-center gap-4 rounded-xl border border-outline-variant bg-surface-container p-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-primary/30">
              <img
                src={appt.barber.image}
                alt={appt.barber.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-on-surface">
                  {appt.barber.name}
                </p>
                <ApptStatusBadge status={appt.status} size="sm" />
              </div>
              <p className="text-xs text-on-surface-variant">
                {appt.barber.role}
              </p>
              <p className="text-xs text-on-surface-variant">
                {appt.shop.name}
              </p>
            </div>
          </div>

          {/* Info rows */}
          <div className="rounded-xl border border-outline-variant bg-surface-container px-4">
            <InfoRow icon={MapPin} label="Location">
              <p className="text-sm text-on-surface">{appt.shop.name}</p>
              <p className="text-xs text-on-surface-variant">
                {appt.shop.city}
              </p>
            </InfoRow>

            <InfoRow icon={Calendar} label="Date">
              <p className="text-sm font-semibold text-on-surface">{date}</p>
              <p className="text-xs text-on-surface-variant">{relative}</p>
            </InfoRow>

            <InfoRow icon={Clock} label="Time">
              <p className="text-sm text-on-surface">{time}</p>
              <p className="text-xs text-on-surface-variant">
                {totalDuration} min total
              </p>
            </InfoRow>

            <InfoRow icon={Scissors} label="Services">
              <div className="space-y-1">
                {appt.services.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="text-on-surface">{s.name}</span>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                      <span>{s.duration} min</span>
                      <span className="font-semibold text-on-surface">
                        {formatMoney(s.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </InfoRow>

            <InfoRow icon={DollarSign} label="Price">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] text-on-surface-variant">
                    Estimated
                  </p>
                  <p className="font-semibold text-on-surface">
                    {formatMoney(appt.estimatedPrice)}
                  </p>
                </div>
                {appt.finalPrice != null && (
                  <>
                    <span className="text-on-surface-variant">→</span>
                    <div>
                      <p className="text-[10px] text-on-surface-variant">
                        Final
                      </p>
                      <p className="font-semibold text-primary">
                        {formatMoney(appt.finalPrice)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </InfoRow>

            {appt.notes && (
              <InfoRow icon={StickyNote} label="Notes">
                <p className="text-sm text-on-surface">{appt.notes}</p>
              </InfoRow>
            )}

            {appt.cancelReason && (
              <InfoRow icon={AlertCircle} label="Cancellation reason">
                <p className="text-sm text-on-surface">{appt.cancelReason}</p>
                {appt.cancelledBy && (
                  <p className="text-xs text-on-surface-variant">
                    Cancelled by:{" "}
                    <span className="capitalize">{appt.cancelledBy}</span>
                  </p>
                )}
              </InfoRow>
            )}

            <InfoRow icon={User} label="Booked on">
              <p className="text-sm text-on-surface-variant">{bookedAt}</p>
            </InfoRow>
          </div>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 border-t border-outline-variant bg-surface-container-low/95 p-4 backdrop-blur">
          <div className="flex flex-col gap-2.5">
            {(appt.status === "pending" || appt.status === "confirmed") && (
              <button
                type="button"
                onClick={() => onCancel(appt)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-status-cancelled/30 bg-status-cancelled/10 text-sm font-semibold text-status-cancelled transition-all hover:bg-status-cancelled/20"
              >
                Cancel Booking
              </button>
            )}
            {appt.status === "completed" && !appt.reviewed && (
              <button
                type="button"
                onClick={() => onReview(appt)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary transition-all hover:opacity-90"
              >
                Leave a Review
              </button>
            )}
            {(appt.status === "completed" || appt.status === "cancelled") && (
              <button
                type="button"
                onClick={() => onRebook(appt)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface transition-all hover:bg-surface-container-high"
              >
                Rebook
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-full items-center justify-center rounded-xl text-sm text-on-surface-variant transition-colors hover:text-on-surface"
            >
              Close
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
