import { RefreshCw } from "lucide-react";

export default function ChangeRequestPendingBadge({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-status-pending/30 bg-status-pending/15 px-2.5 py-1 text-[10px] font-bold tracking-wide text-status-pending uppercase sm:text-xs ${className}`}
    >
      <RefreshCw className="h-3 w-3 shrink-0" aria-hidden />
      Change Request Pending
    </span>
  );
}
