import { STATUSES } from "../../../../constants/barber/walk_In";

export default function StatusBadge({ status }) {
  const config = STATUSES[status] ?? STATUSES.waiting;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.badge}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {config.label}
    </span>
  );
}
