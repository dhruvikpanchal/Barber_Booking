import { normalizeCustomer } from "@/client/modules/barber/helpers/barberMappers.js";

const BARBER_TIMELINE_STEPS = [
  { key: "created", label: "Booking Created" },
  { key: "accepted", label: "Booking Accepted" },
  { key: "arrived", label: "Customer Arrived" },
  { key: "inService", label: "In Service" },
  { key: "completed", label: "Completed" },
];

function toIso(value) {
  if (value == null) return null;
  if (typeof value === "string") return value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Client-side fallback when appointment detail omits a server-built timeline.
 * Mirrors server {@link buildTimeline} in barber/mapper.ts.
 */
export function buildBarberTimeline({
  bookedAt,
  acceptedAt,
  arrivedAt,
  inServiceAt,
  completedAt,
  status,
}) {
  const timestamps = {
    created: bookedAt,
    accepted: acceptedAt,
    arrived: arrivedAt,
    inService: inServiceAt ?? arrivedAt,
    completed: completedAt,
  };

  const isCancelled = status === "cancelled" || status === "no-show";
  const isCompleted = status === "completed";

  return BARBER_TIMELINE_STEPS.map(({ key, label }, index) => {
    const at = timestamps[key] ?? null;
    let state;

    if (isCancelled) {
      state = at ? "done" : "cancelled";
    } else if (isCompleted) {
      state = at ? "done" : "upcoming";
    } else {
      const lastDone = BARBER_TIMELINE_STEPS.findLastIndex((step) => timestamps[step.key] != null);
      if (index < lastDone || (index === lastDone && at)) state = "done";
      else if (index === lastDone + 1) state = "current";
      else state = "upcoming";
    }

    return { key, label, at: toIso(at), state };
  });
}

export function mapBarberServiceChangeRequest(sc, appointment = null) {
  if (!sc) return null;

  const previousServices = sc.originalServices ?? sc.previousServices ?? [];
  const requestedServices = sc.updatedServices ?? sc.requestedServices ?? [];

  return {
    id: sc.id,
    appointmentId: sc.appointmentId ?? appointment?.id,
    status: String(sc.status ?? "pending").toLowerCase(),
    requestedAt: sc.requestedAt,
    resolvedAt: sc.resolvedAt ?? null,
    customerNote: sc.customerNote ?? "",
    rejectionNote: sc.rejectionNote ?? null,
    previousServices,
    requestedServices,
    snapshot: {
      customer: normalizeCustomer(
        appointment?.customer ?? sc.snapshot?.customer ?? { name: "Customer" },
      ),
      startAt: appointment?.startAt ?? sc.snapshot?.startAt ?? null,
      services: appointment?.services ?? sc.snapshot?.services ?? previousServices,
    },
  };
}

export function mapBarberServiceChangeRequests(requests = [], appointment = null) {
  return (requests ?? []).map((sc) => mapBarberServiceChangeRequest(sc, appointment));
}

export function getPendingServiceChangeRequest(requests = []) {
  return (requests ?? []).find((r) => r.status === "pending") ?? null;
}

export function getServiceChangeAppointmentId(appt) {
  return appt?.id ?? appt?.bookingId ?? null;
}

export function normalizeBarberAppointment(appt) {
  const services =
    appt.services ??
    (appt.service
      ? [
          {
            name: appt.service,
            duration: appt.duration ?? 30,
            price: appt.price ?? 0,
          },
        ]
      : []);

  const price =
    appt.status === "completed" && appt.finalPrice != null
      ? appt.finalPrice
      : (appt.price ??
        appt.totalPrice ??
        appt.estimatedPrice ??
        services.reduce((sum, s) => sum + (s.price ?? 0), 0));
  const duration =
    appt.duration ?? appt.totalDuration ?? services.reduce((sum, s) => sum + (s.duration ?? 0), 0);

  const serviceChangeRequests = mapBarberServiceChangeRequests(
    appt.serviceChangeRequests,
    appt,
  );

  return {
    ...appt,
    customer: normalizeCustomer(appt.customer),
    services,
    service: appt.service ?? appt.serviceLabel ?? services.map((s) => s.name).join(" + "),
    price,
    duration,
    bookedAt: appt.bookedAt ?? appt.createdAt,
    serviceChangeRequests,
    timeline:
      appt.timeline ??
      buildBarberTimeline({
        bookedAt: appt.bookedAt ?? appt.createdAt,
        acceptedAt: appt.confirmedAt ?? appt.acceptedAt ?? null,
        arrivedAt: appt.arrivedAt ?? null,
        inServiceAt: appt.inServiceAt ?? appt.arrivedAt ?? null,
        completedAt:
          appt.status === "completed" ? (appt.completedAt ?? appt.startAt) : null,
        status: appt.status,
      }),
  };
}
