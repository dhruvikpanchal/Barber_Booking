"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, Search } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import AppointmentStats from "./components/Appointments/AppointmentStats";
import {
  AppointmentCard,
  AppointmentTableRow,
} from "./components/Appointments/AppointmentRow";
import RescheduleModal from "./components/Appointments/RescheduleModal";
import AppointmentDetailDrawer from "./components/Appointments/AppointmentDetailDrawer";
import ServiceChangeRequestsSection from "./components/Appointments/ServiceChangeRequestsSection";
import { INITIAL_APPOINTMENTS } from "../../data/barber/appointmentsData";
import { APPOINTMENT_TABS } from "@/constants/barber/barber.js";

function isSameDay(iso, ref) {
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear()
    && d.getMonth() === ref.getMonth()
    && d.getDate() === ref.getDate()
  );
}

const STATUS_RANK = [
  "pending",
  "confirmed",
  "rescheduled",
  "in-service",
  "completed",
  "cancelled",
  "no-show",
];

export default function Appointments() {
  const router = useRouter();
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [tab, setTab] = useState("upcoming");
  const [query, setQuery] = useState("");
  const [rescheduleFor, setRescheduleFor] = useState(null);
  const [detailFor, setDetailFor] = useState(null);

  const stats = useMemo(() => {
    const today = new Date();
    return {
      pending: appointments.filter((a) => a.status === "pending").length,
      confirmed: appointments.filter((a) => a.status === "confirmed").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      today: appointments.filter((a) => isSameDay(a.startAt, today)).length,
    };
  }, [appointments]);

  const filtered = useMemo(() => {
    const now = Date.now();
    let list = appointments;
    if (tab === "upcoming") {
      list = list.filter(
        (a) =>
          new Date(a.startAt).getTime() >= now - 60 * 60 * 1000
          && (a.status === "pending"
            || a.status === "confirmed"
            || a.status === "rescheduled"),
      );
    } else if (tab !== "all") {
      list = list.filter((a) => a.status === tab);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.customer.name.toLowerCase().includes(q)
          || a.service.toLowerCase().includes(q)
          || a.customer.phone.toLowerCase().includes(q),
      );
    }
    const rank = (s) => {
      const i = STATUS_RANK.indexOf(s);
      return i === -1 ? STATUS_RANK.length : i;
    };
    return [...list].sort((a, b) => {
      if (tab === "upcoming") {
        const r = rank(a.status) - rank(b.status);
        if (r !== 0) return r;
      }
      return new Date(a.startAt) - new Date(b.startAt);
    });
  }, [appointments, tab, query]);

  function updateStatus(id, status) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );
    setDetailFor((cur) => (cur && cur.id === id ? { ...cur, status } : cur));
  }
  const accept = (id) => updateStatus(id, "confirmed");
  const reject = (id) => updateStatus(id, "cancelled");
  const complete = (id) => updateStatus(id, "completed");
  const noShow = (id) => updateStatus(id, "no-show");

  function applyReschedule(id, isoStart) {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, startAt: isoStart, status: "rescheduled" } : a,
      ),
    );
    setDetailFor((cur) =>
      cur && cur.id === id
        ? { ...cur, startAt: isoStart, status: "rescheduled" }
        : cur,
    );
    setRescheduleFor(null);
  }

  const handlers = {
    onAccept: accept,
    onReject: reject,
    onComplete: complete,
    onReschedule: (appt) => setRescheduleFor(appt),
    onView: (appt) =>
      router.push(routes.barber.appointmentsDetail(appt.id)),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-4">
      <header className="space-y-2">
        <p className="font-label-caps text-primary">Barber · Appointments</p>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
          Appointments
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-on-surface-variant">
          Review booking requests, confirm or reject, reschedule on the fly, and
          mark sessions complete.
        </p>
      </header>

      <AppointmentStats stats={stats} />

      <ServiceChangeRequestsSection />

      <section className="rounded-xl border border-outline-variant bg-surface-container-low">
        <div className="flex flex-col gap-4 border-b border-outline-variant px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <CalendarCheck className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-serif text-lg font-bold text-on-surface">
                Booking inbox
              </h2>
              <p className="text-sm text-on-surface-variant">
                {stats.pending} pending · {stats.confirmed} confirmed
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative block">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
                aria-hidden
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, service…"
                className="h-10 w-full rounded-md border border-outline-variant bg-surface-container py-2 pr-3 pl-9 text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none md:w-64"
              />
            </label>
          </div>
        </div>

        <div className="scrollbar-thin flex gap-1 overflow-x-auto border-b border-outline-variant px-4 py-2 md:px-6">
          {APPOINTMENT_TABS.map((t) => {
            const active = tab === t.key;
            const count =
              t.key === "upcoming"
                ? appointments.filter(
                  (a) =>
                    (a.status === "pending"
                      || a.status === "confirmed"
                      || a.status === "rescheduled")
                    && new Date(a.startAt).getTime() >= Date.now() - 3600_000,
                ).length
                : t.key === "all"
                  ? appointments.length
                  : appointments.filter((a) => a.status === t.key).length;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${active
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                  }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-1.5 text-[10px] font-bold ${active
                      ? "bg-on-primary/20 text-on-primary"
                      : "bg-surface-container text-on-surface-variant"
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <p className="font-serif text-base font-bold text-on-surface">
              No appointments here
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Try a different tab or clear your search.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
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
                  <tr className="border-b border-outline-variant/60 text-on-surface-variant">
                    <th className="px-4 py-3 font-label-caps">Customer</th>
                    <th className="px-4 py-3 font-label-caps">Service</th>
                    <th className="px-4 py-3 font-label-caps">When</th>
                    <th className="px-4 py-3 font-label-caps">Status</th>
                    <th className="px-4 py-3 font-label-caps">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((appt) => (
                    <AppointmentTableRow
                      key={appt.id}
                      appt={appt}
                      {...handlers}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
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
        onComplete={complete}
        onNoShow={noShow}
      />
    </div>
  );
}
