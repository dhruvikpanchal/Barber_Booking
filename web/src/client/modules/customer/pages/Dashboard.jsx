"use client";

import { useEffect } from "react";
import Link from "@/lib/AppLink";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, CheckCircle2, CalendarClock, XCircle, CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { getGreeting, getTodayDateLabel } from "@/client/lib/format/formatDateTime.js";
import { useHydrated } from "@/client/modules/shared/hooks/useHydrated.js";
import { useStoredUser } from "@/client/modules/shared/hooks/useStoredUser.js";
import { routes } from "@/client/config/routes/routes.js";
import { customerHook } from "@/client/modules/customer/hooks/customerQuery.jsx";
import { seedDashboardQueryCache } from "@/client/modules/customer/helpers/customerCacheHelpers.js";
import CustomerStatTile from "@/client/modules/customer/components/Dashboard/CustomerStatTile.jsx";
import QuickActions from "@/client/modules/customer/components/Dashboard/QuickActions.jsx";
import NextAppointmentCard from "@/client/modules/customer/components/Dashboard/NextAppointmentCard.jsx";
import UpcomingBookingsWidget from "@/client/modules/customer/components/Dashboard/UpcomingBookingsWidget.jsx";
import RecentActivity from "@/client/modules/customer/components/Dashboard/RecentActivity.jsx";
import NotificationsPreview from "@/client/modules/customer/components/Dashboard/NotificationsPreview.jsx";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

export default function Dashboard() {
  const hydrated = useHydrated();
  const queryClient = useQueryClient();
  const storedUser = useStoredUser();
  const { data, isPending, isError, error, refetch } = customerHook.Dashboard.useDashboard();

  useEffect(() => {
    if (data) seedDashboardQueryCache(queryClient, data);
  }, [data, queryClient]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load your dashboard.");
    }
  }, [isError, error]);

  const greeting = hydrated ? getGreeting() : "Hello";
  const today = hydrated ? getTodayDateLabel() : "";
  const firstName =
    data?.profile?.firstName ??
    storedUser?.firstName ??
    storedUser?.fullName?.split(" ")[0] ??
    "there";

  const stats = data?.stats ?? { total: 0, completed: 0, upcoming: 0, cancelled: 0 };
  const nextAppointment = data?.nextAppointment ?? null;
  const upcoming = data?.upcoming ?? [];
  const recentActivity = data?.recentActivity ?? [];
  const notificationPreview = data?.notifications?.preview ?? [];
  const unreadCount = data?.notifications?.unreadCount ?? 0;

  if (isPending) {
    return <PageLoader label="Loading dashboard..." className="mx-auto max-w-6xl" />;
  }

  if (isError) {
    return (
      <div className="text-on-surface mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="font-medium">Could not load your dashboard.</p>
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
    <div className="text-on-surface mx-auto w-full max-w-6xl min-w-0 space-y-6 md:space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="font-label-caps text-primary">Customer · Dashboard</p>
          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            {greeting}, {firstName}
          </h1>
          <p className="text-on-surface-variant text-sm">
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
            aria-disabled={isPending}
            tabIndex={isPending ? -1 : undefined}
            className="border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            <CalendarClock className="h-4 w-4" aria-hidden />
            My appointments
          </Link>
          <Link
            href={routes.customer.bookAppointment}
            aria-disabled={isPending}
            tabIndex={isPending ? -1 : undefined}
            className="bg-primary text-on-primary hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50"
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
        <CustomerStatTile
          label="Total bookings"
          value={stats.total}
          hint="All time on your account"
          Icon={CalendarDays}
          accent="text-primary bg-primary/15"
        />
        <CustomerStatTile
          label="Completed"
          value={stats.completed}
          hint="Finished visits"
          Icon={CheckCircle2}
          accent="text-status-confirmed bg-status-confirmed/15"
        />
        <CustomerStatTile
          label="Upcoming"
          value={stats.upcoming}
          hint="Pending and confirmed"
          Icon={CalendarClock}
          accent="text-status-pending bg-status-pending/15"
        />
        <CustomerStatTile
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
          <NotificationsPreview notifications={notificationPreview} unreadCount={unreadCount} />
        </div>
      </div>
    </div>
  );
}
