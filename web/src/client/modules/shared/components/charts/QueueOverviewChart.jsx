"use client";

import {
  ResponsiveContainer,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import { ChartContainer } from "./ChartContainer.jsx";

export default function QueueOverviewChart({ cities = [] }) {
  const chartData = cities.map((c) => ({
    city: c.city,
    waiting: c.waiting,
    active: c.inService,
    free: c.freeChairs,
  }));

  return (
    <section className="border-outline-variant bg-surface-container-low rounded-xl border p-4">
      <div className="mb-4">
        <h3 className="text-on-surface font-serif text-lg font-bold">Queue overview</h3>

        <p className="text-on-surface-variant text-xs">Live city queue analytics</p>
      </div>

      <ChartContainer className="h-72 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="waitingFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

            <XAxis dataKey="city" tickLine={false} axisLine={false} fontSize={11} />

            <YAxis tickLine={false} axisLine={false} fontSize={11} />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="waiting"
              stroke="currentColor"
              strokeWidth={3}
              fill="url(#waitingFill)"
              className="text-primary"
            />

            <Line
              type="monotone"
              dataKey="active"
              stroke="var(--color-secondary)"
              strokeWidth={3}
              dot={{ r: 4 }}
            />

            <Line
              type="monotone"
              dataKey="free"
              stroke="var(--color-tertiary)"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </section>
  );
}
