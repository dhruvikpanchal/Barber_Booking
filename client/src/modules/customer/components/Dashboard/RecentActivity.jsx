import Link from "next/link";
import {
  Activity,
  CalendarPlus,
  CalendarCheck,
  CheckCircle2,
  RefreshCw,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import { formatTimeAgo } from "@/lib/format/formatDateTime.js";

const TYPE_META = {
  booked: {
    Icon: CalendarPlus,
    accent: "bg-primary/15 text-primary",
  },
  confirmed: {
    Icon: CalendarCheck,
    accent: "bg-status-confirmed/15 text-status-confirmed",
  },
  completed: {
    Icon: CheckCircle2,
    accent: "bg-status-confirmed/15 text-status-confirmed",
  },
  cancelled: {
    Icon: XCircle,
    accent: "bg-status-cancelled/15 text-status-cancelled",
  },
  update: {
    Icon: RefreshCw,
    accent: "bg-status-pending/15 text-status-pending",
  },
};

/**
 * @param {{ items: ReturnType<import('@/data/customer/dashboardData.js').buildRecentActivity> }} props
 */
export default function RecentActivity({ items }) {
  return (
    <section
      className="rounded-xl border border-outline-variant bg-surface-container-low"
      aria-labelledby="recent-activity-heading"
    >
      <div className="flex items-center gap-2 border-b border-outline-variant px-4 py-3 sm:px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant">
          <Activity className="h-4 w-4" aria-hidden />
        </span>
        <h2
          id="recent-activity-heading"
          className="font-serif text-base font-bold text-on-surface sm:text-lg"
        >
          Recent activity
        </h2>
      </div>

      {items.length === 0 ? (
        <p className="px-4 py-6 text-sm text-on-surface-variant sm:px-5">
          No recent booking activity yet.
        </p>
      ) : (
        <ul className="divide-y divide-outline-variant">
          {items.map((item) => {
            const meta = TYPE_META[item.type] ?? TYPE_META.booked;
            const Icon = meta.Icon;

            return (
              <li key={item.id}>
                <Link
                  href={routes.customer.appointmentsDetail(item.appointmentId)}
                  className="group flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-surface-container sm:px-5"
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.accent}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-on-surface">
                      {item.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-on-surface-variant">
                      {item.description}
                    </p>
                    <p className="mt-1 text-[11px] text-on-surface-variant">
                      {formatTimeAgo(item.at)}
                    </p>
                  </div>
                  <ChevronRight
                    className="mt-2 h-4 w-4 shrink-0 text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
