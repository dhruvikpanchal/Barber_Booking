"use client";

import { Check, Circle, X } from "lucide-react";

function formatStepTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function StepIcon({ state }) {
  if (state === "done") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-confirmed/15 text-status-confirmed">
        <Check className="h-4 w-4" aria-hidden />
      </span>
    );
  }
  if (state === "current") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary">
        <Circle className="h-3 w-3 fill-current" aria-hidden />
      </span>
    );
  }
  if (state === "cancelled") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-cancelled/10 text-status-cancelled">
        <X className="h-4 w-4" aria-hidden />
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container text-on-surface-variant">
      <Circle className="h-3 w-3" aria-hidden />
    </span>
  );
}

export default function AppointmentProgressTracker({ steps = [] }) {
  if (!steps.length) return null;

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
      <header className="border-b border-outline-variant px-4 py-3.5 sm:px-5 sm:py-4">
        <h2 className="font-serif text-base font-bold text-on-surface sm:text-lg">
          Progress tracker
        </h2>
        <p className="mt-0.5 text-xs text-on-surface-variant">
          Booking created → confirmed → arrived → completed
        </p>
      </header>
      <ol className="space-y-0 px-4 py-4 sm:px-5">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const time = formatStepTime(step.at);
          return (
            <li key={step.key} className="relative flex gap-3 pb-6 last:pb-0">
              {!isLast && (
                <span
                  className={`absolute left-4 top-8 h-[calc(100%-2rem)] w-px -translate-x-1/2 ${
                    step.state === "done"
                      ? "bg-status-confirmed/40"
                      : "bg-outline-variant"
                  }`}
                  aria-hidden
                />
              )}
              <StepIcon state={step.state} />
              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={`text-sm font-semibold ${
                    step.state === "upcoming"
                      ? "text-on-surface-variant"
                      : "text-on-surface"
                  }`}
                >
                  {step.label}
                </p>
                {time ? (
                  <p className="mt-0.5 text-xs text-on-surface-variant">{time}</p>
                ) : (
                  <p className="mt-0.5 text-xs text-on-surface-variant/70">
                    {step.state === "current"
                      ? "In progress"
                      : step.state === "cancelled"
                        ? "Not reached"
                        : "Pending"}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
