"use client";

import { useEffect, useMemo } from "react";
import Link from "@/lib/AppLink";
import {
  Activity,
  ArrowLeft,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarDays,
  Clock,
  CreditCard,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  Scissors,
  StickyNote,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import { mapAdminAppointmentDetail } from "@/client/modules/admin/helpers/adminMappers.js";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { APPOINTMENT_STATUSES } from "@/client/modules/admin/constants/adminConstants.js";
import { formatWhen } from "@/client/modules/admin/components/Appointments/AppointmentTableRow.jsx";
import { formatMoney } from "@/client/lib/format/formatMoney.js";
import ModificationHistorySection from "@/client/modules/admin/components/Appointments/ModificationHistorySection.jsx";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";
import {
  fullDateTime,
  SectionCard,
  DetailRow,
  Breadcrumb,
  PaymentBadge,
  TIMELINE_ICONS,
  StatusHistoryTrack,
} from "../components/AppointmentDetail/Primitives.jsx";

/**
 * @param {{ id: string }} props
 */
export default function AppointmentDetail({ id }) {
  const { data, isPending, isError, error, refetch } = adminHook.Appointments.useAppointment(id);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load appointment.");
    }
  }, [isError, error]);

  const appt = useMemo(() => (data ? mapAdminAppointmentDetail(data) : null), [data]);

  if (isPending) {
    return <PageLoader label="Loading appointment..." className="mx-auto max-w-6xl" />;
  }

  if (isError || !appt) {
    return (
      <div className="text-on-surface mx-auto max-w-6xl py-16 text-center">
        <p className="font-medium">Could not load appointment.</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isPending}
            className="text-primary text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Try again
          </button>
          <Link
            href={routes.admin.appointments}
            className="border-outline-variant text-on-surface-variant hover:text-on-surface inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to appointments
          </Link>
        </div>
      </div>
    );
  }

  const { date, time } = formatWhen(appt.startAt);
  const booked = fullDateTime(appt.createdAt);

  const customerProfileHref = appt.customer.userId
    ? routes.admin.usersDetail(appt.customer.userId)
    : null;
  const barberProfileHref = appt.barber.adminBarberId
    ? routes.admin.barbersDetail(appt.barber.adminBarberId)
    : routes.admin.barbers;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <Breadcrumb appt={appt} />

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="font-label-caps text-primary text-[11px] tracking-widest uppercase">
            Appointment · {appt.id}
          </p>
          <h1 className="text-on-surface font-serif text-xl font-bold md:text-2xl">
            {appt.customer.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={appt.status} config={APPOINTMENT_STATUSES} />
            <PaymentBadge status={appt.paymentStatus} />
          </div>
          <p className="text-on-surface-variant text-sm">
            {date} at {time} · Booked {booked}
          </p>
        </div>

        <Link
          href={routes.admin.appointments}
          className="border-outline-variant bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface inline-flex shrink-0 items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to appointments
        </Link>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Appointment date",
            value: date,
            sub: time,
            icon: Calendar,
          },
          {
            label: "Total amount",
            value: formatMoney(appt.price),
            sub: `${appt.duration} min`,
            icon: IndianRupee,
          },
          {
            label: "Payment",
            value: appt.paymentStatus,
            sub: "No online checkout",
            icon: CreditCard,
          },
          {
            label: "Service",
            value: appt.service,
            sub: appt.shop,
            icon: Scissors,
          },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div
            key={label}
            className="border-outline-variant bg-surface-container rounded-xl border p-4"
          >
            <Icon className="text-primary h-4 w-4" aria-hidden />
            <p className="text-on-surface mt-3 font-serif text-lg font-bold">{value}</p>
            <p className="text-on-surface text-xs font-semibold">{label}</p>
            {sub && <p className="text-on-surface-variant mt-0.5 text-[11px]">{sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <SectionCard
            title="Appointment information"
            description="Booking reference, schedule, and notes."
          >
            <div className="grid gap-0 sm:grid-cols-2">
              <DetailRow label="Appointment ID" value={appt.id} icon={CalendarCheck} />
              <DetailRow label="Booking date" value={booked} icon={Calendar} />
              <DetailRow label="Appointment date" value={date} icon={CalendarDays} />
              <DetailRow label="Appointment time" value={time} icon={Clock} />
              <DetailRow label="Current status" value={null} icon={Activity} />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={appt.status} config={APPOINTMENT_STATUSES} />
              <PaymentBadge status={appt.paymentStatus} />
            </div>
            {appt.notes ? (
              <div className="border-outline-variant bg-surface-container mt-4 rounded-lg border p-4">
                <p className="font-label-caps text-on-surface-variant flex items-center gap-2">
                  <StickyNote className="h-3.5 w-3.5" aria-hidden />
                  Notes / special requests
                </p>
                <p className="text-on-surface mt-2 text-sm leading-relaxed">{appt.notes}</p>
              </div>
            ) : (
              <p className="text-on-surface-variant mt-4 text-sm">
                No special requests for this booking.
              </p>
            )}
          </SectionCard>

          <div className="grid gap-5 md:grid-cols-2">
            <SectionCard title="Customer details" description="Booked by" className="h-full">
              <div className="flex items-center gap-4">
                <div className="bg-primary/15 text-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-serif text-lg font-bold">
                  {appt.customer.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-on-surface font-semibold">{appt.customer.name}</p>
                  {appt.customer.userId && (
                    <p className="text-on-surface-variant text-xs">ID: {appt.customer.userId}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <DetailRow label="Email" value={appt.customer.email} icon={Mail} />
                <DetailRow label="Phone" value={appt.customer.phone} icon={Phone} />
              </div>
              {customerProfileHref && (
                <Link
                  href={customerProfileHref}
                  className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border py-2.5 text-xs font-semibold transition-colors"
                >
                  View customer profile
                </Link>
              )}
            </SectionCard>

            <SectionCard
              title="Barber details"
              description="Assigned professional"
              className="h-full"
            >
              <DetailRow label="Barber name" value={appt.barber.name} icon={User} />
              <DetailRow label="Shop" value={appt.barber.shop} icon={Building2} />
              <DetailRow
                label="Specialization"
                value={appt.barber.specialization}
                icon={Scissors}
              />
              <DetailRow label="Email" value={appt.barber.email} icon={Mail} />
              <DetailRow label="Phone" value={appt.barber.phone} icon={Phone} />
              <DetailRow label="City" value={appt.city} icon={MapPin} />
              <Link
                href={barberProfileHref}
                className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border py-2.5 text-xs font-semibold transition-colors"
              >
                View barber profile
              </Link>
            </SectionCard>
          </div>

          <SectionCard title="Service details" description="What was booked for this visit.">
            <DetailRow label="Service name" value={appt.serviceDetails.name} icon={Scissors} />
            <DetailRow label="Category" value={appt.serviceDetails.category} icon={Scissors} />
            <DetailRow
              label="Duration"
              value={`${appt.serviceDetails.duration} minutes`}
              icon={Clock}
            />
            <DetailRow
              label="Price"
              value={
                appt.originalService
                  ? `${formatMoney(appt.price)} (was ${formatMoney(appt.originalPrice ?? appt.price)})`
                  : formatMoney(appt.serviceDetails.price)
              }
              icon={IndianRupee}
            />
            {appt.originalService && (
              <DetailRow label="Original service" value={appt.originalService} icon={Scissors} />
            )}
            {appt.serviceDetails.description && (
              <div className="border-outline-variant/60 mt-4 border-t pt-4">
                <p className="font-label-caps text-on-surface-variant text-[11px]">Description</p>
                <p className="text-on-surface mt-2 text-sm leading-relaxed">
                  {appt.serviceDetails.description}
                </p>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Modification history"
            description="All changes to this booking with previous and updated values."
          >
            <ModificationHistorySection modifications={appt.modifications} />
          </SectionCard>

          <SectionCard
            title="Activity timeline"
            description="Chronological log of platform events."
          >
            {appt.timeline.length === 0 ? (
              <p className="text-on-surface-variant text-sm">No activity logged yet.</p>
            ) : (
              <ol className="border-outline-variant relative space-y-0 border-l pl-6">
                {appt.timeline.map((event, index) => {
                  const Icon = TIMELINE_ICONS[event.type] ?? Activity;
                  return (
                    <li key={event.id} className="relative pb-6 last:pb-0">
                      <span
                        className={`border-outline-variant bg-surface-container-low absolute -left-[1.65rem] flex h-7 w-7 items-center justify-center rounded-full border ${
                          index === 0 ? "text-primary" : "text-on-surface-variant"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      <p className="text-on-surface text-sm font-semibold">{event.title}</p>
                      {event.description && (
                        <p className="text-on-surface-variant mt-0.5 text-sm">
                          {event.description}
                        </p>
                      )}
                      <p className="text-on-surface-variant/80 mt-1 text-[11px]">
                        {fullDateTime(event.at)}
                      </p>
                    </li>
                  );
                })}
              </ol>
            )}
          </SectionCard>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="border-outline-variant bg-surface-container-low rounded-xl border p-5">
            <p className="font-label-caps text-on-surface-variant text-[11px]">Status history</p>
            <div className="mt-4">
              <StatusHistoryTrack steps={appt.statusHistory} />
            </div>
          </div>

          <div className="border-outline-variant bg-surface-container-low rounded-xl border p-5">
            <p className="font-label-caps text-on-surface-variant text-[11px]">
              Appointment management
            </p>
            <p className="text-on-surface-variant mt-2 text-xs leading-relaxed">
              Platform monitoring view. Status changes are made by customers and barbers in their
              apps — admins observe only.
            </p>
            <div className="mt-4 space-y-2">
              <Link
                href={routes.admin.appointments}
                className="border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-xs font-semibold transition-colors"
              >
                <Activity className="h-4 w-4" aria-hidden />
                Return to monitor
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
