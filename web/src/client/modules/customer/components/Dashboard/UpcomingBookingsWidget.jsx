import Link from "next/link";
import { CalendarClock, ChevronRight } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import { formatDateTime } from "@/client/modules/customer/helpers/appointmentsHelpers.js";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { CUSTOMER_APPOINTMENT_STATUSES } from "@/client/modules/customer/constants/appointmentStatusesConstants.js";

export default function UpcomingBookingsWidget({ appointments }) {
  return (
    <section
      className="border-outline-variant bg-surface-container-low rounded-xl border"
      aria-labelledby="upcoming-bookings-heading"
    >
      <div className="border-outline-variant flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="bg-primary/15 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <CalendarClock className="h-4 w-4" aria-hidden />
          </span>
          <h2
            id="upcoming-bookings-heading"
            className="text-on-surface font-serif text-base font-bold sm:text-lg"
          >
            Upcoming bookings
          </h2>
        </div>
        <Link
          href={routes.customer.myAppointments}
          className="text-primary text-xs font-semibold hover:opacity-80"
        >
          View all
        </Link>
      </div>

      {appointments.length === 0 ? (
        <p className="text-on-surface-variant px-4 py-6 text-sm sm:px-5">
          No upcoming appointments.{" "}
          <Link
            href={routes.customer.bookAppointment}
            className="text-primary font-semibold hover:opacity-80"
          >
            Book one now
          </Link>
        </p>
      ) : (
        <ul className="divide-outline-variant divide-y">
          {appointments.map((appt) => {
            const { date, time, relative } = formatDateTime(appt.startAt);
            const services = appt.services.map((s) => s.name).join(", ");

            return (
              <li key={appt.id}>
                <Link
                  href={routes.customer.appointmentsDetail(appt.id)}
                  className="group hover:bg-surface-container flex items-center gap-3 px-4 py-3.5 transition-colors sm:px-5"
                >
                  <div className="border-outline-variant h-10 w-10 shrink-0 overflow-hidden rounded-lg border">
                    <img src={appt.barber.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-on-surface truncate text-sm font-semibold">
                      {appt.barber.name}
                    </p>
                    <p className="text-on-surface-variant truncate text-xs">{services}</p>
                    <p className="text-on-surface-variant mt-0.5 text-xs">
                      {date} · {time}
                      <span className="text-primary"> · {relative}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <StatusBadge
                      status={appt.status}
                      config={CUSTOMER_APPOINTMENT_STATUSES}
                      size="sm"
                    />
                    <ChevronRight
                      className="text-on-surface-variant h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
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
