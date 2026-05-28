import { SERVICE_CATALOG } from "@/config/catalog/services.js";
import { INITIAL_BARBERS } from "@/data/admin/barberData.js";
import { INITIAL_USERS } from "@/data/admin/usersData.js";
import { INITIAL_ADMIN_APPOINTMENTS } from "@/data/admin/appointmentsData.js";

const BARBER_CONTACT = {
  "marcus-vale": {
    phone: "+1 (212) 555-0142",
    email: "marcus.vale@ironandoak.app",
    specialization: "Skin Fades, Beard Trim",
  },
  "ezra-finch": {
    phone: "+1 (718) 555-0081",
    email: "ezra.finch@ironandoak.app",
    specialization: "Classic Cuts, Line-ups",
  },
  "diego-rey": {
    phone: "+1 (415) 555-0239",
    email: "diego.rey@ironandoak.app",
    specialization: "Razor Fades, Kids Cuts",
  },
  "owen-blake": {
    phone: "+1 (312) 555-0055",
    email: "owen.blake@ironandoak.app",
    specialization: "Skin Fades, Hot Towel Shave",
  },
};

const STATUS_PIPELINE = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "in-service", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

function paymentStatusFor(status) {
  if (status === "completed") return "Paid at visit";
  if (status === "cancelled") return "Not charged";
  return "Due at visit";
}

function resolveServiceMeta(serviceName) {
  const normalized = serviceName.toLowerCase();
  const match =
    SERVICE_CATALOG.find((s) =>
      normalized.includes(s.name.toLowerCase().split(" ")[0]),
    ) ?? SERVICE_CATALOG[0];

  let category = "Grooming";
  if (normalized.includes("beard")) category = "Beard";
  if (normalized.includes("shave") || normalized.includes("towel")) {
    category = "Shave";
  }
  if (normalized.includes("kid")) category = "Kids";

  return {
    category,
    description: match.description,
    catalogName: match.name,
  };
}

function parseModificationEntry(entry, index) {
  const { at, actor, change } = entry;
  let field = "Booking";
  let previousValue = "—";
  let updatedValue = change;
  let reason = null;

  const statusMatch = change.match(/Status\s*→\s*(.+)/i);
  if (statusMatch) {
    field = "Status";
    previousValue = "Previous status";
    updatedValue = statusMatch[1].trim();
    reason = actor === "Customer" ? "Customer-initiated" : "Barber workflow";
  } else if (change.includes("Service updated") || change.includes("→")) {
    field = "Service";
    const arrow = change.match(/(.+?)\s*→\s*(.+)/);
    if (arrow) {
      previousValue = arrow[1].replace(/^Service updated:\s*/i, "").trim();
      updatedValue = arrow[2].trim();
    } else {
      updatedValue = change;
    }
    reason = "Service change at chair or before visit";
  } else if (change.toLowerCase().includes("booking submitted")) {
    field = "Booking";
    previousValue = "—";
    updatedValue = "Submitted";
    reason = "Initial online booking";
  } else if (change.toLowerCase().includes("cancelled")) {
    field = "Status";
    previousValue = "Active booking";
    updatedValue = "Cancelled";
    reason = entry.reason ?? "Customer or admin cancellation";
  }

  return {
    id: `mod-${index}-${at}`,
    at,
    actor,
    field,
    previousValue,
    updatedValue,
    reason,
    summary: change,
  };
}

function buildStatusHistory(appt) {
  const timestamps = { pending: appt.createdAt };

  for (const entry of appt.modificationHistory ?? []) {
    const m = entry.change.match(/Status\s*→\s*(.+)/i);
    if (!m) continue;
    const label = m[1].trim().toLowerCase();
    if (label.includes("confirm")) timestamps.confirmed = entry.at;
    if (label.includes("in service") || label.includes("in progress")) {
      timestamps["in-service"] = entry.at;
    }
    if (label.includes("complet")) timestamps.completed = entry.at;
    if (label.includes("cancel")) timestamps.cancelled = entry.at;
  }

  const current = appt.status;
  const steps =
    current === "cancelled"
      ? [
          { key: "pending", label: "Pending" },
          { key: "confirmed", label: "Confirmed" },
          { key: "cancelled", label: "Cancelled" },
        ]
      : STATUS_PIPELINE;

  const rank = {
    pending: 0,
    confirmed: 1,
    "in-service": 2,
    completed: 3,
    cancelled: 2,
  };
  const currentRank = rank[current] ?? 0;

  return steps.map((step) => {
    const stepRank = rank[step.key] ?? 0;
    let state = "upcoming";
    if (step.key === current) state = "current";
    else if (stepRank < currentRank) state = "complete";
    else if (current === "cancelled" && step.key === "pending")
      state = "complete";

    return {
      ...step,
      at: timestamps[step.key] ?? null,
      state,
    };
  });
}

function buildTimeline(appt) {
  const events = [
    {
      id: `${appt.id}-created`,
      type: "created",
      title: "Appointment created",
      description: "Customer submitted booking online.",
      at: appt.createdAt,
    },
  ];

  if (appt.status !== "cancelled" && appt.status !== "pending") {
    events.push({
      id: `${appt.id}-payment`,
      type: "payment",
      title:
        appt.status === "completed" ? "Payment completed" : "Payment pending",
      description: paymentStatusFor(appt.status),
      at: appt.status === "completed" ? appt.startAt : appt.createdAt,
    });
  }

  for (const log of appt.activityLog ?? []) {
    events.push({
      id: `${appt.id}-log-${log.at}`,
      type: "activity",
      title: log.message,
      description: null,
      at: log.at,
    });
  }

  return events.sort((a, b) => new Date(b.at) - new Date(a.at));
}

function customerInitials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function resolveCustomerUserId(email) {
  const user = INITIAL_USERS.find((u) => u.email === email);
  return user?.id ?? null;
}

function resolveAdminBarberId(barberId, barberName) {
  const bySlug = INITIAL_BARBERS.find(
    (b) => b.name.toLowerCase() === barberName.toLowerCase(),
  );
  return bySlug?.id ?? null;
}

/** Enrich appointment row for admin detail page. */
export function buildAdminAppointmentDetail(raw) {
  const serviceMeta = resolveServiceMeta(raw.service);
  const barberContact = BARBER_CONTACT[raw.barberId] ?? {
    phone: "—",
    email: "—",
    specialization: "General grooming",
  };

  return {
    ...raw,
    paymentStatus: paymentStatusFor(raw.status),
    customer: {
      ...raw.customer,
      initials: customerInitials(raw.customer.name),
      userId: resolveCustomerUserId(raw.customer.email),
    },
    barber: {
      id: raw.barberId,
      adminBarberId: resolveAdminBarberId(raw.barberId, raw.barberName),
      name: raw.barberName,
      shop: raw.shop,
      city: raw.city,
      ...barberContact,
    },
    serviceDetails: {
      name: raw.service,
      category: serviceMeta.category,
      duration: raw.duration,
      price: raw.price,
      originalPrice: raw.originalPrice ?? null,
      description: serviceMeta.description,
    },
    modifications: (raw.modificationHistory ?? []).map(parseModificationEntry),
    statusHistory: buildStatusHistory(raw),
    timeline: buildTimeline(raw),
  };
}

/** @returns {ReturnType<typeof buildAdminAppointmentDetail> | undefined} */
export function getAdminAppointmentById(id) {
  const raw = INITIAL_ADMIN_APPOINTMENTS.find((a) => a.id === id);
  return raw ? buildAdminAppointmentDetail(raw) : undefined;
}
