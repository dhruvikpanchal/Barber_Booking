import { Calendar, Clock, Scissors } from "lucide-react";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { CUSTOMER_APPOINTMENT_STATUSES } from "@/client/modules/customer/constants/appointmentStatuses.js";
import ChangeRequestPendingBadge from "./ChangeRequestPendingBadge.jsx";

export default function AppointmentSummaryCard({
  id,
  status,
  date,
  time,
  relative,
  serviceCount,
  totalDuration,
  hasPendingChange,
}) {
  return (
    <div className="grid gap-3 rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
      <div className="min-w-0 sm:col-span-2 lg:col-span-1">
        <p className="font-label-caps text-[10px] text-on-surface-variant">
          Booking
        </p>
        <p className="mt-0.5 font-serif text-lg font-bold text-on-surface">
          #{id}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={status} config={CUSTOMER_APPOINTMENT_STATUSES} />
          {hasPendingChange ? <ChangeRequestPendingBadge /> : null}
        </div>
      </div>

      <div className="min-w-0">
        <p className="font-label-caps text-[10px] text-on-surface-variant">
          Date & time
        </p>
        <div className="mt-1 flex items-start gap-2">
          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
          <div>
            <p className="text-sm font-semibold text-on-surface">{date}</p>
            <p className="text-xs text-on-surface-variant">
              {time} · {relative}
            </p>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <p className="font-label-caps text-[10px] text-on-surface-variant">
          Services
        </p>
        <div className="mt-1 flex items-start gap-2">
          <Scissors className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
          <p className="text-sm text-on-surface">
            {serviceCount} service{serviceCount !== 1 ? "s" : ""} ·{" "}
            {totalDuration} min
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <p className="font-label-caps text-[10px] text-on-surface-variant">
          Status
        </p>
        <div className="mt-1 flex items-start gap-2">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
          <p className="text-sm capitalize text-on-surface">{status}</p>
        </div>
      </div>
    </div>
  );
}
