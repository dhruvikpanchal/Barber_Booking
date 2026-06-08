"use client";

import { useState } from "react";
import { Pencil, Trash2, Clock, ChevronDown, ChevronUp, CornerDownRight } from "lucide-react";
import {
  canEditReview,
  formatRelative,
  timeLeft,
  StarDisplay,
} from "@/client/modules/customer/components/Reviews/Primitives.jsx";

export function ReviewCard({ review, onEdit, onDelete }) {
  const editable = canEditReview(review);
  const remaining = editable ? timeLeft(review.createdAt) : null;
  const [expanded, setExpanded] = useState(false);
  const longComment = review.comment?.length > 180;
  const displayComment =
    longComment && !expanded ? review.comment.slice(0, 180) + "…" : review.comment;

  return (
    <article className="border-outline-variant bg-surface-container-low overflow-hidden rounded-2xl border transition-all">
      {/* Card header */}
      <div className="flex items-start gap-4 p-5">
        {/* Barber avatar */}
        <div className="border-outline-variant h-12 w-12 shrink-0 overflow-hidden rounded-xl border">
          <img
            src={review.barber.image}
            alt={review.barber.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-on-surface text-sm leading-tight font-semibold">
                {review.barber.name}
              </p>
              <p className="text-on-surface-variant mt-0.5 text-xs">{review.barber.role}</p>
            </div>
            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              {editable && (
                <button
                  type="button"
                  onClick={() => onEdit(review)}
                  className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
              )}
              <button
                type="button"
                onClick={() => onDelete(review)}
                className="border-status-cancelled/30 bg-status-cancelled/5 text-status-cancelled hover:bg-status-cancelled/10 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          </div>

          {/* Services chips */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {review.services.map((s) => (
              <span
                key={s}
                className="border-outline-variant bg-surface-container text-on-surface-variant inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Rating + date row */}
      <div className="flex flex-col gap-2 px-5 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <StarDisplay rating={review.rating} />

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {remaining && (
            <span className="border-primary/20 bg-primary/8 text-primary flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium">
              <Clock className="h-2.5 w-2.5 shrink-0" />
              {remaining}
            </span>
          )}

          <span className="text-on-surface-variant text-xs">
            {formatRelative(review.createdAt)}
          </span>
        </div>
      </div>

      {/* Comment body */}
      {review.comment && (
        <div className="px-5 pb-4">
          <p className="text-on-surface text-sm leading-relaxed">{displayComment}</p>
          {longComment && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-primary mt-1.5 flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-80"
            >
              {expanded ? (
                <>
                  Show less <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Read more <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Barber reply */}
      {review.barberReply && (
        <div className="border-outline-variant bg-surface-container mx-5 mb-5 flex gap-3 rounded-xl border p-4">
          <CornerDownRight className="text-on-surface-variant mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="text-on-surface-variant mb-1 text-xs font-semibold tracking-wide uppercase">
              Barber's Reply
            </p>
            <p className="text-on-surface text-sm leading-relaxed">{review.barberReply}</p>
          </div>
        </div>
      )}
    </article>
  );
}
