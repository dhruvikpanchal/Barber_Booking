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

export default function RecentActivity({ items }) {
  return (
    <section
      className="border-outline-variant bg-surface-container-low rounded-xl border"
      aria-labelledby="recent-activity-heading"
    >
      <div className="border-outline-variant flex items-center gap-2 border-b px-4 py-3 sm:px-5">
        <span className="bg-surface-container-high text-on-surface-variant flex h-8 w-8 items-center justify-center rounded-lg">
          <Activity className="h-4 w-4" aria-hidden />
        </span>
        <h2
          id="recent-activity-heading"
          className="text-on-surface font-serif text-base font-bold sm:text-lg"
        >
          Recent activity
        </h2>
      </div>

      {items.length === 0 ? (
        <p className="text-on-surface-variant px-4 py-6 text-sm sm:px-5">
          No recent booking activity yet.
        </p>
      ) : (
        <ul className="divide-outline-variant divide-y">
          {items.map((item) => {
            const meta = TYPE_META[item.type] ?? TYPE_META.booked;
            const Icon = meta.Icon;

            return (
              <li key={item.id}>
                <Link
                  href={routes.customer.appointmentsDetail(item.appointmentId)}
                  className="group hover:bg-surface-container flex items-start gap-3 px-4 py-3.5 transition-colors sm:px-5"
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.accent}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-on-surface text-sm font-semibold">{item.title}</p>
                    <p className="text-on-surface-variant mt-0.5 line-clamp-2 text-xs">
                      {item.description}
                    </p>
                    <p className="text-on-surface-variant mt-1 text-[11px]">
                      {formatTimeAgo(item.at)}
                    </p>
                  </div>
                  <ChevronRight
                    className="text-on-surface-variant mt-2 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
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
