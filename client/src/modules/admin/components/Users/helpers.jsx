import { Star } from "lucide-react";
import {
  USER_STATUS_CONFIG,
  USER_ACTIVITY_CONFIG,
} from "@/constants/admin/admin.js";

export function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function fmtRelative(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function StatusBadge({ status }) {
  const cfg = USER_STATUS_CONFIG[status] ?? USER_STATUS_CONFIG.inactive;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} aria-hidden />
      {cfg.label}
    </span>
  );
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

export function MiniStars({ rating }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`h-3 w-3 ${n <= Math.round(rating) ? "fill-primary text-primary" : "fill-transparent text-outline"}`}
          aria-hidden
        />
      ))}
    </span>
  );
}
