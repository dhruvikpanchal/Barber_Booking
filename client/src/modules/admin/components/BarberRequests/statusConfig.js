import { CheckCircle2, Clock, XCircle } from "lucide-react";

export const REQUEST_STATUSES = {
  pending: {
    label: "Pending",
    badge: "bg-status-pending/15 text-status-pending border border-status-pending/25",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    badge: "bg-status-confirmed/15 text-status-confirmed border border-status-confirmed/25",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    badge: "bg-status-cancelled/15 text-status-cancelled border border-status-cancelled/25",
    icon: XCircle,
  },
};
