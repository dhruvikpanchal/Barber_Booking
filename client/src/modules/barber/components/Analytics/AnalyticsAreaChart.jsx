"use client";

import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip } from "recharts";

export default function AnalyticsAreaChart({ data = [], labels = [] }) {
  const chartData = data.map((value, index) => ({
    label: labels[index],
    value,
  }));

  return (
    <section className="border-outline-variant bg-surface-container-low rounded-xl border p-4 sm:p-5">
      <div className="h-40 w-full sm:h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
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
              fill="url(#analyticsGradient)"
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
      </div>
    </section>
  );
}
