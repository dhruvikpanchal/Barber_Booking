"use client";

import { Phone, Scissors, Timer, Trash2, ArrowRight, RotateCcw } from "lucide-react";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { STATUSES } from "../../constants/walk_In";

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
    <article className="rounded-xl border border-outline-variant bg-surface-container-low p-4 transition-colors hover:border-outline md:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 font-serif text-base font-bold text-primary">
              {initials(entry.name)}
            </span>
            {isActive && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-on-primary">
                {position}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif text-base font-bold text-on-surface">
                {entry.name}
              </h3>
              <StatusBadge status={entry.status} config={STATUSES} fallback="waiting" />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-on-surface-variant">
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
              {isActive && (
                <span className="inline-flex items-center gap-1">
                  Waited {waited}m
                </span>
              )}
            </div>
            {entry.notes && (
              <p className="pt-1 text-xs text-on-surface-variant">
                Note: {entry.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {entry.status === "waiting" && (
            <>
              <button
                type="button"
                onClick={() => onAdvance(entry.id)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-on-primary transition-opacity hover:opacity-90"
              >
                Start <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => onCancel(entry.id)}
                className="inline-flex h-9 items-center rounded-md border border-outline-variant px-3 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
              >
                Cancel
              </button>
            </>
          )}
          {entry.status === "in-service" && (
            <button
              type="button"
              onClick={() => onAdvance(entry.id)}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-status-confirmed px-3 text-xs font-semibold text-background transition-opacity hover:opacity-90"
            >
              Complete <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
          {(entry.status === "done" || entry.status === "cancelled") && (
            <>
              <button
                type="button"
                onClick={() => onReopen(entry.id)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-outline-variant px-3 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reopen
              </button>
              <button
                type="button"
                onClick={() => onRemove(entry.id)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-status-cancelled/50 hover:text-status-cancelled"
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
