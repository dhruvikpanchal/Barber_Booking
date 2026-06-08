import { CalendarPlus, CalendarClock, Star, CalendarX } from "lucide-react";

export const TYPE_META = {
  booking_request: {
    icon: CalendarPlus,
    label: "Booking Request",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    dot: "bg-primary",
    filterLabel: "Booking Requests",
  },
  modification: {
    icon: CalendarClock,
    label: "Updates",
    color: "text-status-pending",
    bg: "bg-status-pending/10",
    border: "border-status-pending/20",
    dot: "bg-status-pending",
    filterLabel: "Updates",
  },
  review: {
    icon: Star,
    label: "Review",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    dot: "bg-yellow-400",
    filterLabel: "Reviews",
  },
  cancellation: {
    icon: CalendarX,
    label: "Cancelled",
    color: "text-status-cancelled",
    bg: "bg-status-cancelled/10",
    border: "border-status-cancelled/20",
    dot: "bg-status-cancelled",
    filterLabel: "Cancelled",
  },
};

export const FILTERS = [
  { id: "all", label: "All" },
  { id: "booking_request", label: "Bookings" },
  { id: "modification", label: "Updates" },
  { id: "review", label: "Reviews" },
  { id: "cancellation", label: "Cancelled" },
];
