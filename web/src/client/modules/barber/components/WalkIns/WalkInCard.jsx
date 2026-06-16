"use client";

import { Phone, Scissors, Timer, Trash2, ArrowRight, RotateCcw } from "lucide-react";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { STATUSES } from "@/client/modules/barber/constants/walkInConstants.js";

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function waitedMinutes(addedAt) {
  return Math.max(0, Math.round((Date.now() - addedAt) / 60000));
}

export default function WalkInCard({ entry, position, onAdvance, onCancel, onReopen, onRemove }) {
  const isActive = entry.status === "waiting" || entry.status === "in-service";
  const waited = waitedMinutes(entry.addedAt);

  return (
    <article className="border-outline-variant bg-surface-container-low hover:border-outline rounded-xl border p-4 transition-colors md:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="relative">
            <span className="bg-primary/15 text-primary flex h-12 w-12 items-center justify-center rounded-full font-serif text-base font-bold">
              {initials(entry.name)}
            </span>
            {isActive && (
              <span className="bg-primary text-on-primary absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold">
                {position}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-on-surface font-serif text-base font-bold">{entry.name}</h3>
              <StatusBadge status={entry.status} config={STATUSES} fallback="waiting" />
            </div>
            <div className="text-on-surface-variant flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {entry.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" aria-hidden /> {entry.phone}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Scissors className="h-3.5 w-3.5" aria-hidden /> {entry.service}
              </span>
              <span className="inline-flex items-center gap-1">
                <Timer className="h-3.5 w-3.5" aria-hidden /> ~{entry.duration} min
              </span>
              {isActive && <span className="inline-flex items-center gap-1">Waited {waited}m</span>}
            </div>
            {entry.notes && (
              <p className="text-on-surface-variant pt-1 text-xs">Note: {entry.notes}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {entry.status === "waiting" && (
            <>
              <button
                type="button"
                onClick={() => onAdvance(entry.id)}
                className="bg-primary text-on-primary inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-opacity hover:opacity-90"
              >
                Start <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => onCancel(entry.id)}
                className="border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface inline-flex h-9 items-center rounded-md border px-3 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
            </>
          )}
          {entry.status === "in-service" && (
            <button
              type="button"
              onClick={() => onAdvance(entry.id)}
              className="bg-status-confirmed text-background inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-semibold transition-opacity hover:opacity-90"
            >
              Complete <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
          {(entry.status === "done" || entry.status === "cancelled") && (
            <>
              <button
                type="button"
                onClick={() => onReopen(entry.id)}
                className="border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reopen
              </button>
              <button
                type="button"
                onClick={() => onRemove(entry.id)}
                className="border-outline-variant text-on-surface-variant hover:border-status-cancelled/50 hover:text-status-cancelled inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors"
                aria-label="Remove from list"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
