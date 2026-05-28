import { Ban, Eye, ShieldCheck } from "lucide-react";
import { ActivityBadge, fmtRelative, StatusBadge } from "./helpers.jsx";

/** Compact mobile-only card — desktop uses UserTableRow. */
export default function UserCard({ user, onAction }) {
  return (
    <article className="rounded-lg border border-outline-variant bg-surface-container-low p-3">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 font-serif text-sm font-bold text-primary">
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-on-surface">
              {user.name}
            </p>
            <p className="truncate text-xs text-on-surface-variant">
              {user.email}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <ActivityBadge level={user.activity} />
              <span className="text-[11px] text-on-surface-variant">
                {fmtRelative(user.lastActive)}
              </span>
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <StatusBadge status={user.status} />
        </div>
      </div>

      <div className="mt-2.5 rounded-lg border border-outline-variant bg-surface-container px-3 py-2">
        <p className="font-label-caps text-[10px] text-on-surface-variant">
          Bookings
        </p>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <p className="font-serif text-lg font-bold text-on-surface">
            {user.bookingsTotal}
          </p>
          <p className="text-[10px] text-on-surface-variant">
            {user.bookingsThisMonth} this month
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onAction("view", user)}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-outline-variant text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container"
        >
          <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
          View
        </button>
        {user.status === "disabled" ? (
          <button
            type="button"
            onClick={() => onAction("enable", user)}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-status-confirmed/30 bg-status-confirmed/10 text-xs font-semibold text-status-confirmed transition-colors hover:bg-status-confirmed/20"
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Enable
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onAction("disable", user)}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-status-pending/30 bg-status-pending/10 text-xs font-semibold text-status-pending transition-colors hover:bg-status-pending/20"
          >
            <Ban className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Disable
          </button>
        )}
      </div>
    </article>
  );
}
