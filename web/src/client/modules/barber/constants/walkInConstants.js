import { Clock, Scissors, CheckCircle2, XCircle } from "lucide-react";

export const STATUSES = {
  waiting: {
    key: "waiting",
    label: "Waiting",
    icon: Clock,
    badge: "bg-status-pending/15 text-status-pending border border-status-pending/30",
    dot: "bg-status-pending",
  },
  "in-service": {
    key: "in-service",
    label: "In service",
    icon: Scissors,
    badge: "bg-primary/15 text-primary border border-primary/30",
    dot: "bg-primary",
  },
  done: {
    key: "done",
    label: "Done",
    icon: CheckCircle2,
    badge: "bg-status-confirmed/15 text-status-confirmed border border-status-confirmed/30",
    dot: "bg-status-confirmed",
  },
  cancelled: {
    key: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    badge: "bg-status-cancelled/15 text-status-cancelled border border-status-cancelled/30",
    dot: "bg-status-cancelled",
  },
};

export const STATUS_ORDER = ["waiting", "in-service", "done", "cancelled"];

export const WALK_IN_TABS = [
  { key: "active", label: "Active" },
  { key: "waiting", label: "Waiting" },
  { key: "in-service", label: "In service" },
  { key: "done", label: "Done" },
  { key: "cancelled", label: "Cancelled" },
  { key: "all", label: "All" },
];
