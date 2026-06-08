"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

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
export default function CustomerGrowthChart({ title, data = [] }) {
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

      <div className="h-44 w-full sm:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 4" vertical={false} opacity={0.08} />

            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />

            <YAxis tickLine={false} axisLine={false} fontSize={11} />

            <Tooltip
              cursor={{ opacity: 0.08 }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid var(--color-outline-variant)",
                background: "var(--color-surface-container)",
              }}
            />

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
        </ResponsiveContainer>
      </div>
    </section>
  );
}
