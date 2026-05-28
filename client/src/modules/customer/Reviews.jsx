"use client";

/**
 * src/modules/customer/Reviews.jsx
 * Role: customer
 * Route: /customer/reviews
 *
 * Customer reviews page — lists all reviews written by the logged-in
 * customer, allows adding (if completed & within 24h), editing (within
 * 24h of creation), and deleting (always).
 *
 * Business rules (from AGENTS.md + config/rules/booking.js):
 *  - REVIEW_EDIT_HOURS = 24  → add/edit window closes 24h after completion
 *  - canDeleteReview        → always allowed
 *  - Barber reply           → displayed read-only
 *
 * Data: src/data/customer/appointmentsData.js (MY_APPOINTMENTS)
 * Deps: lucide-react icons only, no other icon library
 */

import { useState, useMemo, useEffect } from "react";
import {
  Star,
  StarHalf,
  MessageSquare,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  CornerDownRight,
  AlertCircle,
  Plus,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA  (mirrors src/data/customer/appointmentsData.js shapes)
// Replace import once the real data layer is wired.
// ─────────────────────────────────────────────────────────────────────────────

const REVIEW_EDIT_HOURS = 24;
const REVIEW_EDIT_MS = REVIEW_EDIT_HOURS * 60 * 60 * 1000;

function hoursAgo(h) {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}
function daysAgo(d, h = 11) {
  return new Date(
    Date.now() - d * 86400 * 1000 - h * 3600 * 1000,
  ).toISOString();
}

// Completed appointments that already have a review
const INITIAL_REVIEWS = [
  {
    id: "rev-001",
    appointmentId: "bk-4001",
    barber: {
      id: "marcus-vale",
      name: "Marcus Vale",
      role: "Master Barber",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    services: ["Skin Fade", "Beard Sculpt"],
    completedAt: daysAgo(7),
    createdAt: daysAgo(7, 9), // well outside 24h edit window
    rating: 5,
    comment:
      "Sharpest fade I've had in years. Marcus is a genuine craftsman — every line is razor-precise. Already locked in my next appointment.",
    barberReply:
      "Thanks so much — always great to have you in the chair. See you next month!",
  },
  {
    id: "rev-002",
    appointmentId: "bk-4002",
    barber: {
      id: "ezra-finch",
      name: "Ezra Finch",
      role: "Head Barber",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
    services: ["Classic Cut"],
    completedAt: daysAgo(14),
    createdAt: daysAgo(14, 8),
    rating: 4,
    comment:
      "Solid cut and great conversation. Minor wait time but nothing unreasonable. Will definitely be back.",
    barberReply: null,
  },
  {
    id: "rev-003",
    appointmentId: "bk-4003",
    barber: {
      id: "lena-park",
      name: "Lena Park",
      role: "Senior Barber",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    },
    services: ["Hot Towel Shave"],
    completedAt: hoursAgo(10), // within 24h edit window
    createdAt: hoursAgo(10),
    rating: 5,
    comment:
      "Came in before a big meeting and left looking like a CEO. The straight razor technique is flawless.",
    barberReply: null,
  },
];

// Completed appointments without a review (eligible to add one within 24h)
const REVIEWABLE_APPOINTMENTS = [
  {
    id: "bk-4004",
    barber: {
      id: "marcus-vale",
      name: "Marcus Vale",
      role: "Master Barber",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    services: [{ name: "Signature Cut", price: 45 }],
    completedAt: hoursAgo(5), // within 24h
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATORS  (mirrors src/lib/validators/review.js)
// ─────────────────────────────────────────────────────────────────────────────

function canEditReview(review) {
  const msSince = Date.now() - new Date(review.createdAt).getTime();
  return msSince <= REVIEW_EDIT_MS;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function formatRelative(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days === 1) return "yesterday";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeLeft(iso) {
  const cutoff = new Date(iso).getTime() + REVIEW_EDIT_MS;
  const left = cutoff - Date.now();
  if (left <= 0) return null;
  const hrs = Math.floor(left / 3600000);
  const mins = Math.floor((left % 3600000) / 60000);
  if (hrs > 0) return `${hrs}h ${mins}m left to edit`;
  return `${mins}m left to edit`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StarDisplay({ rating, size = "md" }) {
  const sz = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <span
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sz} ${
            s <= rating
              ? "fill-status-pending text-status-pending"
              : "text-outline-variant"
          }`}
        />
      ))}
    </span>
  );
}

function RatingInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
  return (
    <div className="text-center">
      <p className="mb-3 text-sm text-on-surface-variant">
        How was your experience?
      </p>
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110 focus:outline-none focus-visible:scale-110"
            aria-label={`${s} star${s !== 1 ? "s" : ""}`}
          >
            <Star
              className={`h-9 w-9 transition-colors ${
                s <= (hovered || value)
                  ? "fill-status-pending text-status-pending"
                  : "text-outline-variant"
              }`}
            />
          </button>
        ))}
      </div>
      {(hovered || value) > 0 && (
        <p className="mt-2 text-sm font-semibold text-status-pending">
          {LABELS[hovered || value]}
        </p>
      )}
    </div>
  );
}

// Review Form Modal — used for both add and edit
function ReviewFormModal({ appt, review, onSubmit, onClose, submitting }) {
  const isEdit = !!review;
  const [rating, setRating] = useState(review?.rating ?? 0);
  const [comment, setComment] = useState(review?.comment ?? "");

  const canSubmit = rating > 0 && !submitting;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container-low shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
          <div>
            <p className="font-semibold text-on-surface">
              {isEdit ? "Edit Review" : "Leave a Review"}
            </p>
            <p className="text-xs text-on-surface-variant">
              {(appt || review)?.barber?.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Barber info chip */}
          <div className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container p-3.5">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-outline-variant">
              <img
                src={(appt || review)?.barber?.image}
                alt={(appt || review)?.barber?.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-sm text-on-surface">
                {(appt || review)?.barber?.name}
              </p>
              <p className="text-xs text-on-surface-variant">
                {appt
                  ? appt.services.map((s) => s.name).join(", ")
                  : review?.services?.join(", ")}
              </p>
            </div>
          </div>

          {/* Star rating */}
          <RatingInput value={rating} onChange={setRating} />

          {/* Comment */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Your Comments{" "}
              <span className="normal-case font-normal">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Tell others about your experience…"
              className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-outline-variant px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-outline-variant text-sm font-semibold text-on-surface transition-all hover:bg-surface-container-high disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit({ rating, comment })}
            disabled={!canSubmit}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary/30 border-t-on-primary" />
                Saving…
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Delete confirm modal
function DeleteModal({ review, onConfirm, onClose, deleting }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-outline-variant bg-surface-container-low shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-status-cancelled/30 bg-status-cancelled/10">
            <Trash2 className="h-5 w-5 text-status-cancelled" />
          </div>
          <div>
            <p className="font-semibold text-on-surface">Delete this review?</p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Your review for{" "}
              <span className="font-medium text-on-surface">
                {review?.barber?.name}
              </span>{" "}
              will be permanently removed. This can't be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3 border-t border-outline-variant px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-outline-variant text-sm font-semibold text-on-surface transition-all hover:bg-surface-container-high disabled:opacity-40"
          >
            Keep
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-status-cancelled text-sm font-semibold text-on-surface transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {deleting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Single review card
function ReviewCard({ review, onEdit, onDelete }) {
  const editable = canEditReview(review);
  const remaining = editable ? timeLeft(review.createdAt) : null;
  const [expanded, setExpanded] = useState(false);
  const longComment = review.comment?.length > 180;
  const displayComment =
    longComment && !expanded
      ? review.comment.slice(0, 180) + "…"
      : review.comment;

  return (
    <article className="rounded-2xl border border-outline-variant bg-surface-container-low overflow-hidden transition-all">
      {/* Card header */}
      <div className="flex items-start gap-4 p-5">
        {/* Barber avatar */}
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-outline-variant">
          <img
            src={review.barber.image}
            alt={review.barber.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-on-surface text-sm leading-tight">
                {review.barber.name}
              </p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {review.barber.role}
              </p>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {editable && (
                <button
                  type="button"
                  onClick={() => onEdit(review)}
                  className="flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container px-3 py-1.5 text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
              )}
              <button
                type="button"
                onClick={() => onDelete(review)}
                className="flex items-center gap-1.5 rounded-lg border border-status-cancelled/30 bg-status-cancelled/5 px-3 py-1.5 text-xs font-semibold text-status-cancelled hover:bg-status-cancelled/10 transition-colors"
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
                className="inline-flex items-center rounded-md border border-outline-variant bg-surface-container px-2 py-0.5 text-[11px] font-medium text-on-surface-variant"
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
            <span className="flex items-center gap-1 rounded-md border border-primary/20 bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary">
              <Clock className="h-2.5 w-2.5 shrink-0" />
              {remaining}
            </span>
          )}

          <span className="text-xs text-on-surface-variant">
            {formatRelative(review.createdAt)}
          </span>
        </div>
      </div>

      {/* Comment body */}
      {review.comment && (
        <div className="px-5 pb-4">
          <p className="text-sm text-on-surface leading-relaxed">
            {displayComment}
          </p>
          {longComment && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1.5 flex items-center gap-1 text-xs font-medium text-primary hover:opacity-80 transition-opacity"
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
        <div className="mx-5 mb-5 flex gap-3 rounded-xl border border-outline-variant bg-surface-container p-4">
          <CornerDownRight className="h-4 w-4 shrink-0 mt-0.5 text-on-surface-variant" />
          <div>
            <p className="text-xs font-semibold text-on-surface-variant mb-1 uppercase tracking-wide">
              Barber's Reply
            </p>
            <p className="text-sm text-on-surface leading-relaxed">
              {review.barberReply}
            </p>
          </div>
        </div>
      )}
    </article>
  );
}

// Card for a reviewable (unreviewd) appointment
function ReviewableCard({ appt, onWrite }) {
  const timeRemaining = timeLeft(appt.completedAt);
  if (!timeRemaining) return null; // window closed

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-outline-variant">
          <img
            src={appt.barber.image}
            alt={appt.barber.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-on-surface">
            {appt.barber.name}
          </p>

          <p className="mt-0.5 line-clamp-2 text-xs text-on-surface-variant">
            {appt.services.map((s) => s.name).join(", ")}
          </p>

          <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-primary">
            <Clock className="h-2.5 w-2.5 shrink-0" />
            {timeRemaining}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onWrite(appt)}
        className="flex h-10 w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-xs font-semibold text-on-primary transition-opacity hover:opacity-90 sm:w-auto"
      >
        <Plus className="h-3.5 w-3.5" />
        Write Review
      </button>
    </div>
  );
}

// Summary stats bar
function StatsBar({ reviews }) {
  if (!reviews.length) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5 flex flex-col sm:flex-row items-center gap-6">
      {/* Big average */}
      <div className="text-center shrink-0">
        <p className="font-serif text-5xl font-bold text-on-surface leading-none">
          {avg.toFixed(1)}
        </p>
        <StarDisplay rating={Math.round(avg)} />
        <p className="mt-1 text-xs text-on-surface-variant">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Distribution bars */}
      <div className="flex-1 w-full space-y-1.5">
        {dist.map(({ star, count }) => {
          const pct = reviews.length ? (count / reviews.length) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant w-4 text-right shrink-0">
                {star}
              </span>
              <Star className="h-3 w-3 shrink-0 fill-status-pending text-status-pending" />
              <div className="flex-1 h-2 rounded-full bg-surface-container overflow-hidden">
                <div
                  className="h-full rounded-full bg-status-pending transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-on-surface-variant w-4 shrink-0">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Empty state
function EmptyState({ onBrowse }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container">
        <MessageSquare className="h-7 w-7 text-on-surface-variant" />
      </div>
      <p className="font-semibold text-on-surface">No reviews yet</p>
      <p className="mt-1 max-w-xs text-sm text-on-surface-variant">
        After a completed appointment, you'll have 24 hours to leave a review
        for your barber.
      </p>
      <button
        type="button"
        onClick={onBrowse}
        className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:opacity-90 transition-opacity"
      >
        Book an Appointment
      </button>
    </div>
  );
}

// Toast
function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  const styles = {
    success:
      "border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed",
    error:
      "border-status-cancelled/30 bg-status-cancelled/10 text-status-cancelled",
    info: "border-primary/30 bg-primary/10 text-primary",
  };
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm ${
        styles[toast.type] ?? styles.info
      }`}
    >
      <span className="text-sm font-medium text-on-surface">
        {toast.message}
      </span>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-2 text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editTarget, setEditTarget] = useState(null); // review to edit
  const [writeTarget, setWriteTarget] = useState(null); // appointment to review
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  // Filter / sort state
  const [filterRating, setFilterRating] = useState(0); // 0 = all
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | rating

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  useEffect(() => {
    const t = setTimeout(() => {
      setReviews(INITIAL_REVIEWS);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  // Pending reviewable appointments (within window, no review yet)
  const pendingReviewable = useMemo(() => {
    const reviewedApptIds = new Set(reviews.map((r) => r.appointmentId));
    return REVIEWABLE_APPOINTMENTS.filter(
      (a) =>
        !reviewedApptIds.has(a.id)
        && Date.now() - new Date(a.completedAt).getTime() <= REVIEW_EDIT_MS,
    );
  }, [reviews]);

  // Filtered + sorted reviews
  const visible = useMemo(() => {
    let list = filterRating
      ? reviews.filter((r) => r.rating === filterRating)
      : reviews;
    if (sortBy === "oldest")
      list = [...list].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
    else if (sortBy === "rating")
      list = [...list].sort((a, b) => b.rating - a.rating);
    else
      list = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    return list;
  }, [reviews, filterRating, sortBy]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleSubmitReview({ rating, comment }) {
    setSubmitting(true);
    setTimeout(() => {
      if (writeTarget) {
        const newReview = {
          id: `rev-${Date.now()}`,
          appointmentId: writeTarget.id,
          barber: writeTarget.barber,
          services: writeTarget.services.map((s) => s.name),
          completedAt: writeTarget.completedAt,
          createdAt: new Date().toISOString(),
          rating,
          comment,
          barberReply: null,
        };
        setReviews((prev) => [newReview, ...prev]);
        showToast(`Review submitted — ${rating} ★. Thanks!`);
        setWriteTarget(null);
      } else if (editTarget) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === editTarget.id
              ? {
                  ...r,
                  rating,
                  comment,
                  createdAt: r.createdAt, // keep original timestamp for window calc
                }
              : r,
          ),
        );
        showToast("Review updated.");
        setEditTarget(null);
      }
      setSubmitting(false);
    }, 800);
  }

  function handleDeleteConfirm() {
    setDeleting(true);
    setTimeout(() => {
      setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleting(false);
      setDeleteTarget(null);
      showToast("Review deleted.", "info");
    }, 600);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6 pb-28 text-on-surface md:space-y-8 md:pb-8">
      {/* Page header */}
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Star className="h-4 w-4 text-primary" />
          <span className="font-label-caps text-[10px] text-on-surface-variant">
            Customer · Reviews
          </span>
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
          My Reviews
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Your feedback helps barbers improve and helps others choose with
          confidence.
        </p>
      </header>

      {loading ? (
        // Skeleton
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-2xl bg-surface-container animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Pending reviewable appointments banner */}
          {pendingReviewable.length > 0 && (
            <section className="mb-6 space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Awaiting Your Review
                </h2>
              </div>
              {pendingReviewable.map((a) => (
                <ReviewableCard key={a.id} appt={a} onWrite={setWriteTarget} />
              ))}
            </section>
          )}

          {reviews.length === 0 ? (
            <EmptyState onBrowse={() => {}} />
          ) : (
            <>
              {/* Stats */}
              <div className="mb-6">
                <StatsBar reviews={reviews} />
              </div>

              {/* Filter + sort bar */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                {/* Rating filter pills */}
                <div className="flex items-center gap-1.5">
                  {[0, 5, 4, 3, 2, 1].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() =>
                        setFilterRating(filterRating === r ? 0 : r)
                      }
                      className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all ${
                        filterRating === r
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-outline-variant text-on-surface-variant hover:border-primary/40"
                      }`}
                    >
                      {r === 0 ? (
                        "All"
                      ) : (
                        <>
                          {r}
                          <Star className="h-2.5 w-2.5 fill-current" />
                        </>
                      )}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-outline-variant bg-surface-container px-3 py-1.5 text-xs font-medium text-on-surface focus:border-primary focus:outline-none"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="rating">Highest rated</option>
                </select>
              </div>

              {/* Review count */}
              <p className="mb-4 text-xs text-on-surface-variant">
                Showing{" "}
                <span className="font-semibold text-on-surface">
                  {visible.length}
                </span>{" "}
                of {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                {filterRating > 0 && ` · filtered to ${filterRating}★`}
              </p>

              {/* Review list */}
              {visible.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <p className="font-medium text-on-surface">
                    No {filterRating}★ reviews
                  </p>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    Try a different rating filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visible.map((rev) => (
                    <ReviewCard
                      key={rev.id}
                      review={rev}
                      onEdit={setEditTarget}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {(writeTarget || editTarget) && (
        <ReviewFormModal
          appt={writeTarget}
          review={editTarget}
          onSubmit={handleSubmitReview}
          onClose={() => {
            setWriteTarget(null);
            setEditTarget(null);
          }}
          submitting={submitting}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          review={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
