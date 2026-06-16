"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import { CalendarCheck } from "lucide-react";
import AppointmentStats from "@/client/modules/admin/components/Appointments/AppointmentStats.jsx";
import AppointmentFilters from "@/client/modules/admin/components/Appointments/AppointmentFilters.jsx";
import {
  AppointmentCard,
  AppointmentTableRow,
} from "@/client/modules/admin/components/Appointments/AppointmentTableRow.jsx";
import AppointmentDetailDrawer from "@/client/modules/admin/components/Appointments/AppointmentDetailDrawer.jsx";
import MonitorUpdatesModal from "@/client/modules/admin/components/Appointments/MonitorUpdatesModal.jsx";
import ModificationHistoryModal from "@/client/modules/admin/components/Appointments/ModificationHistoryModal.jsx";
import ServiceUpdatedModal from "@/client/modules/admin/components/Appointments/ServiceUpdatedModal.jsx";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import {
  mapAdminAppointmentListItem,
  mapAdminAppointmentStats,
} from "@/client/modules/admin/helpers/adminMappers.js";
import { buildStatusCounts } from "@/client/modules/admin/components/Appointments/helpers.jsx";

export default function Appointments() {
  const router = useRouter();
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [city, setCity] = useState("all");
  const [barberId, setBarberId] = useState("all");
  const [query, setQuery] = useState("");
  const [detailFor, setDetailFor] = useState(null);
  const [monitorFor, setMonitorFor] = useState(null);
  const [historyFor, setHistoryFor] = useState(null);
  const [serviceFor, setServiceFor] = useState(null);

  const listParams = useMemo(
    () => ({
      status: status === "all" ? undefined : status,
      dateRange: dateRange === "all" ? undefined : dateRange,
      city: city === "all" ? undefined : city,
      barberId: barberId === "all" ? undefined : barberId,
      q: query.trim() || undefined,
      page: 1,
      limit: 100,
    }),
    [status, dateRange, city, barberId, query],
  );

  const statsQuery = adminHook.Appointments.useAppointmentStats();
  const listQuery = adminHook.Appointments.useListAppointments(listParams);

  const busy = statsQuery.isPending || listQuery.isPending;

  useEffect(() => {
    if (listQuery.isError) {
      toast.error(listQuery.error?.message || "Could not load appointments.");
    }
  }, [listQuery.isError, listQuery.error]);

  useEffect(() => {
    if (statsQuery.isError) {
      toast.error(statsQuery.error?.message || "Could not load appointment stats.");
    }
  }, [statsQuery.isError, statsQuery.error]);

  const appointments = useMemo(
    () => (listQuery.data?.items ?? []).map(mapAdminAppointmentListItem),
    [listQuery.data],
  );

  const stats = useMemo(
    () => mapAdminAppointmentStats(statsQuery.data),
    [statsQuery.data],
  );

  const statusCounts = useMemo(() => buildStatusCounts(appointments), [appointments]);

  const filtered = useMemo(
    () => [...appointments].sort((a, b) => new Date(b.startAt) - new Date(a.startAt)),
    [appointments],
  );

  function handleView(appt) {
    if (busy) return;
    router.push(routes.admin.appointmentsDetail(appt.id));
  }

  const handlers = {
    onView: handleView,
    onMonitor: (appt) => !busy && setMonitorFor(appt),
    onHistory: (appt) => !busy && setHistoryFor(appt),
    onServiceUpdated: (appt) => !busy && setServiceFor(appt),
  };

  if (listQuery.isPending && appointments.length === 0) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 pb-4">
        <div className="bg-surface-container h-24 animate-pulse rounded-xl" />
        <div className="bg-surface-container h-64 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (listQuery.isError && appointments.length === 0) {
    return (
      <div className="text-on-surface mx-auto max-w-7xl py-16 text-center">
        <p className="font-medium">Could not load appointments.</p>
        <button
          type="button"
          onClick={() => listQuery.refetch()}
          disabled={busy}
          className="text-primary mt-3 text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-4">
      <header className="space-y-2">
        <p className="font-label-caps text-primary">Admin · Operations</p>
        <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
          Appointments monitoring
        </h1>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
          Oversee bookings across all shops and barbers. Filter by status, date, city, or barber —
          then inspect details, live activity, and service changes without modifying records.
        </p>
      </header>

      <AppointmentStats stats={stats} />

      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        <div className="border-outline-variant flex flex-col gap-4 border-b px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <span className="bg-primary/15 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <CalendarCheck className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-on-surface font-serif text-lg font-bold">All bookings</h2>
              <p className="text-on-surface-variant text-sm">
                {filtered.length} of {listQuery.data?.meta?.total ?? filtered.length} shown
              </p>
            </div>
          </div>
        </div>

        <AppointmentFilters
          status={status}
          onStatusChange={setStatus}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          city={city}
          onCityChange={setCity}
          barberId={barberId}
          onBarberChange={setBarberId}
          query={query}
          onQueryChange={setQuery}
          counts={statusCounts}
          disabled={busy}
        />

        {filtered.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <p className="text-on-surface font-serif text-base font-bold">
              No bookings match your filters
            </p>
            <p className="text-on-surface-variant mt-1 text-sm">
              Try a different status, date range, city, or barber.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead>
                  <tr className="border-outline-variant text-on-surface-variant border-b">
                    <th className="font-label-caps px-4 py-3">Booking</th>
                    <th className="font-label-caps px-4 py-3">Customer</th>
                    <th className="font-label-caps px-4 py-3">Barber</th>
                    <th className="font-label-caps px-4 py-3">City</th>
                    <th className="font-label-caps px-4 py-3">Service</th>
                    <th className="font-label-caps px-4 py-3">Scheduled</th>
                    <th className="font-label-caps px-4 py-3">Status</th>
                    <th className="font-label-caps px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((appt) => (
                    <AppointmentTableRow key={appt.id} appt={appt} {...handlers} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-4 lg:hidden">
              {filtered.map((appt) => (
                <AppointmentCard key={appt.id} appt={appt} {...handlers} />
              ))}
            </div>
          </>
        )}
      </section>

      <AppointmentDetailDrawer appt={detailFor} onClose={() => setDetailFor(null)} />
      <MonitorUpdatesModal appt={monitorFor} onClose={() => setMonitorFor(null)} />
      <ModificationHistoryModal appt={historyFor} onClose={() => setHistoryFor(null)} />
      <ServiceUpdatedModal appt={serviceFor} onClose={() => setServiceFor(null)} />
    </div>
  );
}
