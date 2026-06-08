"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { RatingInput } from "@/client/modules/customer/components/Reviews/Primitives.jsx";
import Modal from "@/client/modules/shared/components/ui/Modal";

export function ReviewFormModal({ appt, review, onSubmit, onClose, submitting }) {
  const isEdit = !!review;
  const [rating, setRating] = useState(review?.rating ?? 0);
  const [comment, setComment] = useState(review?.comment ?? "");

  const canSubmit = rating > 0 && !submitting;

  return (
    <Modal
      open={Boolean(appt || review)}
      onClose={onClose}
      size="md"
      backdropClassName="bg-black/60 backdrop-blur-sm"
      panelClassName="border-outline-variant bg-surface-container-low rounded-2xl border shadow-2xl"
    >
        {/* Header */}
        <div className="border-outline-variant flex items-center justify-between border-b px-5 py-4">
          <div>
            <p className="text-on-surface font-semibold">
              {isEdit ? "Edit Review" : "Leave a Review"}
            </p>
            <p className="text-on-surface-variant text-xs">{(appt || review)?.barber?.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {/* Barber info chip */}
          <div className="border-outline-variant bg-surface-container flex items-center gap-3 rounded-xl border p-3.5">
            <div className="border-outline-variant h-10 w-10 shrink-0 overflow-hidden rounded-lg border">
              <img
                src={(appt || review)?.barber?.image}
                alt={(appt || review)?.barber?.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-on-surface text-sm font-semibold">
                {(appt || review)?.barber?.name}
              </p>
              <p className="text-on-surface-variant text-xs">
                {appt ? appt.services.map((s) => s.name).join(", ") : review?.services?.join(", ")}
              </p>
            </div>
          </div>

          {/* Star rating */}
          <RatingInput value={rating} onChange={setRating} />

          {/* Comment */}
          <div>
            <label className="text-on-surface-variant mb-1.5 block text-xs font-semibold tracking-wide uppercase">
              Your Comments <span className="font-normal normal-case">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Tell others about your experience…"
              className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm transition-colors focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-outline-variant flex gap-3 border-t px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="border-outline-variant text-on-surface hover:bg-surface-container-high flex h-11 flex-1 items-center justify-center rounded-xl border text-sm font-semibold transition-all disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit({ rating, comment })}
            disabled={!canSubmit}
            className="bg-primary text-on-primary flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (
              <>
                <span className="border-on-primary/30 border-t-on-primary h-4 w-4 animate-spin rounded-full border-2" />
                Saving…
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
    </Modal>
  );
}
