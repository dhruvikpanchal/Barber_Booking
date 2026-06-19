"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "@/lib/AppLink";
import { CalendarDays, CheckCircle2, IndianRupee, PlusCircle, Users } from "lucide-react";
import { toast } from "sonner";
import StatTile from "@/client/modules/shared/components/ui/StatTile";
import TodaySchedule from "@/client/modules/barber/components/Dashboard/TodaySchedule";
import PendingRequests from "@/client/modules/barber/components/Dashboard/PendingRequests";
import QueueSnapshot from "@/client/modules/barber/components/Dashboard/QueueSnapshot";
import EarningsCard from "@/client/modules/barber/components/Dashboard/EarningsCard";
import CustomerStats from "@/client/modules/barber/components/Dashboard/CustomerStats";
import { getGreeting, getTodayDateLabel } from "@/client/lib/format/formatDateTime.js";
import { formatMoney } from "@/client/lib/format/formatMoney.js";
import { useHydrated } from "@/client/modules/shared/hooks/useHydrated.js";
import { routes } from "@/client/config/routes/routes.js";
import { barberHook, useBarberInvalidation } from "@/client/modules/barber/hooks/barberQuery.jsx";
import { seedBarberDashboardQueryCache } from "@/client/modules/barber/helpers/barberCacheHelpers.js";
import { useStoredUser } from "@/client/modules/shared/hooks/useStoredUser.js";
import { mapDashboardAppointment } from "@/client/modules/barber/helpers/barberMappers.js";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

export default function Dashboard() {
  const hydrated = useHydrated();
  const queryClient = useQueryClient();
  const storedUser = useStoredUser();
  const { data, isPending, isError, error, refetch } = barberHook.Dashboard.useGetDashboard();
  const statusMutation = barberHook.Appointments.useUpdateAppointmentStatus();
  const invalidate = useBarberInvalidation();

  const busy = isPending || statusMutation.isPending;

  useEffect(() => {
    if (data) seedBarberDashboardQueryCache(queryClient, data);
  }, [data, queryClient]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load dashboard.");
    }
  }, [isError, error]);

  const greeting = hydrated ? getGreeting() : "Hello";
  const today = hydrated ? getTodayDateLabel() : "";
  const firstName =
    data?.barber?.firstName ??
    storedUser?.firstName ??
    storedUser?.fullName?.split(" ")[0] ??
    "there";

  const stats = data?.stats ?? {
    today: 0,
    completed: 0,
    upcoming: 0,
    pending: 0,
    earnings: 0,
    served: 0,
  };
  const appointments = (data?.todaySchedule ?? []).map(mapDashboardAppointment);
  const requests = (data?.pendingRequests ?? []).map(mapDashboardAppointment);
  const queueSnapshot = data?.queueSnapshot ?? {
    waiting: 0,
    avgWaitMin: 0,
    chairsTotal: 0,
    chairsBusy: 0,
    nextUp: [],
  };
  const earnings = data?.earnings ?? {
    today: 0,
    yesterday: 0,
    weekToDate: 0,
    weekTarget: 0,
    trend: [],
    tips: 0,
  };
  const customerStats = data?.customerStats ?? {
    servedToday: 0,
    newClients: 0,
    returning: 0,
    avgRating: 0,
    reviewsThisWeek: 0,
    rebookRate: 0,
  };

  async function handleRequest(id, status) {
    if (busy) return;
    try {
      await statusMutation.mutateAsync({ id, status: status.toUpperCase() });
      toast.success(status === "confirmed" ? "Booking confirmed." : "Booking rejected.");
      await Promise.all([refetch(), invalidate.operations()]);
    } catch (err) {
      toast.error(err?.message || "Could not update booking.");
    }
  }

  if (isPending) {
    return <PageLoader label="Loading dashboard..." className="mx-auto max-w-6xl" />;
  }

  if (isError) {
    return (
      <div className="text-on-surface mx-auto max-w-6xl py-16 text-center">
        <p className="font-medium">Could not load dashboard.</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={busy}
          className="text-primary mt-3 text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 space-y-6 pb-4 sm:space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="font-label-caps text-primary">Barber · Dashboard</p>
          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            {greeting}, {firstName}
          </h1>
          <p className="text-on-surface-variant text-sm">{today || "\u00a0"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={routes.barber.walkIns}
            aria-disabled={busy}
            tabIndex={busy ? -1 : undefined}
            className="border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            <PlusCircle className="h-4 w-4" aria-hidden /> Add walk-in
          </Link>
          <Link
            href={routes.barber.queue}
            aria-disabled={busy}
            tabIndex={busy ? -1 : undefined}
            className="bg-primary text-on-primary hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            <Users className="h-4 w-4" aria-hidden /> Open queue
          </Link>
        </div>
      </header>

      <section className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Today's bookings"
          value={stats.today}
          hint={`${stats.completed} done · ${stats.upcoming} upcoming`}
          Icon={CalendarDays}
          accent="text-primary bg-primary/15"
        />
        <StatTile
          label="Pending"
          value={stats.pending}
          hint="Needs your response"
          Icon={CheckCircle2}
          accent="text-status-pending bg-status-pending/15"
        />
        <StatTile
          label="Queue waiting"
          value={queueSnapshot.waiting}
          hint={`Avg ${queueSnapshot.avgWaitMin}m wait`}
          Icon={Users}
          accent="text-status-confirmed bg-status-confirmed/15"
        />
        <StatTile
          label="Today's earnings"
          value={formatMoney(stats.earnings)}
          hint={`${stats.served} customers served`}
          Icon={IndianRupee}
          accent="text-status-confirmed bg-status-confirmed/15"
        />
      </section>

      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <TodaySchedule appointments={appointments} />
          <EarningsCard earnings={earnings} />
        </div>
        <div className="min-w-0 space-y-6">
          <PendingRequests
            requests={requests}
            onAccept={(id) => handleRequest(id, "confirmed")}
            onReject={(id) => handleRequest(id, "cancelled")}
          />
          <QueueSnapshot snapshot={queueSnapshot} />
        </div>
      </div>

      <CustomerStats stats={customerStats} />
    </div>
  );
}
