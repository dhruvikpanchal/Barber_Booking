"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { ChartContainer } from "./ChartContainer.jsx";
import { CHART_TOOLTIP_STYLE } from "./chartStyles.js";

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
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={chartData} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="4 4" opacity={0.1} vertical={false} />

            <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={10} />

            <YAxis tickLine={false} axisLine={false} fontSize={10} />

            <Tooltip cursor={{ opacity: 0.08 }} contentStyle={CHART_TOOLTIP_STYLE} />

            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill="var(--color-primary)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
