export function normalizeAppointment(appt) {
  if (!appt) return appt;
  const history = appt.serviceChangeHistory ?? [];
  const resolved = history.filter((c) => c.status !== "pending");
  const latestResolved = resolved.length ? resolved[resolved.length - 1] : null;

  return {
    ...appt,
    pendingChangeRequest: mapServiceChange(appt.pendingServiceChange),
    latestChangeRequest: mapServiceChange(latestResolved),
    services: appt.services ?? [],
  };
}
