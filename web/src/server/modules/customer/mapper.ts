import { buildPaginationMeta } from "@/server/shared/pagination";
import {
  CUSTOMER_APPOINTMENT_NOTIFICATION_CLIENT_TYPES,
  CUSTOMER_NOTIFICATION_CLIENT_TYPES,
  CUSTOMER_TIMELINE_STEPS,
  type CustomerNotificationType,
  type CustomerTimelineStepState,
} from "@/server/modules/customer/constants";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function centsToDollars(cents: number): number {
  return Math.round(cents) / 100;
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAppointmentDate(date: Date): string {
  const day = date.toLocaleDateString("en-US", { weekday: "short" });
  const dmy = date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${day}, ${dmy} · ${time}`;
}

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatShortDate(date);
}

function toInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

function toClientNotificationType(dbType: string): string {
  return (
    CUSTOMER_NOTIFICATION_CLIENT_TYPES[dbType as CustomerNotificationType] ?? dbType.toLowerCase()
  );
}

export { buildPaginationMeta };

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE  ·  GET /api/v1/customer/profile
// ─────────────────────────────────────────────────────────────────────────────

type CustomerProfileDbRow = {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  photoUrl: string | null;
  address: string | null;
  createdAt: Date;
};

export type CustomerProfileDto = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  photoUrl: string | null;
  joinedAt: string;
  initials: string;
};

export function toCustomerProfileDto(row: CustomerProfileDbRow): CustomerProfileDto {
  return {
    id: row.id,
    fullName: row.fullName,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    address: row.address,
    photoUrl: row.photoUrl,
    joinedAt: row.createdAt.toISOString(),
    initials: toInitials(row.fullName),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD  ·  GET /api/v1/customer/dashboard
// ─────────────────────────────────────────────────────────────────────────────

export type DashboardStatsDto = {
  total: number;
  completed: number;
  upcoming: number;
  cancelled: number;
};

export type DashboardActivityDto = {
  id: string;
  type: "booked" | "confirmed" | "completed" | "cancelled";
  at: string;
  appointmentId: string;
  title: string;
  description: string;
};

export type CustomerDashboardDto = {
  profile: Pick<CustomerProfileDto, "fullName" | "firstName" | "photoUrl">;
  stats: DashboardStatsDto;
  nextAppointment: CustomerAppointmentListItemDto | null;
  upcoming: CustomerAppointmentListItemDto[];
  recentActivity: DashboardActivityDto[];
  notifications: {
    unreadCount: number;
    preview: CustomerNotificationDto[];
  };
};

export function toDashboardStatsDto(
  appointments: CustomerAppointmentListItemDto[],
): DashboardStatsDto {
  const now = Date.now();
  const upcoming = appointments.filter(
    (a) =>
      (a.status === "pending" || a.status === "confirmed" || a.status === "in-service") &&
      new Date(a.startAt).getTime() > now,
  );

  return {
    total: appointments.length,
    completed: appointments.filter((a) => a.status === "completed").length,
    upcoming: upcoming.length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };
}

export function buildDashboardActivity(
  appointments: CustomerAppointmentDetailDto[],
  limit: number,
): DashboardActivityDto[] {
  const events: DashboardActivityDto[] = [];

  for (const appt of appointments) {
    const services = appt.services.map((s) => s.name).join(", ");
    const withBarber = `with ${appt.barber.name}`;

    if (appt.bookedAt) {
      events.push({
        id: `${appt.id}-booked`,
        type: "booked",
        at: appt.bookedAt,
        appointmentId: appt.id,
        title: "Booking placed",
        description: `${services} ${withBarber}`,
      });
    }

    const accepted = appt.timeline.find((s) => s.key === "accepted" && s.at);
    if (accepted) {
      events.push({
        id: `${appt.id}-accepted`,
        type: "confirmed",
        at: accepted.at!,
        appointmentId: appt.id,
        title: "Barber confirmed",
        description: `${appt.barber.name} accepted your appointment`,
      });
    }

    const completed = appt.timeline.find((s) => s.key === "completed" && s.at);
    if (completed && appt.status === "completed") {
      events.push({
        id: `${appt.id}-completed`,
        type: "completed",
        at: completed.at!,
        appointmentId: appt.id,
        title: "Visit completed",
        description: `${services} ${withBarber}`,
      });
    }

    if (appt.status === "cancelled" && appt.bookedAt) {
      events.push({
        id: `${appt.id}-cancelled`,
        type: "cancelled",
        at: appt.cancelledAt ?? appt.bookedAt,
        appointmentId: appt.id,
        title: "Booking cancelled",
        description: appt.cancelReason ?? `Appointment with ${appt.barber.name} was cancelled`,
      });
    }
  }

  return events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, limit);
}

// ─────────────────────────────────────────────────────────────────────────────
// APPOINTMENTS  ·  /api/v1/customer/appointments
// ─────────────────────────────────────────────────────────────────────────────

type AppointmentServiceSnapshot = {
  name: string;
  price: number;
  duration: number;
};

type ServiceChangeItemSnapshot = {
  side: string;
  name: string;
  price: number;
  duration: number;
};

type CustomerAppointmentDbRow = {
  id: string;
  status: string;
  startAt: Date;
  estimatedPrice: number;
  finalPrice: number | null;
  notes: string | null;
  barberNotes: string | null;
  bookedAt: Date;
  confirmedAt: Date | null;
  arrivedAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  cancelledBy: string | null;
  cancelReason: string | null;
  reviewId: string | null;
  barber: {
    id: string;
    slug: string;
    displayRole: string;
    user: { fullName: string; photoUrl: string | null };
  };
  shop: { name: string; city: string } | null;
  services: AppointmentServiceSnapshot[];
  originalServices: AppointmentServiceSnapshot[];
  updatedServices: AppointmentServiceSnapshot[] | null;
  serviceChangeRequests?: {
    id: string;
    status: string;
    customerNote: string | null;
    rejectionNote: string | null;
    requestedAt: Date;
    resolvedAt: Date | null;
    items: ServiceChangeItemSnapshot[];
  }[];
};

export type AppointmentServiceDto = {
  name: string;
  price: number;
  duration: number;
};

export type CustomerBarberSummaryDto = {
  id: string;
  slug: string;
  name: string;
  role: string;
  image: string | null;
};

export type CustomerShopSummaryDto = {
  name: string;
  city: string;
};

export type CustomerTimelineStepDto = {
  key: string;
  label: string;
  at: string | null;
  state: CustomerTimelineStepState;
};

export type CustomerServiceChangeDto = {
  id: string;
  status: string;
  customerNote: string | null;
  rejectionNote: string | null;
  requestedAt: string;
  resolvedAt: string | null;
  outcome: "accepted" | "rejected" | "pending" | null;
  previousServices: AppointmentServiceDto[];
  updatedServices: AppointmentServiceDto[];
};

export type CustomerAppointmentListItemDto = {
  id: string;
  status: string;
  startAt: string;
  dateDisplay: string;
  estimatedPrice: number;
  finalPrice: number | null;
  notes: string | null;
  bookedAt: string;
  reviewed: boolean;
  cancelledBy: string | null;
  cancelReason: string | null;
  barber: CustomerBarberSummaryDto;
  shop: CustomerShopSummaryDto | null;
  services: AppointmentServiceDto[];
  serviceLabel: string;
  totalPrice: number;
  totalDuration: number;
};

export type CustomerAppointmentDetailDto = CustomerAppointmentListItemDto & {
  confirmedAt: string | null;
  arrivedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  barberNotes: string | null;
  customer: { name: string; email: string; phone: string | null };
  originalServices: AppointmentServiceDto[];
  updatedServices: AppointmentServiceDto[] | null;
  timeline: CustomerTimelineStepDto[];
  pendingServiceChange: CustomerServiceChangeDto | null;
  serviceChangeHistory: CustomerServiceChangeDto[];
};

function toAppointmentServices(rows: AppointmentServiceSnapshot[]): AppointmentServiceDto[] {
  return rows.map((s) => ({
    name: s.name,
    price: centsToDollars(s.price),
    duration: s.duration,
  }));
}

function buildCustomerTimeline(row: CustomerAppointmentDbRow): CustomerTimelineStepDto[] {
  const servicesUpdatedAt =
    row.updatedServices &&
    row.originalServices.length > 0 &&
    JSON.stringify(row.originalServices) !== JSON.stringify(row.updatedServices)
      ? (row.confirmedAt ?? row.bookedAt)
      : null;

  const timestamps: Record<string, Date | null> = {
    created: row.bookedAt,
    accepted: row.confirmedAt,
    arrived: row.arrivedAt,
    servicesUpdated: servicesUpdatedAt,
    completed: row.completedAt,
  };

  const isCancelled = row.status === "CANCELLED" || row.status === "NO_SHOW";
  const isCompleted = row.status === "COMPLETED";
  const hasServiceUpdate = Boolean(servicesUpdatedAt);

  const steps = CUSTOMER_TIMELINE_STEPS.filter(
    (s) => s.key !== "servicesUpdated" || hasServiceUpdate,
  );

  const lastDoneIndex = steps.findLastIndex((s) => (timestamps[s.key] ?? null) !== null);

  return steps.map((step, i) => {
    const at = timestamps[step.key] ?? null;
    let state: CustomerTimelineStepState;

    if (isCancelled) {
      state = at ? "done" : "cancelled";
    } else if (isCompleted) {
      state = at ? "done" : "upcoming";
    } else if (i < lastDoneIndex || (i === lastDoneIndex && at)) {
      state = "done";
    } else if (i === lastDoneIndex + 1) {
      state = "current";
    } else {
      state = "upcoming";
    }

    return {
      key: step.key,
      label: step.label,
      at: at ? at.toISOString() : null,
      state,
    };
  });
}

function toServiceChangeDto(
  sc: NonNullable<CustomerAppointmentDbRow["serviceChangeRequests"]>[number],
): CustomerServiceChangeDto {
  const status = sc.status.toLowerCase();
  return {
    id: sc.id,
    status,
    customerNote: sc.customerNote,
    rejectionNote: sc.rejectionNote,
    requestedAt: sc.requestedAt.toISOString(),
    resolvedAt: sc.resolvedAt?.toISOString() ?? null,
    outcome: status === "accepted" ? "accepted" : status === "rejected" ? "rejected" : "pending",
    previousServices: sc.items
      .filter((i) => i.side === "original")
      .map((i) => ({ name: i.name, price: centsToDollars(i.price), duration: i.duration })),
    updatedServices: sc.items
      .filter((i) => i.side === "updated")
      .map((i) => ({ name: i.name, price: centsToDollars(i.price), duration: i.duration })),
  };
}

function mapAppointmentBase(row: CustomerAppointmentDbRow): CustomerAppointmentListItemDto {
  const activeServices = row.updatedServices?.length ? row.updatedServices : row.services;
  const services = toAppointmentServices(activeServices);
  const totalPrice = services.reduce((s, sv) => s + sv.price, 0);
  const totalDuration = services.reduce((s, sv) => s + sv.duration, 0);

  return {
    id: row.id,
    status: row.status.toLowerCase().replace("_", "-"),
    startAt: row.startAt.toISOString(),
    dateDisplay: formatAppointmentDate(row.startAt),
    estimatedPrice: centsToDollars(row.estimatedPrice),
    finalPrice: row.finalPrice !== null ? centsToDollars(row.finalPrice) : null,
    notes: row.notes,
    bookedAt: row.bookedAt.toISOString(),
    reviewed: Boolean(row.reviewId),
    cancelledBy: row.cancelledBy?.toLowerCase() ?? null,
    cancelReason: row.cancelReason,
    barber: {
      id: row.barber.slug,
      slug: row.barber.slug,
      name: row.barber.user.fullName,
      role: row.barber.displayRole,
      image: row.barber.user.photoUrl,
    },
    shop: row.shop ? { name: row.shop.name, city: row.shop.city } : null,
    services,
    serviceLabel: services.map((s) => s.name).join(" + "),
    totalPrice,
    totalDuration,
  };
}

export function toCustomerAppointmentListItemDto(
  row: CustomerAppointmentDbRow,
): CustomerAppointmentListItemDto {
  return mapAppointmentBase(row);
}

export function toCustomerAppointmentDetailDto(
  row: CustomerAppointmentDbRow,
  customer: { fullName: string; email: string; phone: string | null },
): CustomerAppointmentDetailDto {
  const base = mapAppointmentBase(row);
  const changes = (row.serviceChangeRequests ?? []).map(toServiceChangeDto);
  const pending = changes.find((c) => c.status === "pending") ?? null;

  return {
    ...base,
    confirmedAt: row.confirmedAt?.toISOString() ?? null,
    arrivedAt: row.arrivedAt?.toISOString() ?? null,
    completedAt: row.completedAt?.toISOString() ?? null,
    cancelledAt: row.cancelledAt?.toISOString() ?? null,
    barberNotes: row.barberNotes,
    customer: {
      name: customer.fullName,
      email: customer.email,
      phone: customer.phone,
    },
    originalServices: toAppointmentServices(row.originalServices),
    updatedServices: row.updatedServices ? toAppointmentServices(row.updatedServices) : null,
    timeline: buildCustomerTimeline(row),
    pendingServiceChange: pending,
    serviceChangeHistory: changes,
  };
}

export type CreateAppointmentResultDto = {
  id: string;
  barberId: string;
  barberName: string;
  shopName: string | null;
  services: AppointmentServiceDto[];
  startAt: string;
  estimatedPrice: number;
  status: string;
  notes: string | null;
  bookedAt: string;
};

export function toCreateAppointmentResultDto(
  row: CustomerAppointmentDbRow,
): CreateAppointmentResultDto {
  const services = toAppointmentServices(row.services);
  return {
    id: row.id,
    barberId: row.barber.id,
    barberName: row.barber.user.fullName,
    shopName: row.shop?.name ?? null,
    services,
    startAt: row.startAt.toISOString(),
    estimatedPrice: centsToDollars(row.estimatedPrice),
    status: row.status.toLowerCase(),
    notes: row.notes,
    bookedAt: row.bookedAt.toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING WIZARD  ·  /api/v1/customer/booking/*
// ─────────────────────────────────────────────────────────────────────────────

export type BookingBarberDbRow = {
  id: string;
  slug: string;
  displayRole: string;
  experience: number;
  averageRating: number;
  reviewCount: number;
  startingPrice: number;
  isAvailable: boolean;
  user: { fullName: string; photoUrl: string | null };
  shop: {
    id: string;
    name: string;
    city: string;
    address: string | null;
  } | null;
  specialties: { name: string }[];
  services: { service: { slug: string } }[];
};

export type BookingBarberDto = {
  id: string;
  slug: string;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  experience: number;
  startingPrice: number;
  available: boolean;
  location: string | null;
  city: string | null;
  address: string | null;
  specialties: string[];
  services: string[];
  image: string | null;
};

export function toBookingBarberDto(row: BookingBarberDbRow): BookingBarberDto {
  return {
    id: row.slug,
    slug: row.slug,
    name: row.user.fullName,
    role: row.displayRole,
    rating: Math.round(row.averageRating * 10) / 10,
    reviews: row.reviewCount,
    experience: row.experience,
    startingPrice: centsToDollars(row.startingPrice),
    available: row.isAvailable,
    location: row.shop?.name ?? null,
    city: row.shop?.city ?? null,
    address: row.shop?.address ?? null,
    specialties: row.specialties.map((s) => s.name),
    services: row.services.map((s) => s.service.slug),
    image: row.user.photoUrl,
  };
}

type BookingServiceDbRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  isActive: boolean;
};

export type BookingServiceDto = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  active: boolean;
};

export function toBookingServiceDto(row: BookingServiceDbRow): BookingServiceDto {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: centsToDollars(row.price),
    duration: row.duration,
    active: row.isActive,
  };
}

export type AvailableSlotDto = {
  id: string;
  label: string;
  available: boolean;
  time: string;
};

export function toAvailableSlotDto(time: string, available: boolean): AvailableSlotDto {
  const [h, m] = time.split(":").map(Number);
  const id = `${h}:${m}`;
  return {
    id,
    label: formatTime12h(time),
    available,
    time,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FAVORITES  ·  /api/v1/customer/favorites
// ─────────────────────────────────────────────────────────────────────────────

type FavoriteBarberDbRow = {
  savedAt: Date;
  lastVisitedAt: Date | null;
  totalVisits: number;
  lastService: string | null;
  yourRating: number | null;
  barber: BookingBarberDbRow & { nextAvailableLabel?: string | null };
};

export type FavoriteBarberDto = {
  id: string;
  slug: string;
  name: string;
  role: string;
  shopId: string | null;
  shopName: string | null;
  shopCity: string | null;
  rating: number;
  reviews: number;
  experience: number;
  startingPrice: number;
  available: boolean;
  specialties: string[];
  image: string | null;
  savedAt: string;
  lastVisited: string | null;
  totalVisits: number;
  lastService: string | null;
  yourRating: number | null;
  nextAvailable: string | null;
};

export function toFavoriteBarberDto(row: FavoriteBarberDbRow): FavoriteBarberDto {
  const b = row.barber;
  return {
    id: b.slug,
    slug: b.slug,
    name: b.user.fullName,
    role: b.displayRole,
    shopId: b.shop?.id ?? null,
    shopName: b.shop?.name ?? null,
    shopCity: b.shop?.city ?? null,
    rating: Math.round(b.averageRating * 10) / 10,
    reviews: b.reviewCount,
    experience: b.experience,
    startingPrice: centsToDollars(b.startingPrice),
    available: b.isAvailable,
    specialties: b.specialties.map((s) => s.name),
    image: b.user.photoUrl,
    savedAt: row.savedAt.toISOString(),
    lastVisited: row.lastVisitedAt?.toISOString() ?? null,
    totalVisits: row.totalVisits,
    lastService: row.lastService,
    yourRating: row.yourRating,
    nextAvailable: row.barber.nextAvailableLabel ?? null,
  };
}

export type FavoriteToggleResultDto = {
  barberId: string;
  savedAt: string;
};

export function toFavoriteToggleResultDto(
  barberId: string,
  savedAt: Date,
): FavoriteToggleResultDto {
  return { barberId, savedAt: savedAt.toISOString() };
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS  ·  /api/v1/customer/reviews
// ─────────────────────────────────────────────────────────────────────────────

type CustomerReviewDbRow = {
  id: string;
  rating: number;
  comment: string | null;
  barberReply: string | null;
  barberRepliedAt: Date | null;
  createdAt: Date;
  appointment: {
    id: string;
    completedAt: Date | null;
    services: { name: string }[];
  };
  barber: {
    id: string;
    slug: string;
    displayRole: string;
    user: { fullName: string; photoUrl: string | null };
  };
};

export type CustomerReviewDto = {
  id: string;
  appointmentId: string;
  rating: number;
  comment: string | null;
  barberReply: string | null;
  createdAt: string;
  completedAt: string | null;
  services: string[];
  barber: CustomerBarberSummaryDto;
  editable: boolean;
};

export function toCustomerReviewDto(row: CustomerReviewDbRow): CustomerReviewDto {
  const editable = Date.now() - row.createdAt.getTime() <= 24 * 60 * 60 * 1000;
  return {
    id: row.id,
    appointmentId: row.appointment.id,
    rating: row.rating,
    comment: row.comment,
    barberReply: row.barberReply,
    createdAt: row.createdAt.toISOString(),
    completedAt: row.appointment.completedAt?.toISOString() ?? null,
    services: row.appointment.services.map((s) => s.name),
    barber: {
      id: row.barber.slug,
      slug: row.barber.slug,
      name: row.barber.user.fullName,
      role: row.barber.displayRole,
      image: row.barber.user.photoUrl,
    },
    editable,
  };
}

export type ReviewableAppointmentDto = {
  id: string;
  completedAt: string;
  services: AppointmentServiceDto[];
  barber: CustomerBarberSummaryDto;
};

export function toReviewableAppointmentDto(
  row: CustomerAppointmentDbRow,
): ReviewableAppointmentDto {
  return {
    id: row.id,
    completedAt: row.completedAt?.toISOString() ?? row.startAt.toISOString(),
    services: toAppointmentServices(row.services),
    barber: {
      id: row.barber.slug,
      slug: row.barber.slug,
      name: row.barber.user.fullName,
      role: row.barber.displayRole,
      image: row.barber.user.photoUrl,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS  ·  /api/v1/customer/notifications
// ─────────────────────────────────────────────────────────────────────────────

type CustomerNotificationDbRow = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  metadata: unknown;
  createdAt: Date;
  appointmentId: string | null;
};

function notificationMetadata(meta: unknown): Record<string, unknown> {
  if (meta && typeof meta === "object" && !Array.isArray(meta)) {
    return meta as Record<string, unknown>;
  }
  return {};
}

export type CustomerNotificationDto = {
  id: string;
  type: string;
  read: boolean;
  time: string;
  timestamp: string;
  appointmentId: string | null;
  message: string;
  title: string | null;
  barber: { name: string; initials: string } | null;
  service: string | null;
  date: string | null;
  outcome: string | null;
  previousServices: string | null;
  updatedServices: string | null;
  cancelledBy: string | null;
  reason: string | null;
  completedAt: string | null;
};

export function toCustomerNotificationDto(row: CustomerNotificationDbRow): CustomerNotificationDto {
  const meta = notificationMetadata(row.metadata);
  const clientType = toClientNotificationType(row.type);
  const barberName =
    (meta.barber as { name?: string } | undefined)?.name ?? (meta.client as string) ?? null;

  return {
    id: row.id,
    type: clientType,
    read: row.isRead,
    time: formatRelativeTime(row.createdAt),
    timestamp: row.createdAt.toISOString(),
    appointmentId: row.appointmentId,
    message: row.message,
    title: (meta.title as string) ?? row.title ?? null,
    barber: barberName
      ? {
          name: barberName,
          initials:
            (meta.barber as { initials?: string } | undefined)?.initials ?? toInitials(barberName),
        }
      : null,
    service: (meta.service as string) ?? null,
    date: (meta.date as string) ?? null,
    outcome: (meta.outcome as string) ?? null,
    previousServices: (meta.previousServices as string) ?? null,
    updatedServices: (meta.updatedServices as string) ?? null,
    cancelledBy: (meta.cancelledBy as string) ?? null,
    reason: (meta.reason as string) ?? null,
    completedAt: (meta.completedAt as string) ?? null,
  };
}

export function matchesCustomerNotificationFilter(
  notif: CustomerNotificationDto,
  filter: string,
): boolean {
  if (filter === "all") return true;
  if (filter === "appointments") {
    return CUSTOMER_APPOINTMENT_NOTIFICATION_CLIENT_TYPES.includes(
      notif.type as (typeof CUSTOMER_APPOINTMENT_NOTIFICATION_CLIENT_TYPES)[number],
    );
  }
  return notif.type === filter;
}

export type NotificationsSummaryDto = {
  total: number;
  unread: number;
};

export function toNotificationsSummaryDto(
  rows: CustomerNotificationDbRow[],
): NotificationsSummaryDto {
  return {
    total: rows.length,
    unread: rows.filter((n) => !n.isRead).length,
  };
}
