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

export function RechartsBarChart({ data = [], labels = [], title }) {
  const chartData = data.map((value, index) => ({
    label: labels[index],
    value,
  }));

  return (
    <div className="relative h-full w-full">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">
          {title}
        </h4>
      </div>

      <div className="border-outline-variant/30 bg-surface-container/20 h-full w-full rounded-lg border p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="4 4" opacity={0.1} vertical={false} />

            <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={10} />

            <YAxis tickLine={false} axisLine={false} fontSize={10} />

            <Tooltip
              cursor={{ opacity: 0.08 }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid var(--color-outline-variant)",
                background: "var(--color-surface-container)",
              }}
            />

            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill="var(--color-primary)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
