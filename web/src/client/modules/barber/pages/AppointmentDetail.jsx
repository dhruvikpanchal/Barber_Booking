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
import { routes } from "@/client/config/routes/routes.js";
import {
  buildBarberTimeline,
  getServiceChangeAppointmentId,
  normalizeBarberAppointment,
} from "@/client/modules/barber/data/appointmentsData.js";
import { formatDateLabel, formatTimeLabel } from "@/client/lib/format/formatDateTime.js";
import { useMergedBarberAppointment } from "@/client/lib/storage/serviceChangeStore.js";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { STATUSES } from "@/modules/barber/constants/status.js";
import ServiceChangeRequestsSection from "@/client/modules/barber/components/Appointments/ServiceChangeRequestsSection.jsx";
import AppointmentProgressTracker from "@/client/modules/customer/components/MyAppointments/AppointmentProgressTracker.jsx";

function InfoRow({ Icon, label, value }) {
  if (value == null || value === "") return null;
  return (
    <div className="border-outline-variant/60 flex items-start gap-3 border-b py-3 last:border-b-0">
      <span className="bg-surface-container text-on-surface-variant mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-label-caps text-on-surface-variant">{label}</p>
        <p className="text-on-surface text-sm">{value}</p>
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
    appt.status === "pending" ||
    appt.status === "confirmed" ||
    appt.status === "in-service" ||
    appt.status === "rescheduled";

  return (
    <div className="text-on-surface mx-auto w-full max-w-6xl min-w-0 space-y-6 pb-28 md:space-y-8 md:pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Link
            href={routes.barber.appointments}
            className="text-on-surface-variant hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to appointments
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-primary/15 text-primary flex h-14 w-14 items-center justify-center rounded-xl font-serif text-lg font-bold">
              {customerInitials(appt.customer.name)}
            </span>
            <div>
              <p className="font-label-caps text-primary">Barber · Appointment</p>
              <h1 className="font-serif text-2xl font-bold tracking-tight md:text-3xl">
                {appt.customer.name}
              </h1>
              <p className="text-on-surface-variant text-sm">
                #{appt.id}
                {appt.bookingId ? ` · Booking ${appt.bookingId}` : ""}
              </p>
            </div>
            <StatusBadge status={appt.status} config={STATUSES} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {phoneHref ? (
            <a
              href={`tel:${phoneHref}`}
              className="border-outline-variant bg-surface-container-low hover:bg-surface-container inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Call
            </a>
          ) : null}
          {appt.customer.email ? (
            <a
              href={`mailto:${appt.customer.email}`}
              className="border-outline-variant bg-surface-container-low hover:bg-surface-container inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors"
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
          className="border-status-pending/40 bg-status-pending/10 text-on-surface rounded-xl border px-4 py-3 text-sm sm:px-5"
        >
          <span className="text-status-pending font-semibold">Service change pending</span>
          <span className="text-on-surface-variant">
            {" "}
            — review the request below and accept or reject before the visit.
          </span>
        </div>
      ) : null}

      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <section className="border-outline-variant bg-surface-container-low rounded-xl border">
            <header className="border-outline-variant border-b px-4 py-3.5 sm:px-5">
              <h2 className="font-serif text-base font-bold sm:text-lg">Appointment details</h2>
            </header>
            <div className="grid gap-0 sm:grid-cols-2">
              <div className="border-outline-variant border-b px-4 sm:border-r sm:border-b-0 sm:px-5">
                <InfoRow Icon={CalendarDays} label="Date" value={date} />
                <InfoRow Icon={Clock} label="Time" value={time} />
                <InfoRow Icon={Clock} label="Duration" value={`${appt.duration} minutes`} />
                <InfoRow Icon={DollarSign} label="Estimated total" value={`$${appt.price}`} />
              </div>
              <div className="px-4 py-1 sm:px-5">
                <p className="font-label-caps text-on-surface-variant py-3">Services</p>
                <ul className="space-y-2 pb-3">
                  {appt.services.map((s) => (
                    <li key={s.name} className="text-on-surface flex items-start gap-2 text-sm">
                      <Scissors className="text-primary/70 mt-0.5 h-4 w-4 shrink-0" aria-hidden />
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
                  <div className="border-outline-variant/60 border-t">
                    <InfoRow Icon={StickyNote} label="Customer notes" value={appt.notes} />
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="border-outline-variant bg-surface-container-low rounded-xl border">
            <header className="border-outline-variant border-b px-4 py-3.5 sm:px-5">
              <h2 className="font-serif text-base font-bold sm:text-lg">Customer</h2>
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
          <section className="border-outline-variant bg-surface-container-low rounded-xl border p-4 sm:p-5">
            <h2 className="font-serif text-base font-bold">Actions</h2>
            <p className="text-on-surface-variant mt-1 text-xs">
              Update status as the visit progresses.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {appt.status === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={acceptBooking}
                    className="bg-primary text-on-primary inline-flex h-11 items-center justify-center gap-2 rounded-md text-sm font-bold hover:opacity-90"
                  >
                    <Check className="h-4 w-4" aria-hidden />
                    Accept booking
                  </button>
                  <button
                    type="button"
                    onClick={rejectBooking}
                    className="border-outline-variant text-on-surface-variant hover:border-status-cancelled/50 hover:text-status-cancelled inline-flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-semibold"
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
                    className="bg-primary text-on-primary inline-flex h-11 items-center justify-center gap-2 rounded-md text-sm font-bold hover:opacity-90"
                  >
                    <UserCheck className="h-4 w-4" aria-hidden />
                    Confirm arrival
                  </button>
                  <button
                    type="button"
                    onClick={markCompleted}
                    className="bg-status-confirmed text-background inline-flex h-11 items-center justify-center gap-2 rounded-md text-sm font-semibold hover:opacity-90"
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                    Mark completed
                  </button>
                  <button
                    type="button"
                    onClick={markNoShow}
                    className="border-outline-variant text-on-surface-variant hover:text-status-cancelled inline-flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-semibold"
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
                  className="bg-status-confirmed text-background inline-flex h-11 items-center justify-center gap-2 rounded-md text-sm font-semibold hover:opacity-90"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Mark completed
                </button>
              )}
              {!canAct && (
                <p className="border-outline-variant bg-surface-container text-on-surface-variant rounded-lg border px-3 py-3 text-sm">
                  No status actions for{" "}
                  <span className="text-on-surface font-medium">{appt.status}</span> appointments.
                </p>
              )}
            </div>
          </section>

          <section className="border-outline-variant bg-surface-container-low rounded-xl border p-4 sm:p-5">
            <h2 className="font-label-caps text-on-surface-variant">Contact customer</h2>
            <div className="mt-3 flex flex-col gap-2">
              {phoneHref ? (
                <a
                  href={`tel:${phoneHref}`}
                  className="border-outline-variant hover:bg-surface-container inline-flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-semibold"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {appt.customer.phone}
                </a>
              ) : null}
              {appt.customer.email ? (
                <a
                  href={`mailto:${appt.customer.email}`}
                  className="border-outline-variant hover:bg-surface-container inline-flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-semibold"
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
          className="border-outline-variant bg-surface-container-highest text-on-surface fixed bottom-24 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg md:bottom-8"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
