import Link from "@/lib/AppLink";
import { CalendarDays, ChevronRight, Clock } from "lucide-react";
import { formatTimeLabel } from "@/lib/format/formatDateTime.js";
import { formatMoney } from "@/client/lib/format/formatMoney.js";
import StatusPill from "./StatusPill";

export default function TodaySchedule({ appointments }) {
  return (
    <section className="border-outline-variant bg-surface-container-low min-w-0 overflow-hidden rounded-xl border">
      <header className="border-outline-variant flex flex-col gap-3 border-b px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="bg-primary/15 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10">
            <CalendarDays className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="text-on-surface font-serif text-base font-bold sm:text-lg">
              Today’s appointments
            </h2>
            <p className="text-on-surface-variant text-xs">
              {appointments.length} booked ·{" "}
              {appointments.filter((a) => a.status === "completed").length} done
            </p>
          </div>
        </div>
        <Link
          href="/barber/appointments"
          className="text-primary hover:bg-primary/10 inline-flex shrink-0 items-center gap-1 self-start rounded-md px-2 py-1 text-xs font-medium sm:self-center"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </header>

      <ul className="divide-outline-variant divide-y">
        {appointments.map((a) => (
          <li
            key={a.id}
            className="hover:bg-surface-container flex flex-col gap-2 px-4 py-3 transition-colors sm:flex-row sm:items-center sm:gap-4 sm:px-5"
          >
            <div className="flex min-w-0 items-center gap-3 sm:flex-1 sm:gap-4">
              <div className="bg-surface-container flex w-14 shrink-0 flex-col items-center rounded-lg px-2 py-2 text-center sm:w-16">
                <span className="text-on-surface font-serif text-sm font-bold">
                  {formatTimeLabel(a.startAt)}
                </span>
                <span className="text-on-surface-variant text-[10px] font-medium">
                  {a.duration}m
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-on-surface truncate font-medium">{a.customer?.name ?? "Customer"}</p>
                <p className="text-on-surface-variant truncate text-xs">
                  {a.service} · {formatMoney(a.price)}
                </p>
              </div>
            </div>
            <StatusPill status={a.status} className="self-start sm:shrink-0" />
          </li>
        ))}
        {appointments.length === 0 ? (
          <li className="text-on-surface-variant flex items-center justify-center gap-2 px-4 py-10 text-sm sm:px-5">
            <Clock className="h-4 w-4" aria-hidden /> No appointments today.
          </li>
        ) : null}
      </ul>
    </section>
  );
}
