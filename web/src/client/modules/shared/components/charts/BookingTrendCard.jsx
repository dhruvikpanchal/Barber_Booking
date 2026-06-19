"use client";

import { TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartResponsiveContainer } from "./ChartContainer.jsx";
import ChartTooltip from "./ChartTooltip.jsx";
import { CHART_AXIS_TICK } from "./chartStyles.js";

export default function BookingTrendCard({ data = [], total, delta }) {
  return (
    <section className="border-outline-variant bg-surface-container-low min-w-0 overflow-hidden rounded-xl border p-4 sm:p-5">
      <header className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <p className="font-label-caps text-on-surface-variant">Booking trend</p>

          <h3 className="text-on-surface font-serif text-lg font-bold sm:text-xl">
            <span className="block sm:inline">{total?.toLocaleString()} bookings</span>

            <span className="text-on-surface-variant sm:ml-1">· this week</span>
          </h3>
        </div>

        {typeof delta === "number" ? (
          <span className="bg-status-confirmed/15 text-status-confirmed inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />+{delta}%
          </span>
        ) : null}
      </header>

      <ChartContainer className="h-40 w-full min-w-0 sm:h-52">
        <ChartResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} />
                <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 4" opacity={0.1} />

            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={CHART_AXIS_TICK} />

            <ChartTooltip />

            <Area
              type="monotone"
              dataKey="value"
              stroke="currentColor"
              strokeWidth={3}
              fill="url(#bookingGradient)"
              className="text-primary"
            />
          </AreaChart>
        </ChartResponsiveContainer>
      </ChartContainer>
    </section>
  );
}
