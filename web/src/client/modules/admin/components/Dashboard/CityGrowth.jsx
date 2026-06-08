import { ArrowDownRight, ArrowUpRight, Flame, MapPin } from "lucide-react";

export default function CityGrowth({ cities = [] }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
      <header className="mb-3 sm:mb-4">
        <p className="font-label-caps text-on-surface-variant">City growth</p>
        <h3 className="font-serif text-base font-bold text-on-surface sm:text-lg">
          Top performing markets
        </h3>
      </header>
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
        {cities.map((c) => {
          const up = c.delta >= 0;
          return (
            <div
              key={c.city}
              className="min-w-0 rounded-lg border border-outline-variant bg-surface-container/40 p-3 transition-colors hover:bg-surface-container sm:p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <MapPin
                    className="h-4 w-4 shrink-0 text-primary"
                    aria-hidden
                  />
                  <p className="truncate text-sm font-semibold text-on-surface">
                    {c.city}
                  </p>
                </div>
                {c.hot ? (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-status-pending/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-status-pending">
                    <Flame className="h-3 w-3" aria-hidden /> Hot
                  </span>
                ) : null}
              </div>
              <p className="mt-2 font-serif text-lg font-bold text-on-surface sm:text-xl">
                {c.users.toLocaleString()}
              </p>
              <div
                className={`mt-1 inline-flex items-center gap-0.5 text-xs font-medium ${
                  up ? "text-status-confirmed" : "text-status-cancelled"
                }`}
              >
                {up ? (
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                )}
                {up ? "+" : ""}
                {c.delta}% this month
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
