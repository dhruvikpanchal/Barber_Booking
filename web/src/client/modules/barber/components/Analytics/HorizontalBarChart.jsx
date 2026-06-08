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

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
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

            <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} />

            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={110}
              fontSize={11}
            />

            <Tooltip
              cursor={{ opacity: 0.08 }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid var(--color-outline-variant)",
                background: "var(--color-surface-container)",
              }}
            />

            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={18}>
              {chartData.map((_, index) => (
                <Cell key={index} fill="var(--color-primary)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
