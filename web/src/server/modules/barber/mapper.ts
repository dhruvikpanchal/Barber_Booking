import { buildPaginationMeta } from "@/server/modules/shared/helpers/pagination";
import {
  APPOINTMENT_TIMELINE_STEPS,
  BARBER_NOTIFICATION_TYPE_LABELS,
  BARBER_NOTIFICATION_ACTIONABLE,
  type BarberExperienceTier,
  type ReviewCategoryKey,
  type BarberNotificationType,
  type TimelineStepState,
} from "@/server/modules/barber/constants";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Convert integer cents to decimal dollars.  4500 → 45.00 */
export function centsToDollars(cents: number): number {
  return Math.round(cents) / 100;
}

/** Convert decimal dollars to integer cents.  45.00 → 4500 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

const EXPERIENCE_TIER_TO_YEARS: Record<BarberExperienceTier, number> = {
  "0-2": 1,
  "2-5": 3,
  "5-10": 7,
  "10+": 12,
};

/** Map API experience tier → integer years stored in barber_profiles.experience */
export function experienceTierToYears(tier: BarberExperienceTier): number {
  return EXPERIENCE_TIER_TO_YEARS[tier] ?? 0;
}

/** Map stored years → API experience tier */
export function yearsToExperienceTier(years: number): BarberExperienceTier {
  if (years < 2) return "0-2";
  if (years < 5) return "2-5";
  if (years < 10) return "5-10";
  return "10+";
}

/** "09:00" → "9:00 AM",  "13:30" → "1:30 PM" */
function formatTime12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

/** Date → "May 12, 2025" */
function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Date → "Mon, 12 May · 2:30 PM" */
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

/** Date → relative label: "2 min ago", "3 hrs ago", "Yesterday", "May 12" */
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

/** "Marcus Vale" → initials "MV" */
function toInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

/** "Marcus Vale" → "Marcus V." (last name initial for public display) */
function toPublicName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return parts[0] ?? "Guest";
  return `${parts[0]} ${parts[parts.length - 1]!.charAt(0)}.`;
}

export { buildPaginationMeta };

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE  ·  GET /api/v1/barber/profile
// ─────────────────────────────────────────────────────────────────────────────

type ProfileDbRow = {
  id: string;
  slug: string;
  displayRole: string;
  experience: number;
  bio: string | null;
  portfolioUrl: string | null;
  availability: string | null;
  isAvailable: boolean;
  barberStatus: string;
  joinedAt: Date;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string | null;
    photoUrl: string | null;
    city: string | null;
  };
  shop: {
    id: string;
    name: string;
    address: string | null;
    city: string;
    openHoursSummary: string | null;
  } | null;
  specialties: { name: string }[];
  galleryImages: { id: string; src: string; alt: string | null; sortOrder: number }[];
  workingHours: {
    day: number;
    openTime: string | null;
    closeTime: string | null;
    isClosed: boolean;
  }[];
};

export type BarberProfileDto = {
  id: string;
  slug: string;
  displayRole: string;
  experience: number;
  bio: string | null;
  portfolioUrl: string | null;
  availability: string | null;
  isAvailable: boolean;
  barberStatus: string;
  joinedAt: string;
  // User fields flattened for the profile form
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  city: string | null;
  // Shop
  shopId: string | null;
  shopName: string | null;
  shopAddress: string | null;
  shopCity: string | null;
  shopHours: string | null;
  // Derived
  specialties: string[];
  gallery: { id: string; src: string; alt: string | null; sortOrder: number }[];
  initials: string;
};

export function toBarberProfileDto(row: ProfileDbRow): BarberProfileDto {
  return {
    id: row.id,
    slug: row.slug,
    displayRole: row.displayRole,
    experience: row.experience,
    bio: row.bio,
    portfolioUrl: row.portfolioUrl,
    availability: row.availability,
    isAvailable: row.isAvailable,
    barberStatus: row.barberStatus,
    joinedAt: row.joinedAt.toISOString(),
    userId: row.user.id,
    firstName: row.user.firstName,
    lastName: row.user.lastName,
    fullName: row.user.fullName,
    email: row.user.email,
    phone: row.user.phone,
    photoUrl: row.user.photoUrl,
    city: row.user.city,
    shopId: row.shop?.id ?? null,
    shopName: row.shop?.name ?? null,
    shopAddress: row.shop?.address ?? null,
    shopCity: row.shop?.city ?? null,
    shopHours: row.shop?.openHoursSummary ?? null,
    specialties: row.specialties.map((s) => s.name),
    gallery: [...row.galleryImages].sort((a, b) => a.sortOrder - b.sortOrder),
    initials: toInitials(row.user.fullName),
  };
}

