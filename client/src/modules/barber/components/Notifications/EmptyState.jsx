import { BellOff } from "lucide-react";
import { TYPE_META } from "../../../../constants/barber/notifications.js";

export default function EmptyState({ filter }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-14 h-14 rounded-full bg-surface-container border border-outline-variant
          flex items-center justify-center mb-4"
      >
        <BellOff className="w-6 h-6 text-on-surface-variant" />
      </div>
      <p className="text-sm font-semibold text-on-surface">No notifications</p>
      <p className="text-xs text-on-surface-variant mt-1 max-w-xs">
        {filter === "all"
          ? "You're all caught up. New activity will appear here."
          : `No ${TYPE_META[filter]?.filterLabel.toLowerCase() || filter} at the moment.`}
      </p>
    </div>
  );
}
