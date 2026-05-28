import Link from "next/link";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import { formatDateTime } from "@/data/customer/appointmentsData.js";
import ApptStatusBadge from "../MyAppointments/ApptStatusBadge.jsx";

/**
 * @param {{ appointment: import('@/data/customer/appointmentsData.js').MY_APPOINTMENTS[number] | null }} props
 */
export default function NextAppointmentCard({ appointment }) {
  if (!appointment) {
    return (
      <section className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-6 text-center sm:p-8">
        <p className="font-label-caps text-on-surface-variant">Next appointment</p>
        <h2 className="mt-2 font-serif text-xl font-bold text-on-surface">
          No upcoming bookings
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          Book your next cut with a barber you trust.
        </p>
        <Link
          href={routes.customer.bookAppointment}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-on-primary transition-colors hover:bg-primary/90"
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
    <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
      <div className="border-b border-outline-variant bg-surface-container px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-label-caps text-primary">Next appointment</p>
          <ApptStatusBadge status={appointment.status} size="sm" />
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-outline-variant sm:h-20 sm:w-20">
          <img
            src={appointment.barber.image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-on-surface sm:text-2xl">
              {appointment.barber.name}
            </h2>
            <p className="text-sm text-on-surface-variant">
              {appointment.barber.role}
            </p>
          </div>

          <p className="text-sm font-medium text-on-surface">{serviceNames}</p>

          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-on-surface-variant">
            <li className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>
                {date}
                <span className="text-on-surface-variant"> · {relative}</span>
              </span>
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              {time}
            </li>
            {appointment.shop?.name ? (
              <li className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span className="truncate">{appointment.shop.name}</span>
              </li>
            ) : null}
          </ul>
        </div>

        <Link
          href={routes.customer.appointmentsDetail(appointment.id)}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-md border border-outline-variant bg-surface-container px-4 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high sm:self-center"
        >
          View details
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
