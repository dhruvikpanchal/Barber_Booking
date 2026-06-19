"use client";

import { useSyncExternalStore } from "react";
import { decodeJwtPayload, getStoredUser } from "@/client/lib/auth/session.js";
import { getAccessToken } from "@/lib/axios";
import { CUSTOMER_NAV_SECTIONS } from "@/client/modules/customer/constants/customerNavSeenConstants.js";

const STORAGE_KEY = "io.customer.nav.lastSeen.v1";
const NOTIFY_EVENT = "io:customer-nav-seen-update";

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
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
  window.dispatchEvent(new CustomEvent(NOTIFY_EVENT));
}

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(updater) {
  memoryState = typeof updater === "function" ? updater(memoryState) : updater;
  persist();
  emit();
}

function subscribe(listener) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        memoryState = loadState();
        listener();
      }
    };
    const onNotify = () => {
      memoryState = loadState();
      listener();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(NOTIFY_EVENT, onNotify);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(NOTIFY_EVENT, onNotify);
    };
  }
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return memoryState;
}

export function useCustomerNavSeenRevision() {
  return useSyncExternalStore(subscribe, getSnapshot, () => ({}));
}

export function resolveCustomerNavUserId() {
  const stored = getStoredUser();
  if (stored?.id) return String(stored.id);

  const payload = decodeJwtPayload(getAccessToken());
  if (payload?.sub) return String(payload.sub);

  return null;
}

function toMs(value) {
  if (value == null) return 0;
  const ms = new Date(value).getTime();
  return Number.isFinite(ms) ? ms : 0;
}

function maxTimestampMs(timestamps = []) {
  const values = timestamps.map(toMs).filter((ms) => ms > 0);
  if (!values.length) return Date.now();
  return Math.max(Date.now(), ...values);
}

function readUserSections(userId) {
  if (!userId) return {};
  return memoryState[userId] ?? {};
}

function getSectionLastSeenMs(userId, section) {
  const value = readUserSections(userId)[section];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function setSectionLastSeenMs(userId, section, ms) {
  if (!userId || !section) return;
  setState((current) => ({
    ...current,
    [userId]: {
      ...current[userId],
      [section]: ms,
    },
  }));
}

/**
 * On first use, watermark existing items so legacy data never shows as "new".
 */
export function ensureCustomerNavSectionWatermark(userId, section, itemTimestamps = []) {
  if (!userId || !section) return null;

  const existing = getSectionLastSeenMs(userId, section);
  if (existing != null) return existing;

  const watermark = maxTimestampMs(itemTimestamps);
  setSectionLastSeenMs(userId, section, watermark);
  return watermark;
}

export function countCustomerItemsNewerThan(items, getTimestamp, userId, section) {
  if (!userId || !section) return 0;

  const timestamps = items.map((item) => getTimestamp(item)).filter(Boolean);
  const lastSeen = ensureCustomerNavSectionWatermark(userId, section, timestamps);

  return items.filter((item) => toMs(getTimestamp(item)) > lastSeen).length;
}

export function markCustomerNavSectionSeen(userId, section, items = [], getTimestamp = () => null) {
  if (!userId || !section) return;

  const timestamps = items.map((item) => getTimestamp(item)).filter(Boolean);
  const next = maxTimestampMs(timestamps);
  const current = getSectionLastSeenMs(userId, section) ?? 0;
  if (next <= current) return;

  setSectionLastSeenMs(userId, section, next);
}

export { CUSTOMER_NAV_SECTIONS, toMs };
