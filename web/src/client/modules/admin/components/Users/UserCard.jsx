import { Ban, Eye, ShieldCheck } from "lucide-react";
import { ActivityBadge, UserStatusBadge } from "@/client/modules/shared/components/ui/badges.jsx";
import { formatRelativeAge } from "@/client/lib/format/formatDateTime.js";

/** Compact mobile-only card — desktop uses UserTableRow. */
export default function UserCard({ user, onAction }) {
  return (
    <article className="border-outline-variant bg-surface-container-low rounded-lg border p-3">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="bg-primary/20 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-serif text-sm font-bold">
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="text-on-surface truncate text-sm font-semibold">{user.name}</p>
            <p className="text-on-surface-variant truncate text-xs">{user.email}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <ActivityBadge level={user.activity} />
              <span className="text-on-surface-variant text-[11px]">
                {formatRelativeAge(user.lastActive)}
              </span>
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <UserStatusBadge status={user.status} />
        </div>
      </div>

      <div className="border-outline-variant bg-surface-container mt-2.5 rounded-lg border px-3 py-2">
        <p className="font-label-caps text-on-surface-variant text-[10px]">Bookings</p>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <p className="text-on-surface font-serif text-lg font-bold">{user.bookingsTotal}</p>
          <p className="text-on-surface-variant text-[10px]">{user.bookingsThisMonth} this month</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onAction("view", user)}
          className="border-outline-variant text-on-surface hover:bg-surface-container inline-flex h-9 items-center justify-center gap-1.5 rounded-md border text-xs font-semibold transition-colors"
        >
          <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
          View
        </button>
        {user.status === "disabled" ? (
          <button
            type="button"
            onClick={() => onAction("enable", user)}
            className="border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed hover:bg-status-confirmed/20 inline-flex h-9 items-center justify-center gap-1.5 rounded-md border text-xs font-semibold transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Enable
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onAction("disable", user)}
            className="border-status-pending/30 bg-status-pending/10 text-status-pending hover:bg-status-pending/20 inline-flex h-9 items-center justify-center gap-1.5 rounded-md border text-xs font-semibold transition-colors"
          >
            <Ban className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Disable
          </button>
        )}
      </div>
    </article>
  );
}
