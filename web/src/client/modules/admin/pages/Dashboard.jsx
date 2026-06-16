"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  CalendarCheck,
  Loader2,
  Scissors,
  Settings,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import StatTile from "@/client/modules/shared/components/ui/StatTile";
import BookingTrendCard from "@/client/modules/shared/components/charts/BookingTrendCard.jsx";
import RecentActivity from "@/client/modules/admin/components/Dashboard/RecentActivity";
import RecentReports from "@/client/modules/admin/components/Dashboard/RecentReports";
import QueueOverview from "@/client/modules/admin/components/Dashboard/QueueOverview";
import CityGrowth from "@/client/modules/admin/components/Dashboard/CityGrowth";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import { mapAdminDashboard } from "@/client/modules/admin/helpers/adminMappers.js";
import { getGreeting, getTodayDateLabel } from "@/client/lib/format/formatDateTime.js";
import { useHydrated } from "@/client/modules/shared/hooks/useHydrated.js";

export default function Dashboard() {
  const hydrated = useHydrated();
  const { data, isPending, isError, error, refetch } = adminHook.Dashboard.useDashboard();

  const greeting = hydrated ? getGreeting() : "Hello";
  const today = hydrated ? getTodayDateLabel() : "";

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load dashboard.");
    }
  }, [isError, error]);

  const dashboard = useMemo(() => mapAdminDashboard(data), [data]);
  const stats = dashboard?.stats;
  const trendTotal = useMemo(
    () => (dashboard?.bookingTrend ?? []).reduce((sum, d) => sum + d.value, 0),
    [dashboard?.bookingTrend],
  );

  if (isPending && !dashboard) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 pb-4">
        <div className="bg-surface-container h-24 animate-pulse rounded-xl" />
        <div className="bg-surface-container h-64 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (isError && !dashboard) {
    return (
      <div className="text-on-surface mx-auto max-w-7xl py-16 text-center">
        <p className="font-medium">Could not load dashboard.</p>
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

  if (!stats) return null;

  return (
    <div className="mx-auto max-w-7xl min-w-0 space-y-6 pb-4 sm:space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="font-label-caps text-primary">Admin · Dashboard</p>
          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            {greeting}, Admin
          </h1>
          <p className="text-on-surface-variant text-sm">
            {today ? `${today} · ` : ""}Platform overview
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={routes.admin.barberRequests}
            className="border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors"
          >
            <UserCheck className="h-4 w-4" aria-hidden /> Review barbers
            <span className="bg-status-pending/15 text-status-pending ml-1 rounded-full px-2 py-0.5 text-[11px] font-bold">
              {stats.pendingApprovals}
            </span>
          </Link>
          <Link
            href={routes.admin.analytics}
            className="bg-primary text-on-primary hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold transition-colors"
          >
            <BarChart3 className="h-4 w-4" aria-hidden /> Open analytics
          </Link>
        </div>
      </header>

      <section className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatTile
          label="Total users"
          value={stats.totalUsers.toLocaleString()}
          hint="Across all cities"
          Icon={Users}
          accent="text-primary bg-primary/15"
          delta={stats.usersDelta}
        />
        <StatTile
          label="Total barbers"
          value={stats.totalBarbers.toLocaleString()}
          hint="Active on the platform"
          Icon={Scissors}
          accent="text-status-confirmed bg-status-confirmed/15"
          delta={stats.barbersDelta}
        />
        <StatTile
          label="Pending approvals"
          value={stats.pendingApprovals}
          hint="Barber sign-ups to review"
          Icon={UserCheck}
          accent="text-status-pending bg-status-pending/15"
        />
        <StatTile
          label="Total bookings"
          value={stats.totalBookings.toLocaleString()}
          hint="Last 30 days"
          Icon={CalendarCheck}
          accent="text-primary bg-primary/15"
          delta={stats.bookingsDelta}
        />
        <StatTile
          label="System growth"
          value={`+${stats.systemGrowth}%`}
          hint="Month over month"
          Icon={TrendingUp}
          accent="text-status-confirmed bg-status-confirmed/15"
          delta={stats.systemGrowth}
        />
      </section>

      <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-2">
          <BookingTrendCard
            data={dashboard.bookingTrend}
            total={trendTotal}
            delta={stats.bookingsDelta}
          />
          <RecentActivity items={dashboard.recentActivity} />
        </div>
        <div className="min-w-0 space-y-4 sm:space-y-6">
          <QueueOverview cities={dashboard.queueOverview} />
          <RecentReports items={dashboard.recentReports} />
        </div>
      </div>

      <CityGrowth cities={dashboard.cityGrowth} />

      <footer className="border-outline-variant bg-surface-container-low flex flex-wrap items-center justify-between gap-3 rounded-xl border px-5 py-4">
        <p className="text-on-surface-variant text-xs">
          Need to configure platform-wide settings or notifications?
        </p>
        <Link
          href={routes.admin.settings}
          className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high inline-flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-semibold transition-colors"
        >
          <Settings className="h-3.5 w-3.5" aria-hidden /> System settings
        </Link>
      </footer>

      {isPending && (
        <p className="text-on-surface-variant flex items-center justify-center gap-2 text-xs">
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          Refreshing dashboard…
        </p>
      )}
    </div>
  );
}
