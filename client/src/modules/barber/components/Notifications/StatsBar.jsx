import { TYPE_META } from "../../../../constants/barber/notifications.js";

export default function StatsBar({ notifications }) {
  const counts = {
    booking_request: notifications.filter(
      (n) => n.type === "booking_request" && !n.read,
    ).length,
    modification: notifications.filter(
      (n) => n.type === "modification" && !n.read,
    ).length,
    review: notifications.filter((n) => n.type === "review" && !n.read).length,
    cancellation: notifications.filter(
      (n) => n.type === "cancellation" && !n.read,
    ).length,
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {Object.entries(counts).map(([type, count]) => {
        const meta = TYPE_META[type];
        const Icon = meta.icon;
        return (
          <div
            key={type}
            className={`rounded-lg border ${meta.border} ${meta.bg} px-4 py-3 flex items-center gap-3`}
          >
            <div
              className={`w-8 h-8 rounded-md bg-surface-container-lowest flex items-center justify-center shrink-0`}
            >
              <Icon className={`w-4 h-4 ${meta.color}`} />
            </div>
            <div>
              <p className={`text-xl font-bold ${meta.color}`}>{count}</p>
              <p className="text-[10px] text-on-surface-variant leading-tight">
                {meta.filterLabel}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
