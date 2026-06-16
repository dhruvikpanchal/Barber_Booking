"use client";

import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip } from "recharts";
import { ChartContainer } from "./ChartContainer.jsx";

export default function AreaSeriesPanel({
  data = [],
  labels = [],
  gradientId = "areaSeriesGradient",
  embedded = false,
}) {
  const chartData = data.map((value, index) => ({
    label: labels[index],
    value,
  }));

  const chart = (
    <ChartContainer className="h-40 w-full min-w-0 sm:h-44">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.35} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 4" vertical={false} opacity={0.08} />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="value"
            stroke="currentColor"
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={{
              r: 4,
              strokeWidth: 2,
              fill: "var(--color-primary)",
              stroke: "var(--color-surface-container-low)",
            }}
            className="text-primary"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );

  if (embedded) return chart;

  return (
    <section className="border-outline-variant bg-surface-container-low rounded-xl border p-4 sm:p-5">
      {chart}
    </section>
  );
}
