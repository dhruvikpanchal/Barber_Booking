import { TYPE_META } from "../../constants/notificationsConstants.js";

export default function StatsBar({ notifications }) {
  const counts = {
    booking_request: notifications.filter((n) => n.type === "booking_request" && !n.read).length,
    modification: notifications.filter((n) => n.type === "modification" && !n.read).length,
    review: notifications.filter((n) => n.type === "review" && !n.read).length,
    cancellation: notifications.filter((n) => n.type === "cancellation" && !n.read).length,
  };

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Object.entries(counts).map(([type, count]) => {
        const meta = TYPE_META[type];
        const Icon = meta.icon;
        return (
          <div
            key={type}
            className={`rounded-lg border ${meta.border} ${meta.bg} flex items-center gap-3 px-4 py-3`}
          >
            <div
              className={`bg-surface-container-lowest flex h-8 w-8 shrink-0 items-center justify-center rounded-md`}
            >
              <Icon className={`h-4 w-4 ${meta.color}`} />
            </div>
            <div>
              <p className={`text-xl font-bold ${meta.color}`}>{count}</p>
              <p className="text-on-surface-variant text-[10px] leading-tight">
                {meta.filterLabel}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
