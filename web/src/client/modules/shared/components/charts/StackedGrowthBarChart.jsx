"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartResponsiveContainer } from "./ChartContainer.jsx";
import ChartTooltip from "./ChartTooltip.jsx";
import { CHART_AXIS_TICK } from "./chartStyles.js";

/**
 * @param {{
 * title: string,
 * data: Array<{
 *   label: string,
 *   new: number,
 *   returning: number
 * }>
 * }} props
 */
export default function StackedGrowthBarChart({ title, data = [] }) {
  const chartData = data.map((item) => ({
    name: item.label,
    New: item.new,
    Returning: item.returning,
  }));

  return (
    <section className="border-outline-variant bg-surface-container-low min-w-0 rounded-xl border p-4 sm:p-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="font-label-caps text-on-surface-variant">{title}</p>

        <div className="flex gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1.5">
            <span className="bg-status-pending h-2 w-2 rounded-sm" aria-hidden />
            New
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span className="bg-primary h-2 w-2 rounded-sm" aria-hidden />
            Returning
          </span>
        </div>
      </header>

      <ChartContainer className="h-44 w-full min-w-0 sm:h-52">
        <ChartResponsiveContainer>
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 4" vertical={false} opacity={0.08} />

            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={CHART_AXIS_TICK} />

            <YAxis tickLine={false} axisLine={false} tick={CHART_AXIS_TICK} />

            <ChartTooltip />

            <Bar
              dataKey="Returning"
              stackId="customers"
              fill="var(--color-primary)"
              radius={[0, 0, 6, 6]}
            />

            <Bar
              dataKey="New"
              stackId="customers"
              fill="var(--color-status-pending)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartResponsiveContainer>
      </ChartContainer>
    </section>
  );
}
