"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  CalendarClock,
  XCircle,
  CalendarPlus,
} from "lucide-react";
import { MY_APPOINTMENTS } from "@/data/customer/appointmentsData.js";
import { INITIAL_NOTIFICATIONS } from "@/data/customer/notificationsData.js";
import { INITIAL_PROFILE } from "@/data/customer/profileData.js";
import {
  buildRecentActivity,
  getDashboardStats,
  getNextAppointment,
  getNotificationPreview,
  getUpcomingAppointments,
} from "@/data/customer/dashboardData.js";
import { getGreeting, getTodayDateLabel } from "@/lib/format/formatDateTime.js";
import { useHydrated } from "@/lib/hooks/useHydrated.js";
import { routes } from "@/config/routes/routes.js";
import StatTile from "./components/Dashboard/StatTile.jsx";
import QuickActions from "./components/Dashboard/QuickActions.jsx";
import NextAppointmentCard from "./components/Dashboard/NextAppointmentCard.jsx";
import UpcomingBookingsWidget from "./components/Dashboard/UpcomingBookingsWidget.jsx";
import RecentActivity from "./components/Dashboard/RecentActivity.jsx";
import NotificationsPreview from "./components/Dashboard/NotificationsPreview.jsx";

export default function Dashboard() {
  const hydrated = useHydrated();

  const stats = useMemo(() => getDashboardStats(MY_APPOINTMENTS), []);
  const nextAppointment = useMemo(() => getNextAppointment(MY_APPOINTMENTS), []);
  const upcoming = useMemo(() => getUpcomingAppointments(MY_APPOINTMENTS, 3), []);
  const recentActivity = useMemo(() => buildRecentActivity(MY_APPOINTMENTS, 6), []);
  const notificationPreview = useMemo(
    () => getNotificationPreview(INITIAL_NOTIFICATIONS, 4),
    [],
  );
  const unreadCount = useMemo(
    () => INITIAL_NOTIFICATIONS.filter((n) => !n.read).length,
    [],
  );

  const greeting = hydrated ? getGreeting() : "Hello";
  const today = hydrated ? getTodayDateLabel() : "";
  const firstName = INITIAL_PROFILE.fullName.split(" ")[0];

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6 pb-28 text-on-surface md:space-y-8 md:pb-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="font-label-caps text-primary">Customer · Dashboard</p>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
            {greeting}, {firstName}
          </h1>
          <p className="text-sm text-on-surface-variant">
            {today ? (
              <>
                {today}
                <span className="text-on-surface-variant/80">
                  {" "}
                  · Here&apos;s what&apos;s coming up
                </span>
              </>
            ) : (
              "\u00a0"
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={routes.customer.myAppointments}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-outline-variant bg-surface-container-low px-4 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
          >
            <CalendarClock className="h-4 w-4" aria-hidden />
            My appointments
          </Link>
          <Link
            href={routes.customer.bookAppointment}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-on-primary transition-colors hover:bg-primary/90"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden />
            Book appointment
          </Link>
        </div>
      </header>

      <section
        className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Booking statistics"
      >
        <StatTile
          label="Total bookings"
          value={stats.total}
          hint="All time on your account"
          Icon={CalendarDays}
          accent="text-primary bg-primary/15"
        />
        <StatTile
          label="Completed"
          value={stats.completed}
          hint="Finished visits"
          Icon={CheckCircle2}
          accent="text-status-confirmed bg-status-confirmed/15"
        />
        <StatTile
          label="Upcoming"
          value={stats.upcoming}
          hint="Pending and confirmed"
          Icon={CalendarClock}
          accent="text-status-pending bg-status-pending/15"
        />
        <StatTile
          label="Cancelled"
          value={stats.cancelled}
          hint="Did not take place"
          Icon={XCircle}
          accent="text-status-cancelled bg-status-cancelled/15"
        />
      </section>

      <NextAppointmentCard appointment={nextAppointment} />

      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <UpcomingBookingsWidget appointments={upcoming} />
          <RecentActivity items={recentActivity} />
        </div>
        <div className="min-w-0 space-y-6">
          <QuickActions />
          <NotificationsPreview
            notifications={notificationPreview}
            unreadCount={unreadCount}
          />
        </div>
      </div>
    </div>
  );
}
