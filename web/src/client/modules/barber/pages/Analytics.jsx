"use client";

import { useEffect, useMemo, useState } from "react";
import { useHydrated } from "@/client/modules/shared/hooks/useHydrated.js";
import { BarChart3, CalendarCheck, CheckCircle2, IndianRupee, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { barberHook } from "@/client/modules/barber/hooks/barberQuery.jsx";
import {
  formatRevenue,
  formatRating,
  normalizeAnalytics,
} from "@/client/modules/barber/helpers/analyticsHelpers.js";
import StatTile from "@/client/modules/shared/components/ui/StatTile";
import AnalyticsPeriodFilter, {
  defaultCustomRange,
} from "@/client/modules/barber/components/Analytics/AnalyticsPeriodFilter.jsx";
import MetricTrendCard from "@/client/modules/shared/components/charts/MetricTrendCard.jsx";
import HorizontalBarChart from "@/client/modules/shared/components/charts/HorizontalBarChart.jsx";
import StackedGrowthBarChart from "@/client/modules/shared/components/charts/StackedGrowthBarChart.jsx";
import CustomerStatsPanel from "@/client/modules/barber/components/Analytics/CustomerStatsPanel.jsx";
import MonthlyPerformanceSummary from "@/client/modules/barber/components/Analytics/MonthlyPerformanceSummary.jsx";
import GrowthInsights from "@/client/modules/barber/components/Analytics/GrowthInsights.jsx";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

export default function Analytics() {
  const hydrated = useHydrated();
  const [period, setPeriod] = useState("month");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  useEffect(() => {
    setCustomRange(defaultCustomRange());
  }, []);

  const queryParams = useMemo(() => {
    if (period === "custom") {
      return { period, start: customRange.start, end: customRange.end };
    }
    return { period };
  }, [period, customRange]);

  const canFetch =
    period !== "custom" ||
    Boolean(customRange.start && customRange.end && customRange.start <= customRange.end);

  const { data, isPending, isError, error, refetch } = barberHook.Analytics.useGetAnalytics(
    canFetch ? queryParams : "",
    { enabled: canFetch },
  );

  const analytics = useMemo(() => normalizeAnalytics(data), [data]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load analytics.");
    }
  }, [isError, error]);

  const completionRate =
    analytics.stats.totalAppointments > 0
      ? Math.round(
          (analytics.stats.completedAppointments / analytics.stats.totalAppointments) * 100,
        )
      : 0;

  if (!hydrated || (isPending && canFetch) || (!canFetch && period === "custom")) {
    return <PageLoader label="Loading analytics..." className="mx-auto max-w-6xl" />;
  }

  if (isError) {
    return (
      <div className="text-on-surface mx-auto max-w-6xl py-16 text-center">
        <p className="font-medium">Could not load analytics.</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isPending}
          className="text-primary mt-3 text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          Try again
        </button>
      </div>
    );
  }

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
        Showing data for <span className="text-on-surface font-semibold">{analytics.label}</span>
      </p>

      <section
        className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
        aria-label="Key metrics"
      >
        <StatTile
          label="Total revenue"
          value={formatRevenue(analytics.stats.totalRevenue)}
          hint="Gross service revenue"
          Icon={IndianRupee}
          accent="text-status-confirmed bg-status-confirmed/15"
          delta={analytics.deltas.totalRevenue}
        />
        <StatTile
          label="Total appointments"
          value={analytics.stats.totalAppointments}
          hint={`${completionRate}% completed`}
          Icon={CalendarCheck}
          accent="text-primary bg-primary/15"
          delta={analytics.deltas.totalAppointments}
        />
        <StatTile
          label="Completed"
          value={analytics.stats.completedAppointments}
          hint="Finished visits"
          Icon={CheckCircle2}
          accent="text-status-confirmed bg-status-confirmed/15"
          delta={analytics.deltas.completedAppointments}
        />
        <StatTile
          label="Total customers"
          value={analytics.stats.totalCustomers}
          hint={`${analytics.customers.new} new · ${analytics.customers.returning} returning`}
          Icon={Users}
          accent="text-primary bg-primary/15"
          delta={analytics.deltas.totalCustomers}
        />
        <StatTile
          label="Average rating"
          value={formatRating(analytics.stats.averageRating)}
          hint="From customer reviews"
          Icon={Star}
          accent="text-status-pending bg-status-pending/15"
          delta={analytics.deltas.averageRating}
        />
      </section>

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <MetricTrendCard
          title="Revenue trend"
          subtitle={`${formatRevenue(analytics.stats.totalRevenue)} · ${analytics.label}`}
          data={analytics.revenueTrend}
          delta={analytics.deltas.totalRevenue}
          gradientId="barberRevenueTrend"
        />
        <MetricTrendCard
          title="Appointment trend"
          subtitle={`${analytics.stats.totalAppointments} bookings · ${analytics.label}`}
          data={analytics.appointmentTrend}
          delta={analytics.deltas.totalAppointments}
          gradientId="barberApptTrend"
        />
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <HorizontalBarChart
          title="Service popularity"
          description="Bookings by service type in this period"
          data={analytics.servicePopularity}
        />
        <StackedGrowthBarChart title="Customer growth" data={analytics.customerGrowth} />
      </div>

      <CustomerStatsPanel customers={analytics.customers} />

      <MonthlyPerformanceSummary rows={analytics.monthlySummary} periodLabel={analytics.label} />

      <GrowthInsights insights={analytics.insights} />

      <section className="border-outline-variant bg-surface-container-low/50 rounded-xl border border-dashed px-4 py-6 text-center sm:px-6">
        <BarChart3 className="text-primary/60 mx-auto h-8 w-8" aria-hidden />
        <p className="text-on-surface-variant mt-2 text-sm">
          Analytics are loaded from your live booking data.
        </p>
      </section>
    </div>
  );
}
