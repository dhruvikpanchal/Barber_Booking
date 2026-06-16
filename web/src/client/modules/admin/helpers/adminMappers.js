import { buildAdminBarberDetail } from "@/client/modules/admin/helpers/barberDetailHelpers.js";
import { buildBarberRequestDetail } from "@/client/modules/admin/helpers/barberRequestsHelpers.js";
import { buildContactMessageRecord } from "@/client/modules/admin/helpers/contactMessagesHelpers.js";
import { mapAdminUserDetailFromApi } from "@/client/modules/admin/helpers/userDetailHelpers.js";
import { customerInitials } from "@/client/lib/format/formatInitials.js";
import { formatTimeAgo } from "@/client/lib/format/formatDateTime.js";

function paymentStatusFor(status) {
  if (status === "completed") return "Paid at visit";
  if (status === "cancelled") return "Not charged";
  return "Due at visit";
}

export function mapAdminAppointmentListItem(raw) {
  return {
    ...raw,
    customer: {
      ...raw.customer,
      initials: raw.customer?.initials ?? customerInitials(raw.customer?.name ?? ""),
    },
    shop: raw.shop ?? "",
  };
}

export function mapAdminAppointmentStats(stats) {
  return {
    pending: stats?.pending ?? 0,
    confirmed: stats?.confirmed ?? 0,
    inService: stats?.inService ?? 0,
    completed: stats?.completed ?? 0,
    cancelled: stats?.cancelled ?? 0,
  };
}

export function mapAdminAppointmentDetail(raw) {
  const modifications = (raw.modificationHistory ?? []).map((m, i) => ({
    id: m.id ?? `mod-${i}`,
    at: m.at,
    actor: m.actor,
    field: "Booking",
    previousValue: "—",
    updatedValue: m.action,
    reason: null,
    summary: m.action,
  }));

  const timeline = (raw.timeline ?? []).map((step, i) => ({
    id: `${raw.id}-tl-${i}`,
    type: step.key,
    title: step.label,
    description:
      step.state === "current" ? "In progress" : step.state === "cancelled" ? "Cancelled" : null,
    at: step.at ?? raw.startAt,
  }));

  const statusSteps = [
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "in-service", label: "In Service" },
    { key: "completed", label: "Completed" },
  ];

  const statusRank = { pending: 0, confirmed: 1, "in-service": 2, completed: 3, cancelled: 2 };
  const currentRank = statusRank[raw.status] ?? 0;

  const statusHistory =
    raw.status === "cancelled"
      ? [
          { key: "pending", label: "Pending", state: "complete", at: null },
          { key: "confirmed", label: "Confirmed", state: "complete", at: null },
          { key: "cancelled", label: "Cancelled", state: "current", at: null },
        ]
      : statusSteps.map((step) => {
          const stepRank = statusRank[step.key] ?? 0;
          let state = "upcoming";
          if (step.key === raw.status) state = "current";
          else if (stepRank < currentRank) state = "complete";
          const tlStep = (raw.timeline ?? []).find(
            (t) => t.key === step.key || t.key === step.key.replace("-", ""),
          );
          return { ...step, at: tlStep?.at ?? null, state };
        });

  return {
    id: raw.id,
    customer: {
      name: raw.customer?.name ?? "",
      initials: raw.customer?.initials ?? customerInitials(raw.customer?.name ?? ""),
      email: raw.email ?? "",
      phone: raw.phone ?? "",
      userId: null,
    },
    barber: {
      id: raw.barberId,
      adminBarberId: raw.barberId,
      name: raw.barberName,
      shop: "—",
      specialization: "—",
      email: "—",
      phone: "—",
    },
    service: raw.service,
    shop: "—",
    city: raw.city ?? "",
    price: raw.price,
    duration: raw.duration ?? 0,
    startAt: raw.startAt,
    createdAt: raw.startAt,
    status: raw.status,
    paymentStatus: paymentStatusFor(raw.status),
    notes: raw.notes ?? null,
    serviceDetails: {
      name: raw.service,
      category: "Grooming",
      duration: raw.duration ?? 0,
      price: raw.price,
      description: "",
    },
    modifications,
    timeline,
    statusHistory,
    originalService: null,
    originalPrice: null,
  };
}

