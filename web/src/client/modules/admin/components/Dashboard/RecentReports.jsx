import Link from "next/link";
import { AlertTriangle, ChevronRight, Flag } from "lucide-react";

const SEVERITY = {
  high: "bg-status-cancelled/15 text-status-cancelled border-status-cancelled/30",
  medium: "bg-status-pending/15 text-status-pending border-status-pending/30",
  low: "bg-surface-container text-on-surface-variant border-outline-variant",
};

export default function RecentReports({ items = [] }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-2">
          <Flag className="h-4 w-4 shrink-0 text-status-cancelled" aria-hidden />
          <h3 className="font-serif text-base font-bold text-on-surface sm:text-lg">
            Recent reports
          </h3>
        </div>
        <Link
          href="/admin/reports"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View all <ChevronRight className="h-3 w-3" aria-hidden />
        </Link>
      </header>
      <ul className="divide-y divide-outline-variant/60">
        {items.map((r) => (
          <li
            key={r.id}
            className="px-4 py-3 transition-colors hover:bg-surface-container sm:px-5 sm:py-3.5"
          >
            <div className="flex gap-3">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-status-cancelled"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium text-on-surface sm:truncate">
                  {r.title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-on-surface-variant sm:truncate">
                  {r.reporter} → {r.target}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-0 sm:hidden">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${SEVERITY[r.severity]}`}
                  >
                    {r.severity}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    {r.time}
                  </span>
                </div>
              </div>
              <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${SEVERITY[r.severity]}`}
                >
                  {r.severity}
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  {r.time}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
