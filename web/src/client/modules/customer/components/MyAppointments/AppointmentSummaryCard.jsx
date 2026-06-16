import { Calendar, Clock, Scissors } from "lucide-react";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { CUSTOMER_APPOINTMENT_STATUSES } from "@/client/modules/customer/constants/appointmentStatusesConstants.js";
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
    <div className="border-outline-variant bg-surface-container-low grid gap-3 rounded-xl border p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
      <div className="min-w-0 sm:col-span-2 lg:col-span-1">
        <p className="font-label-caps text-on-surface-variant text-[10px]">Booking</p>
        <p className="text-on-surface mt-0.5 font-serif text-lg font-bold">#{id}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={status} config={CUSTOMER_APPOINTMENT_STATUSES} />
          {hasPendingChange ? <ChangeRequestPendingBadge /> : null}
        </div>
      </div>

      <div className="min-w-0">
        <p className="font-label-caps text-on-surface-variant text-[10px]">Date & time</p>
        <div className="mt-1 flex items-start gap-2">
          <Calendar className="text-primary/70 mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="text-on-surface text-sm font-semibold">{date}</p>
            <p className="text-on-surface-variant text-xs">
              {time} · {relative}
            </p>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <p className="font-label-caps text-on-surface-variant text-[10px]">Services</p>
        <div className="mt-1 flex items-start gap-2">
          <Scissors className="text-primary/70 mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-on-surface text-sm">
            {serviceCount} service{serviceCount !== 1 ? "s" : ""} · {totalDuration} min
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <p className="font-label-caps text-on-surface-variant text-[10px]">Status</p>
        <div className="mt-1 flex items-start gap-2">
          <Clock className="text-primary/70 mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-on-surface text-sm capitalize">{status}</p>
        </div>
      </div>
    </div>
  );
}
