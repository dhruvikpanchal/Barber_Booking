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
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { SOURCES, STATUSES } from "../../constants/queue";
import { useHydrated } from "@/client/modules/shared/hooks/useHydrated.js";

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
  const waitMin = hydrated ? Math.max(0, Math.round((Date.now() - entry.addedAt) / 60000)) : null;

  return (
    <article className="group border-outline-variant bg-surface-container-low hover:border-outline rounded-xl border p-4 transition-colors">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3 md:items-center">
          {/* {isWaiting && (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 font-serif text-sm font-bold text-primary">
              {position}
            </span>
          )} */}
          <span className="bg-surface-container text-on-surface flex h-11 w-11 items-center justify-center rounded-full font-serif text-sm font-bold">
            {initials(entry.name)}
          </span>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-on-surface font-serif text-base font-bold">{entry.name}</h3>
              <StatusBadge
                status={entry.status}
                config={STATUSES}
                fallback="waiting"
                size="compact"
              />
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${source.badge}`}
              >
                <SourceIcon className="h-3 w-3" aria-hidden />
                {source.label}
              </span>
            </div>
            <div className="text-on-surface-variant flex flex-wrap gap-x-4 gap-y-1 text-xs">
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
                <span className="text-status-pending inline-flex items-center gap-1">
                  Waited {waitMin ?? "—"}m
                </span>
              )}
              {isActive && chairLabel && (
                <span className="text-primary inline-flex items-center gap-1">
                  <Armchair className="h-3.5 w-3.5" aria-hidden /> {chairLabel}
                </span>
              )}
            </div>
            {entry.notes && (
              <p className="text-on-surface-variant pt-1 text-xs">Note: {entry.notes}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          {isWaiting && (
            <>
              <div className="border-outline-variant flex overflow-hidden rounded-md border">
                <button
                  type="button"
                  onClick={() => onMove(entry.id, -1)}
                  disabled={!canMoveUp}
                  className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-9 w-9 items-center justify-center disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(entry.id, 1)}
                  disabled={!canMoveDown}
                  className="border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-9 w-9 items-center justify-center border-l disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
              <button
                type="button"
                onClick={() => onSeat(entry.id)}
                className="bg-primary text-on-primary inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-semibold hover:opacity-90"
              >
                <Play className="h-3.5 w-3.5" aria-hidden /> Seat
              </button>
              <button
                type="button"
                onClick={() => onCancel(entry.id)}
                className="border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface inline-flex h-9 items-center rounded-md border px-3 text-xs font-medium"
              >
                Cancel
              </button>
            </>
          )}
          {isActive && (
            <button
              type="button"
              onClick={() => onComplete(entry.id)}
              className="bg-status-confirmed text-background inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-semibold hover:opacity-90"
            >
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Complete
            </button>
          )}
          {(entry.status === "done" ||
            entry.status === "cancelled" ||
            entry.status === "no-show") && (
            <button
              type="button"
              onClick={() => onReopen(entry.id)}
              className="border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reopen
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
