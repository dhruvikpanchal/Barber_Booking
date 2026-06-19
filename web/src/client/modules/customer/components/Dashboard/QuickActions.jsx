import Link from "@/lib/AppLink";
import {
  CalendarPlus,
  CalendarClock,
  Star,
  Heart,
  ChevronRight,
} from "lucide-react";
import { routes } from "@/config/routes/routes.js";

const ACTIONS = [
  {
    label: "Book appointment",
    description: "Find a barber and schedule",
    href: routes.customer.bookAppointment,
    Icon: CalendarPlus,
    accent: "bg-primary/15 text-primary",
  },
  {
    label: "View appointments",
    description: "Upcoming, past, and cancelled",
    href: routes.customer.myAppointments,
    Icon: CalendarClock,
    accent: "bg-status-confirmed/15 text-status-confirmed",
  },
  {
    label: "Reviews",
    description: "Rate your recent visits",
    href: routes.customer.reviews,
    Icon: Star,
    accent: "bg-yellow-400/15 text-yellow-400",
  },
  {
    label: "Favorites",
    description: "Saved barbers you love",
    href: routes.customer.favorites,
    Icon: Heart,
    accent: "bg-status-cancelled/15 text-status-cancelled",
  },
];

export default function QuickActions() {
  return (
    <section aria-labelledby="dashboard-quick-actions">
      <h2
        id="dashboard-quick-actions"
        className="font-label-caps text-on-surface-variant"
      >
        Quick actions
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ACTIONS.map(({ label, description, href, Icon, accent }) => (
          <Link
            key={label}
            href={href}
            className="group flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low p-3.5 transition-colors hover:border-outline hover:bg-surface-container"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-on-surface">
                {label}
              </span>
              <span className="block text-xs text-on-surface-variant">
                {description}
              </span>
            </span>
            <ChevronRight
              className="h-4 w-4 shrink-0 text-on-surface-variant transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
