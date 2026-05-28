"use client";

import { useState, useCallback, useMemo } from "react";
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
import { Toast } from "@/components/common/settings/TinyPrimitives.jsx";
import { SkeletonLoader } from "@/modules/admin/components/Analytics/SkeletonLoader.jsx";
import { QueueOverviewChart } from "@/modules/admin/components/Analytics/LineChart.jsx";
import { RechartsBarChart } from "@/modules/admin/components/Analytics/BarChart.jsx";
import {
  ANALYTICS_DATA,
  LIVE_QUEUE_ANALYTICS,
  QUEUE_OVERVIEW_DATA,
} from "@/data/admin/analyticsData.js";

export default function AdminAnalytics() {
  const [filter, setFilter] = useState("month"); // 'today' | 'week' | 'month' | 'year' | 'custom'
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [isCustomApplied, setIsCustomApplied] = useState(false);

  // Auto-dismiss toast
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const handleCloseToast = useCallback(() => {
    setToast(null);
  }, []);

  // Handle filter changes (includes simulation loading state)
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setIsCustomApplied(false);

    if (newFilter !== "custom") {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  };

  // Apply custom dates
  const handleApplyCustomDates = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      showToast("Please select both start and end dates.", "error");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      showToast("Start date cannot be after end date.", "error");
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      setIsCustomApplied(true);
      showToast("Custom date range filter applied.", "success");
    }, 850);
    return () => clearTimeout(timer);
  };

  // Simulate exporting report
  const handleExportReport = async () => {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setExporting(false);
    showToast(`Platform report (${filter.toUpperCase()}) exported successfully.`, "success");
  };

  // Generate dataset based on active filter
  const currentData = useMemo(() => {
    if (filter === "custom") {
      if (!isCustomApplied) {
        return null; // Prompt custom dates input
      }
      // Simulate custom dataset selection based on duration in days
      const daysDiff = Math.ceil(
        Math.abs(new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff <= 2) {
        return ANALYTICS_DATA.today;
      } else if (daysDiff <= 9) {
        return ANALYTICS_DATA.week;
      } else if (daysDiff <= 45) {
        return ANALYTICS_DATA.month;
      } else {
        return ANALYTICS_DATA.year;
      }
    }
    return ANALYTICS_DATA[filter] || ANALYTICS_DATA.month;
  }, [filter, startDate, endDate, isCustomApplied]);

  // If search matches "2030" or future (empty state simulation)
  const isEmptyState = useMemo(() => {
    if (filter === "custom" && isCustomApplied) {
      const yearStart = new Date(startDate).getFullYear();
      if (yearStart >= 2029) return true;
    }
    return false;
  }, [filter, isCustomApplied, startDate]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-4">
      {/* Page Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="font-label-caps text-primary">Admin · Monitoring</p>

          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            Platform Analytics
          </h1>

          <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
            Monitor platform performance, appointment activity, revenue trends, barber productivity,
            customer growth, service popularity, and rating insights across the entire system.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportReport}
            disabled={
              loading || exporting || (filter === "custom" && !isCustomApplied) || isEmptyState
            }
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

      {/* Main Container */}
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-8 md:py-8">
        {/* Filters and Search Bar */}
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
                  onClick={() => handleFilterChange(item)}
                  className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
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

          {/* Custom Date Form */}
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
                  className="border-outline-variant bg-surface-container text-on-surface focus:border-primary h-9 w-full rounded-md border px-3 text-xs focus:outline-none"
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
                  className="border-outline-variant bg-surface-container text-on-surface focus:border-primary h-9 w-full rounded-md border px-3 text-xs focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 h-9 shrink-0 rounded-md border px-5 text-xs font-semibold transition-all active:scale-95"
              >
                Apply Range
              </button>
            </form>
          )}
        </div>

        {/* Content States */}
        {loading ? (
          <SkeletonLoader />
        ) : filter === "custom" && !isCustomApplied ? (
          /* Prompt for Custom Date Range input */
          <div className="border-outline-variant bg-surface-container-low flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <Filter className="text-primary/40 mb-4 h-12 w-12 animate-bounce" />
            <h3 className="text-on-surface text-base font-bold">Select Custom Date Range</h3>
            <p className="text-on-surface-variant mt-2 max-w-sm text-xs leading-relaxed">
              Choose start and end dates in the filter panel above to analyze platform metrics for a
              custom period.
            </p>
          </div>
        ) : isEmptyState ? (
          /* Custom Date Filter Empty State */
          <div className="border-outline-variant bg-surface-container-low flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <AlertCircle className="text-on-surface-variant/40 mb-4 h-12 w-12" />
            <h3 className="text-on-surface text-base font-bold">No Platform Data Found</h3>
            <p className="text-on-surface-variant mt-2 max-w-sm text-xs leading-relaxed">
              There are no platform bookings, customer registrations or ratings recorded between{" "}
              {startDate} and {endDate}.
            </p>
            <button
              onClick={() => {
                setFilter("month");
                setIsCustomApplied(false);
                setStartDate("");
                setEndDate("");
              }}
              className="bg-primary text-on-primary mt-5 h-9 rounded-md px-4 text-xs font-semibold transition-all hover:opacity-95 active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        ) : currentData ? (
          /* Render Active Dashboards */
          <div className="space-y-8">
            {/* Top StatTiles grid */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {currentData.stats.map((stat, i) => {
                let Icon = Users;
                let accent = "text-primary bg-primary/10";

                if (stat.label === "Total Barbers") {
                  Icon = Scissors;
                  accent = "text-amber-500 bg-amber-500/10";
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
                    key={i}
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
                        <span className="text-on-surface-variant text-[9px] opacity-60">
                          prev period
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>

            {/* Charts Grid */}
            <section className="grid gap-6 md:grid-cols-2">
              {/* Customer Growth Line Chart */}
              <div className="border-outline-variant/60 bg-surface-container-low rounded-xl border p-5 shadow-sm">
                <QueueOverviewChart cities={LIVE_QUEUE_ANALYTICS} />
              </div>

              {/* Appointment Trends Line Chart */}
              <div className="border-outline-variant/60 bg-surface-container-low rounded-xl border p-5 shadow-sm">
                <QueueOverviewChart cities={LIVE_QUEUE_ANALYTICS} />
              </div>

              {/* Barber Registration Growth Bar Chart */}
              <div className="border-outline-variant/60 bg-surface-container-low rounded-xl border p-5 shadow-sm">
                <QueueOverviewChart cities={LIVE_QUEUE_ANALYTICS} />
              </div>

              {/* Service Usage Bar Chart */}
              <div className="border-outline-variant/60 bg-surface-container-low rounded-xl border p-5 shadow-sm">
                <RechartsBarChart
                  data={currentData.serviceUsage.data}
                  labels={currentData.serviceUsage.labels}
                  title="Top 5 Most Demanded Services"
                />
              </div>

              {/* Rating Trends Line Chart */}
              <div className="border-outline-variant/60 bg-surface-container-low rounded-xl border p-5 shadow-sm md:col-span-2">
                <QueueOverviewChart cities={QUEUE_OVERVIEW_DATA} />
              </div>
            </section>

            {/* Insights Section */}
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

            {/* Reports Section Table */}
            <section className="border-outline-variant bg-surface-container-low overflow-hidden rounded-xl border">
              <div className="border-outline-variant/80 bg-surface-container-low border-b px-5 py-4">
                <h3 className="text-on-surface text-xs font-bold tracking-wider uppercase">
                  Report Breakdown ({filter.toUpperCase()})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="border-outline-variant bg-surface-container-lowest text-on-surface-variant border-b font-semibold">
                    <tr>
                      <th className="px-5 py-3">Timeframe</th>
                      <th className="px-5 py-3 text-right">Barbers Registered</th>
                      <th className="px-5 py-3 text-right">New Customers</th>
                      <th className="px-5 py-3 text-right">Total Appointments</th>
                      <th className="px-5 py-3 text-right">Service Formats</th>
                      <th className="px-5 py-3 text-right">Avg Rating Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-outline-variant/45 divide-y">
                    {currentData.reports.map((row, i) => (
                      <tr key={i} className="hover:bg-surface-container-high transition-colors">
                        <td className="text-on-surface px-5 py-3 font-semibold">{row.period}</td>
                        <td className="text-on-surface px-5 py-3 text-right">{row.barbers}</td>
                        <td className="text-on-surface px-5 py-3 text-right">{row.customers}</td>
                        <td className="text-on-surface px-5 py-3 text-right">{row.appointments}</td>
                        <td className="text-on-surface px-5 py-3 text-right">{row.services}</td>
                        <td className="px-5 py-3 text-right font-medium text-yellow-500">
                          {row.rating.toFixed(2)} ★
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        ) : null}
      </div>

      {/* Success/Error Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={handleCloseToast} />}
    </div>
  );
}
