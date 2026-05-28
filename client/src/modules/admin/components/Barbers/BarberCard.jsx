import { Ban, Eye, ShieldCheck, Star, Store } from "lucide-react";
import { StatusBadge } from "./helpers.jsx";

/** Compact mobile-only card — desktop uses BarberTableRow. */
export default function BarberCard({ barber, onAction }) {
  return (
    <article className="rounded-lg border border-outline-variant bg-surface-container-low p-3">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 font-serif text-sm font-bold text-primary">
            {barber.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-on-surface">
              {barber.name}
            </p>
            <p className="truncate text-xs text-on-surface-variant">
              {barber.email}
            </p>

            <div className="mt-1">
              <p className="flex items-center gap-1 truncate text-xs text-on-surface-variant">
                <Store className="h-3 w-3 shrink-0" aria-hidden />
                {barber.shop.name}
              </p>
              <p className="truncate text-[11px] text-on-surface-variant">
                {barber.shop.city}
              </p>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-xs text-on-surface-variant">
              <Star
                className="h-3 w-3 fill-primary text-primary"
                aria-hidden
              />
              <span className="font-semibold text-on-surface">
                {barber.rating.toFixed(1)}
              </span>
              <span className="text-on-surface-variant">
                · {barber.reviewCount} reviews
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <StatusBadge status={barber.status} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onAction("view", barber)}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-outline-variant text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container"
        >
          <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
          View
        </button>

        {barber.status === "disabled" ? (
          <button
            type="button"
            onClick={() => onAction("enable", barber)}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-status-confirmed/30 bg-status-confirmed/10 text-xs font-semibold text-status-confirmed transition-colors hover:bg-status-confirmed/20"
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Enable
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onAction("disable", barber)}
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
