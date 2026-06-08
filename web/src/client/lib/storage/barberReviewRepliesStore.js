"use client";

import { useSyncExternalStore, useMemo } from "react";

const STORAGE_KEY = "io.barberReviewReplies.v1";
const NOTIFY_EVENT = "io:barber-review-reply-update";

function loadState() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

let memoryState = loadState();
const listeners = new Set();

function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
    window.dispatchEvent(new CustomEvent(NOTIFY_EVENT));
  }
}

function subscribe(listener) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    window.addEventListener(NOTIFY_EVENT, listener);
    window.addEventListener("storage", listener);
    return () => {
      listeners.delete(listener);
      window.removeEventListener(NOTIFY_EVENT, listener);
      window.removeEventListener("storage", listener);
    };
  }
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return memoryState;
}

/** @returns {{ reply: string, replyAt: string } | null} */
export function getStoredReply(reviewId) {
  return memoryState[reviewId] ?? null;
}

/**
 * Persist barber reply — only if none exists yet.
 * @returns {{ ok: boolean, error?: string }}
 */
export function saveBarberReply(reviewId, text) {
  if (memoryState[reviewId]?.reply) {
    return { ok: false, error: "You have already replied to this review." };
  }
  const trimmed = text?.trim();
  if (!trimmed) {
    return { ok: false, error: "Reply cannot be empty." };
  }
  memoryState = {
    ...memoryState,
    [reviewId]: {
      reply: trimmed.slice(0, 500),
      replyAt: new Date().toISOString(),
    },
  };
  persist();
  listeners.forEach((l) => l());
  return { ok: true };
}

export function useBarberReviewReplies() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function mergeReviewWithStoredReply(review, overrides = memoryState) {
  const stored = overrides[review.id];
  if (!stored) return review;
  return {
    ...review,
    reply: stored.reply,
    replyAt: stored.replyAt,
    hasReply: true,
  };
}

export function useMergedReview(baseReview) {
  const overrides = useBarberReviewReplies();
  return useMemo(
    () => mergeReviewWithStoredReply(baseReview, overrides),
    [baseReview, overrides],
  );
}
