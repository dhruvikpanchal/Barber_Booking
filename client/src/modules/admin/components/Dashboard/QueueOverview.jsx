import { Armchair, Clock, Users } from "lucide-react";

export default function QueueOverview({ cities = [] }) {
  return (
    <section className="border-outline-variant bg-surface-container-low min-w-0 overflow-hidden rounded-xl border">
      <header className="border-outline-variant flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 sm:px-5 sm:py-4">
        <h3 className="text-on-surface font-serif text-base font-bold sm:text-lg">
          Queue overview
        </h3>
        <span className="text-on-surface-variant text-xs">By city · live</span>
      </header>
      <ul className="divide-outline-variant/60 divide-y">
        {cities.map((c) => {
          const total = c.waiting + c.inService;
          const load = Math.min(100, Math.round((c.waiting / Math.max(total, 1)) * 100));
          return (
            <li key={c.city} className="px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <p className="text-on-surface truncate text-sm font-semibold">{c.city}</p>
                <div className="text-on-surface-variant flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {c.waiting} wait
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {c.inService} active
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Armchair className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {c.freeChairs} free
                  </span>
                </div>
              </div>
              <div className="bg-surface-container mt-2 h-1.5 w-full overflow-hidden rounded-full">
                <div className="bg-primary h-full rounded-full" style={{ width: `${load}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
