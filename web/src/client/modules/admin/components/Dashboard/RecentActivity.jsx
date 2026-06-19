import { CalendarCheck, CheckCircle2, IndianRupee, Flag, UserCheck, UserPlus } from "lucide-react";

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
    Icon: IndianRupee,
    accent: "text-status-confirmed bg-status-confirmed/15",
  },
};

export default function RecentActivity({ items = [] }) {
  return (
    <section className="border-outline-variant bg-surface-container-low min-w-0 overflow-hidden rounded-xl border">
      <header className="border-outline-variant flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 sm:px-5 sm:py-4">
        <h3 className="text-on-surface font-serif text-base font-bold sm:text-lg">
          Recent activity
        </h3>
        <span className="text-on-surface-variant text-xs">Live feed</span>
      </header>
      <ul className="divide-outline-variant/60 divide-y">
        {items.length === 0 ? (
          <li className="px-4 py-10 text-center sm:px-5">
            <p className="text-on-surface-variant text-sm">No recent activity yet.</p>
            <p className="text-on-surface-variant/70 mt-1 text-xs">
              New bookings will appear here as customers schedule appointments.
            </p>
          </li>
        ) : (
          items.map((a) => {
            const cfg = ICONS[a.type] ?? ICONS.booking;
            const Icon = cfg.Icon;
            return (
              <li
                key={a.id}
                className="hover:bg-surface-container px-4 py-3 transition-colors sm:px-5 sm:py-3.5"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${cfg.accent}`}
                  >
                    <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-on-surface text-sm leading-snug font-medium">
                      <span className="line-clamp-2 sm:truncate">
                        {a.title}
                        <span className="text-on-surface-variant"> · {a.subject}</span>
                      </span>
                    </p>
                    <p className="text-on-surface-variant mt-0.5 line-clamp-2 text-xs sm:truncate">
                      {a.meta}
                    </p>
                    <span className="text-on-surface-variant mt-1 inline-block text-[11px] sm:hidden">
                      {a.time}
                    </span>
                  </div>
                  <span className="text-on-surface-variant hidden shrink-0 text-[11px] sm:inline">
                    {a.time}
                  </span>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
