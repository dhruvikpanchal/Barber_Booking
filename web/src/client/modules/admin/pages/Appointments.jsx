"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import { CalendarCheck, ChevronLeft, ChevronRight, X } from "lucide-react";
import AppointmentStats from "@/client/modules/admin/components/Appointments/AppointmentStats.jsx";
import AppointmentFilters from "@/client/modules/admin/components/Appointments/AppointmentFilters.jsx";
import {
  AppointmentCard,
  AppointmentTableRow,
} from "@/client/modules/admin/components/Appointments/AppointmentTableRow.jsx";
import MonitorUpdatesModal from "@/client/modules/admin/components/Appointments/MonitorUpdatesModal.jsx";
import ModificationHistoryModal from "@/client/modules/admin/components/Appointments/ModificationHistoryModal.jsx";
import ServiceUpdatedModal from "@/client/modules/admin/components/Appointments/ServiceUpdatedModal.jsx";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import {
  mapAdminAppointmentListItem,
  mapAdminAppointmentStats,
} from "@/client/modules/admin/helpers/adminMappers.js";
import { buildStatusCounts } from "@/client/modules/admin/components/Appointments/helpers.jsx";
import { APPOINTMENTS_PAGE_SIZE } from "@/client/modules/admin/constants/adminConstants.js";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

export default function Appointments() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlBarberId = searchParams.get("barberId");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [city, setCity] = useState("all");
  const [barberId, setBarberId] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const activeBarberId = urlBarberId ?? barberId;
  const [monitorFor, setMonitorFor] = useState(null);
  const [historyFor, setHistoryFor] = useState(null);
  const [serviceFor, setServiceFor] = useState(null);

  const listParams = useMemo(
    () => ({
      status: status === "all" ? undefined : status,
      dateRange: dateRange === "all" ? undefined : dateRange,
      city: city === "all" ? undefined : city,
      barberId: activeBarberId === "all" ? undefined : activeBarberId,
      q: query.trim() || undefined,
      page,
      limit: APPOINTMENTS_PAGE_SIZE,
    }),
    [status, dateRange, city, activeBarberId, query, page],
  );

  const listQuery = adminHook.Appointments.useListAppointments(listParams);
  const barbersQuery = adminHook.Barbers.useListBarbers({ page: 1, limit: 200, sort: "name_asc" });

  const busy = listQuery.isPending;

  useEffect(() => {
    if (listQuery.isError) {
      toast.error(listQuery.error?.message || "Could not load appointments.");
    }
  }, [listQuery.isError, listQuery.error]);

  const appointments = useMemo(
    () => (listQuery.data?.items ?? []).map(mapAdminAppointmentListItem),
    [listQuery.data],
  );

  const stats = useMemo(
    () => mapAdminAppointmentStats(listQuery.data?.meta?.stats),
    [listQuery.data?.meta?.stats],
  );

  const statusCounts = useMemo(() => buildStatusCounts(appointments), [appointments]);

  const barberOptions = useMemo(
    () =>
      (barbersQuery.data?.items ?? []).map((barber) => ({
        id: barber.id,
        name: barber.name,
        shop: typeof barber.shop === "string" ? barber.shop : (barber.shop?.name ?? "Independent"),
      })),
    [barbersQuery.data?.items],
  );

  const filtered = useMemo(
    () => [...appointments].sort((a, b) => new Date(b.startAt) - new Date(a.startAt)),
    [appointments],
  );

  const totalPages = listQuery.data?.meta?.totalPages ?? 1;
  const totalCount = listQuery.data?.meta?.total ?? filtered.length;

  const filteredBarberName = useMemo(() => {
    if (!urlBarberId || activeBarberId === "all") return null;
    return barberOptions.find((barber) => barber.id === activeBarberId)?.name ?? null;
  }, [urlBarberId, activeBarberId, barberOptions]);

  function clearBarberFilter() {
    setBarberId("all");
    router.replace(routes.admin.appointments);
    resetPage();
  }

  function resetPage() {
    setPage(1);
  }

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
    return <PageLoader label="Loading appointments..." className="mx-auto max-w-7xl" />;
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

      {filteredBarberName ? (
        <div className="border-primary/25 bg-primary/8 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3">
          <p className="text-on-surface text-sm">
            Showing appointments for{" "}
            <span className="font-semibold">{filteredBarberName}</span>
          </p>
          <button
            type="button"
            onClick={clearBarberFilter}
            disabled={busy}
            className="text-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Clear barber filter
          </button>
        </div>
      ) : null}

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
                {filtered.length} of {totalCount} shown
              </p>
            </div>
          </div>
        </div>

        <AppointmentFilters
          status={status}
          onStatusChange={(value) => {
            setStatus(value);
            resetPage();
          }}
          dateRange={dateRange}
          onDateRangeChange={(value) => {
            setDateRange(value);
            resetPage();
          }}
          city={city}
          onCityChange={(value) => {
            setCity(value);
            resetPage();
          }}
          barberId={activeBarberId}
          onBarberChange={(value) => {
            setBarberId(value);
            if (urlBarberId) {
              router.replace(routes.admin.appointments);
            }
            resetPage();
          }}
          query={query}
          onQueryChange={(value) => {
            setQuery(value);
            resetPage();
          }}
          counts={statusCounts}
          barbers={barberOptions}
          barbersLoading={barbersQuery.isPending}
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

        {totalPages > 1 && (
          <div className="border-outline-variant flex items-center justify-between border-t px-5 py-3 md:px-6">
            <p className="text-on-surface-variant text-xs">
              Showing {(page - 1) * APPOINTMENTS_PAGE_SIZE + 1}–
              {Math.min(page * APPOINTMENTS_PAGE_SIZE, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1 || busy}
                onClick={() => setPage((p) => p - 1)}
                className="border-outline-variant text-on-surface-variant hover:bg-surface-container flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  disabled={busy}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${n === page ? "bg-primary text-on-primary" : "border-outline-variant text-on-surface-variant hover:bg-surface-container border"}`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={page === totalPages || busy}
                onClick={() => setPage((p) => p + 1)}
                className="border-outline-variant text-on-surface-variant hover:bg-surface-container flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </section>

      <MonitorUpdatesModal appt={monitorFor} onClose={() => setMonitorFor(null)} />
      <ModificationHistoryModal appt={historyFor} onClose={() => setHistoryFor(null)} />
      <ServiceUpdatedModal appt={serviceFor} onClose={() => setServiceFor(null)} />
    </div>
  );
}
