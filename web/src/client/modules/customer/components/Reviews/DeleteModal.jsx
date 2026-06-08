"use client";

import { Trash2 } from "lucide-react";
import Modal from "@/client/modules/shared/components/ui/Modal";

export function DeleteModal({ review, onConfirm, onClose, deleting }) {
  return (
    <Modal
      open={Boolean(review)}
      onClose={onClose}
      size="sm"
      backdropClassName="bg-black/60 backdrop-blur-sm"
      panelClassName="border-outline-variant bg-surface-container-low rounded-2xl border shadow-2xl"
    >
        <div className="space-y-4 p-6 text-center">
          <div className="border-status-cancelled/30 bg-status-cancelled/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full border">
            <Trash2 className="text-status-cancelled h-5 w-5" />
          </div>
          <div>
            <p className="text-on-surface font-semibold">Delete this review?</p>
            <p className="text-on-surface-variant mt-1 text-sm">
              Your review for{" "}
              <span className="text-on-surface font-medium">{review?.barber?.name}</span> will be
              permanently removed. This can't be undone.
            </p>
          </div>
        </div>
        <div className="border-outline-variant flex gap-3 border-t px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="border-outline-variant text-on-surface hover:bg-surface-container-high flex h-11 flex-1 items-center justify-center rounded-xl border text-sm font-semibold transition-all disabled:opacity-40"
          >
            Keep
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="bg-status-cancelled text-on-surface flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {deleting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
    </Modal>
  );
}
