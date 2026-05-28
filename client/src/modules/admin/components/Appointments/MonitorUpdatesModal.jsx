"use client";

import { Activity, Radio, X } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

function formatLogTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MonitorUpdatesModal({ appt, onClose }) {
  if (!appt) return null;

  const log = [...(appt.activityLog ?? [])].sort(
    (a, b) => new Date(b.at) - new Date(a.at),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="scrollbar-thin max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-outline-variant bg-surface-container-low shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="monitor-title"
        aria-modal="true"
      >
        <header className="flex items-start justify-between gap-3 border-b border-outline-variant px-5 py-4">
          <div>
            <p className="font-label-caps text-primary">Monitor updates</p>
            <h2
              id="monitor-title"
              className="font-serif text-lg font-bold text-on-surface"
            >
              {appt.customer.name}
            </h2>
            <p className="text-xs text-on-surface-variant">#{appt.id}</p>
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
          <div className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container px-4 py-3">
            <span className="inline-flex items-center gap-2 text-sm text-on-surface-variant">
              <Radio className="h-4 w-4 text-status-confirmed" aria-hidden />
              Live feed
            </span>
            <StatusBadge status={appt.status} />
          </div>

          {log.length === 0 ? (
            <p className="py-8 text-center text-sm text-on-surface-variant">
              No activity recorded yet.
            </p>
          ) : (
            <ul className="space-y-0">
              {log.map((entry, i) => (
                <li
                  key={`${entry.at}-${i}`}
                  className="relative flex gap-3 border-l-2 border-primary/30 py-3 pl-5 last:pb-0"
                >
                  <span className="absolute -left-[9px] top-4 flex h-4 w-4 items-center justify-center rounded-full bg-primary/20">
                    <Activity className="h-2.5 w-2.5 text-primary" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm text-on-surface">{entry.message}</p>
                    <p className="mt-0.5 text-xs text-on-surface-variant">
                      {formatLogTime(entry.at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
