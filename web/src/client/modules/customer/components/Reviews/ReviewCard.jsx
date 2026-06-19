"use client";

import { useState } from "react";
import { Pencil, Trash2, Clock, ChevronDown, ChevronUp, CornerDownRight } from "lucide-react";

import BarberImage from "@/client/modules/customer/components/shared/BarberImage.jsx";
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

  const longComment = review.comment?.length > 120;

  return (
    <article className="border-outline-variant bg-surface-container-low overflow-hidden rounded-xl border transition-all">
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <BarberImage
          src={review.barber.image}
          name={review.barber.name}
          className="h-10 w-10 rounded-lg sm:h-12 sm:w-12"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-on-surface truncate text-sm font-semibold">{review.barber.name}</p>

              <p className="text-on-surface-variant text-xs">{review.barber.role}</p>
            </div>

            {editable && (
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(review)}
                  className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high flex items-center gap-1 rounded-lg border p-2 text-xs font-semibold transition-colors sm:px-3 sm:py-1.5"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(review)}
                  className="border-status-cancelled/30 bg-status-cancelled/5 text-status-cancelled hover:bg-status-cancelled/10 flex items-center gap-1 rounded-lg border p-2 text-xs font-semibold transition-colors sm:px-3 sm:py-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Services */}
          {review.services?.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {review.services.slice(0, 3).map((service) => (
                <span
                  key={service}
                  className="border-outline-variant bg-surface-container text-on-surface-variant inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium"
                >
                  {service}
                </span>
              ))}

              {review.services.length > 3 && (
                <span className="text-on-surface-variant text-[11px]">
                  +{review.services.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rating & Date */}
      <div className="flex flex-col gap-2 px-4 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <StarDisplay rating={review.rating} />

        <div className="flex flex-wrap items-center gap-2">
          {remaining && (
            <span className="border-primary/20 bg-primary/10 text-primary flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium">
              <Clock className="h-3 w-3" />
              {remaining}
            </span>
          )}

          <span className="text-on-surface-variant text-xs">
            {formatRelative(review.createdAt)}
          </span>
        </div>
      </div>

      {/* Comment */}
      {review.comment && (
        <div className="px-4 pb-4">
          <p
            className={`text-on-surface text-sm leading-relaxed ${!expanded ? "line-clamp-3" : ""}`}
          >
            {review.comment}
          </p>

          {longComment && (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="text-primary mt-1 flex items-center gap-1 text-xs font-medium hover:opacity-80"
            >
              {expanded ? (
                <>
                  Show less
                  <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  Read more
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Barber Reply */}
      {review.barberReply && (
        <div className="border-outline-variant bg-surface-container mx-4 mb-4 flex gap-2 rounded-lg border p-3">
          <CornerDownRight className="text-on-surface-variant mt-0.5 h-4 w-4 shrink-0" />

          <div className="min-w-0">
            <p className="text-on-surface-variant mb-1 text-[11px] font-semibold tracking-wide uppercase">
              Barber Reply
            </p>

            <p className="text-on-surface text-sm leading-relaxed">{review.barberReply}</p>
          </div>
        </div>
      )}
    </article>
  );
}
