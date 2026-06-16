import { SERVICE_CHANGE_MIN_MS } from "@/lib/storage/serviceChangeStore.js";

function atFromTimeline(appt, key) {
  return appt.timeline?.find((s) => s.key === key)?.at ?? null;
}

function getRelative(d) {
  const now = new Date();
  const diffMs = d - now;
  const diffDays = Math.round(diffMs / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 0) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

export function canRequestServiceChange(appt, pendingRequest) {
  if (pendingRequest?.status === "pending") {
    return {
      allowed: false,
      reason: "pending",
      message: "You already have a change request awaiting barber approval.",
    };
  }
  if (appt.status !== "pending" && appt.status !== "confirmed") {
    return {
      allowed: false,
      reason: "status",
      message: "Service changes are only available for upcoming bookings.",
    };
  }
  const msUntil = new Date(appt.startAt).getTime() - Date.now();
  if (msUntil <= SERVICE_CHANGE_MIN_MS) {
    return {
      allowed: false,
      reason: "window",
      message: "Service changes are not available within 5 hours of the appointment.",
    };
  }
  return { allowed: true };
}

export function servicesEqual(a, b) {
  if (!a?.length || !b?.length) return false;
  const key = (list) =>
    [...list]
      .map((s) => `${s.name}:${s.price}:${s.duration}`)
      .sort()
      .join("|");
  return key(a) === key(b);
}

export function buildProgressTracker(appt) {
  const bookedAt =
    appt.bookedAt ?? atFromTimeline(appt, "booked") ?? atFromTimeline(appt, "created");
  const acceptedAt = appt.acceptedAt ?? atFromTimeline(appt, "accepted");
  const confirmedAt =
    appt.status === "pending"
      ? null
      : (acceptedAt ?? (["confirmed", "completed"].includes(appt.status) ? bookedAt : null));

  const arrivedAt = appt.arrivedAt ?? atFromTimeline(appt, "arrived");
  const completedAt = appt.completedAt ?? atFromTimeline(appt, "completed");

  const steps = [
    { key: "booked", label: "Booking Created", at: bookedAt },
    { key: "confirmed", label: "Confirmed", at: confirmedAt },
    { key: "arrived", label: "Arrived", at: arrivedAt },
    { key: "completed", label: "Completed", at: completedAt },
  ];

  if (appt.status === "cancelled") {
    const lastDone = steps.findLastIndex((s) => s.at);
    return steps.map((step, i) => ({
      ...step,
      state: i <= lastDone ? "done" : "cancelled",
    }));
  }

  if (appt.status === "completed") {
    return steps.map((step) => ({ ...step, state: "done" }));
  }

  const lastDoneIndex = steps.findLastIndex((s) => s.at);
  return steps.map((step, i) => ({
    ...step,
    state:
      i < lastDoneIndex || (i === lastDoneIndex && step.at)
        ? "done"
        : i === lastDoneIndex + 1
          ? "current"
          : "upcoming",
  }));
}

export function formatDateTime(iso) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    relative: getRelative(d),
  };
}

export function getTotalDuration(services) {
  if (!services?.length) return 0;
  return services.reduce((s, sv) => s + (sv?.duration ?? 0), 0);
}

export function getServiceNames(services) {
  if (!services?.length) return "—";
  return services.map((s) => s?.name ?? "Service").join(", ");
}

export function formatShopLabel(shop) {
  if (!shop?.name) return "—";
  return shop.name.replace("Iron & Oak — ", "");
}

export function formatShopCity(shop) {
  return shop?.city ?? "";
}
