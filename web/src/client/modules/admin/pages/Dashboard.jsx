"use client";

import { useEffect, useMemo } from "react";
import Link from "@/lib/AppLink";
import {
  BarChart3,
  CalendarCheck,
  Loader2,
  MessageSquare,
  Scissors,
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
import CityGrowth from "@/client/modules/admin/components/Dashboard/CityGrowth";
import QueueSnapshot from "@/client/modules/admin/components/Dashboard/QueueSnapshot";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import { mapAdminDashboard } from "@/client/modules/admin/helpers/adminMappers.js";
import { getGreeting, getTodayDateLabel } from "@/client/lib/format/formatDateTime.js";
import { useHydrated } from "@/client/modules/shared/hooks/useHydrated.js";
import { useHeaderProfile } from "@/client/modules/shared/hooks/useHeaderProfile.js";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

export default function Dashboard() {
  const hydrated = useHydrated();
  const headerProfile = useHeaderProfile("admin");
  const { data, isPending, isError, error, refetch } = adminHook.Dashboard.useDashboard();

  const greeting = hydrated ? getGreeting() : "Hello";
  const today = hydrated ? getTodayDateLabel() : "";
  const firstName = headerProfile.name?.split(" ")[0] || "Admin";

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load dashboard.");
    }
  }, [isError, error]);

  const dashboard = useMemo(() => mapAdminDashboard(data), [data]);
  const trendTotal = useMemo(
    () => (dashboard?.bookingTrend ?? []).reduce((sum, d) => sum + d.value, 0),
    [dashboard?.bookingTrend],
  );

  if (isPending && !dashboard) {
    return <PageLoader label="Loading dashboard..." className="mx-auto max-w-7xl" />;
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

  if (!dashboard) {
    return (
      <div className="text-on-surface mx-auto max-w-7xl py-16 text-center">
        <p className="font-medium">Dashboard data is unavailable.</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isPending}
          className="text-primary mt-3 text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
    );
  }

  const stats = dashboard.stats;

  return (
    <div className="text-on-surface mx-auto w-full max-w-7xl min-w-0 space-y-6 pb-4 md:space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="font-label-caps text-primary">Admin · Dashboard</p>
          <h1 className="font-serif text-2xl font-bold tracking-tight md:text-3xl">
            {greeting}, {firstName}
          </h1>
          <p className="text-on-surface-variant text-sm">
            {today ? `${today} · ` : ""}Platform overview and live operations
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={routes.admin.barberRequests}
            className="border-outline-variant bg-surface-container-low hover:bg-surface-container inline-flex h-10 min-w-0 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors sm:px-4"
          >
            <UserCheck className="h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">Barber requests</span>
            {stats.pendingApprovals > 0 ? (
              <span className="bg-status-pending/15 text-status-pending shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold">
                {stats.pendingApprovals}
              </span>
            ) : null}
          </Link>
          {dashboard.unreadMessages > 0 ? (
            <Link
              href={routes.admin.contactMessages}
              className="border-outline-variant bg-surface-container-low hover:bg-surface-container inline-flex h-10 min-w-0 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors sm:px-4"
            >
              <MessageSquare className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">Messages</span>
              <span className="bg-primary/15 text-primary shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold">
                {dashboard.unreadMessages}
              </span>
            </Link>
          ) : null}
          <Link
            href={routes.admin.analytics}
            className="bg-primary text-on-primary hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold transition-colors"
          >
            <BarChart3 className="h-4 w-4 shrink-0" aria-hidden />
            Analytics
          </Link>
        </div>
      </header>

      <section className="grid min-w-0 grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <StatTile
          label="Total users"
          value={stats.totalUsers.toLocaleString()}
          hint="Registered customers"
          Icon={Users}
          accent="text-primary bg-primary/15"
          delta={stats.usersDelta}
        />
        <StatTile
          label="Total barbers"
          value={stats.totalBarbers.toLocaleString()}
          hint="Active on platform"
          Icon={Scissors}
          accent="text-status-confirmed bg-status-confirmed/15"
          delta={stats.barbersDelta}
        />
        <StatTile
          label="Pending approvals"
          value={stats.pendingApprovals}
          hint="Applications to review"
          Icon={UserCheck}
          accent="text-status-pending bg-status-pending/15"
        />
        <StatTile
          label="Bookings (30d)"
          value={stats.totalBookings.toLocaleString()}
          hint="Last 30 days"
          Icon={CalendarCheck}
          accent="text-primary bg-primary/15"
          delta={stats.bookingsDelta}
        />
        <StatTile
          label="Platform growth"
          value={`+${stats.systemGrowth}%`}
          hint="Month over month"
          Icon={TrendingUp}
          accent="text-status-confirmed bg-status-confirmed/15"
          delta={stats.systemGrowth}
          className="col-span-2 md:col-span-1"
        />
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="min-w-0 lg:col-span-2">
          <BookingTrendCard
            data={dashboard.bookingTrend}
            total={trendTotal}
            delta={stats.bookingsDelta}
          />
        </div>
        <div className="min-w-0 lg:col-span-1">
          <QueueSnapshot {...dashboard.queueOverview} />
        </div>
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-2 lg:gap-6">
        <RecentActivity items={dashboard.recentActivity} />
        <RecentReports items={dashboard.recentReports} />
      </section>

      <CityGrowth cities={dashboard.cityGrowth} />

      {isPending ? (
        <p className="text-on-surface-variant flex items-center justify-center gap-2 text-xs">
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          Refreshing dashboard…
        </p>
      ) : null}
    </div>
  );
}
