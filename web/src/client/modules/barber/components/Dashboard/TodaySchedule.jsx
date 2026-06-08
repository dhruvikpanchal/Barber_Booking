import Link from "next/link";
import { CalendarDays, ChevronRight, Clock } from "lucide-react";
import { formatTimeLabel } from "@/lib/format/formatDateTime.js";
import StatusPill from "./StatusPill";

export default function TodaySchedule({ appointments }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
      <header className="flex flex-col gap-3 border-b border-outline-variant px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary sm:h-10 sm:w-10">
            <CalendarDays className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="font-serif text-base font-bold text-on-surface sm:text-lg">
              Today’s appointments
            </h2>
            <p className="text-xs text-on-surface-variant">
              {appointments.length} booked ·{" "}
              {appointments.filter((a) => a.status === "completed").length} done
            </p>
          </div>
        </div>
        <Link
          href="/barber/appointments"
          className="inline-flex shrink-0 items-center gap-1 self-start rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 sm:self-center"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </header>

      <ul className="divide-y divide-outline-variant">
        {appointments.map((a) => (
          <li
            key={a.id}
            className="flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-surface-container sm:flex-row sm:items-center sm:gap-4 sm:px-5"
          >
            <div className="flex min-w-0 items-center gap-3 sm:flex-1 sm:gap-4">
              <div className="flex w-14 shrink-0 flex-col items-center rounded-lg bg-surface-container px-2 py-2 text-center sm:w-16">
                <span className="font-serif text-sm font-bold text-on-surface">
                  {formatTimeLabel(a.startAt)}
                </span>
                <span className="text-[10px] font-medium text-on-surface-variant">
                  {a.duration}m
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-on-surface">
                  {a.customer}
                </p>
                <p className="truncate text-xs text-on-surface-variant">
                  {a.service} · ${a.price}
                </p>
              </div>
            </div>
            <StatusPill status={a.status} className="self-start sm:shrink-0" />
          </li>
        ))}
        {appointments.length === 0 ? (
          <li className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-on-surface-variant sm:px-5">
            <Clock className="h-4 w-4" aria-hidden /> No appointments today.
          </li>
        ) : null}
      </ul>
    </section>
  );
}
