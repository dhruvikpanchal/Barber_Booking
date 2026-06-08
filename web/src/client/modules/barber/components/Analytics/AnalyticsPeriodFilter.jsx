"use client";

import { useState } from "react";
import { CalendarRange, X } from "lucide-react";
import { ANALYTICS_PERIODS } from "@/modules/barber/constants/analytics.js";

function defaultCustomRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 13);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

/**
 * @param {{ period: string, onPeriodChange: (key: string) => void, customRange: { start: string, end: string }, onCustomRangeChange: (range: { start: string, end: string }) => void }} props
 */
export default function AnalyticsPeriodFilter({
  period,
  onPeriodChange,
  customRange,
  onCustomRangeChange,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState(customRange);

  function openCustom() {
    setDraft(customRange);
    onPeriodChange("custom");
    setModalOpen(true);
  }

  function applyCustom() {
    if (draft.start && draft.end && draft.start <= draft.end) {
      onCustomRangeChange(draft);
      setModalOpen(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="scrollbar-thin flex gap-1 overflow-x-auto pb-0.5">
          {ANALYTICS_PERIODS.map((p) => {
            const active = period === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => (p.key === "custom" ? openCustom() : onPeriodChange(p.key))}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary text-on-primary"
                    : "border-outline-variant text-on-surface-variant hover:text-on-surface border"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        {period === "custom" && customRange.start && customRange.end ? (
          <p className="text-on-surface-variant inline-flex items-center gap-1.5 text-xs">
            <CalendarRange className="text-primary h-3.5 w-3.5" aria-hidden />
            {new Date(customRange.start).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            {" – "}
            {new Date(customRange.end).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        ) : null}
      </div>

      {modalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="custom-range-title"
        >
          <div className="border-outline-variant bg-surface-container w-full max-w-md space-y-4 rounded-xl border p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3
                  id="custom-range-title"
                  className="text-on-surface font-serif text-lg font-bold"
                >
                  Custom date range
                </h3>
                <p className="text-on-surface-variant mt-0.5 text-sm">
                  Choose start and end dates for your report.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="text-on-surface-variant hover:bg-surface-container-high flex h-8 w-8 items-center justify-center rounded-md"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-label-caps text-on-surface-variant">Start</span>
                <input
                  type="date"
                  value={draft.start}
                  max={draft.end}
                  onChange={(e) => setDraft((d) => ({ ...d, start: e.target.value }))}
                  className="border-outline-variant bg-surface-container-low text-on-surface focus:border-primary mt-1 h-10 w-full rounded-md border px-3 text-sm focus:outline-none"
                />
              </label>
              <label className="block text-sm">
                <span className="font-label-caps text-on-surface-variant">End</span>
                <input
                  type="date"
                  value={draft.end}
                  min={draft.start}
                  onChange={(e) => setDraft((d) => ({ ...d, end: e.target.value }))}
                  className="border-outline-variant bg-surface-container-low text-on-surface focus:border-primary mt-1 h-10 w-full rounded-md border px-3 text-sm focus:outline-none"
                />
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="border-outline-variant text-on-surface-variant hover:bg-surface-container-high flex-1 rounded-md border py-2.5 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCustom}
                className="bg-primary text-on-primary flex-1 rounded-md py-2.5 text-sm font-bold hover:opacity-90"
              >
                Apply range
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export { defaultCustomRange };
