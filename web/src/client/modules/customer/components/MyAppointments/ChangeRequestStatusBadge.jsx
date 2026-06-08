import { Check, RefreshCw, X } from "lucide-react";

const STYLES = {
  pending: {
    icon: RefreshCw,
    label: "Pending",
    className:
      "border-status-pending/30 bg-status-pending/15 text-status-pending",
  },
  accepted: {
    icon: Check,
    label: "Approved",
    className:
      "border-status-confirmed/30 bg-status-confirmed/15 text-status-confirmed",
  },
  rejected: {
    icon: X,
    label: "Rejected",
    className:
      "border-status-cancelled/30 bg-status-cancelled/15 text-status-cancelled",
  },
};

export default function ChangeRequestStatusBadge({ status, className = "" }) {
  const meta = STYLES[status];
  if (!meta) return null;
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase sm:text-xs ${meta.className} ${className}`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden />
      {meta.label}
    </span>
  );
}
