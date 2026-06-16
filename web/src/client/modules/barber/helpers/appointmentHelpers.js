export function getServiceChangeAppointmentId(appt) {
  return appt?.bookingId ?? appt?.id;
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

  const price = appt.price ?? services.reduce((sum, s) => sum + (s.price ?? 0), 0);
  const duration = appt.duration ?? services.reduce((sum, s) => sum + (s.duration ?? 0), 0);

  return {
    ...appt,
    services,
    service: appt.service ?? services.map((s) => s.name).join(" + "),
    price,
    duration,
    bookedAt: appt.bookedAt ?? appt.createdAt,
    timeline:
      appt.timeline ??
      buildBarberTimeline({
        bookedAt: appt.bookedAt ?? appt.createdAt,
        acceptedAt:
          appt.status !== "pending" && appt.status !== "cancelled"
            ? (appt.acceptedAt ?? appt.bookedAt ?? appt.createdAt)
            : null,
        arrivedAt: appt.arrivedAt ?? null,
        inServiceAt: appt.inServiceAt ?? null,
        completedAt: appt.status === "completed" ? (appt.completedAt ?? appt.startAt) : null,
        status: appt.status,
      }),
  };
}
