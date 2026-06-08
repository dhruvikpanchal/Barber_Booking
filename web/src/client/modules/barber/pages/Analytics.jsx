"use client";

import { useMemo, useState } from "react";
import { BarChart3, CalendarCheck, CheckCircle2, DollarSign, Star, Users } from "lucide-react";
import { formatRevenue, getAnalyticsDataset } from "@/client/modules/barber/data/analyticsData.js";
import StatTile from "@/client/modules/shared/components/ui/StatTile";
import AnalyticsPeriodFilter, {
  defaultCustomRange,
} from "@/client/modules/barber/components/Analytics/AnalyticsPeriodFilter.jsx";
import TrendLineChart from "@/client/modules/barber/components/Analytics/TrendLineChart.jsx";
import HorizontalBarChart from "@/client/modules/barber/components/Analytics/HorizontalBarChart.jsx";
import CustomerGrowthChart from "@/client/modules/barber/components/Analytics/CustomerGrowthChart.jsx";
import CustomerStatsPanel from "@/client/modules/barber/components/Analytics/CustomerStatsPanel.jsx";
import MonthlyPerformanceSummary from "@/client/modules/barber/components/Analytics/MonthlyPerformanceSummary.jsx";
import GrowthInsights from "@/client/modules/barber/components/Analytics/GrowthInsights.jsx";

export default function Analytics() {
  const [period, setPeriod] = useState("month");
  const [customRange, setCustomRange] = useState(defaultCustomRange);

  const data = useMemo(() => getAnalyticsDataset(period, customRange), [period, customRange]);

  const completionRate =
    data.stats.totalAppointments > 0
      ? Math.round((data.stats.completedAppointments / data.stats.totalAppointments) * 100)
      : 0;

  return (
    <div className="text-on-surface mx-auto w-full max-w-6xl min-w-0 space-y-6 pb-28 md:space-y-8 md:pb-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="font-label-caps text-primary">Barber · Analytics</p>
          <h1 className="font-serif text-2xl font-bold tracking-tight md:text-3xl">
            Business analytics
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
            Track revenue, bookings, service demand, and customer growth. Use filters to compare
            performance across time periods.
          </p>
        </div>

        <AnalyticsPeriodFilter
          period={period}
          onPeriodChange={setPeriod}
          customRange={customRange}
          onCustomRangeChange={(range) => {
            setCustomRange(range);
            setPeriod("custom");
          }}
        />
      </header>

      <p className="text-on-surface-variant text-sm">
        Showing data for <span className="text-on-surface font-semibold">{data.label}</span>
      </p>

      <section
        className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
        aria-label="Key metrics"
      >
        <StatTile
          label="Total revenue"
          value={formatRevenue(data.stats.totalRevenue)}
          hint="Gross service revenue"
          Icon={DollarSign}
          accent="text-status-confirmed bg-status-confirmed/15"
          delta={data.deltas.totalRevenue}
        />
        <StatTile
          label="Total appointments"
          value={data.stats.totalAppointments}
          hint={`${completionRate}% completed`}
          Icon={CalendarCheck}
          accent="text-primary bg-primary/15"
          delta={data.deltas.totalAppointments}
        />
        <StatTile
          label="Completed"
          value={data.stats.completedAppointments}
          hint="Finished visits"
          Icon={CheckCircle2}
          accent="text-status-confirmed bg-status-confirmed/15"
          delta={data.deltas.completedAppointments}
        />
        <StatTile
          label="Total customers"
          value={data.stats.totalCustomers}
          hint={`${data.customers.new} new · ${data.customers.returning} returning`}
          Icon={Users}
          accent="text-primary bg-primary/15"
          delta={data.deltas.totalCustomers}
        />
        <StatTile
          label="Average rating"
          value={data.stats.averageRating.toFixed(1)}
          hint="From customer reviews"
          Icon={Star}
          accent="text-status-pending bg-status-pending/15"
          delta={data.deltas.averageRating}
        />
      </section>

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <TrendLineChart
          title="Revenue trend"
          subtitle={`${formatRevenue(data.stats.totalRevenue)} · ${data.label}`}
          data={data.revenueTrend}
          delta={data.deltas.totalRevenue}
          gradientId="barberRevenueTrend"
          valuePrefix="$"
        />
        <TrendLineChart
          title="Appointment trend"
          subtitle={`${data.stats.totalAppointments} bookings · ${data.label}`}
          data={data.appointmentTrend}
          delta={data.deltas.totalAppointments}
          gradientId="barberApptTrend"
        />
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <HorizontalBarChart
          title="Service popularity"
          description="Bookings by service type in this period"
          data={data.servicePopularity}
        />
        <CustomerGrowthChart title="Customer growth" data={data.customerGrowth} />
      </div>

      <CustomerStatsPanel customers={data.customers} />

      <MonthlyPerformanceSummary rows={data.monthlySummary} periodLabel={data.label} />

      <GrowthInsights insights={data.insights} />

      <section className="border-outline-variant bg-surface-container-low/50 rounded-xl border border-dashed px-4 py-6 text-center sm:px-6">
        <BarChart3 className="text-primary/60 mx-auto h-8 w-8" aria-hidden />
        <p className="text-on-surface-variant mt-2 text-sm">
          Demo analytics use mock data. Connect your booking API to populate live charts and
          reports.
        </p>
      </section>
    </div>
  );
}
