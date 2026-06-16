import { CalendarCheck, Clock, Scissors, CheckCircle2, AlertCircle } from "lucide-react";

export const STATUSES = {
  pending: {
    label: "Pending",
    icon: AlertCircle,
    badge: "bg-status-pending/15 text-status-pending border border-status-pending/30",
  },
  confirmed: {
    label: "Confirmed",
    icon: CalendarCheck,
    badge: "bg-primary/15 text-primary border border-primary/30",
  },
  "in-service": {
    label: "In service",
    icon: Scissors,
    badge: "bg-status-pending/15 text-status-pending border border-status-pending/30",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    badge: "bg-status-confirmed/15 text-status-confirmed border border-status-confirmed/30",
  },
  upcoming: {
    label: "Upcoming",
    icon: Clock,
    badge: "bg-on-surface-variant/15 text-on-surface-variant border border-outline-variant",
  },
  cancelled: {
    label: "Cancelled",
    icon: AlertCircle,
    badge: "bg-status-cancelled/15 text-status-cancelled border border-status-cancelled/30",
  },
  rescheduled: {
    label: "Rescheduled",
    icon: CalendarCheck,
    badge: "bg-primary/15 text-primary border border-primary/30",
  },
  "no-show": {
    label: "No-show",
    icon: AlertCircle,
    badge: "bg-status-cancelled/15 text-status-cancelled border border-status-cancelled/30",
  },
};
