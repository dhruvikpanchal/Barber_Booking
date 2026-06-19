"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { ChartContainer, ChartResponsiveContainer } from "./ChartContainer.jsx";
import ChartTooltip from "./ChartTooltip.jsx";
import { CHART_AXIS_TICK } from "./chartStyles.js";

export default function VerticalBarChart({ data = [], labels = [], title }) {
  const chartData = data.map((value, index) => ({
    label: labels[index],
    value,
  }));

  return (
    <div className="relative w-full">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">
          {title}
        </h4>
      </div>

      <ChartContainer className="border-outline-variant/30 bg-surface-container/20 h-72 w-full min-w-0 rounded-lg border p-2">
        <ChartResponsiveContainer>
          <BarChart data={chartData} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="4 4" opacity={0.1} vertical={false} />

            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={CHART_AXIS_TICK} />

            <YAxis tickLine={false} axisLine={false} tick={CHART_AXIS_TICK} />

            <ChartTooltip />

            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill="var(--color-primary)" />
              ))}
            </Bar>
          </BarChart>
        </ChartResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
