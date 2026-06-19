"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import Modal from "@/client/modules/shared/components/ui/Modal";
import { formatDateTime } from "@/client/modules/customer/helpers/appointmentsHelpers.js";
import BarberImage from "@/client/modules/customer/components/shared/BarberImage.jsx";

const MAX_REASON_LENGTH = 500;

export default function CancelModal({ appt, onConfirm, onClose, cancelling }) {
  const [reason, setReason] = useState("");

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

      <div className="space-y-4 p-5">
        <div className="border-outline-variant bg-surface-container flex items-center gap-3 rounded-xl border p-4">
          <BarberImage
            src={appt.barber.image}
            name={appt.barber.name}
            className="h-11 w-11 rounded-lg"
          />
          <div>
            <p className="text-on-surface font-semibold">{appt.barber.name}</p>
            <p className="text-on-surface-variant text-xs">
              {date} at {time}
            </p>
          </div>
        </div>

        <label className="block">
          <span className="text-on-surface-variant mb-1.5 block text-xs font-semibold">
            Reason for cancellation (optional)
          </span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={cancelling}
            maxLength={MAX_REASON_LENGTH}
            rows={3}
            placeholder="Let your barber know why you're cancelling…"
            className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <p className="text-on-surface-variant mt-1 text-right text-[11px]">
            {reason.length}/{MAX_REASON_LENGTH}
          </p>
        </label>

        <p className="text-on-surface-variant text-xs leading-relaxed">
          Your barber will be notified that this appointment was cancelled.
        </p>
      </div>

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
          onClick={() => onConfirm(reason.trim())}
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
