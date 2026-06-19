"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { ChartContainer, ChartResponsiveContainer } from "./ChartContainer.jsx";
import ChartTooltip from "./ChartTooltip.jsx";
import { CHART_AXIS_TICK } from "./chartStyles.js";

/**
 * @param {{
 * title: string,
 * description?: string,
 * data: Array<{ label: string, value: number }>
 * }} props
 */
export default function HorizontalBarChart({ title, description, data = [] }) {
  const chartData = data.map((item) => ({
    name: item.label,
    value: item.value,
  }));

  return (
    <section className="border-outline-variant bg-surface-container-low min-w-0 rounded-xl border p-4 sm:p-5">
      <header className="mb-4">
        <p className="font-label-caps text-on-surface-variant">{title}</p>

        {description ? (
          <p className="text-on-surface-variant mt-0.5 text-sm">{description}</p>
        ) : null}
      </header>

      <ChartContainer className="h-72 w-full min-w-0">
        <ChartResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 0,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 4" horizontal={false} opacity={0.08} />

            <XAxis type="number" tickLine={false} axisLine={false} tick={CHART_AXIS_TICK} />

            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={110}
              tick={CHART_AXIS_TICK}
            />

            <ChartTooltip />

            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={18}>
              {chartData.map((_, index) => (
                <Cell key={index} fill="var(--color-primary)" />
              ))}
            </Bar>
          </BarChart>
        </ChartResponsiveContainer>
      </ChartContainer>
    </section>
  );
}
