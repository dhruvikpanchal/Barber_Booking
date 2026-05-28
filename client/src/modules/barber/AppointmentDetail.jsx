"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  Mail,
  Phone,
  Scissors,
  StickyNote,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import {
  buildBarberTimeline,
  getServiceChangeAppointmentId,
  normalizeBarberAppointment,
} from "@/data/barber/appointmentsData.js";
import {
  formatDateLabel,
  formatTimeLabel,
} from "@/lib/format/formatDateTime.js";
import { useMergedBarberAppointment } from "@/lib/storage/serviceChangeStore.js";
import StatusBadge from "./components/Appointments/StatusBadge.jsx";
import ServiceChangeRequestsSection from "./components/Appointments/ServiceChangeRequestsSection.jsx";
import AppointmentProgressTracker from "@/modules/customer/components/MyAppointments/AppointmentProgressTracker.jsx";

function InfoRow({ Icon, label, value }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex items-start gap-3 border-b border-outline-variant/60 py-3 last:border-b-0">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-container text-on-surface-variant">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-label-caps text-on-surface-variant">{label}</p>
        <p className="text-sm text-on-surface">{value}</p>
      </div>
    </div>
  );
}

function customerInitials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function mapTimelineForTracker(timeline = []) {
  const labelMap = {
    created: "Booking created",
    accepted: "Confirmed",
    arrived: "Customer arrived",
    inService: "In service",
    completed: "Completed",
  };
  return timeline.map((step) => ({
    ...step,
    label: labelMap[step.key] ?? step.label,
  }));
}

/**
 * @param {{ appt: ReturnType<typeof normalizeBarberAppointment> }} props
 */
