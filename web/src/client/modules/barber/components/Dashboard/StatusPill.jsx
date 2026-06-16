import { STATUSES } from "../../constants/statusConstants";

export default function StatusPill({ status, className = "" }) {
  const s = STATUSES[status] ?? STATUSES.upcoming;
  const Icon = s.icon;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${s.badge} ${className}`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {s.label}
    </span>
  );
}
