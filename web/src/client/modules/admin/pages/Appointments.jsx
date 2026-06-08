"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { INITIAL_ADMIN_APPOINTMENTS } from "@/client/modules/admin/data/appointmentsData.js";
import {
  buildStatusCounts,
  matchesDateRange,
} from "@/client/modules/admin/components/Appointments/helpers.jsx";

export default function Appointments() {
  const router = useRouter();
  const [appointments] = useState(INITIAL_ADMIN_APPOINTMENTS);
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [city, setCity] = useState("all");
  const [barberId, setBarberId] = useState("all");
  const [query, setQuery] = useState("");
  const [detailFor, setDetailFor] = useState(null);
  const [monitorFor, setMonitorFor] = useState(null);
  const [historyFor, setHistoryFor] = useState(null);
  const [serviceFor, setServiceFor] = useState(null);

  const stats = useMemo(
    () => ({
      pending: appointments.filter((a) => a.status === "pending").length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      inService: appointments.filter((a) => a.status === "in-service").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
    }),
    [appointments],
  );

  const statusCounts = useMemo(() => buildStatusCounts(appointments), [appointments]);

  const filtered = useMemo(() => {
    let list = appointments;
    if (status !== "all") {
      list = list.filter((a) => a.status === status);
    }
    if (city !== "all") {
      list = list.filter((a) => a.city === city);
    }
    if (barberId !== "all") {
      list = list.filter((a) => a.barberId === barberId);
    }
    if (dateRange !== "all") {
      list = list.filter((a) => matchesDateRange(a.startAt, dateRange));
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.customer.name.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.service.toLowerCase().includes(q) ||
          a.barberName.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => new Date(b.startAt) - new Date(a.startAt));
  }, [appointments, status, city, barberId, dateRange, query]);

  function handleView(appt) {
    router.push(routes.admin.appointmentsDetail(appt.id));
  }

  const handlers = {
    onView: handleView,
    onMonitor: setMonitorFor,
    onHistory: setHistoryFor,
    onServiceUpdated: setServiceFor,
  };

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
                {filtered.length} of {appointments.length} shown
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
