import { DollarSign, TrendingUp, Wallet } from "lucide-react";
import Sparkline from "./Sparkline.jsx";

export default function EarningsCard({ earnings }) {
  const { today, yesterday, weekToDate, weekTarget, trend, tips } = earnings;
  const deltaPct = yesterday ? Math.round(((today - yesterday) / yesterday) * 100) : 0;
  const goalPct = Math.min(100, Math.round((weekToDate / weekTarget) * 100));

  return (
    <section className="border-outline-variant bg-surface-container-low min-w-0 overflow-hidden rounded-xl border">
      <header className="border-outline-variant flex flex-col gap-3 border-b px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="bg-status-confirmed/15 text-status-confirmed flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10">
            <Wallet className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="text-on-surface font-serif text-base font-bold sm:text-lg">
              Estimated earnings
            </h2>
            <p className="text-on-surface-variant text-xs">Tips included · ${tips} today</p>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 self-start rounded-full px-2 py-0.5 text-[11px] font-medium sm:self-center ${
            deltaPct >= 0
              ? "bg-status-confirmed/15 text-status-confirmed"
              : "bg-status-cancelled/15 text-status-cancelled"
          }`}
        >
          <TrendingUp className="h-3 w-3 shrink-0" aria-hidden />
          {deltaPct >= 0 ? "+" : ""}
          {deltaPct}% vs yesterday
        </span>
      </header>

      <div className="grid gap-4 px-4 py-3.5 sm:grid-cols-2 sm:px-5 sm:py-4">
        <div>
          <p className="font-label-caps text-on-surface-variant">Today</p>
          <p className="text-on-surface font-serif text-2xl font-bold sm:text-3xl">${today}</p>
          <p className="text-on-surface-variant mt-0.5 text-xs">Yesterday ${yesterday}</p>
          <div className="text-status-confirmed mt-2">
            <Sparkline data={trend} />
          </div>
        </div>
        <div className="border-outline-variant bg-surface-container flex flex-col justify-between rounded-lg border p-3">
          <div>
            <p className="font-label-caps text-on-surface-variant">Week to date</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p className="text-on-surface font-serif text-xl font-bold sm:text-2xl">
                ${weekToDate}
              </p>
              <p className="text-on-surface-variant text-xs">/ ${weekTarget}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="bg-surface-container-high h-2 w-full overflow-hidden rounded-full">
              <div className="bg-primary h-full rounded-full" style={{ width: `${goalPct}%` }} />
            </div>
            <div className="text-on-surface-variant mt-1 flex flex-col gap-1 text-[11px] sm:flex-row sm:items-center sm:justify-between">
              <span>{goalPct}% of weekly goal</span>
              <span className="inline-flex items-center gap-1">
                <DollarSign className="h-3 w-3 shrink-0" aria-hidden />${weekTarget - weekToDate} to
                go
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
