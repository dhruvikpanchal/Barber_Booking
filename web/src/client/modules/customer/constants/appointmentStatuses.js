import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

export const CUSTOMER_APPOINTMENT_STATUSES = {
  pending: {
    label: "Pending",
    icon: Clock,
    badge: "bg-status-pending/15 text-status-pending border border-status-pending/30",
  },
  confirmed: {
    label: "Confirmed",
    icon: CalendarCheck,
    badge: "bg-primary/15 text-primary border border-primary/30",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    badge: "bg-status-confirmed/15 text-status-confirmed border border-status-confirmed/30",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    badge: "bg-status-cancelled/15 text-status-cancelled border border-status-cancelled/30",
  },
};
