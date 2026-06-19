"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Scissors,
  CalendarCheck,
  Star,
  Clock,
  Calendar,
  Sparkles,
  Download,
  AlertCircle,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { toast } from "sonner";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";
import AreaSeriesPanel from "@/client/modules/shared/components/charts/AreaSeriesPanel.jsx";
import VerticalBarChart from "@/client/modules/shared/components/charts/VerticalBarChart.jsx";
import { rowsToCsv, downloadFile } from "@/client/modules/admin/components/Reports/MockDataBuilder";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import { formatMoney } from "@/client/lib/format/formatMoney.js";

export default function AdminAnalytics() {
  const [filter, setFilter] = useState("month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exporting, setExporting] = useState(false);
  const [isCustomApplied, setIsCustomApplied] = useState(false);

  const shouldFetch = filter !== "custom" || isCustomApplied;

  const queryParams = useMemo(() => {
    if (filter === "custom" && isCustomApplied) {
      return { period: "custom", start: startDate, end: endDate };
    }
    if (filter !== "custom") {
      return { period: filter };
    }
    return "";
  }, [filter, startDate, endDate, isCustomApplied]);

  const generateMutation = adminHook.Reports.useGenerateReport();

  const {
    data: analytics,
    isPending,
    isError,
    error,
    refetch,
  } = adminHook.Analytics.useAnalytics(shouldFetch ? queryParams : "");

  const busy = isPending || exporting || generateMutation.isPending;

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load analytics.");
    }
  }, [isError, error]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setIsCustomApplied(false);
  };

  const handleApplyCustomDates = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be after end date.");
      return;
    }
    setIsCustomApplied(true);
    toast.success("Custom date range filter applied.");
  };

  const handleExportReport = async () => {
    setExporting(true);
    try {
      const payload = {
        type: "appointments",
        range: filter,
        format: "csv",
        ...(filter === "custom" ? { start: startDate, end: endDate } : {}),
      };

      const result = await toast
        .promise(generateMutation.mutateAsync(payload), {
          loading: "Generating platform report…",
          success: "Report downloaded.",
          error: "Could not export report.",
        })
        .unwrap();

      if (result?.columns?.length && result?.rows?.length) {
        const csv = rowsToCsv(result.columns, result.rows);
        downloadFile(
          csv,
          `iron-oak-analytics-${filter}-${Date.now()}.csv`,
          "text/csv;charset=utf-8;",
        );
      } else {
        toast.info("No appointment rows to export for this period.");
      }
    } catch {
      /* toast handles error */
    } finally {
      setExporting(false);
    }
  };

  const currentData = useMemo(() => {
    if (!analytics) return null;
    return {
      stats: analytics.stats ?? [],
      serviceUsage: analytics.serviceUsage ?? { data: [], labels: [] },
      insights: analytics.insights ?? {},
      summary: analytics.summary ?? {},
      appointmentsTrends: analytics.appointmentsTrends ?? { data: [], labels: [] },
    };
  }, [analytics]);

  const isEmptyState =
    shouldFetch &&
    !isPending &&
    !isError &&
    currentData &&
    currentData.summary?.totalAppointments === 0 &&
    currentData.stats.every((s) => s.value === "0" || s.value === 0);

  const showCustomPrompt = filter === "custom" && !isCustomApplied;

  if (isPending && shouldFetch && !currentData) {
    return (
      <div className="mx-auto max-w-7xl min-w-0 space-y-8 pb-4">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="font-label-caps text-primary">Admin · Monitoring</p>
            <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
              Platform Analytics
            </h1>
          </div>
        </header>
        <PageLoader label="Loading analytics..." className="mx-auto max-w-7xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl min-w-0 space-y-8 pb-4">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="font-label-caps text-primary">Admin · Monitoring</p>

          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            Platform Analytics
          </h1>

          <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
            Monitor appointments, new customer sign-ups, service demand, and platform ratings for the
            selected period.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportReport}
            disabled={busy || showCustomPrompt || isEmptyState || isError}
            className="bg-primary text-on-primary inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {exporting ? (
              <span className="border-on-primary/30 border-t-on-primary h-4 w-4 animate-spin rounded-full border-2" />
            ) : (
              <Download className="h-4 w-4" aria-hidden />
            )}

            {exporting ? "Exporting..." : "Export Report"}
          </button>
        </div>
      </header>

      <div className="border-outline-variant/60 bg-surface-container-low rounded-xl border p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <Filter className="text-on-surface-variant/70 h-4 w-4" />
              <span className="text-on-surface text-xs font-bold tracking-wider uppercase">
                Date Filters:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {["today", "week", "month", "year", "custom"].map((item) => (
                <button
                  key={item}
                  type="button"
                  disabled={busy}
                  onClick={() => handleFilterChange(item)}
                  className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                    filter === item
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  {item === "today" && "Today"}
                  {item === "week" && "This Week"}
                  {item === "month" && "This Month"}
                  {item === "year" && "This Year"}
                  {item === "custom" && "Custom Range"}
                </button>
              ))}
            </div>
          </div>

          {filter === "custom" && (
            <form
              onSubmit={handleApplyCustomDates}
              className="border-outline-variant/40 mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-end"
            >
              <div className="flex-1 space-y-1">
                <label className="text-on-surface-variant block text-[10px] font-semibold uppercase">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={busy}
                  className="border-outline-variant bg-surface-container text-on-surface focus:border-primary h-9 w-full rounded-md border px-3 text-xs focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-on-surface-variant block text-[10px] font-semibold uppercase">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={busy}
                  className="border-outline-variant bg-surface-container text-on-surface focus:border-primary h-9 w-full rounded-md border px-3 text-xs focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 h-9 shrink-0 rounded-md border px-5 text-xs font-semibold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply Range
              </button>
            </form>
          )}
        </div>

        {isError ? (
          <div className="border-outline-variant bg-surface-container-low flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <AlertCircle className="text-on-surface-variant/40 mb-4 h-12 w-12" />
            <h3 className="text-on-surface text-base font-bold">Could not load analytics</h3>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={busy}
              className="text-primary mt-4 text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              Try again
            </button>
          </div>
        ) : isPending ? (
          <PageLoader label="Loading analytics..." className="mx-auto max-w-7xl" />
        ) : showCustomPrompt ? (
          <div className="border-outline-variant bg-surface-container-low flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <Filter className="text-primary/40 mb-4 h-12 w-12 animate-bounce" />
            <h3 className="text-on-surface text-base font-bold">Select Custom Date Range</h3>
            <p className="text-on-surface-variant mt-2 max-w-sm text-xs leading-relaxed">
              Choose start and end dates in the filter panel above to analyze platform metrics for a
              custom period.
            </p>
          </div>
        ) : isEmptyState ? (
          <div className="border-outline-variant bg-surface-container-low flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <AlertCircle className="text-on-surface-variant/40 mb-4 h-12 w-12" />
            <h3 className="text-on-surface text-base font-bold">No Platform Data Found</h3>
            <p className="text-on-surface-variant mt-2 max-w-sm text-xs leading-relaxed">
              There are no platform bookings, customer registrations or ratings recorded for the
              selected period.
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setFilter("month");
                setIsCustomApplied(false);
                setStartDate("");
                setEndDate("");
              }}
              className="bg-primary text-on-primary mt-5 h-9 rounded-md px-4 text-xs font-semibold transition-all hover:opacity-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reset Filters
            </button>
          </div>
        ) : currentData ? (
          <div className="space-y-8">
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {currentData.stats.map((stat) => {
                let Icon = Users;
                let accent = "text-primary bg-primary/10";

                if (stat.label === "Total Barbers") {
                  Icon = Scissors;
                  accent = "text-amber-500 bg-amber-500/10";
                } else if (stat.label === "New Customers") {
                  Icon = Users;
                  accent = "text-primary bg-primary/10";
                } else if (stat.label === "Total Appointments") {
                  Icon = CalendarCheck;
                  accent = "text-emerald-500 bg-emerald-500/10";
                } else if (stat.label === "Total Services") {
                  Icon = Clock;
                  accent = "text-sky-500 bg-sky-500/10";
                } else if (stat.label === "Active Barbers") {
                  Icon = Sparkles;
                  accent = "text-indigo-500 bg-indigo-500/10";
                } else if (stat.label === "Average Rating") {
                  Icon = Star;
                  accent = "text-yellow-500 bg-yellow-500/10 animate-pulse";
                }

                return (
                  <div
                    key={stat.label}
                    className="border-outline-variant/50 bg-surface-container-low relative overflow-hidden rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="text-on-surface-variant truncate text-[10px] font-bold tracking-wider uppercase">
                          {stat.label}
                        </p>
                        <h3 className="text-on-surface mt-2.5 text-xl font-extrabold tracking-tight">
                          {stat.value}
                        </h3>
                      </div>
                      <div className={`rounded-lg p-2 ${accent} shrink-0`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>
                    {stat.change && (
                      <div className="mt-3 flex items-center gap-1">
                        <span
                          className={`flex items-center gap-0.5 text-[10px] font-bold ${stat.isPositive ? "text-emerald-500" : "text-error"}`}
                        >
                          {stat.isPositive ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownRight className="h-3.5 w-3.5" />
                          )}
                          {stat.change}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>

            <section className="grid min-w-0 gap-6 md:grid-cols-2">
              <div className="border-outline-variant/60 bg-surface-container-low min-w-0 overflow-hidden rounded-xl border p-5 shadow-sm">
                <h4 className="text-on-surface-variant mb-3 text-xs font-semibold tracking-wider uppercase">
                  Appointments over time
                </h4>
                <AreaSeriesPanel
                  embedded
                  gradientId="analyticsAppointmentsTrend"
                  data={currentData.appointmentsTrends.data ?? []}
                  labels={currentData.appointmentsTrends.labels ?? []}
                />
              </div>

              <div className="border-outline-variant/60 bg-surface-container-low min-w-0 overflow-hidden rounded-xl border p-5 shadow-sm">
                <VerticalBarChart
                  data={currentData.serviceUsage.data}
                  labels={currentData.serviceUsage.labels}
                  title="Top 5 Most Demanded Services"
                />
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 pl-1">
                <Sparkles className="text-primary h-4 w-4" />
                <h3 className="text-on-surface text-xs font-bold tracking-wider uppercase">
                  Smart Insights
                </h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="border-outline-variant bg-surface-container-low rounded-xl border p-4">
                  <div className="flex items-center gap-2 text-amber-500">
                    <Scissors className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-bold tracking-wider uppercase">
                      Most Active Barber
                    </span>
                  </div>
                  <p className="text-on-surface mt-2 truncate text-sm font-bold">
                    {currentData.insights.mostActiveBarber}
                  </p>
                </div>

                <div className="border-outline-variant bg-surface-container-low rounded-xl border p-4">
                  <div className="flex items-center gap-2 text-sky-500">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-bold tracking-wider uppercase">
                      Top Service
                    </span>
                  </div>
                  <p className="text-on-surface mt-2 truncate text-sm font-bold">
                    {currentData.insights.mostBookedService}
                  </p>
                </div>

                <div className="border-outline-variant bg-surface-container-low rounded-xl border p-4">
                  <div className="flex items-center gap-2 text-yellow-500">
                    <Star className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-bold tracking-wider uppercase">
                      Highest Rated Barber
                    </span>
                  </div>
                  <p className="text-on-surface mt-2 truncate text-sm font-bold">
                    {currentData.insights.highestRatedBarber}
                  </p>
                </div>

                <div className="border-outline-variant bg-surface-container-low rounded-xl border p-4">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-bold tracking-wider uppercase">Peak Day</span>
                  </div>
                  <p className="text-on-surface mt-2 truncate text-sm font-bold">
                    {currentData.insights.peakBookingDay}
                  </p>
                </div>

                <div className="border-outline-variant bg-surface-container-low rounded-xl border p-4">
                  <div className="text-primary flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-bold tracking-wider uppercase">Peak Time</span>
                  </div>
                  <p className="text-on-surface mt-2 truncate text-sm font-bold">
                    {currentData.insights.peakBookingTime}
                  </p>
                </div>
              </div>
            </section>

            <section className="border-outline-variant bg-surface-container-low overflow-hidden rounded-xl border">
              <div className="border-outline-variant/80 bg-surface-container-low border-b px-5 py-4">
                <h3 className="text-on-surface text-xs font-bold tracking-wider uppercase">
                  Period Summary ({filter.toUpperCase()})
                </h3>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total appointments", value: currentData.summary.totalAppointments },
                  { label: "Completed", value: currentData.summary.completedAppointments },
                  { label: "New customers", value: currentData.summary.totalCustomers },
                  {
                    label: "Revenue",
                    value: formatMoney(Number(currentData.summary.totalRevenue ?? 0)),
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="border-outline-variant bg-surface-container rounded-lg border p-4"
                  >
                    <p className="text-on-surface-variant text-[10px] font-bold uppercase">
                      {row.label}
                    </p>
                    <p className="text-on-surface mt-2 font-serif text-xl font-bold">{row.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : null}
    </div>
  );
}
