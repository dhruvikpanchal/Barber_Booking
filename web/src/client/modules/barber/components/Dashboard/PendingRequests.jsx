import Link from "next/link";
import { AlertCircle, Check, ChevronRight, X } from "lucide-react";
import { formatTimeAgo, formatTimeLabel } from "@/lib/format/formatDateTime.js";
import { useHydrated } from "@/client/modules/shared/hooks/useHydrated.js";

export default function PendingRequests({ requests, onAccept, onReject }) {
  const hydrated = useHydrated();

  return (
    <section className="border-outline-variant bg-surface-container-low min-w-0 overflow-hidden rounded-xl border">
      <header className="border-outline-variant flex flex-col gap-3 border-b px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="bg-status-pending/15 text-status-pending flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10">
            <AlertCircle className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="text-on-surface font-serif text-base font-bold sm:text-lg">
              Pending requests
            </h2>
            <p className="text-on-surface-variant text-xs">
              {requests.length} waiting on your approval
            </p>
          </div>
        </div>
        <Link
          href="/barber/appointments"
          className="text-primary hover:bg-primary/10 inline-flex shrink-0 items-center gap-1 self-start rounded-md px-2 py-1 text-xs font-medium sm:self-center"
        >
          Inbox
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </header>

      {requests.length === 0 ? (
        <div className="text-on-surface-variant px-4 py-10 text-center text-sm sm:px-5">
          You’re all caught up.
        </div>
      ) : (
        <ul className="divide-outline-variant divide-y">
          {requests.map((r) => (
            <li key={r.id} className="px-4 py-3 sm:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-on-surface truncate font-medium">{r.customer}</p>
                  <p className="text-on-surface-variant truncate text-xs">
                    {r.service} · {formatTimeLabel(r.startAt)} · ${r.price}
                  </p>
                  <p className="text-on-surface-variant mt-0.5 text-[11px]">
                    requested {hydrated ? formatTimeAgo(r.requestedAt) : "recently"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center justify-end gap-1.5 sm:pt-0.5">
                  <button
                    type="button"
                    onClick={() => onReject?.(r.id)}
                    className="border-outline-variant text-on-surface-variant hover:bg-status-cancelled/10 hover:text-status-cancelled inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors"
                    aria-label="Reject"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onAccept?.(r.id)}
                    className="bg-primary text-on-primary hover:bg-primary/90 inline-flex h-9 items-center gap-1 rounded-md px-3 text-xs font-bold transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden />
                    <span>Accept</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
