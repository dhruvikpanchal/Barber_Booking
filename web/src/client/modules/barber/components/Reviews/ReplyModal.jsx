"use client";

import { X, Check, Lock } from "lucide-react";
import { useState } from "react";
import { formatShortDate } from "@/client/lib/format/formatDateTime.js";
import Modal from "@/client/modules/shared/components/ui/Modal";

const MAX_LENGTH = 500;

/**
 * Single-reply only — cannot edit or delete after posting.
 * @param {{ review: object, onClose: () => void, onSubmit: (id: string, text: string) => void }} props
 */
export function ReplyModal({ review, onClose, onSubmit }) {
  const [text, setText] = useState("");

  const canReply = review && !review.hasReply && !review.reply;

  if (!canReply) return null;

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      labelledBy="reply-modal-title"
      panelClassName="space-y-4 rounded-xl border border-outline-variant bg-surface-container p-5 shadow-2xl"
    >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3
              id="reply-modal-title"
              className="font-serif text-lg font-bold text-on-surface"
            >
              Reply to review
            </h3>
            <p className="mt-0.5 text-sm text-on-surface-variant">
              {review.customer.name} · {formatShortDate(review.date)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-high"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <p className="inline-flex items-start gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-xs text-on-surface-variant">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
          You can post one reply per review. It cannot be edited or deleted after
          submission.
        </p>

        <blockquote className="rounded-lg border-l-2 border-primary/40 bg-surface-container-low py-2 pr-3 pl-3 text-sm italic text-on-surface-variant">
          &ldquo;{review.text}&rdquo;
        </blockquote>

        <div>
          <label
            htmlFor="barber-reply-text"
            className="font-label-caps mb-1.5 block text-on-surface-variant"
          >
            Your response
          </label>
          <textarea
            id="barber-reply-text"
            rows={4}
            value={text}
            maxLength={MAX_LENGTH}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a professional, grateful response…"
            className="w-full resize-none rounded-md border border-outline-variant bg-surface-container px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-right text-xs text-on-surface-variant">
            {text.length}/{MAX_LENGTH}
          </p>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-outline-variant py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => text.trim() && onSubmit(review.id, text.trim())}
            disabled={!text.trim()}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-semibold text-on-primary transition-all hover:opacity-90 disabled:opacity-50"
          >
            <Check className="h-4 w-4" aria-hidden />
            Post reply
          </button>
        </div>
    </Modal>
  );
}
