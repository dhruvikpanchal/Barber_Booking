"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import Modal from "@/client/modules/shared/components/ui/Modal";

/**
 * @param {{
 *   request: { id: string; ownerName: string; shopName: string } | null;
 *   onClose: () => void;
 *   onConfirm: (id: string, note: string) => void;
 * }} props
 */
export default function RejectModal({ request, onClose, onConfirm }) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (request) {
      setNote("");
      setError("");
    }
  }, [request?.id]);

  if (!request) return null;

  function handleConfirm() {
    const trimmed = note.trim();
    if (!trimmed) {
      setError("Please provide a reason for rejecting this application.");
      return;
    }
    onConfirm(request.id, trimmed);
    setNote("");
    setError("");
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="md"
      zIndex="z-[60]"
      labelledBy="reject-title"
      panelClassName="rounded-xl border border-outline-variant bg-surface-container-low p-6 shadow-2xl"
    >
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-status-cancelled/15 text-status-cancelled">
            <AlertTriangle className="h-5 w-5" aria-hidden />
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <h2
          id="reject-title"
          className="mt-4 font-serif text-lg font-bold text-on-surface"
        >
          Reject application?
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          <span className="font-medium text-on-surface">
            {request.ownerName}
          </span>{" "}
          at {request.shopName} will be notified with your rejection reason.
        </p>

        <label className="mt-4 block">
          <span className="font-label-caps text-on-surface-variant">
            Rejection reason
            <span className="text-status-cancelled"> *</span>
          </span>
          <textarea
            rows={4}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (error && e.target.value.trim()) setError("");
            }}
            placeholder="e.g. Please upload a valid state barber license."
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "reject-reason-error" : undefined}
            className={`mt-2 w-full resize-y rounded-md border bg-surface-container px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none ${
              error
                ? "border-status-cancelled focus:border-status-cancelled"
                : "border-outline-variant focus:border-primary"
            }`}
          />
          {error && (
            <p
              id="reject-reason-error"
              className="mt-2 text-xs font-medium text-status-cancelled"
              role="alert"
            >
              {error}
            </p>
          )}
        </label>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-outline-variant px-4 py-2.5 text-xs font-semibold tracking-wide text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-md bg-status-cancelled px-4 py-2.5 text-xs font-semibold tracking-wide text-on-error transition-opacity hover:opacity-90"
          >
            Confirm reject
          </button>
        </div>
    </Modal>
  );
}
