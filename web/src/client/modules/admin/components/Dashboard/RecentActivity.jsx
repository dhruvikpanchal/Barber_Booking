import {
  CalendarCheck,
  CheckCircle2,
  DollarSign,
  Flag,
  UserCheck,
  UserPlus,
} from "lucide-react";

const ICONS = {
  barber_approved: {
    Icon: CheckCircle2,
    accent: "text-status-confirmed bg-status-confirmed/15",
  },
  user_signup: { Icon: UserPlus, accent: "text-primary bg-primary/15" },
  booking: {
    Icon: CalendarCheck,
    accent: "text-status-confirmed bg-status-confirmed/15",
  },
  report: { Icon: Flag, accent: "text-status-cancelled bg-status-cancelled/15" },
  barber_request: {
    Icon: UserCheck,
    accent: "text-status-pending bg-status-pending/15",
  },
  payout: {
    Icon: DollarSign,
    accent: "text-status-confirmed bg-status-confirmed/15",
  },
};

export default function RecentActivity({ items = [] }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant px-4 py-3 sm:px-5 sm:py-4">
        <h3 className="font-serif text-base font-bold text-on-surface sm:text-lg">
          Recent activity
        </h3>
        <span className="text-xs text-on-surface-variant">Live feed</span>
      </header>
      <ul className="divide-y divide-outline-variant/60">
        {items.map((a) => {
          const cfg = ICONS[a.type] ?? ICONS.booking;
          const Icon = cfg.Icon;
          return (
            <li
              key={a.id}
              className="px-4 py-3 transition-colors hover:bg-surface-container sm:px-5 sm:py-3.5"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${cfg.accent}`}
                >
                  <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug text-on-surface">
                    <span className="line-clamp-2 sm:truncate">
                      {a.title}
                      <span className="text-on-surface-variant">
                        {" "}
                        · {a.subject}
                      </span>
                    </span>
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-on-surface-variant sm:truncate">
                    {a.meta}
                  </p>
                  <span className="mt-1 inline-block text-[11px] text-on-surface-variant sm:hidden">
                    {a.time}
                  </span>
                </div>
                <span className="hidden shrink-0 text-[11px] text-on-surface-variant sm:inline">
                  {a.time}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