export type GalleryImageDto = {
  id: string;
  src: string;
  alt: string | null;
  sortOrder: number;
};

export function toGalleryImageDto(row: {
  id: string;
  src: string;
  alt: string | null;
  sortOrder: number;
}): GalleryImageDto {
  return { id: row.id, src: row.src, alt: row.alt, sortOrder: row.sortOrder };
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES  ·  GET /api/v1/barber/services
// ─────────────────────────────────────────────────────────────────────────────

export type BarberServiceDbRow = {
  id: string;
  isActive: boolean;
  priceOverride: number | null;
  service: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
    isPopular: boolean;
    isActive: boolean;
  };
};

export type BarberServiceDto = {
  id: string;
  serviceId: string;
  slug: string;
  name: string;
  description: string | null;
  price: number; // dollars
  duration: number; // minutes
  isActive: boolean;
  isPopular: boolean;
  hasPriceOverride: boolean;
  catalogPrice: number; // dollars — original catalog price before override
};

export function toBarberServiceDto(row: BarberServiceDbRow): BarberServiceDto {
  const effectivePriceCents = row.priceOverride ?? row.service.price;
  return {
    id: row.id,
    serviceId: row.service.id,
    slug: row.service.slug,
    name: row.service.name,
    description: row.service.description,
    price: centsToDollars(effectivePriceCents),
    duration: row.service.duration,
    isActive: row.isActive,
    isPopular: row.service.isPopular,
    hasPriceOverride: row.priceOverride !== null,
    catalogPrice: centsToDollars(row.service.price),
  };
}

export type ServicesStatsDto = {
  total: number;
  active: number;
  minPrice: number;
  maxPrice: number;
  avgDuration: number;
};

