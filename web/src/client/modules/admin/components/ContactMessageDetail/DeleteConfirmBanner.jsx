"use client";

import { AlertTriangle } from "lucide-react";

export function DeleteConfirmBanner({ onCancel, onConfirm }) {
  return (
    <section
      role="alertdialog"
      aria-labelledby="delete-msg-title"
      className="rounded-xl border border-status-cancelled/35 bg-status-cancelled/8 p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-status-cancelled/15 text-status-cancelled">
          <AlertTriangle className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id="delete-msg-title"
            className="font-serif text-base font-bold text-on-surface sm:text-lg"
          >
            Delete this message?
          </h2>
          <p className="mt-1.5 text-sm text-on-surface-variant">
            This removes the message and all replies from the queue. This cannot
            be undone.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-10 items-center justify-center rounded-md border border-outline-variant bg-surface-container px-4 text-sm font-semibold text-on-surface hover:bg-surface-container-high"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex h-10 items-center justify-center rounded-md bg-status-cancelled px-4 text-sm font-bold text-on-error hover:opacity-90"
            >
              Delete message
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
