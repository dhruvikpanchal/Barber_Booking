"use client";

import {
  Building2,
  CalendarDays,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  Scissors,
  StickyNote,
  User,
  X,
} from "lucide-react";
import Drawer from "@/client/modules/shared/components/ui/Drawer";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { APPOINTMENT_STATUSES } from "@/client/modules/admin/constants/adminConstants.js";
import { formatWhen } from "./AppointmentTableRow.jsx";

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

export default function AppointmentDetailDrawer({ appt, onClose }) {
  if (!appt) return null;

  const { date, time } = formatWhen(appt.startAt);
  const booked = new Date(appt.createdAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Drawer
      open
      onClose={onClose}
      panelClassName="scrollbar-thin w-full max-w-lg overflow-y-auto border-outline-variant bg-surface-container-low"
    >
      <header className="border-outline-variant bg-surface-container-low/95 sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur">
        <div>
          <p className="font-label-caps text-primary">Booking details</p>
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
          <div className="flex items-start justify-between gap-3">
            <h2 id="appt-detail-title" className="text-on-surface font-serif text-2xl font-bold">
              {appt.customer.name}
            </h2>
            <StatusBadge status={appt.status} config={APPOINTMENT_STATUSES} />
          </div>
          <p className="text-on-surface-variant text-sm">Booked {booked}</p>
        </div>

        <section className="border-outline-variant bg-surface-container rounded-lg border p-4">
          <InfoRow Icon={User} label="Customer" value={appt.customer.name} />
          <InfoRow Icon={Phone} label="Phone" value={appt.customer.phone} />
          <InfoRow Icon={Mail} label="Email" value={appt.customer.email} />
          <InfoRow Icon={Scissors} label="Barber" value={appt.barberName} />
          <InfoRow Icon={Building2} label="Shop" value={appt.shop} />
          <InfoRow Icon={MapPin} label="City" value={appt.city} />
          <InfoRow Icon={CalendarDays} label="Date" value={date} />
          <InfoRow Icon={Clock} label="Time" value={time} />
          <InfoRow
            Icon={DollarSign}
            label="Price"
            value={`$${appt.price} · ${appt.duration} min`}
          />
          <InfoRow Icon={Scissors} label="Service" value={appt.service} />
        </section>

        {appt.notes && (
          <section className="border-outline-variant bg-surface-container rounded-lg border p-4">
            <p className="font-label-caps text-on-surface-variant mb-2 flex items-center gap-2">
              <StickyNote className="h-3.5 w-3.5" aria-hidden />
              Notes
            </p>
            <p className="text-on-surface text-sm leading-relaxed">{appt.notes}</p>
          </section>
        )}

        <p className="border-outline-variant/80 bg-surface-container text-on-surface-variant rounded-md border px-3 py-2 text-xs">
          Read-only view for platform monitoring. Status changes are made by barbers and customers
          in their respective apps.
        </p>
      </div>
    </Drawer>
  );
}
