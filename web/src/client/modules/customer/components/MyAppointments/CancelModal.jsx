"use client";

import { AlertTriangle, X } from "lucide-react";
import Modal from "@/client/modules/shared/components/ui/Modal";
import { formatDateTime } from "@/client/modules/customer/helpers/appointmentsHelpers.js";

export default function CancelModal({ appt, onConfirm, onClose, cancelling }) {
  if (!appt) return null;

  const { date, time } = formatDateTime(appt.startAt);

  return (
    <Modal
      open
      onClose={onClose}
      size="md"
      backdropClassName="bg-black/60 backdrop-blur-sm"
      panelClassName="border-outline-variant bg-surface-container-low rounded-2xl border shadow-2xl"
    >
      {/* Header */}
      <div className="border-outline-variant flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="border-status-cancelled/30 bg-status-cancelled/10 flex h-9 w-9 items-center justify-center rounded-lg border">
            <AlertTriangle className="text-status-cancelled h-4 w-4" />
          </div>
          <div>
            <p className="text-on-surface font-semibold">Cancel Booking</p>
            <p className="text-on-surface-variant text-xs">This action cannot be undone</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="space-y-4 p-5">
        {/* Appointment recap */}
        <div className="border-outline-variant bg-surface-container flex items-center gap-3 rounded-xl border p-4">
          <div className="border-outline-variant h-11 w-11 shrink-0 overflow-hidden rounded-lg border">
            <img
              src={appt.barber.image}
              alt={appt.barber.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-on-surface font-semibold">{appt.barber.name}</p>
            <p className="text-on-surface-variant text-xs">
              {date} at {time}
            </p>
          </div>
        </div>

        {/* Policy note */}
        <div className="border-status-pending/20 bg-status-pending/5 rounded-xl border px-4 py-3">
          <p className="text-on-surface text-xs leading-relaxed">
            <span className="font-semibold">Cancellation policy:</span> Free cancellations up to 24
            hours before your appointment. Late cancellations may incur a{" "}
            <span className="font-semibold">50% fee</span>.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-outline-variant flex gap-3 border-t px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          disabled={cancelling}
          className="border-outline-variant text-on-surface hover:bg-surface-container-high flex h-11 flex-1 items-center justify-center rounded-xl border text-sm font-semibold transition-all disabled:opacity-40"
        >
          Keep Booking
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={cancelling}
          className="bg-status-cancelled flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
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
    </Modal>
  );
}
