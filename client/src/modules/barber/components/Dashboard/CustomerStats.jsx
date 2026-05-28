import { Repeat2, Sparkles, Star, UserCheck, Users2 } from "lucide-react";

export default function CustomerStats({ stats }) {
  const {
    servedToday,
    newClients,
    returning,
    avgRating,
    reviewsThisWeek,
    rebookRate,
  } = stats;

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
      <header className="flex items-center gap-3 border-b border-outline-variant px-4 py-3.5 sm:px-5 sm:py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary sm:h-10 sm:w-10">
          <Users2 className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="font-serif text-base font-bold text-on-surface sm:text-lg">
            Customer stats
          </h2>
          <p className="text-xs text-on-surface-variant">
            How your chair is performing today.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 p-4 min-[400px]:grid-cols-2 sm:grid-cols-3 sm:p-5">
        <Tile
          Icon={UserCheck}
          label="Served today"
          value={servedToday}
          accent="text-primary bg-primary/15"
        />
        <Tile
          Icon={Sparkles}
          label="New clients"
          value={newClients}
          accent="text-status-pending bg-status-pending/15"
        />
        <Tile
          Icon={Repeat2}
          label="Returning"
          value={returning}
          accent="text-status-confirmed bg-status-confirmed/15"
        />
        <Tile
          Icon={Star}
          label="Avg rating"
          value={avgRating.toFixed(1)}
          hint={`${reviewsThisWeek} reviews · 7d`}
          accent="text-status-pending bg-status-pending/15"
        />
        <Tile
          Icon={Repeat2}
          label="Rebook rate"
          value={`${rebookRate}%`}
          accent="text-primary bg-primary/15"
        />
        <div className="rounded-lg border border-dashed border-outline-variant p-3 text-xs leading-relaxed text-on-surface-variant min-[400px]:col-span-2 sm:col-span-1">
          Keep <span className="font-bold text-on-surface">rebook rate</span>{" "}
          above 65% to unlock priority listing.
        </div>
      </div>
    </section>
  );
}

function Tile({ Icon, label, value, hint, accent }) {
  return (
    <div className="min-w-0 rounded-lg border border-outline-variant bg-surface-container p-3">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${accent}`}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <span className="font-label-caps truncate text-[10px] text-on-surface-variant">
          {label}
        </span>
      </div>
      <p className="mt-1 font-serif text-lg font-bold text-on-surface sm:text-xl">
        {value}
      </p>
      {hint ? (
        <p className="text-[11px] text-on-surface-variant">{hint}</p>
      ) : null}
    </div>
  );
}
