"use client";

import { Armchair, Scissors, Timer, UserPlus, X, CheckCircle2 } from "lucide-react";

function minsSince(t) {
  if (!t) return 0;
  return Math.max(0, Math.round((Date.now() - t) / 60000));
}

export default function ChairBoard({
  chairs,
  queue,
  onAssignNext,
  onComplete,
  onClear,
}) {
  if (!chairs.length) {
    return (
      <div className="border-outline-variant bg-surface-container-low rounded-xl border border-dashed px-4 py-10 text-center">
        <p className="text-on-surface font-serif text-base font-bold">No chairs configured</p>
        <p className="text-on-surface-variant mt-1 text-sm">
          Chairs are created automatically when the queue loads. Refresh if this message persists.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {chairs.map((chair) => {
        const customer = queue.find((q) => q.id === chair.customerId);
        const active = !!customer;
        const elapsed = customer?.startedAt ? minsSince(customer.startedAt) : 0;
        const progress = customer
          ? Math.min(100, Math.round((elapsed / customer.duration) * 100))
          : 0;
        const overtime = customer && elapsed > customer.duration;

        return (
          <div
            key={chair.id}
            className={`relative overflow-hidden rounded-xl border p-4 transition-colors ${
              active
                ? "border-primary/30 bg-primary/5"
                : "border-dashed border-outline-variant bg-surface-container-low"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active ? "bg-primary/15 text-primary" : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  <Armchair className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-serif text-sm font-bold text-on-surface">
                    {chair.label}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    {chair.barber}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  active
                    ? "bg-primary/15 text-primary"
                    : "bg-status-confirmed/15 text-status-confirmed"
                }`}
              >
                {active ? "Busy" : "Free"}
              </span>
            </div>

            {active ? (
              <div className="mt-4 space-y-3">
                <div>
                  <p className="font-serif text-base font-bold text-on-surface">
                    {customer.name}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <Scissors className="h-3.5 w-3.5" aria-hidden />
                    {customer.service}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span className="inline-flex items-center gap-1">
                      <Timer className="h-3 w-3" aria-hidden /> {elapsed}m / {customer.duration}m
                    </span>
                    {overtime && (
                      <span className="font-semibold text-status-cancelled">
                        +{elapsed - customer.duration}m over
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-container">
                    <div
                      className={`h-full transition-all ${overtime ? "bg-status-cancelled" : "bg-primary"}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onComplete(chair.id)}
                    className="inline-flex h-8 items-center gap-1 rounded-md bg-status-confirmed px-2.5 text-[11px] font-semibold text-background hover:opacity-90"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Complete
                  </button>
                  <button
                    type="button"
                    onClick={() => onClear(chair.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant hover:border-status-cancelled/40 hover:text-status-cancelled"
                    aria-label="Clear chair"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-on-surface-variant">
                  Chair is open. Seat the next customer in queue.
                </p>
                <button
                  type="button"
                  onClick={() => onAssignNext(chair.id)}
                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-on-primary hover:opacity-90 disabled:opacity-50"
                  disabled={!queue.some((q) => q.status === "waiting")}
                >
                  <UserPlus className="h-3.5 w-3.5" aria-hidden /> Seat next
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
