import { DAY_NAMES, SERVICE_MARKETING } from "@/server/modules/public/constants";
import type { PaginationMeta } from "@/server/shared/responses";

export function centsToDollars(cents: number): number {
  return Math.round(cents) / 100;
}

function formatReviewerName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return parts[0] ?? "Guest";
  return `${parts[0]} ${parts[parts.length - 1]!.charAt(0)}.`;
}

function formatTime24h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatRelativeDate(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 7) return `${days || 1} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

type BarberListRow = {
  slug: string;
  displayRole: string;
  experience: number;
  startingPrice: number;
  averageRating: number;
  reviewCount: number;
  isAvailable: boolean;
  barberStatus: string;
  user: { fullName: string; photoUrl: string | null; city: string | null };
  shop: { name: string; city: string } | null;
  specialties: { name: string }[];
  services: {
    isActive: boolean;
    service: { slug: string; name: string; isActive: boolean };
  }[];
};

export function toBarberListItem(row: BarberListRow) {
  const activeServices = row.services
    .filter((bs) => bs.isActive && bs.service.isActive)
    .map((bs) => bs.service.name);

  return {
    id: row.slug,
    name: row.user.fullName,
    role: row.displayRole,
    rating: row.averageRating,
    reviewCount: row.reviewCount,
    experience: row.experience,
    startingPrice: centsToDollars(row.startingPrice),
    available: row.barberStatus === "ACTIVE" && row.isAvailable,
    image: row.user.photoUrl,
    location: row.shop?.name ?? "Independent",
    city: row.shop?.city ?? row.user.city ?? "",
    specialties: row.specialties.map((s) => s.name),
    services: activeServices,
  };
}

type BarberDetailRow = Omit<BarberListRow, "services"> & {
  bio: string | null;
  portfolioUrl: string | null;
  shop: { name: string; city: string; address: string | null } | null;
  workingHours: {
    day: number;
    openTime: string | null;
    closeTime: string | null;
    isClosed: boolean;
  }[];
  galleryImages: { id: string; src: string; alt: string | null; sortOrder: number }[];
  services: {
    isActive: boolean;
    priceOverride: number | null;
    service: {
      slug: string;
      name: string;
      description: string | null;
      price: number;
      duration: number;
      isActive: boolean;
    };
  }[];
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    customer: { fullName: string };
    appointment: {
      services: { name: string }[];
    };
  }[];
};

export function toWorkingHours(
  rows: BarberDetailRow["workingHours"],
): { day: string; hours: string; closed: boolean }[] {
  const byDay = new Map(rows.map((r) => [r.day, r]));
  return DAY_NAMES.map((dayName, dayIndex) => {
    const row = byDay.get(dayIndex);
    if (!row || row.isClosed || !row.openTime || !row.closeTime) {
      return { day: dayName, hours: "Closed", closed: true };
    }
    return {
      day: dayName,
      hours: `${formatTime24h(row.openTime)} – ${formatTime24h(row.closeTime)}`,
      closed: false,
    };
  });
}

export function toRatingBreakdown(reviews: { rating: number }[]): Record<string, number> {
  const counts = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
  for (const r of reviews) {
    const key = String(Math.min(5, Math.max(1, r.rating))) as keyof typeof counts;
    counts[key] += 1;
  }
  return counts;
}

export function toBarberDetail(row: BarberDetailRow) {
  const base = toBarberListItem(row);
  const offeredServices = row.services
    .filter((bs) => bs.isActive && bs.service.isActive)
    .map((bs) => ({
      id: bs.service.slug,
      name: bs.service.name,
      price: centsToDollars(bs.priceOverride ?? bs.service.price),
      duration: bs.service.duration,
      description: bs.service.description,
    }));

  return {
    ...base,
    address: row.shop?.address ?? null,
    bio: row.bio,
    portfolioUrl: row.portfolioUrl,
    offeredServices,
    workingHours: toWorkingHours(row.workingHours),
    gallery: [...row.galleryImages]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((g) => ({ id: g.id, src: g.src, alt: g.alt })),
    ratingBreakdown: toRatingBreakdown(row.reviews),
    reviews: row.reviews.map((r) => ({
      id: r.id,
      name: formatReviewerName(r.customer.fullName),
      rating: r.rating,
      text: r.comment ?? "",
      date: formatRelativeDate(r.createdAt),
      service: r.appointment.services[0]?.name,
    })),
  };
}

type ServiceRow = {
  slug: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  isPopular: boolean;
};

export function toServiceListItem(row: ServiceRow) {
  const marketing = SERVICE_MARKETING[row.slug];
  return {
    id: row.slug,
    name: row.name,
    category: marketing?.category ?? "Service",
    startingPrice: centsToDollars(row.price),
    duration: row.duration,
    description: row.description,
    popular: row.isPopular,
  };
}

export function toServiceDetail(row: ServiceRow) {
  const list = toServiceListItem(row);
  const marketing = SERVICE_MARKETING[row.slug];
  return {
    ...list,
    tagline: marketing?.tagline ?? "",
    benefits: marketing?.benefits ?? [],
    note: marketing?.note,
    relatedIds: marketing?.relatedIds ?? [],
  };
}

type ShopRow = {
  slug: string;
  name: string;
  city: string;
  imageUrl: string | null;
  startingPrice: number;
  averageRating: number;
  reviewCount: number;
  barberCount: number;
};

export function toShopListItem(row: ShopRow) {
  return {
    id: row.slug,
    name: row.name,
    city: row.city,
    rating: row.averageRating,
    reviews: row.reviewCount,
    barbers: row.barberCount,
    image: row.imageUrl,
    startingPrice: centsToDollars(row.startingPrice),
  };
}

export function toTestimonial(row: {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  customer: { fullName: string };
}) {
  const parts = row.customer.fullName.trim().split(/\s+/);
  const displayName =
    parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]!.charAt(0)}.` : (parts[0] ?? "Guest");

  return {
    id: row.id,
    name: displayName,
    rating: row.rating,
    text: row.comment ?? "",
    date: formatRelativeDate(row.createdAt),
  };
}

export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  return {
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}
