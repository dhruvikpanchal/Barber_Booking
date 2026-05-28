import Link from "next/link";
import { CalendarClock, ChevronRight } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import { formatDateTime } from "@/data/customer/appointmentsData.js";
import ApptStatusBadge from "../MyAppointments/ApptStatusBadge.jsx";

/**
 * @param {{ appointments: typeof import('@/data/customer/appointmentsData.js').MY_APPOINTMENTS }} props
 */
export default function UpcomingBookingsWidget({ appointments }) {
  return (
    <section
      className="rounded-xl border border-outline-variant bg-surface-container-low"
      aria-labelledby="upcoming-bookings-heading"
    >
      <div className="flex items-center justify-between gap-3 border-b border-outline-variant px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <CalendarClock className="h-4 w-4" aria-hidden />
          </span>
          <h2
            id="upcoming-bookings-heading"
            className="font-serif text-base font-bold text-on-surface sm:text-lg"
          >
            Upcoming bookings
          </h2>
        </div>
        <Link
          href={routes.customer.myAppointments}
          className="text-xs font-semibold text-primary hover:opacity-80"
        >
          View all
        </Link>
      </div>

      {appointments.length === 0 ? (
        <p className="px-4 py-6 text-sm text-on-surface-variant sm:px-5">
          No upcoming appointments.{" "}
          <Link
            href={routes.customer.bookAppointment}
            className="font-semibold text-primary hover:opacity-80"
          >
            Book one now
          </Link>
        </p>
      ) : (
        <ul className="divide-y divide-outline-variant">
          {appointments.map((appt) => {
            const { date, time, relative } = formatDateTime(appt.startAt);
            const services = appt.services.map((s) => s.name).join(", ");

            return (
              <li key={appt.id}>
                <Link
                  href={routes.customer.appointmentsDetail(appt.id)}
                  className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-container sm:px-5"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-outline-variant">
                    <img
                      src={appt.barber.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-on-surface">
                      {appt.barber.name}
                    </p>
                    <p className="truncate text-xs text-on-surface-variant">
                      {services}
                    </p>
                    <p className="mt-0.5 text-xs text-on-surface-variant">
                      {date} · {time}
                      <span className="text-primary"> · {relative}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <ApptStatusBadge status={appt.status} size="sm" />
                    <ChevronRight
                      className="h-4 w-4 text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
