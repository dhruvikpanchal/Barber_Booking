import Link from "next/link";
import { ThumbsUp, Flag, Reply, ChevronRight } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import { formatShortDate } from "@/client/lib/format/formatDateTime.js";
import { StarRow } from "@/client/modules/shared/components/ui/StarRow.jsx";

export function ReviewCard({ review, onReply, onReport }) {
  const hasReply = Boolean(review.reply);

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-outline-variant bg-surface-container-low p-5 transition-colors hover:border-outline">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <Link
          href={routes.barber.reviewsDetail(review.id)}
          className="flex min-w-0 items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 font-serif text-sm font-bold text-primary">
            {review.customer.initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-on-surface">
              {review.customer.name}
            </p>
            <p className="text-xs text-on-surface-variant">
              {review.service} · {formatShortDate(review.date)}
            </p>
          </div>
        </Link>
        <StarRow rating={review.rating} size="sm" />
      </div>

      {/* Review text */}
      <p className="text-sm leading-relaxed text-on-surface-variant">
        "{review.text}"
      </p>

      {/* Barber reply */}
      {review.reply && (
        <div className="rounded-lg border border-outline-variant bg-surface-container px-4 py-3">
          <p className="font-label-caps mb-1 text-primary">Your reply</p>
          <p className="text-sm text-on-surface-variant">{review.reply}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-outline-variant pt-3 flex-wrap">
        <div className="flex items-center gap-1">
          {!hasReply ? (
            <button
              type="button"
              onClick={() => onReply(review)}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
            >
              <Reply className="h-3.5 w-3.5" aria-hidden />
              Reply
            </button>
          ) : null}
          <Link
            href={routes.barber.reviewsDetail(review.id)}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
          >
            View
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <button
            onClick={() => onReport(review.id)}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-error"
          >
            <Flag className="h-3.5 w-3.5" aria-hidden />
            Report
          </button>
        </div>
      </div>
    </article>
  );
}
