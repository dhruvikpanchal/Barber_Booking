"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, DollarSign, PlusCircle, Users } from "lucide-react";
import StatTile from "./components/Dashboard/StatTile";
import TodaySchedule from "./components/Dashboard/TodaySchedule";
import PendingRequests from "./components/Dashboard/PendingRequests";
import QueueSnapshot from "./components/Dashboard/QueueSnapshot";
import EarningsCard from "./components/Dashboard/EarningsCard";
import CustomerStats from "./components/Dashboard/CustomerStats";
import {
  CUSTOMER_STATS,
  EARNINGS,
  PENDING_REQUESTS,
  QUEUE_SNAPSHOT,
  TODAY_APPOINTMENTS,
} from "../../data/barber/dashboardData";
import { getGreeting, getTodayDateLabel } from "@/lib/format/formatDateTime.js";
import { useHydrated } from "@/lib/hooks/useHydrated.js";

export default function Dashboard() {
  const hydrated = useHydrated();
  const [requests, setRequests] = useState(PENDING_REQUESTS);
  const [appointments] = useState(TODAY_APPOINTMENTS);

  const stats = useMemo(() => {
    const completed = appointments.filter((a) => a.status === "completed").length;
    const upcoming = appointments.filter(
      (a) => a.status === "confirmed" || a.status === "in-service",
    ).length;
    return {
      today: appointments.length,
      completed,
      upcoming,
      pending: requests.length,
      earnings: EARNINGS.today,
      served: CUSTOMER_STATS.servedToday,
    };
  }, [appointments, requests]);

  const removeRequest = (id) => setRequests((prev) => prev.filter((r) => r.id !== id));

  const greeting = hydrated ? getGreeting() : "Hello";
  const today = hydrated ? getTodayDateLabel() : "";

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 space-y-6 pb-4 sm:space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <p className="font-label-caps text-primary">Barber · Dashboard</p>
          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            {greeting}, Marco
          </h1>
          <p className="text-on-surface-variant text-sm">{today || "\u00a0"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/barber/walk-ins"
            className="border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors"
          >
            <PlusCircle className="h-4 w-4" aria-hidden /> Add walk-in
          </Link>
          <Link
            href="/barber/queue"
            className="bg-primary text-on-primary hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold transition-colors"
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
          delta={12}
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
          value={QUEUE_SNAPSHOT.waiting}
          hint={`Avg ${QUEUE_SNAPSHOT.avgWaitMin}m wait`}
          Icon={Users}
          accent="text-status-confirmed bg-status-confirmed/15"
        />
        <StatTile
          label="Today's earnings"
          value={`$${stats.earnings}`}
          hint={`${stats.served} customers served`}
          Icon={DollarSign}
          accent="text-status-confirmed bg-status-confirmed/15"
          delta={23}
        />
      </section>

      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <TodaySchedule appointments={appointments} />
          <EarningsCard earnings={EARNINGS} />
        </div>
        <div className="min-w-0 space-y-6">
          <PendingRequests requests={requests} onAccept={removeRequest} onReject={removeRequest} />
          <QueueSnapshot snapshot={QUEUE_SNAPSHOT} />
        </div>
      </div>

      <CustomerStats stats={CUSTOMER_STATS} />
    </div>
  );
}
