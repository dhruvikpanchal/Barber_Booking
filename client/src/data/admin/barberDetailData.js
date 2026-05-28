import { SERVICE_CATALOG } from "@/config/catalog/services.js";
import { INITIAL_BARBERS } from "@/data/admin/barberData.js";

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

const DEFAULT_HOURS = [
  { day: "Mon", hours: "9:00 AM – 7:00 PM" },
  { day: "Tue", hours: "9:00 AM – 7:00 PM" },
  { day: "Wed", hours: "9:00 AM – 7:00 PM" },
  { day: "Thu", hours: "9:00 AM – 8:00 PM" },
  { day: "Fri", hours: "9:00 AM – 8:00 PM" },
  { day: "Sat", hours: "8:00 AM – 6:00 PM" },
  { day: "Sun", hours: "Closed" },
];

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function normalizeAccountStatus(status) {
  if (status === "disabled") return "suspended";
  return status;
}

function buildRatingBreakdown(rating, reviewCount) {
  const weights = [0.62, 0.22, 0.08, 0.05, 0.03];
  if (rating < 4) {
    weights[0] = 0.35;
    weights[1] = 0.25;
    weights[2] = 0.2;
  }
  const counts = weights.map((w, i) => {
    const star = 5 - i;
    const base = Math.round(reviewCount * w);
    if (star === Math.round(rating)) return base + Math.max(0, reviewCount - weights.reduce((s, _, j) => s + Math.round(reviewCount * weights[j]), 0));
    return base;
  });
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  return [5, 4, 3, 2, 1].map((star, i) => ({
    star,
    count: counts[i],
    percent: Math.round((counts[i] / total) * 100),
  }));
}

function buildRecentReviews(barber) {
  const samples = [
    {
      author: "Alex M.",
      text: "Consistent quality every visit. Booking and check-in were seamless.",
      rating: 5,
      daysAgo: 3,
    },
    {
      author: "Jordan K.",
      text: "Great attention to detail on the fade. Will book again.",
      rating: barber.rating >= 4.5 ? 5 : 4,
      daysAgo: 11,
    },
    {
      author: "Sam R.",
      text: "Professional atmosphere and solid cut. Wait time was minimal.",
      rating: Math.round(barber.rating),
      daysAgo: 18,
    },
  ];

  return samples.map((s, i) => ({
    id: `${barber.id}-rev-${i}`,
    author: s.author,
    text: s.text,
    rating: s.rating,
    date: new Date(
      Date.now() - s.daysAgo * 24 * 60 * 60 * 1000,
    ).toISOString(),
  }));
}

function buildActivity(barber, accountStatus) {
  const joined = new Date(barber.joinedAt);
  const events = [
    {
      id: `${barber.id}-act-1`,
      type: "account",
      title: "Account created",
      description: `${barber.name} joined Iron & Oak as a barber.`,
      at: joined.toISOString(),
    },
    {
      id: `${barber.id}-act-2`,
      type: "profile",
      title: "Profile updated",
      description: "Bio, specialties, and shop details were refreshed.",
      at: new Date(joined.getTime() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    },
    {
      id: `${barber.id}-act-3`,
      type: "services",
      title: "Services updated",
      description: `${barber.servicesCount} services active on the menu.`,
      at: new Date(joined.getTime() + 1000 * 60 * 60 * 24 * 120).toISOString(),
    },
    {
      id: `${barber.id}-act-4`,
      type: "appointment",
      title: "Recent appointment completed",
      description: "Signature Cut · Customer #4821",
      at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: `${barber.id}-act-5`,
      type: "status",
      title: `Status set to ${accountStatus}`,
      description: "Account status updated by admin.",
      at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
  ];
  return events.sort((a, b) => new Date(b.at) - new Date(a.at));
}

/** Enrich list row for the admin barber detail page. */
export function buildAdminBarberDetail(raw) {
  const h = hashCode(raw.id);
  const accountStatus = normalizeAccountStatus(raw.status);
  const completed = Math.round(raw.appointmentsTotal * 0.88);
  const cancelled = Math.round(raw.appointmentsTotal * 0.06);
  const customersServed = Math.round(raw.appointmentsTotal * 0.72);
  const revenue = Math.round(completed * 42.5);
  const profileViews = 1200 + (h % 800) + raw.reviewCount * 3;

  const services = SERVICE_CATALOG.slice(0, raw.servicesCount).map((s) => ({
    id: s.id,
    name: s.name,
    price: s.price,
    duration: s.duration,
  }));

  const bios = [
    `Precision-focused barber at ${raw.shop.name} with a reputation for consistent fades and client-first service.`,
    `${raw.experience} stylist serving ${raw.shop.city}. Known for classic cuts and modern grooming.`,
    `Chair artist specializing in ${raw.specialties.slice(0, 2).join(" & ")}. Trusted by regulars across ${raw.shop.city}.`,
  ];

  return {
    ...raw,
    accountStatus,
    gender: GENDERS[h % GENDERS.length],
    bio: bios[h % bios.length],
    profilePhotoUrl: raw.profilePhotoUrl ?? null,
    workingHours: raw.workingHours ?? DEFAULT_HOURS,
    services,
    yearsExperience:
      raw.experience === "Master"
        ? "10+ years"
        : raw.experience === "Senior"
          ? "5–10 years"
          : raw.experience === "Journeyman"
            ? "2–5 years"
            : "0–2 years",
    stats: {
      totalAppointments: raw.appointmentsTotal,
      completed,
      cancelled,
      customersServed,
      revenue,
      profileViews,
      thisMonth: raw.appointmentsThisMonth,
    },
    ratingBreakdown: buildRatingBreakdown(raw.rating, raw.reviewCount),
    recentReviews: buildRecentReviews(raw),
    activity: buildActivity(raw, accountStatus),
  };
}

/** @returns {ReturnType<typeof buildAdminBarberDetail> | undefined} */
export function getAdminBarberById(id) {
  const raw = INITIAL_BARBERS.find((b) => b.id === id);
  return raw ? buildAdminBarberDetail(raw) : undefined;
}
