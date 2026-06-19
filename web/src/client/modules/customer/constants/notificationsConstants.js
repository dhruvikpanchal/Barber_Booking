import { CalendarCheck, CalendarClock, CalendarX, RefreshCw, Star, CalendarRange } from "lucide-react";

export const APPOINTMENT_TYPES = [
  "booking_confirmed",
  "booking_reminder",
  "booking_cancelled",
  "booking_rescheduled",
];

export const TYPE_META = {
  booking_confirmed: {
    icon: CalendarCheck,
    label: "Confirmed",
    color: "text-status-confirmed",
    bg: "bg-status-confirmed/10",
    border: "border-status-confirmed/20",
    dot: "bg-status-confirmed",
    filterLabel: "Confirmed",
  },
  booking_reminder: {
    icon: CalendarClock,
    label: "Reminder",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    dot: "bg-primary",
    filterLabel: "Reminders",
  },
  booking_cancelled: {
    icon: CalendarX,
    label: "Cancelled",
    color: "text-status-cancelled",
    bg: "bg-status-cancelled/10",
    border: "border-status-cancelled/20",
    dot: "bg-status-cancelled",
    filterLabel: "Cancelled",
  },
  booking_rescheduled: {
    icon: CalendarRange,
    label: "Rescheduled",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    dot: "bg-primary",
    filterLabel: "Rescheduled",
  },
  service_change: {
    icon: RefreshCw,
    label: "Service update",
    color: "text-status-pending",
    bg: "bg-status-pending/10",
    border: "border-status-pending/20",
    dot: "bg-status-pending",
    filterLabel: "Updates",
  },
  review_request: {
    icon: Star,
    label: "Review",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    dot: "bg-yellow-400",
    filterLabel: "Reviews",
  },
};

export const FILTERS = [
  { id: "all", label: "All" },
  {
    id: "appointments",
    label: "Appointments",
    types: APPOINTMENT_TYPES,
  },
  { id: "service_change", label: "Updates" },
  { id: "review_request", label: "Reviews" },
];
