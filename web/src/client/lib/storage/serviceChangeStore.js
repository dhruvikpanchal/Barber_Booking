"use client";

import { useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "io.serviceChangeRequests.v1";
const NOTIFY_EVENT = "io:service-change-update";

export const SERVICE_CHANGE_MIN_MS = 5 * 60 * 60 * 1000;

function loadState() {
  if (typeof window === "undefined") {
    return { requests: [], overrides: {}, notifications: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { requests: [], overrides: {}, notifications: {} };
    const parsed = JSON.parse(raw);
    return {
      requests: parsed.requests ?? [],
      overrides: parsed.overrides ?? {},
      notifications: parsed.notifications ?? {},
    };
  } catch {
    return { requests: [], overrides: {}, notifications: {} };
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

function emit() {
  listeners.forEach((l) => l());
}

function setState(updater) {
  memoryState = typeof updater === "function" ? updater(memoryState) : updater;
  persist();
  emit();
}

function subscribe(listener) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    const onStorage = () => {
      memoryState = loadState();
      listener();
    };
    window.addEventListener(NOTIFY_EVENT, listener);
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener(NOTIFY_EVENT, listener);
      window.removeEventListener("storage", onStorage);
    };
  }
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return memoryState;
}

export function sumServicePrice(services = []) {
  return services.reduce((sum, s) => sum + (s.price ?? 0), 0);
}

export function useServiceChangeStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return state;
}

export function getPendingRequestForAppointment(appointmentId, state = memoryState) {
  return state.requests.find((r) => r.appointmentId === appointmentId && r.status === "pending");
}

export function getLatestRequestForAppointment(appointmentId, state = memoryState) {
  return [...state.requests]
    .filter((r) => r.appointmentId === appointmentId)
    .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt))[0];
}

export function getAppointmentOverride(appointmentId, state = memoryState) {
  return state.overrides[appointmentId] ?? null;
}

export function getCustomerNotification(appointmentId, state = memoryState) {
  return state.notifications[appointmentId] ?? null;
}

export function submitServiceChangeRequest(payload) {
  const {
    appointmentId,
    requestedServices,
    previousServices,
    customerNote = "",
    snapshot,
  } = payload;

  const pending = getPendingRequestForAppointment(appointmentId);
  if (pending) {
    return { ok: false, error: "A change request is already pending for this appointment." };
  }

  const request = {
    id: `scr-${Date.now()}`,
    appointmentId,
    status: "pending",
    requestedAt: new Date().toISOString(),
    customerNote,
    requestedServices,
    previousServices,
    snapshot,
  };

  setState((prev) => ({
    ...prev,
    requests: [request, ...prev.requests],
  }));

  return { ok: true, request };
}

export function acceptServiceChangeRequest(requestId) {
  const request = memoryState.requests.find((r) => r.id === requestId);
  if (!request || request.status !== "pending") return { ok: false };

  const estimatedPrice = sumServicePrice(request.requestedServices);
  const previous = request.previousServices ?? request.snapshot?.services ?? [];

  setState((prev) => ({
    ...prev,
    requests: prev.requests.map((r) =>
      r.id === requestId ? { ...r, status: "accepted", resolvedAt: new Date().toISOString() } : r,
    ),
    overrides: {
      ...prev.overrides,
      [request.appointmentId]: {
        services: request.requestedServices,
        originalServices: previous,
        updatedServices: request.requestedServices,
        estimatedPrice,
      },
    },
    notifications: {
      ...prev.notifications,
      [request.appointmentId]: {
        type: "accepted",
        message: "Your service change was approved. Estimated total has been updated.",
        at: new Date().toISOString(),
      },
    },
  }));

  return { ok: true };
}

export function rejectServiceChangeRequest(requestId) {
  const request = memoryState.requests.find((r) => r.id === requestId);
  if (!request || request.status !== "pending") return { ok: false };

  setState((prev) => ({
    ...prev,
    requests: prev.requests.map((r) =>
      r.id === requestId ? { ...r, status: "rejected", resolvedAt: new Date().toISOString() } : r,
    ),
    notifications: {
      ...prev.notifications,
      [request.appointmentId]: {
        type: "rejected",
        message: "Your service change request was declined. Original services are unchanged.",
        at: new Date().toISOString(),
      },
    },
  }));

  return { ok: true };
}

export function clearCustomerNotification(appointmentId) {
  setState((prev) => {
    const next = { ...prev.notifications };
    delete next[appointmentId];
    return { ...prev, notifications: next };
  });
}

/** Barber inbox — uses bookingId when linked to a customer booking. */
export function mergeBarberAppointmentWithStore(baseAppt, state = memoryState) {
  const appointmentId = baseAppt.bookingId ?? baseAppt.id;
  const override = getAppointmentOverride(appointmentId, state);
  const pendingRequest = getPendingRequestForAppointment(appointmentId, state);
  const latestRequest = getLatestRequestForAppointment(appointmentId, state);

  if (!override && !pendingRequest && !latestRequest) {
    return baseAppt;
  }

  const services = override?.services ?? baseAppt.services;
  const serviceLabel = Array.isArray(services)
    ? services.map((s) => s.name).join(" + ")
    : baseAppt.service;
  const price = override?.estimatedPrice ?? baseAppt.price;
  const duration = Array.isArray(services)
    ? services.reduce((sum, s) => sum + (s.duration ?? 0), 0)
    : baseAppt.duration;

  return {
    ...baseAppt,
    services,
    service: serviceLabel,
    price,
    duration,
    pendingChangeRequest: pendingRequest ?? null,
    latestChangeRequest: latestRequest ?? null,
    changeRequestHistory: state.requests.filter((r) => r.appointmentId === appointmentId),
  };
}

export function useMergedBarberAppointment(baseAppt) {
  const state = useServiceChangeStore();
  return useMemo(() => mergeBarberAppointmentWithStore(baseAppt, state), [baseAppt, state]);
}

export function mergeAppointmentWithStore(baseAppt, state = memoryState) {
  const override = getAppointmentOverride(baseAppt.id, state);
  const pendingRequest = getPendingRequestForAppointment(baseAppt.id, state);
  const latestRequest = getLatestRequestForAppointment(baseAppt.id, state);
  const notification = getCustomerNotification(baseAppt.id, state);

  if (!override && !pendingRequest && !latestRequest && !notification) {
    return baseAppt;
  }

  return {
    ...baseAppt,
    ...(override ?? {}),
    services: override?.services ?? baseAppt.services,
    estimatedPrice: override?.estimatedPrice ?? baseAppt.estimatedPrice,
    pendingChangeRequest: pendingRequest ?? null,
    latestChangeRequest: latestRequest ?? null,
    customerNotification: notification,
  };
}

export function useMergedAppointment(baseAppt) {
  const state = useServiceChangeStore();
  return useMemo(() => mergeAppointmentWithStore(baseAppt, state), [baseAppt, state]);
}
