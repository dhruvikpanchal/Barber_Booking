import {
  TYPE_META,
  APPOINTMENT_TYPES,
} from "@/client/modules/customer/constants/notificationsConstants.js";

const STAT_GROUPS = [
  { key: "appointments", types: APPOINTMENT_TYPES, metaKey: "booking_confirmed" },
  { key: "service_change", types: ["service_change"], metaKey: "service_change" },
  { key: "review_request", types: ["review_request"], metaKey: "review_request" },
];

export default function StatsBar({ notifications }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {STAT_GROUPS.map(({ key, types, metaKey }) => {
        const meta = TYPE_META[metaKey];
        const Icon = meta.icon;
        const count = notifications.filter((n) => types.includes(n.type) && !n.read).length;

        return (
          <div
            key={key}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${meta.border} ${meta.bg}`}
          >
            <div className="bg-surface-container-lowest flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
              <Icon className={`h-4 w-4 ${meta.color}`} />
            </div>
            <div>
              <p className={`text-xl font-bold ${meta.color}`}>{count}</p>
              <p className="text-on-surface-variant text-[10px] leading-tight">
                {key === "appointments" ? "Appointments" : meta.filterLabel}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
