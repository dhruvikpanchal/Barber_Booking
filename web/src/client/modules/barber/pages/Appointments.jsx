"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, Search } from "lucide-react";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import AppointmentStats from "@/client/modules/barber/components/Appointments/AppointmentStats";
import {
  AppointmentCard,
  AppointmentTableRow,
} from "@/client/modules/barber/components/Appointments/AppointmentRow";
import RescheduleModal from "@/client/modules/barber/components/Appointments/RescheduleModal";
import AppointmentDetailDrawer from "@/client/modules/barber/components/Appointments/AppointmentDetailDrawer";
import ServiceChangeRequestsSection from "@/client/modules/barber/components/Appointments/ServiceChangeRequestsSection";
import { APPOINTMENT_TABS } from "@/client/modules/barber/constants/barberConstants.js";
import { STATUS_RANK } from "@/client/modules/barber/constants/appointmentConstants.js";
import { barberHook, useBarberInvalidation } from "@/client/modules/barber/hooks/barberQuery.jsx";
import { mapAppointmentListItem } from "@/client/modules/barber/helpers/barberMappers.js";

function toReschedulePayload(isoStart) {
  const d = new Date(isoStart);
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    reason: "",
  };
}

export default function Appointments() {
  const router = useRouter();
  const invalidate = useBarberInvalidation();
  const [tab, setTab] = useState("upcoming");
  const [query, setQuery] = useState("");
  const [rescheduleFor, setRescheduleFor] = useState(null);
  const [detailFor, setDetailFor] = useState(null);

  const listQuery = barberHook.Appointments.useListAppointments({
    tab,
    q: query.trim() || undefined,
    page: 1,
    limit: 100,
  });
  const statusMutation = barberHook.Appointments.useUpdateAppointmentStatus();
  const rescheduleMutation = barberHook.Appointments.useRescheduleAppointment();

  const busy = listQuery.isPending || statusMutation.isPending || rescheduleMutation.isPending;

  useEffect(() => {
    if (listQuery.isError) {
      toast.error(listQuery.error?.message || "Could not load appointments.");
    }
  }, [listQuery.isError, listQuery.error]);

  const appointments = useMemo(
    () => (listQuery.data?.appointments ?? []).map(mapAppointmentListItem),
    [listQuery.data],
  );

  const stats = listQuery.data?.stats ?? {
    pending: 0,
    confirmed: 0,
    completed: 0,
    today: 0,
  };

  const filtered = useMemo(() => {
    const rank = (s) => {
      const i = STATUS_RANK.indexOf(s);
      return i === -1 ? STATUS_RANK.length : i;
    };
    return [...appointments].sort((a, b) => {
      if (tab === "upcoming") {
        const r = rank(a.status) - rank(b.status);
        if (r !== 0) return r;
      }
      return new Date(a.startAt) - new Date(b.startAt);
    });
  }, [appointments, tab]);

  async function refetch() {
    await listQuery.refetch();
  }

  async function updateStatus(id, status) {
    if (busy) return;
    try {
      await toast.promise(
        statusMutation.mutateAsync({ id, status: status.toUpperCase().replace("-", "_") }),
        {
          loading: "Updating appointment…",
          success: "Appointment updated.",
          error: "Could not update appointment.",
        },
      );
      await refetch();
      await invalidate.workflow();
      setDetailFor((cur) => (cur && cur.id === id ? { ...cur, status } : cur));
    } catch {
      /* toast handles error */
    }
  }

  const accept = (id) => updateStatus(id, "confirmed");
  const reject = (id) => updateStatus(id, "cancelled");
  const noShow = (id) => updateStatus(id, "no-show");

  async function applyReschedule(id, isoStart) {
    if (busy) return;
    try {
      await toast.promise(
        rescheduleMutation.mutateAsync({ id, ...toReschedulePayload(isoStart) }),
        {
          loading: "Rescheduling…",
          success: "Appointment rescheduled.",
          error: "Could not reschedule appointment.",
        },
      );
      await refetch();
      setRescheduleFor(null);
    } catch {
      /* toast handles error */
    }
  }

  const handlers = {
    onAccept: accept,
    onReject: reject,
    onReschedule: (appt) => !busy && setRescheduleFor(appt),
    onView: (appt) => !busy && router.push(routes.barber.appointmentsDetail(appt.id)),
  };

  if (listQuery.isPending && appointments.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 pb-4">
        <div className="bg-surface-container h-24 animate-pulse rounded-xl" />
        <div className="bg-surface-container h-64 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (listQuery.isError && appointments.length === 0) {
    return (
      <div className="text-on-surface mx-auto max-w-6xl py-16 text-center">
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
    <div className="mx-auto max-w-6xl space-y-8 pb-4">
      <header className="space-y-2">
        <p className="font-label-caps text-primary">Barber · Appointments</p>
        <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
          Appointments
        </h1>
        <p className="text-on-surface-variant max-w-xl text-sm leading-relaxed">
          Manage online customer bookings. Accept requests here, then start and complete services
          from the Queue.
        </p>
      </header>

      <AppointmentStats stats={stats} />

      <ServiceChangeRequestsSection />

      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        <div className="border-outline-variant flex flex-col gap-4 border-b px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <span className="bg-primary/15 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <CalendarCheck className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-on-surface font-serif text-lg font-bold">Booking inbox</h2>
              <p className="text-on-surface-variant text-sm">
                {stats.pending} pending · {stats.confirmed} confirmed
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative block">
              <Search
                className="text-on-surface-variant pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                aria-hidden
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, service…"
                disabled={busy}
                className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary h-10 w-full rounded-md border py-2 pr-3 pl-9 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:w-64"
              />
            </label>
          </div>
        </div>

        <div className="scrollbar-thin border-outline-variant flex gap-1 overflow-x-auto border-b px-4 py-2 md:px-6">
          {APPOINTMENT_TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => !busy && setTab(t.key)}
                disabled={busy}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  active
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <p className="text-on-surface font-serif text-base font-bold">No appointments here</p>
            <p className="text-on-surface-variant mt-1 text-sm">
              Try a different tab or clear your search.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full table-fixed text-left text-sm">
                <colgroup>
                  <col style={{ width: "26%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "20%" }} />
                </colgroup>
                <thead>
                  <tr className="border-outline-variant/60 text-on-surface-variant border-b">
                    <th className="font-label-caps px-4 py-3">Customer</th>
                    <th className="font-label-caps px-4 py-3">Service</th>
                    <th className="font-label-caps px-4 py-3">When</th>
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
            <div className="space-y-2 p-3 md:hidden">
              {filtered.map((appt) => (
                <AppointmentCard key={appt.id} appt={appt} {...handlers} />
              ))}
            </div>
          </>
        )}
      </section>

      <RescheduleModal
        open={Boolean(rescheduleFor)}
        appt={rescheduleFor}
        onClose={() => setRescheduleFor(null)}
        onSubmit={applyReschedule}
      />
      <AppointmentDetailDrawer
        appt={detailFor}
        onClose={() => setDetailFor(null)}
        onAccept={accept}
        onReject={reject}
        onReschedule={(appt) => {
          setDetailFor(null);
          setRescheduleFor(appt);
        }}
        onNoShow={noShow}
      />
    </div>
  );
}
