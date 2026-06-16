import { Ban, Eye, ShieldCheck, Star, Store } from "lucide-react";
import { BarberStatusBadge } from "@/client/modules/shared/components/ui/badges.jsx";

/** Compact mobile-only card — desktop uses BarberTableRow. */
export default function BarberCard({ barber, onAction }) {
  return (
    <article className="border-outline-variant bg-surface-container-low rounded-lg border p-3">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="bg-primary/20 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-serif text-sm font-bold">
            {barber.initials}
          </div>
          <div className="min-w-0">
            <p className="text-on-surface truncate text-sm font-semibold">{barber.name}</p>
            <p className="text-on-surface-variant truncate text-xs">{barber.email}</p>

            <div className="mt-1">
              <p className="text-on-surface-variant flex items-center gap-1 truncate text-xs">
                <Store className="h-3 w-3 shrink-0" aria-hidden />
                {barber.shop.name}
              </p>
              <p className="text-on-surface-variant truncate text-[11px]">{barber.shop.city}</p>
            </div>

            <div className="text-on-surface-variant mt-2 flex items-center gap-1.5 text-xs">
              <Star className="fill-primary text-primary h-3 w-3" aria-hidden />
              <span className="text-on-surface font-semibold">{barber.rating.toFixed(1)}</span>
              <span className="text-on-surface-variant">· {barber.reviewCount} reviews</span>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <BarberStatusBadge status={barber.status} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onAction("view", barber)}
          className="border-outline-variant text-on-surface hover:bg-surface-container inline-flex h-9 items-center justify-center gap-1.5 rounded-md border text-xs font-semibold transition-colors"
        >
          <Eye className="h-3.5 w-3.5 shrink-0" aria-hidden />
          View
        </button>

        {barber.status === "disabled" ? (
          <button
            type="button"
            onClick={() => onAction("enable", barber)}
            className="border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed hover:bg-status-confirmed/20 inline-flex h-9 items-center justify-center gap-1.5 rounded-md border text-xs font-semibold transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Enable
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onAction("disable", barber)}
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
