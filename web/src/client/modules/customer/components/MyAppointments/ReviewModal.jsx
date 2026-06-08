"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import Modal from "@/client/modules/shared/components/ui/Modal";

export default function ReviewModal({ appt, onSubmit, onClose, submitting }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");

  const canSubmit = rating > 0;

  const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  if (!appt) return null;

  return (
    <Modal
      open
      onClose={onClose}
      size="md"
      backdropClassName="bg-black/60 backdrop-blur-sm"
      panelClassName="rounded-2xl border border-outline-variant bg-surface-container-low shadow-2xl"
    >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
          <div>
            <p className="font-semibold text-on-surface">Leave a Review</p>
            <p className="text-xs text-on-surface-variant">
              {appt.barber.name}
              {appt.shop?.name ? ` · ${appt.shop.name.replace("Iron & Oak — ", "")}` : ""}
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

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Barber info */}
          <div className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container p-3.5">
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-outline-variant">
              <img src={appt.barber.image} alt={appt.barber.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="font-semibold text-on-surface">{appt.barber.name}</p>
              <p className="text-xs text-on-surface-variant">
                {appt.services.map((s) => s.name).join(", ")}
              </p>
            </div>
          </div>

          {/* Star rating */}
          <div className="text-center">
            <p className="mb-3 text-sm text-on-surface-variant">How was your experience?</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-9 w-9 transition-colors ${
                      star <= (hovered || rating)
                        ? "fill-status-pending text-status-pending"
                        : "text-outline-variant"
                    }`}
                  />
                </button>
              ))}
            </div>
            {(hovered || rating) > 0 && (
              <p className="mt-2 text-sm font-semibold text-status-pending">
                {LABELS[hovered || rating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Your Comments (optional)
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
            Skip
          </button>
          <button
            type="button"
            onClick={() => onSubmit({ rating, comment })}
            disabled={!canSubmit || submitting}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary/30 border-t-on-primary" />
                Submitting…
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
    </Modal>
  );
}
