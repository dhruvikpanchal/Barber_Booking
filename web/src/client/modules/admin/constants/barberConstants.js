import { CheckCircle2, XCircle, Clock } from "lucide-react";

export const STATUS_CONFIG = {
  active: {
    label: "Active",
    badge: "bg-status-confirmed/15 text-status-confirmed",
    dot: "bg-status-confirmed",
    icon: CheckCircle2,
  },
  inactive: {
    label: "Inactive",
    badge: "bg-outline-variant/60 text-on-surface-variant",
    dot: "bg-outline",
    icon: Clock,
  },
  disabled: {
    label: "Disabled",
    badge: "bg-status-cancelled/15 text-status-cancelled",
    dot: "bg-status-cancelled",
    icon: XCircle,
  },
};

export const SORT_OPTIONS = [
  { key: "name_asc", label: "Name A–Z" },
  { key: "name_desc", label: "Name Z–A" },
  { key: "rating_desc", label: "Highest Rated" },
  { key: "rating_asc", label: "Lowest Rated" },
  { key: "reviews_desc", label: "Most Reviews" },
  { key: "appts_desc", label: "Most Appointments" },
  { key: "joined_desc", label: "Newest Joined" },
  { key: "joined_asc", label: "Oldest Joined" },
];

export const PAGE_SIZE = 6;
