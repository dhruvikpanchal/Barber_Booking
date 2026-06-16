"use client";

import { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  DollarSign,
  Mail,
  Phone,
  Scissors,
  StickyNote,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import {
  getServiceChangeAppointmentId,
  normalizeBarberAppointment,
} from "@/client/modules/barber/helpers/appointmentHelpers.js";
import { mapAppointmentListItem } from "@/client/modules/barber/helpers/barberMappers.js";
import { formatDateLabel, formatTimeLabel } from "@/client/lib/format/formatDateTime.js";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { STATUSES } from "@/client/modules/barber/constants/statusConstants.js";
import ServiceChangeRequestsSection from "@/client/modules/barber/components/Appointments/ServiceChangeRequestsSection.jsx";
import AppointmentProgressTracker from "@/client/modules/customer/components/MyAppointments/AppointmentProgressTracker.jsx";
import { customerInitials } from "@/client/lib/format/formatInitials.js";
import { barberHook, useBarberInvalidation } from "@/client/modules/barber/hooks/barberQuery.jsx";

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

function toApiStatus(status) {
  return status.toUpperCase().replace("-", "_");
}

export default function AppointmentDetail({ appt: initialAppt, appointmentId }) {
  const id = appointmentId ?? initialAppt?.id ?? "";

  const {
    data: apptFromQuery,
    isPending,
    isError,
    error,
    refetch,
  } = barberHook.Appointments.useGetAppointment(id);
  const statusMutation = barberHook.Appointments.useUpdateAppointmentStatus();
  const invalidate = useBarberInvalidation();

  const busy = isPending || statusMutation.isPending;

  const appt = useMemo(() => {
    const raw = apptFromQuery ?? initialAppt;
    if (!raw) return null;
    return normalizeBarberAppointment(mapAppointmentListItem(raw));
  }, [apptFromQuery, initialAppt]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load appointment.");
    }
  }, [isError, error]);

  const updateStatus = useCallback(
    async (status, successMessage) => {
      if (!id || busy) return;
      try {
        await toast.promise(statusMutation.mutateAsync({ id, status: toApiStatus(status) }), {
          loading: "Updating appointment…",
          success: successMessage,
          error: "Could not update appointment.",
        });
        await refetch();
        await invalidate.workflow();
      } catch {
        /* toast handles error */
      }
    },
    [id, busy, statusMutation, refetch, invalidate],
  );

  if (isPending && !appt) {
    return (
      <div className="text-on-surface mx-auto w-full max-w-6xl min-w-0 space-y-6 pb-28 md:pb-8">
        <div className="bg-surface-container h-32 animate-pulse rounded-xl" />
        <div className="bg-surface-container h-64 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!appt) {
    return (
      <div className="text-on-surface mx-auto max-w-6xl py-16 text-center">
        <p>{error?.message ?? "Appointment not found."}</p>
        <Link
          href={routes.barber.appointments}
          className="text-primary mt-3 inline-block text-sm font-semibold hover:underline"
        >
          Back to appointments
        </Link>
      </div>
    );
  }

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
                    onClick={() => updateStatus("confirmed", "Booking confirmed.")}
                    disabled={busy}
                    className="bg-primary text-on-primary inline-flex h-11 items-center justify-center gap-2 rounded-md text-sm font-bold hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" aria-hidden />
                    Accept booking
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus("cancelled", "Booking rejected.")}
                    disabled={busy}
                    className="border-outline-variant text-on-surface-variant hover:border-status-cancelled/50 hover:text-status-cancelled inline-flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X className="h-4 w-4" aria-hidden />
                    Reject booking
                  </button>
                </>
              )}
              {appt.status === "confirmed" && (
                <>
                  <p className="text-on-surface-variant rounded-lg border border-outline-variant bg-surface-container px-3 py-3 text-sm">
                    This booking is confirmed. Seat the customer and complete the service from the{" "}
                    <Link href={routes.barber.queue} className="text-primary font-semibold hover:underline">
                      Queue
                    </Link>{" "}
                    page.
                  </p>
                  <button
                    type="button"
                    onClick={() => updateStatus("no-show", "Marked as no-show.")}
                    disabled={busy}
                    className="border-outline-variant text-on-surface-variant hover:text-status-cancelled inline-flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" aria-hidden />
                    No-show
                  </button>
                </>
              )}
              {appt.status === "in-service" && (
                <p className="text-on-surface-variant rounded-lg border border-outline-variant bg-surface-container px-3 py-3 text-sm">
                  Service in progress. Complete this visit from the{" "}
                  <Link href={routes.barber.queue} className="text-primary font-semibold hover:underline">
                    Queue
                  </Link>{" "}
                  page.
                </p>
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
    </div>
  );
}
