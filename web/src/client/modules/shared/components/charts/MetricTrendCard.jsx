"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import AreaSeriesPanel from "@/client/modules/shared/components/charts/AreaSeriesPanel.jsx";

/**
 * @param {{ title: string, subtitle?: string, data: Array<{ label: string, value: number }>, delta?: number, gradientId?: string, valuePrefix?: string }} props
 */
export default function MetricTrendCard({
  title,
  subtitle,
  data = [],
  delta,
  gradientId = "metricTrendFill",
  valuePrefix = "",
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const positive = typeof delta === "number" && delta >= 0;

  return (
    <section className="border-outline-variant bg-surface-container-low min-w-0 rounded-xl border p-4 sm:p-5">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="font-label-caps text-on-surface-variant">{title}</p>
          {subtitle ? (
            <h3 className="text-on-surface font-serif text-lg font-bold sm:text-xl">{subtitle}</h3>
          ) : (
            <h3 className="text-on-surface font-serif text-lg font-bold sm:text-xl">
              {valuePrefix}
              {total.toLocaleString()} total
            </h3>
          )}
        </div>
        {typeof delta === "number" ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              positive
                ? "bg-status-confirmed/15 text-status-confirmed"
                : "bg-status-cancelled/15 text-status-cancelled"
            }`}
          >
            {positive ? (
              <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" aria-hidden />
            )}
            {positive ? "+" : ""}
            {delta}%
          </span>
        ) : null}
      </header>

      <div className="relative min-w-0">
        <AreaSeriesPanel
          data={data.map((d) => d.value)}
          labels={data.map((d) => d.label)}
          gradientId={gradientId}
          embedded
        />
        <div
          className="text-on-surface-variant mt-2 grid gap-1 text-center text-[10px] sm:text-[11px]"
          style={{
            gridTemplateColumns: `repeat(${Math.max(data.length, 1)}, minmax(0, 1fr))`,
          }}
        >
          {data.map((d) => (
            <span key={d.label} className="truncate">
              {d.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
