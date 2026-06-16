import { createInitialDays } from "@/client/modules/barber/components/Schedule/helpers.jsx";

const NOTIFICATION_UI_TYPES = {
  NEW_BOOKING_REQUEST: "booking_request",
  BOOKING_MODIFICATION_REQUEST: "modification",
  SERVICE_CHANGE_REQUESTED: "modification",
  REVIEW_REQUEST: "review",
  BOOKING_CANCELLED_BY_CUSTOMER: "cancellation",
  BOOKING_CANCELLED: "cancellation",
};

function normalizeStatus(status) {
  if (!status) return status;
  return String(status).toLowerCase().replace(/_/g, "-");
}

function experienceToTier(value) {
  if (typeof value === "string" && ["0-2", "2-5", "5-10", "10+"].includes(value)) {
    return value;
  }
  const years = Number(value) || 0;
  if (years < 2) return "0-2";
  if (years < 5) return "2-5";
  if (years < 10) return "5-10";
  return "10+";
}

function formatInstagramFromUrl(url) {
  if (!url) return "";
  const match = String(url).match(/instagram\.com\/([^/?]+)/i);
  return match ? `@${match[1]}` : url;
}

function toPortfolioUrl(instagram) {
  const raw = instagram?.trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const handle = raw.replace(/^@/, "");
  return `https://instagram.com/${handle}`;
}

export function mapProfileFromApi(dto) {
  if (!dto) return null;
  return {
    shopName: dto.shopName ?? "",
    shopAddress: dto.shopAddress ?? "",
    shopPhone: dto.shopPhone ?? dto.phone ?? "",
    shopHours: dto.shopHours ?? "",
    shopAbout: dto.shopAbout ?? dto.availability ?? "",
    firstName: dto.firstName ?? "",
    lastName: dto.lastName ?? "",
    email: dto.email ?? "",
    phone: dto.phone ?? "",
    city: dto.city ?? "",
    instagram: formatInstagramFromUrl(dto.portfolioUrl ?? dto.instagram ?? ""),
    experience: experienceToTier(dto.experience),
    bio: dto.bio ?? "",
    specialties: dto.specialties ?? [],
    photoPreview: dto.photoUrl ?? "",
    availableToday: dto.isAvailable ?? false,
    portfolio: (dto.gallery ?? []).map((item) => ({
      id: item.id,
      url: item.src,
      caption: item.alt ?? "",
    })),
  };
}

export function mapProfileToApi(profile) {
  return {
    shopName: profile.shopName?.trim() || undefined,
    shopAddress: profile.shopAddress ?? "",
    shopPhone: profile.shopPhone ?? "",
    shopHours: profile.shopHours ?? "",
    shopAbout: profile.shopAbout ?? "",
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone ?? "",
    city: profile.city ?? "",
    portfolioUrl: toPortfolioUrl(profile.instagram),
    availableToday: profile.availableToday,
    experience: profile.experience,
    bio: profile.bio ?? "",
    specialties: profile.specialties ?? [],
  };
}

export function mapAppointmentListItem(dto) {
  if (!dto) return dto;
  return {
    ...dto,
    status: normalizeStatus(dto.status),
    customer: dto.customer ?? { name: dto.customer, phone: "", email: "" },
    service: dto.serviceLabel ?? dto.service ?? "",
    price: dto.totalPrice ?? dto.estimatedPrice ?? dto.price ?? 0,
    duration: dto.totalDuration ?? dto.duration ?? 0,
  };
}

export function mapDashboardAppointment(dto) {
  const item = mapAppointmentListItem(dto);
  return {
    id: item.id,
    customer: item.customer?.name ?? item.customer ?? "",
    service: item.service,
    duration: item.duration,
    price: item.price,
    startAt: item.startAt,
    status: item.status,
    requestedAt: item.bookedAt ?? item.requestedAt,
  };
}

export function mapScheduleFromApi(dto) {
  const days = createInitialDays();
  for (const day of dto?.days ?? []) {
    if (days[day.key]) {
      days[day.key] = {
        enabled: day.enabled,
        open: day.openTime ?? "09:00",
        close: day.closeTime ?? "18:00",
      };
    }
  }
  return {
    days,
    breaks: (dto?.breaks ?? []).map((b) => ({
      id: b.id,
      label: b.label,
      start: b.start,
      end: b.end,
    })),
    unavailableDates: dto?.unavailableDates ?? [],
  };
}

export function mapScheduleToApi({ days, breaks }) {
  const mappedDays = {};
  for (const [key, day] of Object.entries(days)) {
    mappedDays[key] = {
      enabled: day.enabled,
      openTime: day.open,
      closeTime: day.close,
    };
  }
  return { days: mappedDays, breaks };
}

export function mapServiceFromApi(dto) {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? "",
    price: dto.price,
    duration: dto.duration,
    active: dto.isActive ?? dto.active ?? true,
  };
}

export function mapServiceToApi(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    duration: Number(form.duration),
    active: form.active,
  };
}

export function mapQueueEntry(dto) {
  return {
    id: dto.id,
    name: dto.customerName,
    phone: dto.phone ?? "",
    service: dto.serviceName,
    duration: dto.duration,
    source: normalizeStatus(dto.source),
    status: normalizeStatus(dto.status),
    chairId: dto.chairId,
    addedAt: new Date(dto.addedAt).getTime(),
    startedAt: dto.startedAt ? new Date(dto.startedAt).getTime() : undefined,
    notes: dto.notes ?? "",
    appointmentId: dto.appointmentId,
    walkInId: dto.walkInId,
  };
}

export function mapChair(dto) {
  return {
    id: dto.id,
    label: dto.label,
    barber: "You",
    customerId: dto.occupantId,
  };
}

export function mapWalkIn(dto) {
  return {
    id: dto.id,
    name: dto.customerName,
    phone: dto.phone ?? "",
    service: dto.serviceName,
    duration: dto.duration,
    notes: dto.notes ?? "",
    status: normalizeStatus(dto.status),
    addedAt: new Date(dto.addedAt).getTime(),
  };
}

export function mapWalkInToApi(form) {
  return {
    customerName: form.name.trim(),
    phone: form.phone.trim(),
    serviceName: form.service,
    duration: Number(form.duration),
    notes: form.notes.trim(),
  };
}

export function mapNotification(dto) {
  const uiType = NOTIFICATION_UI_TYPES[dto.type] ?? dto.type?.toLowerCase?.() ?? dto.type;
  return {
    ...dto,
    type: uiType,
    read: dto.isRead ?? dto.read ?? false,
    client: dto.client ?? "",
    avatar: dto.avatar ?? (dto.client ? dto.client.slice(0, 2).toUpperCase() : ""),
    timestamp: dto.createdAt ? new Date(dto.createdAt) : new Date(),
  };
}

export function mapReview(dto) {
  if (!dto) return dto;
  return {
    ...dto,
    reply: dto.barberReply ?? dto.reply ?? null,
    replyAt: dto.barberRepliedAt ?? dto.replyAt ?? null,
    reported: dto.reported ?? false,
    date: dto.date?.slice?.(0, 10) ?? dto.date,
  };
}
