"use client";

import { useState } from "react";
import { Star, MessageSquare, X, Clock, Plus } from "lucide-react";
import { formatActivityTimestamp, formatShortDate } from "@/client/lib/format/formatDateTime.js";

const REVIEW_EDIT_HOURS = 24;

export const REVIEW_EDIT_MS = REVIEW_EDIT_HOURS * 60 * 60 * 1000;

/** Completed appointment eligible for a first-time review (matches API — no time limit). */
export function isReviewableAppointment(appointment, reviewedAppointmentIds = new Set()) {
  if (!appointment || appointment.status !== "completed") return false;
  if (appointment.reviewed) return false;
  if (reviewedAppointmentIds.has(appointment.id)) return false;
  return true;
}

/** Edit/delete allowed within 24h of posting (matches API `REVIEW_EDIT_WINDOW_MS`). */
export function canEditReview(review) {
  const msSince = Date.now() - new Date(review.createdAt).getTime();
  return msSince <= REVIEW_EDIT_MS;
}

export function formatRelative(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days >= 2) return formatShortDate(iso);
  return formatActivityTimestamp(iso).toLowerCase();
}

export function timeLeft(iso) {
  const cutoff = new Date(iso).getTime() + REVIEW_EDIT_MS;
  const left = cutoff - Date.now();
  if (left <= 0) return null;
  const hrs = Math.floor(left / 3600000);
  const mins = Math.floor((left % 3600000) / 60000);
  if (hrs > 0) return `${hrs}h ${mins}m left to edit`;
  return `${mins}m left to edit`;
}

export function StarDisplay({ rating, size = "md" }) {
  const sz = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sz} ${
            s <= rating ? "fill-status-pending text-status-pending" : "text-outline-variant"
          }`}
        />
      ))}
    </span>
  );
}

export function RatingInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
  return (
    <div className="text-center">
      <p className="text-on-surface-variant mb-3 text-sm">How was your experience?</p>
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
        <p className="text-status-pending mt-2 text-sm font-semibold">{LABELS[hovered || value]}</p>
      )}
    </div>
  );
}

export function ReviewableCard({ appt, onWrite }) {
  const completedLabel = appt.completedAt ? formatShortDate(appt.completedAt) : null;

  return (
    <div className="border-primary/20 bg-primary/5 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="border-outline-variant h-11 w-11 shrink-0 overflow-hidden rounded-xl border">
          <img
            src={appt.barber.image}
            alt={appt.barber.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-on-surface truncate text-sm font-semibold">{appt.barber.name}</p>

          <p className="text-on-surface-variant mt-0.5 line-clamp-2 text-xs">
            {appt.services.map((s) => s.name).join(", ")}
          </p>

          {completedLabel ? (
            <p className="text-on-surface-variant mt-1 flex items-center gap-1 text-[11px] font-medium">
              <Clock className="h-2.5 w-2.5 shrink-0" />
              Completed {completedLabel}
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onWrite(appt)}
        className="bg-primary text-on-primary flex h-10 w-full shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-semibold transition-opacity hover:opacity-90 sm:w-auto"
      >
        <Plus className="h-3.5 w-3.5" />
        Write Review
      </button>
    </div>
  );
}

export function StatsBar({ reviews }) {
  if (!reviews.length) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  return (
    <div className="border-outline-variant bg-surface-container-low flex flex-col items-center gap-6 rounded-2xl border p-5 sm:flex-row">
      {/* Big average */}
      <div className="shrink-0 text-center">
        <p className="text-on-surface font-serif text-5xl leading-none font-bold">
          {avg.toFixed(1)}
        </p>
        <StarDisplay rating={Math.round(avg)} />
        <p className="text-on-surface-variant mt-1 text-xs">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Distribution bars */}
      <div className="w-full flex-1 space-y-1.5">
        {dist.map(({ star, count }) => {
          const pct = reviews.length ? (count / reviews.length) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-on-surface-variant w-4 shrink-0 text-right text-xs">
                {star}
              </span>
              <Star className="fill-status-pending text-status-pending h-3 w-3 shrink-0" />
              <div className="bg-surface-container h-2 flex-1 overflow-hidden rounded-full">
                <div
                  className="bg-status-pending h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-on-surface-variant w-4 shrink-0 text-xs">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EmptyState({ onBrowse }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="border-outline-variant bg-surface-container mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border">
        <MessageSquare className="text-on-surface-variant h-7 w-7" />
      </div>
      <p className="text-on-surface font-semibold">No reviews yet</p>
      <p className="text-on-surface-variant mt-1 max-w-xs text-sm">
        After a completed appointment, you can leave a review for your barber from here or from
        My Appointments.
      </p>
      <button
        type="button"
        onClick={onBrowse}
        className="bg-primary text-on-primary mt-6 rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
      >
        Book an Appointment
      </button>
    </div>
  );
}

export function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  const styles = {
    success: "border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed",
    error: "border-status-cancelled/30 bg-status-cancelled/10 text-status-cancelled",
    info: "border-primary/30 bg-primary/10 text-primary",
  };
  return (
    <div
      className={`fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm ${
        styles[toast.type] ?? styles.info
      }`}
    >
      <span className="text-on-surface text-sm font-medium">{toast.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="text-on-surface-variant hover:text-on-surface ml-2 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
