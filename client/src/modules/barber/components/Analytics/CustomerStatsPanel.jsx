import { Repeat2, Sparkles, Users2 } from "lucide-react";

/**
 * @param {{ new: number, returning: number, total: number }} customers
 */
export default function CustomerStatsPanel({ customers }) {
  const returningPct =
    customers.total > 0
      ? Math.round((customers.returning / customers.total) * 100)
      : 0;

  return (
    <section className="min-w-0 rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
      <header className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Users2 className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-serif text-base font-bold text-on-surface">
            Customer statistics
          </h2>
          <p className="text-xs text-on-surface-variant">
            New, returning, and total clients
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-3">
        <Stat
          Icon={Sparkles}
          label="New customers"
          value={customers.new}
          accent="text-status-pending bg-status-pending/15"
        />
        <Stat
          Icon={Repeat2}
          label="Returning"
          value={customers.returning}
          accent="text-status-confirmed bg-status-confirmed/15"
        />
        <Stat
          Icon={Users2}
          label="Total customers"
          value={customers.total}
          accent="text-primary bg-primary/15"
        />
      </div>

      <p className="mt-4 rounded-lg border border-outline-variant bg-surface-container px-3 py-2.5 text-xs text-on-surface-variant">
        <span className="font-semibold text-on-surface">{returningPct}%</span>{" "}
        of customers in this period are returning clients.
      </p>
    </section>
  );
}

function Stat({ Icon, label, value, accent }) {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container p-3">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-md ${accent}`}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <span className="font-label-caps text-[10px] text-on-surface-variant">
          {label}
        </span>
      </div>
      <p className="mt-2 font-serif text-2xl font-bold text-on-surface">{value}</p>
    </div>
  );
}
