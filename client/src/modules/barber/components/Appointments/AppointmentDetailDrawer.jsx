"use client";

import {
  X,
  Phone,
  Mail,
  Scissors,
  Clock,
  CalendarDays,
  DollarSign,
  StickyNote,
  Check,
  CalendarClock,
  CheckCircle2,
  UserX,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatWhen } from "./AppointmentRow";

function InfoRow({ Icon, label, value }) {
  if (!value) return null;
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

export default function AppointmentDetailDrawer({
  appt,
  onClose,
  onAccept,
  onReject,
  onReschedule,
  onComplete,
  onNoShow,
}) {
  if (!appt) return null;
  const { date, time } = formatWhen(appt.startAt);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60"
      onClick={onClose}
    >
      <aside
        className="scrollbar-thin h-full w-full max-w-md overflow-y-auto border-l border-outline-variant bg-surface-container-low shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header
          className="sticky top-0 z-10 flex items-center justify-between border-b border-outline-variant bg-surface-container-low/95 px-5 py-4 backdrop-blur"
        >
          <div>
            <p className="font-label-caps text-primary">Appointment</p>
            <p className="text-xs text-on-surface-variant">#{appt.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="space-y-6 p-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                {appt.customer.name}
              </h2>
              <StatusBadge status={appt.status} />
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container px-4">
            <InfoRow Icon={Phone} label="Phone" value={appt.customer.phone} />
            <InfoRow Icon={Mail} label="Email" value={appt.customer.email} />
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container px-4">
            <InfoRow Icon={Scissors} label="Service" value={appt.service} />
            <InfoRow
              Icon={CalendarDays}
              label="When"
              value={`${date} at ${time}`}
            />
            <InfoRow Icon={Clock} label="Duration" value={`${appt.duration} min`} />
            <InfoRow Icon={DollarSign} label="Price" value={`$${appt.price}`} />
            {appt.notes && (
              <InfoRow Icon={StickyNote} label="Notes" value={appt.notes} />
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {appt.status === "pending" && (
              <>
                <button
                  type="button"
                  onClick={() => onAccept(appt.id)}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-4 text-sm font-semibold text-on-primary hover:opacity-90"
                >
                  <Check className="h-4 w-4" aria-hidden /> Accept booking
                </button>
                <button
                  type="button"
                  onClick={() => onReject(appt.id)}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-outline-variant px-4 text-sm font-semibold text-on-surface-variant hover:border-status-cancelled/50 hover:text-status-cancelled"
                >
                  <X className="h-4 w-4" aria-hidden /> Reject
                </button>
              </>
            )}
            {appt.status === "confirmed" && (
              <>
                <button
                  type="button"
                  onClick={() => onComplete(appt.id)}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-status-confirmed px-4 text-sm font-semibold text-background hover:opacity-90"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden /> Mark
                  completed
                </button>
                <button
                  type="button"
                  onClick={() => onNoShow(appt.id)}
                  className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-outline-variant px-4 text-sm font-semibold text-on-surface-variant hover:text-status-cancelled"
                >
                  <UserX className="h-4 w-4" aria-hidden /> No-show
                </button>
              </>
            )}
            {(appt.status === "pending" ||
              appt.status === "confirmed" ||
              appt.status === "rescheduled") && (
              <button
                type="button"
                onClick={() => onReschedule(appt)}
                className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-md border border-outline-variant px-4 text-sm font-semibold text-on-surface hover:bg-surface-container"
              >
                <CalendarClock className="h-4 w-4" aria-hidden /> Reschedule
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
