import { CheckCircle2, CircleDot, Clock, XCircle } from "lucide-react";

export const WORKFLOW_STATUS = {
  new: {
    label: "New",
    icon: CircleDot,
    badge: "bg-status-pending/15 text-status-pending border border-status-pending/30",
    dot: "bg-status-pending",
  },
  in_progress: {
    label: "In progress",
    icon: Clock,
    badge: "bg-primary/15 text-primary border border-primary/30",
    dot: "bg-primary",
  },
  replied: {
    label: "Replied",
    icon: CheckCircle2,
    badge: "bg-status-confirmed/15 text-status-confirmed border border-status-confirmed/30",
    dot: "bg-status-confirmed",
  },
  closed: {
    label: "Closed",
    icon: XCircle,
    badge: "bg-surface-container-high text-on-surface-variant border border-outline-variant",
    dot: "bg-outline",
  },
};

export const STATUS_NEXT = {
  new: ["in_progress", "replied", "closed"],
  in_progress: ["replied", "closed", "new"],
  replied: ["closed", "in_progress"],
  closed: ["new", "in_progress"],
};
