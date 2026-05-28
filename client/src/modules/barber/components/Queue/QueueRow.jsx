"use client";

import {
  Phone,
  Scissors,
  Timer,
  ArrowUp,
  ArrowDown,
  Play,
  CheckCircle2,
  X,
  RotateCcw,
  Globe2,
  UserPlus,
  Armchair,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { SOURCES } from "../../../../constants/barber/queue";
import { useHydrated } from "@/lib/hooks/useHydrated.js";

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function QueueRow({
  entry,
  position,
  chairLabel,
  canMoveUp,
  canMoveDown,
  onMove,
  onSeat,
  onComplete,
  onCancel,
  onReopen,
}) {
  const source = SOURCES[entry.source] ?? SOURCES.online;
  const SourceIcon = entry.source === "online" ? Globe2 : UserPlus;
  const isWaiting = entry.status === "waiting";
  const isActive = entry.status === "in-service" || entry.status === "paused";
  const hydrated = useHydrated();
  const waitMin = hydrated
    ? Math.max(0, Math.round((Date.now() - entry.addedAt) / 60000))
    : null;

  return (
    <article className="group rounded-xl border border-outline-variant bg-surface-container-low p-4 transition-colors hover:border-outline">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3 md:items-center">
          {/* {isWaiting && (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 font-serif text-sm font-bold text-primary">
              {position}
            </span>
          )} */}
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container font-serif text-sm font-bold text-on-surface">
            {initials(entry.name)}
          </span>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif text-base font-bold text-on-surface">
                {entry.name}
              </h3>
              <StatusBadge status={entry.status} />
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${source.badge}`}
              >
                <SourceIcon className="h-3 w-3" aria-hidden />
                {source.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-1">
                <Scissors className="h-3.5 w-3.5" aria-hidden /> {entry.service}
              </span>
              <span className="inline-flex items-center gap-1">
                <Timer className="h-3.5 w-3.5" aria-hidden /> ~{entry.duration}m
              </span>
              {entry.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" aria-hidden /> {entry.phone}
                </span>
              )}
              {isWaiting && (
                <span className="inline-flex items-center gap-1 text-status-pending">
                  Waited {waitMin ?? "—"}m
                </span>
              )}
              {isActive && chairLabel && (
                <span className="inline-flex items-center gap-1 text-primary">
                  <Armchair className="h-3.5 w-3.5" aria-hidden /> {chairLabel}
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

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          {isWaiting && (
            <>
              <div className="flex overflow-hidden rounded-md border border-outline-variant">
                <button
                  type="button"
                  onClick={() => onMove(entry.id, -1)}
                  disabled={!canMoveUp}
                  className="flex h-9 w-9 items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(entry.id, 1)}
                  disabled={!canMoveDown}
                  className="flex h-9 w-9 items-center justify-center border-l border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
              <button
                type="button"
                onClick={() => onSeat(entry.id)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-on-primary hover:opacity-90"
              >
                <Play className="h-3.5 w-3.5" aria-hidden /> Seat
              </button>
              <button
                type="button"
                onClick={() => onCancel(entry.id)}
                className="inline-flex h-9 items-center rounded-md border border-outline-variant px-3 text-xs font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              >
                Cancel
              </button>
            </>
          )}
          {isActive && (
            <button
              type="button"
              onClick={() => onComplete(entry.id)}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-status-confirmed px-3 text-xs font-semibold text-background hover:opacity-90"
            >
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Complete
            </button>
          )}
          {(entry.status === "done"
            || entry.status === "cancelled"
            || entry.status === "no-show") && (
            <button
              type="button"
              onClick={() => onReopen(entry.id)}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-outline-variant px-3 text-xs font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reopen
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
