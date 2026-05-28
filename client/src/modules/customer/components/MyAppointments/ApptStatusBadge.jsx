import {
  Clock,
  CalendarCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-status-pending/15 text-status-pending border border-status-pending/30",
  },
  confirmed: {
    label: "Confirmed",
    icon: CalendarCheck,
    className: "bg-primary/15 text-primary border border-primary/30",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-status-confirmed/15 text-status-confirmed border border-status-confirmed/30",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-status-cancelled/15 text-status-cancelled border border-status-cancelled/30",
  },
};

export default function ApptStatusBadge({ status, size = "md" }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const sizeClass = size === "sm"
    ? "px-2 py-0.5 text-[10px] gap-1"
    : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${sizeClass} ${cfg.className}`}>
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden />
      {cfg.label}
    </span>
  );
}
