import {
  Activity,
  Ban,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Edit3,
  Scissors,
  User,
} from "lucide-react";

export const ACCOUNT_STATUS_CONFIG = {
  active: {
    label: "Active",
    badge:
      "bg-status-confirmed/15 text-status-confirmed border border-status-confirmed/25",
    dot: "bg-status-confirmed",
    icon: CheckCircle2,
    description: "Barber can log in, accept bookings, and appear in search.",
  },
  inactive: {
    label: "Inactive",
    badge:
      "bg-surface-container-high text-on-surface-variant border border-outline-variant",
    dot: "bg-outline",
    icon: Clock,
    description: "Profile hidden from customers; login may be restricted.",
  },
  suspended: {
    label: "Suspended",
    badge:
      "bg-status-cancelled/15 text-status-cancelled border border-status-cancelled/25",
    dot: "bg-status-cancelled",
    icon: Ban,
    description: "Account suspended by admin — no bookings until restored.",
  },
};

export const ACTIVITY_ICONS = {
  account: User,
  profile: Edit3,
  services: Scissors,
  appointment: CalendarCheck,
  status: Activity,
};
