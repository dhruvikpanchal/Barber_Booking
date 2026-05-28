import {
  Clock,
  Scissors,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Armchair,
} from "lucide-react";

export const SOURCES = {
  online: {
    label: "Online",
    badge: "bg-primary/15 text-primary border border-primary/30",
  },
  "walk-in": {
    label: "Walk-in",
    badge:
      "bg-status-pending/15 text-status-pending border border-status-pending/30",
  },
};

export const STATUSES = {
  waiting: {
    label: "Waiting",
    icon: Clock,
    badge:
      "bg-status-pending/15 text-status-pending border border-status-pending/30",
  },
  "in-service": {
    label: "In service",
    icon: Scissors,
    badge: "bg-primary/15 text-primary border border-primary/30",
  },
  paused: {
    label: "Paused",
    icon: PauseCircle,
    badge:
      "bg-status-cancelled/15 text-status-cancelled border border-status-cancelled/30",
  },
  done: {
    label: "Done",
    icon: CheckCircle2,
    badge:
      "bg-status-confirmed/15 text-status-confirmed border border-status-confirmed/30",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    badge:
      "bg-status-cancelled/15 text-status-cancelled border border-status-cancelled/30",
  },
  "no-show": {
    label: "No-show",
    icon: XCircle,
    badge:
      "bg-on-surface-variant/15 text-on-surface-variant border border-outline-variant",
  },
};

export const STATUS_ORDER = [
  "in-service",
  "paused",
  "waiting",
  "done",
  "cancelled",
  "no-show",
];

export const CHAIR_ICON = Armchair;
