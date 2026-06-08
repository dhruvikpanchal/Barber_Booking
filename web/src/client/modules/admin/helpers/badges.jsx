import { ConfigBadge } from "@/client/modules/shared/components/ui/ConfigBadge.jsx";
import {
  USER_STATUS_CONFIG,
  USER_ACTIVITY_CONFIG,
} from "@/client/modules/admin/constants/admin.js";
import { STATUS_CONFIG } from "@/client/modules/admin/data/barberData.js";

export function UserStatusBadge({ status }) {
  return <ConfigBadge status={status} config={USER_STATUS_CONFIG} fallbackKey="inactive" />;
}

export function BarberStatusBadge({ status }) {
  return <ConfigBadge status={status} config={STATUS_CONFIG} fallbackKey="inactive" />;
}

export function ActivityBadge({ level }) {
  const cfg = USER_ACTIVITY_CONFIG[level] ?? USER_ACTIVITY_CONFIG.low;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${cfg.bg} ${cfg.color}`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {cfg.label}
    </span>
  );
}
