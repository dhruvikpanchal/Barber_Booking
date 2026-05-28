"use client";

import { AlertTriangle, X } from "lucide-react";
import { formatDateTime } from "../../../../data/customer/appointmentsData.js";

export default function CancelModal({ appt, onConfirm, onClose, cancelling }) {
  if (!appt) return null;
  const { date, time } = formatDateTime(appt.startAt);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container-low shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-status-cancelled/30 bg-status-cancelled/10">
              <AlertTriangle className="h-4 w-4 text-status-cancelled" />
            </div>
            <div>
              <p className="font-semibold text-on-surface">Cancel Booking</p>
              <p className="text-xs text-on-surface-variant">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Appointment recap */}
          <div className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container p-4">
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-outline-variant">
              <img
                src={appt.barber.image}
                alt={appt.barber.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-on-surface">
                {appt.barber.name}
              </p>
              <p className="text-xs text-on-surface-variant">
                {date} at {time}
              </p>
            </div>
          </div>

          {/* Policy note */}
          <div className="rounded-xl border border-status-pending/20 bg-status-pending/5 px-4 py-3">
            <p className="text-xs leading-relaxed text-on-surface">
              <span className="font-semibold">Cancellation policy:</span> Free
              cancellations up to 24 hours before your appointment. Late
              cancellations may incur a{" "}
              <span className="font-semibold">50% fee</span>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-outline-variant px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={cancelling}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-outline-variant text-sm font-semibold text-on-surface transition-all hover:bg-surface-container-high disabled:opacity-40"
          >
            Keep Booking
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={cancelling}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-status-cancelled text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
          >
            {cancelling ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Cancelling…
              </>
            ) : (
              "Yes, Cancel"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
