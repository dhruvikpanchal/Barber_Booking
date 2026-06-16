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
  UserX,
} from "lucide-react";
import Drawer from "@/client/modules/shared/components/ui/Drawer";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { STATUSES } from "@/client/modules/barber/constants/statusConstants.js";
import { formatWhen } from "./AppointmentRow";

function InfoRow({ Icon, label, value }) {
  if (!value) return null;
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

export default function AppointmentDetailDrawer({
  appt,
  onClose,
  onAccept,
  onReject,
  onReschedule,
  onNoShow,
}) {
  if (!appt) return null;
  const { date, time } = formatWhen(appt.startAt);

  return (
    <Drawer
      open
      onClose={onClose}
      panelClassName="scrollbar-thin w-full max-w-md overflow-y-auto border-outline-variant bg-surface-container-low"
    >
      <header className="border-outline-variant bg-surface-container-low/95 sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur">
        <div>
          <p className="font-label-caps text-primary">Appointment</p>
          <p className="text-on-surface-variant text-xs">#{appt.id}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-9 w-9 items-center justify-center rounded-md"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </header>

      <div className="space-y-6 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-on-surface font-serif text-2xl font-bold">{appt.customer.name}</h2>
            <StatusBadge status={appt.status} config={STATUSES} />
          </div>
        </div>

        <div className="border-outline-variant bg-surface-container rounded-xl border px-4">
          <InfoRow Icon={Phone} label="Phone" value={appt.customer.phone} />
          <InfoRow Icon={Mail} label="Email" value={appt.customer.email} />
        </div>

        <div className="border-outline-variant bg-surface-container rounded-xl border px-4">
          <InfoRow Icon={Scissors} label="Service" value={appt.service} />
          <InfoRow Icon={CalendarDays} label="When" value={`${date} at ${time}`} />
          <InfoRow Icon={Clock} label="Duration" value={`${appt.duration} min`} />
          <InfoRow Icon={DollarSign} label="Price" value={`$${appt.price}`} />
          {appt.notes && <InfoRow Icon={StickyNote} label="Notes" value={appt.notes} />}
        </div>

        <div className="flex flex-wrap gap-2">
          {appt.status === "pending" && (
            <>
              <button
                type="button"
                onClick={() => onAccept(appt.id)}
                className="bg-primary text-on-primary inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md px-4 text-sm font-semibold hover:opacity-90"
              >
                <Check className="h-4 w-4" aria-hidden /> Accept booking
              </button>
              <button
                type="button"
                onClick={() => onReject(appt.id)}
                className="border-outline-variant text-on-surface-variant hover:border-status-cancelled/50 hover:text-status-cancelled inline-flex h-11 items-center justify-center gap-1.5 rounded-md border px-4 text-sm font-semibold"
              >
                <X className="h-4 w-4" aria-hidden /> Reject
              </button>
            </>
          )}
          {appt.status === "confirmed" && (
            <>
              <p className="text-on-surface-variant text-xs">
                Start and complete this visit from the Queue page.
              </p>
              <button
                type="button"
                onClick={() => onNoShow(appt.id)}
                className="border-outline-variant text-on-surface-variant hover:text-status-cancelled inline-flex h-11 items-center justify-center gap-1.5 rounded-md border px-4 text-sm font-semibold"
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
              className="border-outline-variant text-on-surface hover:bg-surface-container inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-md border px-4 text-sm font-semibold"
            >
              <CalendarClock className="h-4 w-4" aria-hidden /> Reschedule
            </button>
          )}
        </div>
      </div>
    </Drawer>
  );
}
