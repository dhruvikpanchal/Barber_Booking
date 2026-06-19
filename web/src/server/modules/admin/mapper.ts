import type {
  AppointmentStatus,
  BarberRequestStatus,
  BarberStatus,
} from "@/server/modules/admin/constants";
import {
  ADMIN_NOTIFICATION_TYPE_TO_VARIANT,
  type AdminNotificationVariant,
  type AdminUserStatusKey,
  type AdminBarberStatusKey,
  type AdminAppointmentStatusKey,
} from "@/server/modules/admin/constants";
import { buildPaginationMeta } from "@/server/modules/shared/helpers/pagination";
import { regionConfig } from "@/server/config/region";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function centsToDollars(cents: number): number {
  return Math.round(cents) / 100;
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export function toClientEnumKey(value: string): string {
  return value.toLowerCase().replace(/_/g, "-");
}

export function toDbEnumKey(value: string): string {
  return value.toUpperCase().replace(/-/g, "_");
}

export function toAppointmentStatusKey(status: AppointmentStatus): AdminAppointmentStatusKey {
  return toClientEnumKey(status) as AdminAppointmentStatusKey;
}

export function toBarberRequestStatusKey(status: BarberRequestStatus): string {
  return status.toLowerCase();
}

export function toBarberStatusKey(status: BarberStatus): AdminBarberStatusKey {
  const key = status.toLowerCase();
  if (key === "active" || key === "inactive" || key === "disabled") {
    return key;
  }
  return "inactive";
}

/** User.isActive + optional activity tier from service layer */
export function toUserStatusKey(isActive: boolean, activity?: string): AdminUserStatusKey {
  if (!isActive) return "disabled";
  if (activity === "low") return "inactive";
  return "active";
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString(regionConfig.locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

export function toAdminNotificationVariant(dbType: string): AdminNotificationVariant | string {
  const mapped =
    ADMIN_NOTIFICATION_TYPE_TO_VARIANT[dbType as keyof typeof ADMIN_NOTIFICATION_TYPE_TO_VARIANT];
  return mapped ?? "system_info";
}

export { buildPaginationMeta, formatRelativeTime, toInitials };

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD  ·  GET /api/v1/admin/dashboard
// client: data/dashboardData.js
// ─────────────────────────────────────────────────────────────────────────────

export type AdminDashboardStatDto = {
  key: string;
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
};

export type AdminDashboardDto = {
  stats: AdminDashboardStatDto[];
  bookingTrend: { label: string; value: number }[];
  recentActivity: { id: string; type: string; message: string; at: string }[];
  recentReports: { id: string; title: string; generatedAt: string }[];
  queueOverview: { waiting: number; inService: number; chairsBusy: number; chairsTotal: number };
  cityGrowth: { city: string; barbers: number; growthPct: number }[];
};

// ─────────────────────────────────────────────────────────────────────────────
// APPOINTMENTS  ·  /admin/appointments
// client: data/appointmentsData.js, appointmentDetailData.js
// ─────────────────────────────────────────────────────────────────────────────

export type AdminAppointmentListItemDto = {
  id: string;
  customer: { name: string; initials: string };
  barberId: string;
  barberName: string;
  service: string;
  city: string;
  status: AdminAppointmentStatusKey;
  startAt: string;
  price: number;
};

export type AdminAppointmentDetailDto = AdminAppointmentListItemDto & {
  phone?: string | null;
  email?: string | null;
  duration: number;
  notes?: string | null;
  timeline: { key: string; label: string; state: string; at?: string }[];
  modificationHistory: { id: string; action: string; at: string; actor: string }[];
};

// ─────────────────────────────────────────────────────────────────────────────
// BARBER REQUESTS  ·  /admin/barber-requests
// client: data/barberRequestsData.js
// ─────────────────────────────────────────────────────────────────────────────

export type AdminBarberRequestListItemDto = {
  id: string;
  shopName: string;
  ownerName: string;
  city: string;
  experience: string;
  status: string;
  submittedAt: string;
  email: string;
  phone?: string | null;
  documentCount: number;
};

export type AdminBarberRequestDetailDto = AdminBarberRequestListItemDto & {
  bio?: string | null;
  specialties: string[];
  portfolio?: string | null;
  documents: { id: string; label: string; fileName: string; fileUrl?: string | null }[];
  rejectionNote?: string | null;
  reviewedAt?: string | null;
};

// ─────────────────────────────────────────────────────────────────────────────
// BARBERS  ·  /admin/barbers
// client: data/barberData.js, barberDetailData.js
// ─────────────────────────────────────────────────────────────────────────────

export type AdminBarberListItemDto = {
  id: string;
  name: string;
  initials: string;
  shop: string;
  city: string;
  status: AdminBarberStatusKey;
  rating: number;
  reviewCount: number;
  servicesCount: number;
  appointmentsTotal: number;
  appointmentsThisMonth: number;
  joinedAt: string;
};

export type AdminBarberDetailDto = AdminBarberListItemDto & {
  email: string;
  phone?: string | null;
  bio?: string | null;
  specialties: string[];
};

// ─────────────────────────────────────────────────────────────────────────────
// USERS  ·  /admin/users
// client: data/usersData.js, userDetailData.js
// ─────────────────────────────────────────────────────────────────────────────

export type AdminUserListItemDto = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  status: AdminUserStatusKey;
  activity: string;
  bookingsTotal: number;
  joinedAt: string;
  lastActive: string;
};

export type AdminUserDetailDto = AdminUserListItemDto & {
  bookingsThisMonth: number;
  cancelledBookings: number;
  reviewsGiven: number;
  avgRatingGiven: number;
  favoriteBarber?: string | null;
  totalSpent: number;
  bookingHistory: {
    id: string;
    barber: string;
    service: string;
    date: string;
    status: string;
    price: number;
  }[];
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT MESSAGES  ·  /admin/contact-messages
// client: data/contactMessagesData.js, contactMessageDetailData.js
// ─────────────────────────────────────────────────────────────────────────────

export type AdminContactMessageListItemDto = {
  id: string;
  name: string;
  email: string;
  subject: string;
  preview: string;
  submittedAt: string;
  isRead: boolean;
  replyStatus: string;
  workflowStatus: string;
};

export type AdminContactMessageDetailDto = AdminContactMessageListItemDto & {
  message: string;
  replyText?: string | null;
  repliedAt?: string | null;
  internalNote?: string | null;
  assignedTo?: string | null;
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS  ·  /admin/notifications
// client: data/notifucationsData.js
// ─────────────────────────────────────────────────────────────────────────────

export type AdminNotificationDto = {
  id: string;
  type: string;
  variant: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE  ·  /admin/profile
// client: data/profileData.js
// ─────────────────────────────────────────────────────────────────────────────

export type AdminProfileDto = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  photoUrl: string | null;
  joinedAt: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// ROW MAPPERS
// ─────────────────────────────────────────────────────────────────────────────

type AdminUserRow = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  city: string | null;
  isActive: boolean;
  createdAt: Date;
  lastActiveAt: Date | null;
  _count?: { appointments: number; reviews: number };
};

export function toAdminProfileDto(row: AdminUserRow): AdminProfileDto {
  return {
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    role: "Admin",
    photoUrl: row.photoUrl,
    joinedAt: row.createdAt.toISOString(),
  };
}

export function toAdminUserListItemDto(row: AdminUserRow, activity: string): AdminUserListItemDto {
  return {
    id: row.id,
    name: row.fullName,
    initials: toInitials(row.fullName),
    email: row.email,
    phone: row.phone,
    city: row.city,
    status: toUserStatusKey(row.isActive, activity),
    activity,
    bookingsTotal: row._count?.appointments ?? 0,
    joinedAt: row.createdAt.toISOString().slice(0, 10),
    lastActive: (row.lastActiveAt ?? row.createdAt).toISOString().slice(0, 10),
  };
}

type AdminBarberRow = {
  id: string;
  displayRole: string;
  bio: string | null;
  barberStatus: string;
  averageRating: number;
  reviewCount: number;
  servicesCount: number;
  totalAppointments: number;
  appointmentsThisMonth: number;
  joinedAt: Date;
  user: {
    fullName: string;
    email: string;
    phone: string | null;
    city: string | null;
  };
  shop: { name: string; city: string } | null;
  specialties: { name: string }[];
};

export function toAdminBarberListItemDto(row: AdminBarberRow): AdminBarberListItemDto {
  return {
    id: row.id,
    name: row.user.fullName,
    initials: toInitials(row.user.fullName),
    shop: row.shop?.name ?? "Independent",
    city: row.shop?.city ?? row.user.city ?? "",
    status: toBarberStatusKey(row.barberStatus as BarberStatus),
    rating: row.averageRating,
    reviewCount: row.reviewCount,
    servicesCount: row.servicesCount,
    appointmentsTotal: row.totalAppointments,
    appointmentsThisMonth: row.appointmentsThisMonth,
    joinedAt: row.joinedAt.toISOString().slice(0, 10),
  };
}

export function toAdminBarberDetailDto(row: AdminBarberRow): AdminBarberDetailDto {
  return {
    ...toAdminBarberListItemDto(row),
    email: row.user.email,
    phone: row.user.phone,
    bio: row.bio,
    specialties: row.specialties.map((s) => s.name),
  };
}

type AdminAppointmentRow = {
  id: string;
  status: string;
  startAt: Date;
  bookedAt?: Date;
  confirmedAt?: Date | null;
  arrivedAt?: Date | null;
  completedAt?: Date | null;
  cancelledAt?: Date | null;
  estimatedPrice: number;
  finalPrice: number | null;
  notes: string | null;
  barberNotes: string | null;
  customer: { fullName: string; email: string; phone: string | null };
  barber: {
    id: string;
    user: { fullName: string };
    shop: { city: string } | null;
  };
  services: { name: string; price: number; duration: number }[];
  modificationHistory?: { id: string; actor: string; summary: string; at: Date }[];
};

function buildAdminAppointmentTimeline(row: AdminAppointmentRow) {
  const clientStatus = toClientEnumKey(row.status);
  const cancelled = clientStatus === "cancelled" || clientStatus === "no-show";

  const steps: { key: string; label: string; at?: Date | null }[] = [
    { key: "created", label: "Booking Created", at: row.bookedAt ?? row.startAt },
    { key: "accepted", label: "Confirmed", at: row.confirmedAt },
    { key: "arrived", label: "In Service", at: row.arrivedAt },
    { key: "completed", label: "Completed", at: row.completedAt },
  ];

  let currentMarked = false;
  return steps.map((step) => {
    if (cancelled) {
      return { key: step.key, label: step.label, state: "cancelled", at: step.at?.toISOString() };
    }
    if (step.at) {
      return { key: step.key, label: step.label, state: "done", at: step.at.toISOString() };
    }
    if (!currentMarked) {
      currentMarked = true;
      return { key: step.key, label: step.label, state: "current" };
    }
    return { key: step.key, label: step.label, state: "upcoming" };
  });
}

export function toAdminAppointmentListItemDto(
  row: AdminAppointmentRow,
): AdminAppointmentListItemDto {
  const serviceLabel = row.services.map((s) => s.name).join(", ") || "Appointment";
  const priceCents = row.finalPrice ?? row.estimatedPrice;

  return {
    id: row.id,
    customer: {
      name: row.customer.fullName,
      initials: toInitials(row.customer.fullName),
    },
    barberId: row.barber.id,
    barberName: row.barber.user.fullName,
    service: serviceLabel,
    city: row.barber.shop?.city ?? "",
    status: toClientEnumKey(row.status) as AdminAppointmentStatusKey,
    startAt: row.startAt.toISOString(),
    price: centsToDollars(priceCents),
  };
}

export function toAdminAppointmentDetailDto(row: AdminAppointmentRow): AdminAppointmentDetailDto {
  const duration = row.services.reduce((sum, s) => sum + s.duration, 0);
  const base = toAdminAppointmentListItemDto(row);

  return {
    ...base,
    phone: row.customer.phone,
    email: row.customer.email,
    duration,
    notes: row.notes,
    timeline: buildAdminAppointmentTimeline(row),
    modificationHistory: (row.modificationHistory ?? []).map((m) => ({
      id: m.id,
      action: m.summary,
      at: m.at.toISOString(),
      actor: m.actor,
    })),
  };
}

type AdminBarberRequestRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  city: string | null;
  shopName: string | null;
  bio: string | null;
  experience: string;
  portfolioUrl: string | null;
  specialties: unknown;
  status: string;
  rejectionNote: string | null;
  submittedAt: Date;
  reviewedAt: Date | null;
  documents: { id: string; label: string; fileName: string; fileUrl: string | null }[];
};

export function toAdminBarberRequestListItemDto(
  row: AdminBarberRequestRow,
): AdminBarberRequestListItemDto {
  return {
    id: row.id,
    shopName: row.shopName ?? "Independent",
    ownerName: `${row.firstName} ${row.lastName}`.trim(),
    city: row.city ?? "",
    experience: row.experience,
    status: toBarberRequestStatusKey(row.status as BarberRequestStatus),
    submittedAt: row.submittedAt.toISOString(),
    email: row.email,
    phone: row.phone,
    documentCount: row.documents.length,
  };
}

export function toAdminBarberRequestDetailDto(
  row: AdminBarberRequestRow,
): AdminBarberRequestDetailDto {
  const specialties = Array.isArray(row.specialties) ? (row.specialties as string[]) : [];

  return {
    ...toAdminBarberRequestListItemDto(row),
    bio: row.bio,
    specialties,
    portfolio: row.portfolioUrl ?? undefined,
    documents: row.documents.map((d) => ({
      id: d.id,
      label: d.label,
      fileName: d.fileName,
      fileUrl: d.fileUrl,
    })),
    rejectionNote: row.rejectionNote,
    reviewedAt: row.reviewedAt?.toISOString(),
  };
}

type AdminContactMessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: Date;
  isRead: boolean;
  replyStatus: string;
  workflowStatus: string;
  replyText: string | null;
  repliedAt: Date | null;
  internalNote: string | null;
  assignedTo: string | null;
};

export function toContactWorkflowStatusKey(status: string): string {
  return status.toLowerCase();
}

export function toContactWorkflowStatusDb(status: string): string {
  return status.toUpperCase().replace(/-/g, "_");
}

export function toAdminContactMessageListItemDto(
  row: AdminContactMessageRow,
): AdminContactMessageListItemDto {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    preview: row.message.length > 120 ? `${row.message.slice(0, 120)}…` : row.message,
    submittedAt: row.submittedAt.toISOString(),
    isRead: row.isRead,
    replyStatus: row.replyStatus.toLowerCase(),
    workflowStatus: toContactWorkflowStatusKey(row.workflowStatus),
  };
}

export function toAdminContactMessageDetailDto(
  row: AdminContactMessageRow,
): AdminContactMessageDetailDto {
  return {
    ...toAdminContactMessageListItemDto(row),
    message: row.message,
    replyText: row.replyText,
    repliedAt: row.repliedAt?.toISOString() ?? null,
    internalNote: row.internalNote,
    assignedTo: row.assignedTo,
  };
}

type NotificationRow = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export function toAdminNotificationDto(row: NotificationRow): AdminNotificationDto {
  const variant = toAdminNotificationVariant(row.type);
  return {
    id: row.id,
    type:
      variant === "barber_request" || variant === "barber_approved"
        ? "barber"
        : variant === "booking" || variant === "cancellation"
          ? "appointments"
          : variant === "contact"
            ? "contact"
            : "system",
    variant,
    title: row.title,
    body: row.message,
    timestamp: row.createdAt.toISOString(),
    read: row.isRead,
  };
}
