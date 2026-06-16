import Link from "next/link";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import { formatDateTime } from "@/client/modules/customer/helpers/appointmentsHelpers.js";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { CUSTOMER_APPOINTMENT_STATUSES } from "@/client/modules/customer/constants/appointmentStatusesConstants.js";

export default function NextAppointmentCard({ appointment }) {
  if (!appointment) {
    return (
      <section className="border-outline-variant bg-surface-container-low rounded-xl border border-dashed p-6 text-center sm:p-8">
        <p className="font-label-caps text-on-surface-variant">Next appointment</p>
        <h2 className="text-on-surface mt-2 font-serif text-xl font-bold">No upcoming bookings</h2>
        <p className="text-on-surface-variant mt-2 text-sm">
          Book your next cut with a barber you trust.
        </p>
        <Link
          href={routes.customer.bookAppointment}
          className="bg-primary text-on-primary hover:bg-primary/90 mt-4 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold transition-colors"
        >
          Book appointment
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>
    );
  }

  const { date, time, relative } = formatDateTime(appointment.startAt);
  const serviceNames = appointment.services.map((s) => s.name).join(", ");

  return (
    <section className="border-outline-variant bg-surface-container-low overflow-hidden rounded-xl border">
      <div className="border-outline-variant bg-surface-container border-b px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-label-caps text-primary">Next appointment</p>
          <StatusBadge
            status={appointment.status}
            config={CUSTOMER_APPOINTMENT_STATUSES}
            size="sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <div className="border-outline-variant relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border sm:h-20 sm:w-20">
          <img src={appointment.barber.image} alt="" className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h2 className="text-on-surface font-serif text-xl font-bold sm:text-2xl">
              {appointment.barber.name}
            </h2>
            <p className="text-on-surface-variant text-sm">{appointment.barber.role}</p>
          </div>

          <p className="text-on-surface text-sm font-medium">{serviceNames}</p>

          <ul className="text-on-surface-variant flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <li className="inline-flex items-center gap-1.5">
              <Calendar className="text-primary h-4 w-4 shrink-0" aria-hidden />
              <span>
                {date}
                <span className="text-on-surface-variant"> · {relative}</span>
              </span>
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Clock className="text-primary h-4 w-4 shrink-0" aria-hidden />
              {time}
            </li>
            {appointment.shop?.name ? (
              <li className="inline-flex items-center gap-1.5">
                <MapPin className="text-primary h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate">{appointment.shop.name}</span>
              </li>
            ) : null}
          </ul>
        </div>

        <Link
          href={routes.customer.appointmentsDetail(appointment.id)}
          className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-md border px-4 text-sm font-semibold transition-colors sm:self-center"
        >
          View details
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