export default function AppointmentDetail({ appt: initialAppt }) {
  const base = normalizeBarberAppointment(initialAppt);
  const merged = useMergedBarberAppointment(base);
  const [patch, setPatch] = useState({});
  const appt = { ...merged, ...patch };
  const [toast, setToast] = useState(null);

  const serviceChangeId = getServiceChangeAppointmentId(appt);
  const hasPendingChange = Boolean(appt.pendingChangeRequest);
  const date = formatDateLabel(appt.startAt, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = formatTimeLabel(appt.startAt);
  const progressSteps = mapTimelineForTracker(appt.timeline);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const applyPatch = useCallback(
    (updates) => {
      setPatch((prev) => {
        const next = { ...prev, ...updates };
        const status = next.status ?? base.status;
        return {
          ...next,
          timeline: buildBarberTimeline({
            bookedAt: base.bookedAt,
            acceptedAt: next.acceptedAt ?? base.acceptedAt ?? null,
            arrivedAt: next.arrivedAt ?? base.arrivedAt ?? null,
            inServiceAt: next.inServiceAt ?? base.inServiceAt ?? null,
            completedAt: next.completedAt ?? base.completedAt ?? null,
            status,
          }),
        };
      });
    },
    [base],
  );

  const acceptBooking = () => {
    const now = new Date().toISOString();
    applyPatch({ status: "confirmed", acceptedAt: now });
    showToast("Booking confirmed.");
  };

  const rejectBooking = () => {
    applyPatch({ status: "cancelled" });
    showToast("Booking rejected.");
  };

  const confirmArrival = () => {
    const now = new Date().toISOString();
    applyPatch({
      status: "in-service",
      arrivedAt: now,
      inServiceAt: now,
    });
    showToast("Customer marked as arrived.");
  };

  const markCompleted = () => {
    const now = new Date().toISOString();
    applyPatch({
      status: "completed",
      completedAt: now,
    });
    showToast("Appointment marked completed.");
  };

  const markNoShow = () => {
    applyPatch({ status: "no-show" });
    showToast("Marked as no-show.");
  };

  const phoneHref = appt.customer.phone?.replace(/[^\d+]/g, "");
  const canAct =
    appt.status === "pending"
    || appt.status === "confirmed"
    || appt.status === "in-service"
    || appt.status === "rescheduled";

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6 pb-28 text-on-surface md:space-y-8 md:pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Link
            href={routes.barber.appointments}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to appointments
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 font-serif text-lg font-bold text-primary">
              {customerInitials(appt.customer.name)}
            </span>
            <div>
              <p className="font-label-caps text-primary">Barber · Appointment</p>
              <h1 className="font-serif text-2xl font-bold tracking-tight md:text-3xl">
                {appt.customer.name}
              </h1>
              <p className="text-sm text-on-surface-variant">
                #{appt.id}
                {appt.bookingId ? ` · Booking ${appt.bookingId}` : ""}
              </p>
            </div>
            <StatusBadge status={appt.status} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {phoneHref ? (
            <a
              href={`tel:${phoneHref}`}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-outline-variant bg-surface-container-low px-4 text-sm font-medium transition-colors hover:bg-surface-container"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Call
            </a>
          ) : null}
          {appt.customer.email ? (
            <a
              href={`mailto:${appt.customer.email}`}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-outline-variant bg-surface-container-low px-4 text-sm font-medium transition-colors hover:bg-surface-container"
            >
              <Mail className="h-4 w-4" aria-hidden />
              Email
            </a>
          ) : null}
        </div>
      </div>

      {hasPendingChange ? (
        <div
          role="status"
          className="rounded-xl border border-status-pending/40 bg-status-pending/10 px-4 py-3 text-sm text-on-surface sm:px-5"
        >
          <span className="font-semibold text-status-pending">
            Service change pending
          </span>
          <span className="text-on-surface-variant">
            {" "}
            — review the request below and accept or reject before the visit.
          </span>
        </div>
      ) : null}

      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-outline-variant bg-surface-container-low">
            <header className="border-b border-outline-variant px-4 py-3.5 sm:px-5">
              <h2 className="font-serif text-base font-bold sm:text-lg">
                Appointment details
              </h2>
            </header>
            <div className="grid gap-0 sm:grid-cols-2">
              <div className="border-b border-outline-variant px-4 sm:border-b-0 sm:border-r sm:px-5">
                <InfoRow
                  Icon={CalendarDays}
                  label="Date"
                  value={date}
                />
                <InfoRow Icon={Clock} label="Time" value={time} />
                <InfoRow
                  Icon={Clock}
                  label="Duration"
                  value={`${appt.duration} minutes`}
                />
                <InfoRow
                  Icon={DollarSign}
                  label="Estimated total"
                  value={`$${appt.price}`}
                />
              </div>
              <div className="px-4 py-1 sm:px-5">
                <p className="py-3 font-label-caps text-on-surface-variant">
                  Services
                </p>
                <ul className="space-y-2 pb-3">
                  {appt.services.map((s) => (
                    <li
                      key={s.name}
                      className="flex items-start gap-2 text-sm text-on-surface"
                    >
                      <Scissors
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary/70"
                        aria-hidden
                      />
                      <span>
                        {s.name}
                        <span className="text-on-surface-variant">
                          {" "}
                          · {s.duration}m · ${s.price}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
                {appt.notes ? (
                  <div className="border-t border-outline-variant/60">
                    <InfoRow
                      Icon={StickyNote}
                      label="Customer notes"
                      value={appt.notes}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant bg-surface-container-low">
            <header className="border-b border-outline-variant px-4 py-3.5 sm:px-5">
              <h2 className="font-serif text-base font-bold sm:text-lg">
                Customer
              </h2>
            </header>
            <div className="px-4 sm:px-5">
              <InfoRow Icon={Phone} label="Phone" value={appt.customer.phone} />
              <InfoRow Icon={Mail} label="Email" value={appt.customer.email} />
            </div>
          </section>

          <AppointmentProgressTracker steps={progressSteps} />

          <ServiceChangeRequestsSection
            appointmentId={serviceChangeId}
            showHistory
            compact={false}
          />
        </div>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
            <h2 className="font-serif text-base font-bold">Actions</h2>
            <p className="mt-1 text-xs text-on-surface-variant">
              Update status as the visit progresses.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {appt.status === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={acceptBooking}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary text-sm font-bold text-on-primary hover:opacity-90"
                  >
                    <Check className="h-4 w-4" aria-hidden />
                    Accept booking
                  </button>
                  <button
                    type="button"
                    onClick={rejectBooking}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-outline-variant text-sm font-semibold text-on-surface-variant hover:border-status-cancelled/50 hover:text-status-cancelled"
                  >
                    <X className="h-4 w-4" aria-hidden />
                    Reject booking
                  </button>
                </>
              )}
              {appt.status === "confirmed" && (
                <>
                  <button
                    type="button"
                    onClick={confirmArrival}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary text-sm font-bold text-on-primary hover:opacity-90"
                  >
                    <UserCheck className="h-4 w-4" aria-hidden />
                    Confirm arrival
                  </button>
                  <button
                    type="button"
                    onClick={markCompleted}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-status-confirmed text-sm font-semibold text-background hover:opacity-90"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    Mark completed
                  </button>
                  <button
                    type="button"
                    onClick={markNoShow}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-outline-variant text-sm font-semibold text-on-surface-variant hover:text-status-cancelled"
                  >
                    <XCircle className="h-4 w-4" aria-hidden />
                    No-show
                  </button>
                </>
              )}
              {appt.status === "in-service" && (
                <button
                  type="button"
                  onClick={markCompleted}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-status-confirmed text-sm font-semibold text-background hover:opacity-90"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Mark completed
                </button>
              )}
              {!canAct && (
                <p className="rounded-lg border border-outline-variant bg-surface-container px-3 py-3 text-sm text-on-surface-variant">
                  No status actions for{" "}
                  <span className="font-medium text-on-surface">
                    {appt.status}
                  </span>{" "}
                  appointments.
                </p>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
            <h2 className="font-label-caps text-on-surface-variant">
              Contact customer
            </h2>
            <div className="mt-3 flex flex-col gap-2">
              {phoneHref ? (
                <a
                  href={`tel:${phoneHref}`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-outline-variant text-sm font-semibold hover:bg-surface-container"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {appt.customer.phone}
                </a>
              ) : null}
              {appt.customer.email ? (
                <a
                  href={`mailto:${appt.customer.email}`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-outline-variant text-sm font-semibold hover:bg-surface-container"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  Send email
                </a>
              ) : null}
            </div>
          </section>
        </aside>
      </div>

      {toast ? (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-lg border border-outline-variant bg-surface-container-highest px-4 py-3 text-sm font-medium text-on-surface shadow-lg md:bottom-8"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
