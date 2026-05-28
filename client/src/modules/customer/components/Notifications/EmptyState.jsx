import { BellOff } from "lucide-react";
import { FILTERS } from "@/constants/customer/notifications.js";

export default function EmptyState({ filter }) {
  const filterMeta = FILTERS.find((f) => f.id === filter);
  const label = filterMeta?.label?.toLowerCase() ?? filter;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-outline-variant bg-surface-container">
        <BellOff className="h-6 w-6 text-on-surface-variant" />
      </div>
      <p className="text-sm font-semibold text-on-surface">No notifications</p>
      <p className="mt-1 max-w-xs text-xs text-on-surface-variant">
        {filter === "all"
          ? "You're all caught up. Booking updates and reminders will appear here."
          : `No ${label} notifications at the moment.`}
      </p>
    </div>
  );
}
