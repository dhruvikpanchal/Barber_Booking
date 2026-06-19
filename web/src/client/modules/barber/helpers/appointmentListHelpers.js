const TAB_STATUS_MAP = {
  upcoming: new Set(["confirmed", "in-service", "rescheduled"]),
  pending: new Set(["pending"]),
  confirmed: new Set(["confirmed"]),
  rescheduled: new Set(["rescheduled"]),
  completed: new Set(["completed"]),
  cancelled: new Set(["cancelled", "no-show"]),
};

export function filterAppointmentsByTab(appointments, tab) {
  if (!tab || tab === "all") return appointments;
  const allowed = TAB_STATUS_MAP[tab];
  if (!allowed) return appointments;
  return appointments.filter((appt) => allowed.has(appt.status));
}

export function filterAppointmentsBySearch(appointments, query) {
  const q = query.trim().toLowerCase();
  if (!q) return appointments;

  return appointments.filter((appt) => {
    const customerName =
      typeof appt.customer === "string"
        ? appt.customer
        : (appt.customer?.name ?? "");
    const customer = customerName.toLowerCase();
    const service = appt.service?.toLowerCase() ?? "";
    return customer.includes(q) || service.includes(q);
  });
}

export function computeAppointmentStats(appointments) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart.getTime() + 86_400_000);

  return {
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    today: appointments.filter((a) => {
      const t = new Date(a.startAt).getTime();
      return t >= todayStart.getTime() && t < todayEnd.getTime();
    }).length,
  };
}
