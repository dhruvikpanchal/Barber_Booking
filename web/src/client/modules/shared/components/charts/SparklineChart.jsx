"use client";

import { AreaChart, Area } from "recharts";
import { ChartContainer, ChartResponsiveContainer } from "./ChartContainer.jsx";

export default function SparklineChart({ data = [] }) {
  const chartData = data.map((value, index) => ({
    index,
    value,
  }));

  return (
      <ChartContainer className="h-14 w-full min-w-0">
      <ChartResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="currentColor" stopOpacity={0.25} />
              <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="value"
            stroke="currentColor"
            strokeWidth={2}
            fill="url(#sparkFill)"
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ChartResponsiveContainer>
    </ChartContainer>
  );
}
