"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  CalendarCheck,
  Scissors,
  Settings,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import StatTile from "./components/Dashboard/StatTile";
import BookingTrendChart from "./components/Dashboard/BookingTrendChart";
import RecentActivity from "./components/Dashboard/RecentActivity";
import RecentReports from "./components/Dashboard/RecentReports";
import QueueOverview from "./components/Dashboard/QueueOverview";
import CityGrowth from "./components/Dashboard/CityGrowth";
import {
  ADMIN_STATS,
  BOOKING_TREND,
  CITY_GROWTH,
  QUEUE_OVERVIEW,
  RECENT_ACTIVITY,
  RECENT_REPORTS,
} from "../../data/admin/dashboardData";
import { getGreeting, getTodayDateLabel } from "@/lib/format/formatDateTime.js";
import { useHydrated } from "@/lib/hooks/useHydrated.js";

export default function Dashboard() {
  const hydrated = useHydrated();
  const greeting = hydrated ? getGreeting() : "Hello";
  const today = hydrated ? getTodayDateLabel() : "";

  const trendTotal = useMemo(() => BOOKING_TREND.reduce((sum, d) => sum + d.value, 0), []);

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
            href="/admin/barber-requests"
            className="border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors"
          >
            <UserCheck className="h-4 w-4" aria-hidden /> Review barbers
            <span className="bg-status-pending/15 text-status-pending ml-1 rounded-full px-2 py-0.5 text-[11px] font-bold">
              {ADMIN_STATS.pendingApprovals}
            </span>
          </Link>
          <Link
            href="/admin/analytics"
            className="bg-primary text-on-primary hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold transition-colors"
          >
            <BarChart3 className="h-4 w-4" aria-hidden /> Open analytics
          </Link>
        </div>
      </header>

      <section className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatTile
          label="Total users"
          value={ADMIN_STATS.totalUsers.toLocaleString()}
          hint="Across all cities"
          Icon={Users}
          accent="text-primary bg-primary/15"
          delta={ADMIN_STATS.usersDelta}
        />
        <StatTile
          label="Total barbers"
          value={ADMIN_STATS.totalBarbers.toLocaleString()}
          hint="Active on the platform"
          Icon={Scissors}
          accent="text-status-confirmed bg-status-confirmed/15"
          delta={ADMIN_STATS.barbersDelta}
        />
        <StatTile
          label="Pending approvals"
          value={ADMIN_STATS.pendingApprovals}
          hint="Barber sign-ups to review"
          Icon={UserCheck}
          accent="text-status-pending bg-status-pending/15"
        />
        <StatTile
          label="Total bookings"
          value={ADMIN_STATS.totalBookings.toLocaleString()}
          hint="Last 30 days"
          Icon={CalendarCheck}
          accent="text-primary bg-primary/15"
          delta={ADMIN_STATS.bookingsDelta}
        />
        <StatTile
          label="System growth"
          value={`+${ADMIN_STATS.systemGrowth}%`}
          hint="Month over month"
          Icon={TrendingUp}
          accent="text-status-confirmed bg-status-confirmed/15"
          delta={ADMIN_STATS.systemGrowth}
        />
      </section>

      <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-2">
          <BookingTrendChart
            data={BOOKING_TREND}
            total={trendTotal}
            delta={ADMIN_STATS.bookingsDelta}
          />
          <RecentActivity items={RECENT_ACTIVITY} />
        </div>
        <div className="min-w-0 space-y-4 sm:space-y-6">
          <QueueOverview cities={QUEUE_OVERVIEW} />
          <RecentReports items={RECENT_REPORTS} />
        </div>
      </div>

      <CityGrowth cities={CITY_GROWTH} />

      <footer className="border-outline-variant bg-surface-container-low flex flex-wrap items-center justify-between gap-3 rounded-xl border px-5 py-4">
        <p className="text-on-surface-variant text-xs">
          Need to configure platform-wide settings or notifications?
        </p>
        <Link
          href="/admin/settings"
          className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high inline-flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-semibold transition-colors"
        >
          <Settings className="h-3.5 w-3.5" aria-hidden /> System settings
        </Link>
      </footer>
    </div>
  );
}
