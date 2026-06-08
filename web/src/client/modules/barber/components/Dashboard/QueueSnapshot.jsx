import Link from "next/link";
import { Armchair, ChevronRight, Timer, Users } from "lucide-react";

export default function QueueSnapshot({ snapshot }) {
  const { chairsTotal, chairsBusy, waiting, avgWaitMin, nextUp } = snapshot;
  const occupancy = Math.round((chairsBusy / chairsTotal) * 100);

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
      <header className="flex flex-col gap-3 border-b border-outline-variant px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary sm:h-10 sm:w-10">
            <Users className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="font-serif text-base font-bold text-on-surface sm:text-lg">
              Queue snapshot
            </h2>
            <p className="text-xs text-on-surface-variant">
              {waiting} waiting · {chairsBusy}/{chairsTotal} chairs in use
            </p>
          </div>
        </div>
        <Link
          href="/barber/queue"
          className="inline-flex shrink-0 items-center gap-1 self-start rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 sm:self-center"
        >
          Open queue
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-2 px-4 py-3.5 min-[380px]:grid-cols-3 min-[380px]:gap-3 sm:px-5 sm:py-4">
        <Mini Icon={Users} label="Waiting" value={waiting} />
        <Mini Icon={Armchair} label="Occupancy" value={`${occupancy}%`} />
        <Mini Icon={Timer} label="Avg wait" value={`${avgWaitMin}m`} />
      </div>

      <div className="border-t border-outline-variant px-4 py-3 sm:px-5">
        <p className="font-label-caps mb-2 text-on-surface-variant">Next up</p>
        <ul className="space-y-2">
          {nextUp.map((q, i) => (
            <li
              key={q.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md border border-outline-variant bg-surface-container px-3 py-2.5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 font-serif text-xs font-bold text-primary">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 basis-[calc(100%-2.5rem)] sm:basis-auto">
                <p className="truncate text-sm font-medium text-on-surface">
                  {q.name}
                </p>
                <p className="truncate text-[11px] text-on-surface-variant">
                  {q.service}
                </p>
              </div>
              <div className="flex w-full shrink-0 items-center justify-between gap-2 pl-10 min-[380px]:w-auto min-[380px]:pl-0 sm:justify-end">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                    q.source === "online"
                      ? "border-primary/30 bg-primary/15 text-primary"
                      : "border-status-pending/30 bg-status-pending/15 text-status-pending"
                  }`}
                >
                  {q.source}
                </span>
                <span className="shrink-0 text-[11px] font-medium text-on-surface-variant">
                  {q.waitMin}m wait
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Mini({ Icon, label, value }) {
  return (
    <div className="min-w-0 rounded-md border border-outline-variant bg-surface-container px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-on-surface-variant">
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="font-label-caps truncate text-[10px]">{label}</span>
      </div>
      <p className="mt-0.5 font-serif text-lg font-bold text-on-surface">
        {value}
      </p>
    </div>
  );
}
