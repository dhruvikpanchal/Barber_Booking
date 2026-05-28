"use client";

import { ArrowRight, Sparkles, X } from "lucide-react";

export default function ServiceUpdatedModal({ appt, onClose }) {
  if (!appt) return null;

  const hasChange = Boolean(appt.originalService);
  const priceNote =
    appt.originalPrice != null
      ? `Price was $${appt.originalPrice}, now $${appt.price}`
      : `Current price $${appt.price}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-xl border border-outline-variant bg-surface-container-low shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="service-updated-title"
        aria-modal="true"
      >
        <header className="flex items-start justify-between gap-3 border-b border-outline-variant px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-label-caps text-primary">Service updated</p>
              <h2
                id="service-updated-title"
                className="font-serif text-lg font-bold text-on-surface"
              >
                #{appt.id}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="space-y-4 p-5">
          {!hasChange ? (
            <p className="text-sm text-on-surface-variant">
              This booking has no service changes on record.
            </p>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-lg border border-outline-variant bg-surface-container p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-label-caps text-[10px] text-on-surface-variant">
                    Previous
                  </p>
                  <p className="truncate text-sm font-semibold text-on-surface-variant line-through decoration-status-cancelled/60">
                    {appt.originalService}
                  </p>
                </div>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-primary"
                  aria-hidden
                />
                <div className="min-w-0 flex-1 text-right">
                  <p className="font-label-caps text-[10px] text-on-surface-variant">
                    Current
                  </p>
                  <p className="truncate text-sm font-semibold text-primary">
                    {appt.service}
                  </p>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant">{priceNote}</p>
              <p className="text-xs text-on-surface-variant">
                {appt.barberName} · {appt.shop}, {appt.city}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