export function toServicesStatsDto(services: BarberServiceDto[]): ServicesStatsDto {
  const active = services.filter((s) => s.isActive);
  const prices = active.map((s) => s.price);
  const durations = active.map((s) => s.duration);
  return {
    total: services.length,
    active: active.length,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    avgDuration: durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULE  ·  GET /api/v1/barber/schedule
// ─────────────────────────────────────────────────────────────────────────────

type WorkingHoursDbRow = {
  day: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
};

type BreakSlotDbRow = {
  id: string;
  label: string;
  start: string;
  end: string;
};

type UnavailableDateDbRow = {
  id: string;
  date: string; // "YYYY-MM-DD"
};

export type WorkingDayDto = {
  key: string;
  label: string;
  short: string;
  dayIndex: number;
  enabled: boolean;
  openTime: string | null;
  closeTime: string | null;
  /** Formatted display: "9:00 AM – 6:00 PM" or "Closed" */
  display: string;
};

export type BreakSlotDto = {
  id: string;
  label: string;
  start: string;
  end: string;
  /** Formatted: "1:00 PM – 2:00 PM" */
  display: string;
};

export type ScheduleDto = {
  days: WorkingDayDto[];
  breaks: BreakSlotDto[];
  unavailableDates: string[];
};

const DAY_META = [
  { key: "sun", label: "Sunday", short: "Sun", dayIndex: 0 },
  { key: "mon", label: "Monday", short: "Mon", dayIndex: 1 },
  { key: "tue", label: "Tuesday", short: "Tue", dayIndex: 2 },
  { key: "wed", label: "Wednesday", short: "Wed", dayIndex: 3 },
  { key: "thu", label: "Thursday", short: "Thu", dayIndex: 4 },
  { key: "fri", label: "Friday", short: "Fri", dayIndex: 5 },
  { key: "sat", label: "Saturday", short: "Sat", dayIndex: 6 },
] as const;

export function toScheduleDto(
  workingHours: WorkingHoursDbRow[],
  breaks: BreakSlotDbRow[],
  unavailableDates: UnavailableDateDbRow[],
): ScheduleDto {
  const hoursByDay = new Map(workingHours.map((r) => [r.day, r]));

  const days: WorkingDayDto[] = DAY_META.map(({ key, label, short, dayIndex }) => {
    const row = hoursByDay.get(dayIndex);
    const enabled = Boolean(row && !row.isClosed);
    const openTime = row?.openTime ?? null;
    const closeTime = row?.closeTime ?? null;
    const display =
      enabled && openTime && closeTime
        ? `${formatTime12h(openTime)} – ${formatTime12h(closeTime)}`
        : "Closed";
    return { key, label, short, dayIndex, enabled, openTime, closeTime, display };
  });

  const breakDtos: BreakSlotDto[] = breaks.map((b) => ({
    id: b.id,
    label: b.label,
    start: b.start,
    end: b.end,
    display: `${formatTime12h(b.start)} – ${formatTime12h(b.end)}`,
  }));

  return {
    days,
    breaks: breakDtos,
    unavailableDates: unavailableDates.map((u) => u.date),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// APPOINTMENTS  ·  GET /api/v1/barber/appointments
// ─────────────────────────────────────────────────────────────────────────────

type AppointmentServiceSnapshot = {
  name: string;
  price: number; // cents
  duration: number;
};

type ServiceChangeItemSnapshot = {
  side: string;
  name: string;
  price: number;
  duration: number;
};

type ServiceChangeRequestDbRow = {
  id: string;
  status: string;
  customerNote: string | null;
  rejectionNote: string | null;
  requestedAt: Date;
  resolvedAt: Date | null;
  items: ServiceChangeItemSnapshot[];
};

type AppointmentListDbRow = {
  id: string;
  status: string;
  startAt: Date;
  estimatedPrice: number;
  finalPrice: number | null;
  notes: string | null;
  bookedAt: Date;
  cancelledBy: string | null;
  cancelReason: string | null;
  customer: {
    fullName: string;
    email: string;
    phone: string | null;
    photoUrl: string | null;
  };
  services: AppointmentServiceSnapshot[];
};

type AppointmentDetailDbRow = AppointmentListDbRow & {
  confirmedAt: Date | null;
  arrivedAt: Date | null;
  completedAt: Date | null;
  barberNotes: string | null;
  serviceChangeRequests: ServiceChangeRequestDbRow[];
  modificationHistory: {
    id: string;
    actor: string;
    field: string | null;
    previousValue: string | null;
    updatedValue: string | null;
    summary: string;
    reason: string | null;
    at: Date;
  }[];
};

export type AppointmentServiceDto = {
  name: string;
  price: number; // dollars
  duration: number;
};

export type TimelineStepDto = {
  key: string;
  label: string;
  at: string | null;
  state: TimelineStepState;
};

export type ServiceChangeDto = {
  id: string;
  status: string;
  customerNote: string | null;
  rejectionNote: string | null;
  requestedAt: string;
  resolvedAt: string | null;
  originalServices: AppointmentServiceDto[];
  updatedServices: AppointmentServiceDto[];
};

export type AppointmentListItemDto = {
  id: string;
  status: string;
  startAt: string;
  dateDisplay: string;
  estimatedPrice: number;
  finalPrice: number | null;
  notes: string | null;
  bookedAt: string;
  cancelledBy: string | null;
  cancelReason: string | null;
  customer: {
    name: string;
    initials: string;
    email: string;
    phone: string | null;
    photoUrl: string | null;
  };
  services: AppointmentServiceDto[];
  /** Concatenated display label: "Skin Fade + Beard Sculpt" */
  serviceLabel: string;
  totalPrice: number;
  totalDuration: number;
};

export type AppointmentDetailDto = AppointmentListItemDto & {
  confirmedAt: string | null;
  arrivedAt: string | null;
  completedAt: string | null;
  barberNotes: string | null;
  timeline: TimelineStepDto[];
  serviceChangeRequests: ServiceChangeDto[];
  modificationHistory: {
    id: string;
    actor: string;
    field: string | null;
    previousValue: string | null;
    updatedValue: string | null;
    summary: string;
    reason: string | null;
    at: string;
  }[];
};

function toAppointmentServices(rows: AppointmentServiceSnapshot[]): AppointmentServiceDto[] {
  return rows.map((s) => ({
    name: s.name,
    price: centsToDollars(s.price),
    duration: s.duration,
  }));
}

function buildTimeline(row: AppointmentDetailDbRow): TimelineStepDto[] {
  const timestamps: Record<string, Date | null> = {
    created: row.bookedAt,
    accepted: row.confirmedAt,
    arrived: row.arrivedAt,
    inService: row.arrivedAt, // same event triggers in-service
    completed: row.completedAt,
  };

  const isCancelled = row.status === "CANCELLED" || row.status === "NO_SHOW";
  const isCompleted = row.status === "COMPLETED";

  return APPOINTMENT_TIMELINE_STEPS.map(({ key, label }, i) => {
    const at = timestamps[key] ?? null;
    let state: TimelineStepState;

    if (isCancelled) {
      state = at ? "done" : "cancelled";
    } else if (isCompleted) {
      state = at ? "done" : "upcoming";
    } else {
      const lastDone = APPOINTMENT_TIMELINE_STEPS.findLastIndex(
        (s) => (timestamps[s.key] ?? null) !== null,
      );
      if (i < lastDone || (i === lastDone && at)) state = "done";
      else if (i === lastDone + 1) state = "current";
      else state = "upcoming";
    }

    return { key, label, at: at ? at.toISOString() : null, state };
  });
}

export function toAppointmentListItemDto(row: AppointmentListDbRow): AppointmentListItemDto {
  const services = toAppointmentServices(row.services);
  const totalPrice = services.reduce((s, sv) => s + sv.price, 0);
  const totalDuration = services.reduce((s, sv) => s + sv.duration, 0);

  return {
    id: row.id,
    status: row.status.toLowerCase().replace(/_/g, "-"),
    startAt: row.startAt.toISOString(),
    dateDisplay: formatAppointmentDate(row.startAt),
    estimatedPrice: centsToDollars(row.estimatedPrice),
    finalPrice: row.finalPrice !== null ? centsToDollars(row.finalPrice) : null,
    notes: row.notes,
    bookedAt: row.bookedAt.toISOString(),
    cancelledBy: row.cancelledBy?.toLowerCase() ?? null,
    cancelReason: row.cancelReason,
    customer: {
      name: row.customer.fullName,
      initials: toInitials(row.customer.fullName),
      email: row.customer.email,
      phone: row.customer.phone,
      photoUrl: row.customer.photoUrl,
    },
    services,
    serviceLabel: services.map((s) => s.name).join(" + "),
    totalPrice,
    totalDuration,
  };
}

export function toAppointmentDetailDto(row: AppointmentDetailDbRow): AppointmentDetailDto {
  const base = toAppointmentListItemDto(row);

  const serviceChanges: ServiceChangeDto[] = row.serviceChangeRequests.map((sc) => ({
    id: sc.id,
    status: sc.status.toLowerCase(),
    customerNote: sc.customerNote,
    rejectionNote: sc.rejectionNote,
    requestedAt: sc.requestedAt.toISOString(),
    resolvedAt: sc.resolvedAt?.toISOString() ?? null,
    originalServices: sc.items
      .filter((i) => i.side === "original")
      .map((i) => ({ name: i.name, price: centsToDollars(i.price), duration: i.duration })),
    updatedServices: sc.items
      .filter((i) => i.side === "updated")
      .map((i) => ({ name: i.name, price: centsToDollars(i.price), duration: i.duration })),
  }));

  return {
    ...base,
    confirmedAt: row.confirmedAt?.toISOString() ?? null,
    arrivedAt: row.arrivedAt?.toISOString() ?? null,
    completedAt: row.completedAt?.toISOString() ?? null,
    barberNotes: row.barberNotes,
    timeline: buildTimeline(row),
    serviceChangeRequests: serviceChanges,
    modificationHistory: row.modificationHistory.map((m) => ({
      id: m.id,
      actor: m.actor,
      field: m.field,
      previousValue: m.previousValue,
      updatedValue: m.updatedValue,
      summary: m.summary,
      reason: m.reason,
      at: m.at.toISOString(),
    })),
  };
}

export type AppointmentStatsDto = {
  pending: number;
  confirmed: number;
  completed: number;
  today: number;
};

export function toAppointmentStatsDto(rows: AppointmentListItemDto[]): AppointmentStatsDto {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart.getTime() + 86_400_000);

  return {
    pending: rows.filter((a) => a.status === "pending").length,
    confirmed: rows.filter((a) => a.status === "confirmed").length,
    completed: rows.filter((a) => a.status === "completed").length,
    today: rows.filter((a) => {
      const t = new Date(a.startAt).getTime();
      return t >= todayStart.getTime() && t < todayEnd.getTime();
    }).length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// QUEUE  ·  GET /api/v1/barber/queue
// ─────────────────────────────────────────────────────────────────────────────

type QueueEntryDbRow = {
  id: string;
  source: string;
  customerName: string;
  phone: string | null;
  serviceName: string;
  duration: number;
  notes: string | null;
  status: string;
  position: number;
  addedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  chair: { id: string; label: string } | null;
  appointmentId: string | null;
  walkInId: string | null;
};

type ChairDbRow = {
  id: string;
  label: string;
  sortOrder: number;
};

export type QueueEntryDto = {
  id: string;
  source: string;
  customerName: string;
  initials: string;
  phone: string | null;
  serviceName: string;
  duration: number;
  notes: string | null;
  status: string;
  position: number;
  addedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  chairId: string | null;
  chairLabel: string | null;
  /** Elapsed minutes since startedAt (null if not in service) */
  elapsedMin: number | null;
  appointmentId: string | null;
  walkInId: string | null;
};

export type ChairDto = {
  id: string;
  label: string;
  sortOrder: number;
  isBusy: boolean;
  occupantId: string | null;
};

export type QueueSnapshotDto = {
  entries: QueueEntryDto[];
  chairs: ChairDto[];
  waiting: number;
  inService: number;
  chairsBusy: number;
  chairsFree: number;
  chairsTotal: number;
  avgWaitMin: number;
  nextUp: { id: string; name: string; service: string; source: string; waitMin: number }[];
};

export function toQueueEntryDto(row: QueueEntryDbRow): QueueEntryDto {
  const elapsedMin = row.startedAt
    ? Math.floor((Date.now() - row.startedAt.getTime()) / 60_000)
    : null;

  return {
    id: row.id,
    source: row.source.toLowerCase().replace("_", "-"),
    customerName: row.customerName,
    initials: toInitials(row.customerName),
    phone: row.phone,
    serviceName: row.serviceName,
    duration: row.duration,
    notes: row.notes,
    status: row.status.toLowerCase().replace("_", "-"),
    position: row.position,
    addedAt: row.addedAt.toISOString(),
    startedAt: row.startedAt?.toISOString() ?? null,
    completedAt: row.completedAt?.toISOString() ?? null,
    chairId: row.chair?.id ?? null,
    chairLabel: row.chair?.label ?? null,
    elapsedMin,
    appointmentId: row.appointmentId,
    walkInId: row.walkInId,
  };
}

export function toQueueSnapshotDto(
  entries: QueueEntryDbRow[],
  chairs: ChairDbRow[],
): QueueSnapshotDto {
  const entryDtos = entries.map(toQueueEntryDto);
  const occupantIds = new Set(
    entries.filter((e) => e.status === "IN_SERVICE" && e.chair).map((e) => e.id),
  );

  const chairDtos: ChairDto[] = chairs.map((c) => {
    const occupant = entries.find((e) => e.chair?.id === c.id && e.status === "IN_SERVICE");
    return {
      id: c.id,
      label: c.label,
      sortOrder: c.sortOrder,
      isBusy: Boolean(occupant),
      occupantId: occupant?.id ?? null,
    };
  });

  const waiting = entryDtos.filter((e) => e.status === "waiting").length;
  const inService = entryDtos.filter((e) => e.status === "in-service").length;
  const chairsBusy = chairDtos.filter((c) => c.isBusy).length;

  // Average wait: mean of (addedAt → now) for waiting entries
  const waitingEntries = entries.filter((e) => e.status === "WAITING");
  const avgWaitMin = waitingEntries.length
    ? Math.round(
        waitingEntries.reduce((sum, e) => sum + (Date.now() - e.addedAt.getTime()) / 60_000, 0) /
          waitingEntries.length,
      )
    : 0;

  const nextUp = entryDtos
    .filter((e) => e.status === "waiting")
    .slice(0, 3)
    .map((e) => ({
      id: e.id,
      name: e.customerName,
      service: e.serviceName,
      source: e.source,
      waitMin: Math.floor((Date.now() - new Date(e.addedAt).getTime()) / 60_000),
    }));

  return {
    entries: entryDtos,
    chairs: chairDtos,
    waiting,
    inService,
    chairsBusy,
    chairsFree: chairDtos.length - chairsBusy,
    chairsTotal: chairDtos.length,
    avgWaitMin,
    nextUp,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// WALK-INS  ·  GET /api/v1/barber/walk-ins
// ─────────────────────────────────────────────────────────────────────────────

type WalkInDbRow = {
  id: string;
  customerName: string;
  phone: string | null;
  serviceName: string;
  duration: number;
  notes: string | null;
  status: string;
  addedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
};

export type WalkInDto = {
  id: string;
  customerName: string;
  initials: string;
  phone: string | null;
  serviceName: string;
  duration: number;
  notes: string | null;
  status: string;
  addedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  /** Elapsed minutes since addedAt — shown in walk-in list UI */
  elapsedMin: number;
};

export function toWalkInDto(row: WalkInDbRow): WalkInDto {
  return {
    id: row.id,
    customerName: row.customerName,
    initials: toInitials(row.customerName),
    phone: row.phone,
    serviceName: row.serviceName,
    duration: row.duration,
    notes: row.notes,
    status: row.status.toLowerCase().replace(/_/g, "-"),
    addedAt: row.addedAt.toISOString(),
    startedAt: row.startedAt?.toISOString() ?? null,
    completedAt: row.completedAt?.toISOString() ?? null,
    cancelledAt: row.cancelledAt?.toISOString() ?? null,
    elapsedMin: Math.floor((Date.now() - row.addedAt.getTime()) / 60_000),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS  ·  GET /api/v1/barber/reviews
// ─────────────────────────────────────────────────────────────────────────────

type ReviewDbRow = {
  id: string;
  rating: number;
  comment: string | null;
  barberReply: string | null;
  barberRepliedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    fullName: string;
    email: string;
    phone: string | null;
  };
  appointment: {
    id: string;
    services: { name: string }[];
  };
};

export type ReviewListItemDto = {
  id: string;
  rating: number;
  text: string | null;
  date: string;
  dateDisplay: string;
  hasReply: boolean;
  barberReply: string | null;
  barberRepliedAt: string | null;
  helpful: number;
  service: string | null;
  customer: {
    name: string;
    initials: string;
    email: string;
    phone: string | null;
  };
  appointmentId: string;
};

export type ReviewDetailDto = ReviewListItemDto & {
  categoryRatings: Record<ReviewCategoryKey, number>;
  history: {
    id: string;
    type: "review" | "reply";
    at: string;
    title: string;
    body: string;
  }[];
};

export type RatingBreakdownDto = Record<string, number> & {
  average: number;
  total: number;
};

/** Derive category ratings from a single overall score (matches reviewsData.js logic) */
function categoryRatingsFromOverall(rating: number): Record<ReviewCategoryKey, number> {
  const clamp = (n: number) => Math.min(5, Math.max(1, Math.round(n)));
  return {
    service: rating,
    ambiance: clamp(rating - (rating <= 2 ? 0 : 1)),
    professionalism: rating,
    value: clamp(rating - (rating >= 4 ? 0 : 1)),
  };
}

export function toReviewListItemDto(row: ReviewDbRow): ReviewListItemDto {
  return {
    id: row.id,
    rating: row.rating,
    text: row.comment,
    date: row.createdAt.toISOString(),
    dateDisplay: formatShortDate(row.createdAt),
    hasReply: row.barberReply !== null,
    barberReply: row.barberReply,
    barberRepliedAt: row.barberRepliedAt?.toISOString() ?? null,
    helpful: 0, // no helpful-count column yet; future extension
    service: row.appointment.services[0]?.name ?? null,
    customer: {
      name: toPublicName(row.customer.fullName),
      initials: toInitials(row.customer.fullName),
      email: row.customer.email,
      phone: row.customer.phone,
    },
    appointmentId: row.appointment.id,
  };
}

export function toReviewDetailDto(row: ReviewDbRow): ReviewDetailDto {
  const base = toReviewListItemDto(row);
  const categoryRatings = categoryRatingsFromOverall(row.rating);

  const history: ReviewDetailDto["history"] = [
    {
      id: `${row.id}-review`,
      type: "review",
      at: row.createdAt.toISOString(),
      title: "Review posted",
      body: row.comment ?? "",
    },
  ];
  if (row.barberReply && row.barberRepliedAt) {
    history.push({
      id: `${row.id}-reply`,
      type: "reply",
      at: row.barberRepliedAt.toISOString(),
      title: "Barber replied",
      body: row.barberReply,
    });
  }

  return { ...base, categoryRatings, history };
}

export function toRatingBreakdownDto(reviews: { rating: number }[]): RatingBreakdownDto {
  const counts: Record<string, number> = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
  for (const r of reviews) {
    const key = String(Math.min(5, Math.max(1, r.rating)));
    counts[key] = (counts[key] ?? 0) + 1;
  }
  const total = reviews.length;
  const average = total
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 10) / 10
    : 0;
  return { ...counts, average, total };
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS  ·  GET /api/v1/barber/analytics
// ─────────────────────────────────────────────────────────────────────────────

export type TrendPointDto = { label: string; value: number };
export type GrowthPointDto = { label: string; new: number; returning: number };
export type ServicePopDto = { label: string; value: number };
export type MonthlySummaryDto = {
  month: string;
  revenue: number;
  appointments: number;
  completed: number;
  rating: number;
};
export type InsightDto = { title: string; body: string; trend: number };

export type AnalyticsStatsDto = {
  totalRevenue: number;
  totalAppointments: number;
  completedAppointments: number;
  totalCustomers: number;
  averageRating: number;
};

export type AnalyticsDeltasDto = Record<keyof AnalyticsStatsDto, number>;

export type AnalyticsDto = {
  period: string;
  label: string;
  stats: AnalyticsStatsDto;
  deltas: AnalyticsDeltasDto;
  revenueTrend: TrendPointDto[];
  appointmentTrend: TrendPointDto[];
  servicePopularity: ServicePopDto[];
  customerGrowth: GrowthPointDto[];
  customers: { new: number; returning: number; total: number };
  monthlySummary: MonthlySummaryDto[];
  insights: InsightDto[];
  meta: { generatedAt: string; periodStart: string; periodEnd: string };
};

type AnalyticsRawData = {
  period: string;
  label: string;
  totalRevenueCents: number;
  totalAppointments: number;
  completedAppointments: number;
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageRating: number;
  prevTotalRevenueCents: number;
  prevTotalAppointments: number;
  prevCompletedAppointments: number;
  prevTotalCustomers: number;
  prevAverageRating: number;
  revenueTrend: { label: string; totalCents: number }[];
  appointmentTrend: TrendPointDto[];
  servicePopularity: ServicePopDto[];
  customerGrowth: GrowthPointDto[];
  monthlySummary: {
    month: string;
    revenueCents: number;
    appointments: number;
    completed: number;
    rating: number;
  }[];
  insights: InsightDto[];
  periodStart: Date;
  periodEnd: Date;
};

function calcDelta(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function toAnalyticsDto(raw: AnalyticsRawData): AnalyticsDto {
  const totalRevenue = centsToDollars(raw.totalRevenueCents);
  const prevRevenue = centsToDollars(raw.prevTotalRevenueCents);

  return {
    period: raw.period,
    label: raw.label,
    stats: {
      totalRevenue,
      totalAppointments: raw.totalAppointments,
      completedAppointments: raw.completedAppointments,
      totalCustomers: raw.totalCustomers,
      averageRating: Math.round(raw.averageRating * 10) / 10,
    },
    deltas: {
      totalRevenue: calcDelta(totalRevenue, prevRevenue),
      totalAppointments: calcDelta(raw.totalAppointments, raw.prevTotalAppointments),
      completedAppointments: calcDelta(raw.completedAppointments, raw.prevCompletedAppointments),
      totalCustomers: calcDelta(raw.totalCustomers, raw.prevTotalCustomers),
      averageRating: calcDelta(raw.averageRating, raw.prevAverageRating),
    },
    revenueTrend: raw.revenueTrend.map((p) => ({
      label: p.label,
      value: centsToDollars(p.totalCents),
    })),
    appointmentTrend: raw.appointmentTrend,
    servicePopularity: raw.servicePopularity,
    customerGrowth: raw.customerGrowth,
    customers: {
      new: raw.newCustomers,
      returning: raw.returningCustomers,
      total: raw.totalCustomers,
    },
    monthlySummary: raw.monthlySummary.map((r) => ({
      month: r.month,
      revenue: centsToDollars(r.revenueCents),
      appointments: r.appointments,
      completed: r.completed,
      rating: r.rating,
    })),
    insights: raw.insights,
    meta: {
      generatedAt: new Date().toISOString(),
      periodStart: raw.periodStart.toISOString(),
      periodEnd: raw.periodEnd.toISOString(),
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS  ·  GET /api/v1/barber/notifications
// ─────────────────────────────────────────────────────────────────────────────

type NotificationDbRow = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  metadata: unknown;
  createdAt: Date;
  appointmentId: string | null;
};

export type NotificationDto = {
  id: string;
  type: string;
  typeLabel: string;
  title: string;
  message: string;
  isRead: boolean;
  actionable: boolean;
  time: string;
  createdAt: string;
  appointmentId: string | null;
  /** Type-specific payload extracted from metadata */
  client: string | null;
  avatar: string | null;
  service: string | null;
  date: string | null;
  duration: string | null;
  shop: string | null;
  oldDate: string | null;
  newDate: string | null;
  reason: string | null;
  rating: number | null;
  review: string | null;
  cancelledBy: string | null;
};

function notificationMetadataRecord(metadata: unknown): Record<string, unknown> {
  if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
    return metadata as Record<string, unknown>;
  }
  return {};
}

export function toNotificationDto(row: NotificationDbRow): NotificationDto {
  const meta = notificationMetadataRecord(row.metadata);
  const bType = row.type as BarberNotificationType;
  const typeLabel = BARBER_NOTIFICATION_TYPE_LABELS[bType] ?? row.type;
  const actionable = BARBER_NOTIFICATION_ACTIONABLE[bType] ?? false;

  return {
    id: row.id,
    type: row.type,
    typeLabel,
    title: row.title,
    message: row.message,
    isRead: row.isRead,
    actionable,
    time: formatRelativeTime(row.createdAt),
    createdAt: row.createdAt.toISOString(),
    appointmentId: row.appointmentId,
    client: (meta.client as string) ?? null,
    avatar: (meta.avatar as string) ?? null,
    service: (meta.service as string) ?? null,
    date: (meta.date as string) ?? null,
    duration: (meta.duration as string) ?? null,
    shop: (meta.shop as string) ?? null,
    oldDate: (meta.oldDate as string) ?? null,
    newDate: (meta.newDate as string) ?? null,
    reason: (meta.reason as string) ?? null,
    rating: (meta.rating as number) ?? null,
    review: (meta.review as string) ?? null,
    cancelledBy: (meta.cancelledBy as string) ?? null,
  };
}

export type NotificationsSummaryDto = {
  total: number;
  unread: number;
  actionable: number;
};

export function toNotificationsSummaryDto(rows: NotificationDbRow[]): NotificationsSummaryDto {
  return {
    total: rows.length,
    unread: rows.filter((n) => !n.isRead).length,
    actionable: rows.filter((n) => BARBER_NOTIFICATION_ACTIONABLE[n.type as BarberNotificationType])
      .length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD  ·  GET /api/v1/barber/dashboard
// ─────────────────────────────────────────────────────────────────────────────

export type DashboardDto = {
  barber: {
    firstName: string;
    displayRole: string;
    photoUrl: string | null;
  };
  stats: {
    today: number;
    completed: number;
    upcoming: number;
    pending: number;
    earnings: number;
    served: number;
  };
  todaySchedule: AppointmentListItemDto[];
  pendingRequests: AppointmentListItemDto[];
  queueSnapshot: QueueSnapshotDto;
  earnings: {
    today: number;
    yesterday: number;
    weekToDate: number;
    weekTarget: number;
    trend: number[];
    tips: number;
  };
  customerStats: {
    servedToday: number;
    newClients: number;
    returning: number;
    avgRating: number;
    reviewsThisWeek: number;
    rebookRate: number;
  };
};

type DashboardRawData = {
  barber: {
    firstName: string;
    displayRole: string;
    photoUrl: string | null;
  };
  todayAppointments: AppointmentListDbRow[];
  pendingRequests: AppointmentListDbRow[];
  queueEntries: QueueEntryDbRow[];
  chairs: ChairDbRow[];
  earningsToday: number; // cents
  earningsYesterday: number;
  earningsWeekToDate: number;
  earningsWeekTarget: number;
  earningsTrend: number[]; // cents per day, 7 entries
  earningsTips: number;
  servedToday: number;
  newClientsToday: number;
  returningToday: number;
  avgRating: number;
  reviewsThisWeek: number;
  rebookRate: number;
};

export function toDashboardDto(raw: DashboardRawData): DashboardDto {
  const todayDtos = raw.todayAppointments.map(toAppointmentListItemDto);
  const pendingDtos = raw.pendingRequests.map(toAppointmentListItemDto);
  const queueDto = toQueueSnapshotDto(raw.queueEntries, raw.chairs);

  const completed = todayDtos.filter((a) => a.status === "completed").length;
  const upcoming = todayDtos.filter(
    (a) => a.status === "confirmed" || a.status === "in-service",
  ).length;

  return {
    barber: raw.barber,
    stats: {
      today: todayDtos.length,
      completed,
      upcoming,
      pending: pendingDtos.length,
      earnings: centsToDollars(raw.earningsToday),
      served: raw.servedToday,
    },
    todaySchedule: todayDtos,
    pendingRequests: pendingDtos,
    queueSnapshot: queueDto,
    earnings: {
      today: centsToDollars(raw.earningsToday),
      yesterday: centsToDollars(raw.earningsYesterday),
      weekToDate: centsToDollars(raw.earningsWeekToDate),
      weekTarget: centsToDollars(raw.earningsWeekTarget),
      trend: raw.earningsTrend.map(centsToDollars),
      tips: centsToDollars(raw.earningsTips),
    },
    customerStats: {
      servedToday: raw.servedToday,
      newClients: raw.newClientsToday,
      returning: raw.returningToday,
      avgRating: Math.round(raw.avgRating * 10) / 10,
      reviewsThisWeek: raw.reviewsThisWeek,
      rebookRate: raw.rebookRate,
    },
  };
}
