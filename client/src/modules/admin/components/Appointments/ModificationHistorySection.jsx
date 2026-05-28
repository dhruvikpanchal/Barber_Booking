"use client";

import { ArrowRight, History } from "lucide-react";

function formatTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * Reusable modification history timeline for appointment detail views.
 *
 * @param {{
 *   modifications: Array<{
 *     id: string;
 *     at: string;
 *     actor: string;
 *     field: string;
 *     previousValue: string;
 *     updatedValue: string;
 *     reason?: string | null;
 *     summary: string;
 *   }>;
 *   emptyMessage?: string;
 *   className?: string;
 * }} props
 */
export default function ModificationHistorySection({
  modifications = [],
  emptyMessage = "No modifications recorded for this appointment.",
  className = "",
}) {
  const sorted = [...modifications].sort(
    (a, b) => new Date(b.at) - new Date(a.at),
  );

  if (sorted.length === 0) {
    return (
      <div
        className={`rounded-xl border border-dashed border-outline-variant px-6 py-12 text-center ${className}`}
      >
        <History
          className="mx-auto h-8 w-8 text-on-surface-variant/40"
          aria-hidden
        />
        <p className="mt-3 text-sm text-on-surface-variant">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <ol className="relative space-y-0">
        {sorted.map((entry, index) => (
          <li
            key={entry.id}
            className="relative pb-6 pl-8 last:pb-0"
          >
            {index < sorted.length - 1 && (
              <span
                className="absolute left-[0.9rem] top-8 bottom-0 w-px bg-outline-variant"
                aria-hidden
              />
            )}
            <span className="absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border border-outline-variant bg-surface-container-low text-primary">
              <History className="h-3.5 w-3.5" aria-hidden />
            </span>

            <article className="rounded-lg border border-outline-variant bg-surface-container p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {entry.field}
                  </p>
                  <p className="mt-1 text-sm text-on-surface">{entry.summary}</p>
                </div>
                <time
                  dateTime={entry.at}
                  className="shrink-0 text-[11px] text-on-surface-variant"
                >
                  {formatTime(entry.at)}
                </time>
              </div>

              <div className="mt-3 flex flex-col gap-2 rounded-md border border-outline-variant/60 bg-surface-container-low px-3 py-2.5 text-sm sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-label-caps text-[10px] text-on-surface-variant">
                    Previous
                  </p>
                  <p className="mt-0.5 truncate text-on-surface-variant">
                    {entry.previousValue}
                  </p>
                </div>
                <ArrowRight
                  className="hidden h-4 w-4 shrink-0 text-on-surface-variant sm:block"
                  aria-hidden
                />
                <div className="min-w-0 flex-1 sm:text-right">
                  <p className="font-label-caps text-[10px] text-on-surface-variant">
                    Updated
                  </p>
                  <p className="mt-0.5 truncate font-medium text-on-surface">
                    {entry.updatedValue}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-on-surface-variant">
                <span className="font-semibold text-on-surface">
                  {entry.actor}
                </span>
                {entry.reason ? ` · ${entry.reason}` : " · No reason provided"}
              </p>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