export function mapAdminBarberListItem(raw) {
  const shopName = typeof raw.shop === "string" ? raw.shop : (raw.shop?.name ?? "Independent");
  const shopCity = raw.city ?? raw.shop?.city ?? "";

  return {
    ...raw,
    email: raw.email ?? "",
    shop: {
      name: shopName,
      city: shopCity,
      address: shopCity,
    },
  };
}

export function mapAdminBarberDetail(raw) {
  const listShape = mapAdminBarberListItem(raw);
  return buildAdminBarberDetail({
    ...listShape,
    experience: raw.experience ?? "Senior",
    specialties: raw.specialties ?? [],
  });
}

export function mapBarberRequestDetail(raw) {
  return buildBarberRequestDetail({
    ...raw,
    fullName: raw.fullName ?? raw.ownerName,
    ownerName: raw.ownerName,
    documents: raw.documents ?? [],
  });
}

export function mapContactMessageListItem(raw) {
  return {
    ...raw,
    message: raw.message ?? raw.preview ?? "",
  };
}

export function mapContactMessageDetail(raw) {
  return buildContactMessageRecord({
    ...raw,
    message: raw.message ?? raw.preview ?? "",
    phone: raw.phone ?? null,
  });
}

export function toBarberStatusApi(status) {
  if (status === "suspended") return "DISABLED";
  return status.toUpperCase();
}

export function mapAdminUserListItem(raw) {
  return {
    ...raw,
    city: raw.city ?? "",
    reviewsGiven: raw.reviewsGiven ?? 0,
    totalSpent: raw.totalSpent ?? 0,
    bookingsThisMonth: raw.bookingsThisMonth ?? 0,
    avgRatingGiven: raw.avgRatingGiven ?? 0,
    favoriteBarber: raw.favoriteBarber ?? "—",
  };
}

export function mapAdminUserDetail(raw) {
  return mapAdminUserDetailFromApi(raw);
}

export function mapAdminNotification(raw) {
  return {
    id: raw.id,
    type: raw.type,
    variant: raw.variant,
    title: raw.title,
    body: raw.body ?? raw.message ?? "",
    timestamp: raw.timestamp ?? raw.createdAt,
    read: raw.read ?? raw.isRead ?? false,
  };
}

export function mapAdminDashboard(raw) {
  if (!raw) return null;

  const stats = raw.stats ?? {};
  const queue = raw.queueOverview ?? {};

  return {
    stats: {
      totalUsers: stats.totalUsers ?? 0,
      usersDelta: stats.usersDelta ?? 0,
      totalBarbers: stats.totalBarbers ?? 0,
      barbersDelta: stats.barbersDelta ?? 0,
      pendingApprovals: stats.pendingApprovals ?? 0,
      totalBookings: stats.totalBookings ?? 0,
      bookingsDelta: stats.bookingsDelta ?? 0,
      systemGrowth: stats.systemGrowth ?? 0,
    },
    bookingTrend: raw.bookingTrend ?? [],
    recentActivity: (raw.recentActivity ?? []).map((item) => ({
      ...item,
      time: item.time ? formatTimeAgo(item.time) : item.time,
    })),
    recentReports: raw.recentReports ?? [],
    queueOverview: [
      {
        city: "Platform-wide",
        waiting: queue.waiting ?? 0,
        inService: queue.inService ?? 0,
        freeChairs: Math.max(0, (queue.chairsTotal ?? 0) - (queue.chairsBusy ?? 0)),
      },
    ],
    cityGrowth: (raw.cityGrowth ?? []).map((c) => ({
      city: c.city,
      users: c.barbers ?? c.users ?? 0,
      delta: c.growthPct ?? c.delta ?? 0,
      hot: (c.growthPct ?? c.delta ?? 0) > 10,
    })),
  };
}

export function mapAdminProfile(api) {
  if (!api) return null;

  return {
    id: api.id,
    fullName: api.fullName ?? "",
    email: api.email ?? "",
    phone: api.phone ?? "",
    city: api.city ?? "",
    photo: api.photoUrl ?? "",
    photoUrl: api.photoUrl ?? "",
    isActive: api.isActive,
    lastActiveAt: api.lastActiveAt,
    createdAt: api.createdAt,
    role: "Administrator",
  };
}

export function mapAdminProfileToApi(profile) {
  return {
    fullName: profile.fullName,
    phone: profile.phone || null,
    city: profile.city || null,
    photoUrl: profile.photo || null,
  };
}
