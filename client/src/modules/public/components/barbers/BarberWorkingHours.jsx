import { CalendarClock } from "lucide-react";

/**
 * @param {{ hours: Array<{ day: string, hours: string, closed?: boolean }> }} props
 */
export default function BarberWorkingHours({ hours }) {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
      <header className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <CalendarClock className="h-4 w-4" aria-hidden />
        </span>
        <h2 className="font-serif text-base font-bold text-on-surface">
          Working hours
        </h2>
      </header>
      <ul className="divide-y divide-outline-variant/60">
        {hours.map((row) => (
          <li
            key={row.day}
            className="flex items-center justify-between py-2.5 text-sm"
          >
            <span className="font-medium text-on-surface">{row.day}</span>
            <span
              className={
                row.closed
                  ? "text-on-surface-variant"
                  : "text-on-surface-variant"
              }
            >
              {row.hours}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
