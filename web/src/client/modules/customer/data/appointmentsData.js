function daysAgo(days, h = 10, m = 0) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}
function daysFromNow(days, h = 10, m = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

/** Demo customer profile used on appointment detail. */
export const DEMO_CUSTOMER = {
  name: "Alice Morgan",
  email: "alice.morgan@example.com",
  phone: "+1 (555) 012-3456",
};

/** Barber IDs seeded as favorites in the detail UI. */
export const INITIAL_FAVORITE_BARBER_IDS = ["marcus-vale", "lena-park"];

export const MY_APPOINTMENTS = [
  // ── UPCOMING ──────────────────────────────────────────────────────
  {
    id: "bk-3001",
    barber: {
      id: "marcus-vale",
      name: "Marcus Vale",
      role: "Master Barber",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    shop: { name: "Iron & Oak — Steel District", city: "New York, NY" },
    services: [
      { name: "Signature Cut", duration: 45, price: 45 },
    ],
    startAt: daysFromNow(2, 10, 30),
    status: "confirmed",
    estimatedPrice: 45,
    finalPrice: null,
    notes: "Going for a shorter taper on the sides.",
    bookedAt: daysAgo(1, 14, 22),
    customer: DEMO_CUSTOMER,
    originalServices: [{ name: "Signature Cut", duration: 45, price: 45 }],
    updatedServices: null,
    barberNotes: null,
    timeline: buildTimeline({
      bookedAt: daysAgo(1, 14, 22),
      acceptedAt: daysAgo(1, 15, 0),
      arrivedAt: null,
      servicesUpdatedAt: null,
      completedAt: null,
      status: "confirmed",
    }),
  },
  {
    id: "bk-3002",
    barber: {
      id: "ezra-finch",
      name: "Ezra Finch",
      role: "Head Barber",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
    shop: { name: "Iron & Oak — Brick Lane", city: "Brooklyn, NY" },
    services: [
      { name: "Skin Fade", duration: 40, price: 40 },
      { name: "Beard Sculpt", duration: 25, price: 28 },
    ],
    startAt: daysFromNow(5, 14, 0),
    status: "pending",
    estimatedPrice: 68,
    finalPrice: null,
    notes: "",
    bookedAt: daysAgo(0, 9, 5),
    customer: DEMO_CUSTOMER,
    originalServices: [
      { name: "Skin Fade", duration: 40, price: 40 },
      { name: "Beard Sculpt", duration: 25, price: 28 },
    ],
    updatedServices: null,
    barberNotes: null,
    timeline: buildTimeline({
      bookedAt: daysAgo(0, 9, 5),
      acceptedAt: null,
      arrivedAt: null,
      servicesUpdatedAt: null,
      completedAt: null,
      status: "pending",
    }),
  },
  {
    id: "bk-3003",
    barber: {
      id: "lena-park",
      name: "Lena Park",
      role: "Senior Barber",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    },
    shop: { name: "Iron & Oak — Mission Row", city: "San Francisco, CA" },
    services: [
      { name: "The Works", duration: 75, price: 85 },
    ],
    startAt: daysFromNow(10, 11, 0),
    status: "confirmed",
    estimatedPrice: 85,
    finalPrice: null,
    notes: "Bring the hot towel treatment.",
    bookedAt: daysAgo(3, 16, 45),
    customer: DEMO_CUSTOMER,
    originalServices: [{ name: "The Works", duration: 75, price: 85 }],
    updatedServices: null,
    barberNotes: "Hot towel add-on confirmed at check-in.",
    timeline: buildTimeline({
      bookedAt: daysAgo(3, 16, 45),
      acceptedAt: daysAgo(3, 17, 10),
      arrivedAt: null,
      servicesUpdatedAt: null,
      completedAt: null,
      status: "confirmed",
    }),
  },

  // ── PAST ─────────────────────────────────────────────────────────
  {
    id: "bk-2001",
    barber: {
      id: "marcus-vale",
      name: "Marcus Vale",
      role: "Master Barber",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    shop: { name: "Iron & Oak — Steel District", city: "New York, NY" },
    services: [
      { name: "Signature Cut", duration: 45, price: 45 },
      { name: "Hot Towel Shave", duration: 30, price: 35 },
    ],
    startAt: daysAgo(7, 10, 30),
    status: "completed",
    estimatedPrice: 80,
    finalPrice: 80,
    notes: "",
    bookedAt: daysAgo(10, 12, 0),
    reviewed: false,
    customer: DEMO_CUSTOMER,
    originalServices: [
      { name: "Signature Cut", duration: 45, price: 45 },
      { name: "Hot Towel Shave", duration: 30, price: 35 },
    ],
    updatedServices: null,
    barberNotes: "Great session — same style as last visit.",
    timeline: buildTimeline({
      bookedAt: daysAgo(10, 12, 0),
      acceptedAt: daysAgo(9, 10, 0),
      arrivedAt: daysAgo(7, 10, 15),
      servicesUpdatedAt: null,
      completedAt: daysAgo(7, 11, 15),
      status: "completed",
    }),
  },
  {
    id: "bk-2002",
    barber: {
      id: "owen-blake",
      name: "Owen Blake",
      role: "Master Barber",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    },
    shop: { name: "Iron & Oak — Old Town", city: "Chicago, IL" },
    services: [
      { name: "Skin Fade", duration: 40, price: 40 },
    ],
    startAt: daysAgo(14, 15, 0),
    status: "completed",
    estimatedPrice: 40,
    finalPrice: 40,
    notes: "",
    bookedAt: daysAgo(17, 10, 0),
    reviewed: true,
    customer: DEMO_CUSTOMER,
    originalServices: [{ name: "Skin Fade", duration: 40, price: 40 }],
    updatedServices: null,
    barberNotes: null,
    timeline: buildTimeline({
      bookedAt: daysAgo(17, 10, 0),
      acceptedAt: daysAgo(16, 9, 0),
      arrivedAt: daysAgo(14, 14, 45),
      servicesUpdatedAt: null,
      completedAt: daysAgo(14, 15, 40),
      status: "completed",
    }),
  },
  {
    id: "bk-2003",
    barber: {
      id: "jay-brooks",
      name: "Jay Brooks",
      role: "Senior Barber",
      image: "https://images.unsplash.com/photo-1542178243-bc20204b769f?w=200&q=80",
    },
    shop: { name: "Iron & Oak — Steel District", city: "New York, NY" },
    services: [
      { name: "Beard Sculpt", duration: 25, price: 28 },
    ],
    startAt: daysAgo(21, 11, 30),
    status: "completed",
    estimatedPrice: 28,
    finalPrice: 28,
    notes: "",
    bookedAt: daysAgo(24, 9, 0),
    reviewed: true,
    customer: DEMO_CUSTOMER,
    originalServices: [{ name: "Beard Sculpt", duration: 25, price: 28 }],
    updatedServices: null,
    barberNotes: null,
    timeline: buildTimeline({
      bookedAt: daysAgo(24, 9, 0),
      acceptedAt: daysAgo(23, 11, 0),
      arrivedAt: daysAgo(21, 11, 15),
      servicesUpdatedAt: null,
      completedAt: daysAgo(21, 11, 55),
      status: "completed",
    }),
  },
  {
    id: "bk-2004",
    barber: {
      id: "lena-park",
      name: "Lena Park",
      role: "Senior Barber",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    },
    shop: { name: "Iron & Oak — Mission Row", city: "San Francisco, CA" },
    services: [
      { name: "Father & Son Cut", duration: 60, price: 65 },
    ],
    startAt: daysAgo(35, 9, 0),
    status: "completed",
    estimatedPrice: 65,
    finalPrice: 70,
    notes: "Add-on scalp treatment done at the shop.",
    bookedAt: daysAgo(38, 18, 0),
    reviewed: false,
    customer: DEMO_CUSTOMER,
    originalServices: [{ name: "Father & Son Cut", duration: 60, price: 65 }],
    updatedServices: [
      { name: "Father & Son Cut", duration: 60, price: 65 },
      { name: "Scalp Treatment", duration: 15, price: 5 },
    ],
    barberNotes:
      "Added scalp treatment at chair — customer approved updated total.",
    timeline: buildTimeline({
      bookedAt: daysAgo(38, 18, 0),
      acceptedAt: daysAgo(37, 9, 0),
      arrivedAt: daysAgo(35, 8, 45),
      servicesUpdatedAt: daysAgo(35, 9, 20),
      completedAt: daysAgo(35, 10, 0),
      status: "completed",
    }),
  },

  // ── CANCELLED ────────────────────────────────────────────────────
  {
    id: "bk-1001",
    barber: {
      id: "ezra-finch",
      name: "Ezra Finch",
      role: "Head Barber",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
    shop: { name: "Iron & Oak — Brick Lane", city: "Brooklyn, NY" },
    services: [
      { name: "Signature Cut", duration: 45, price: 45 },
    ],
    startAt: daysAgo(3, 16, 0),
    status: "cancelled",
    estimatedPrice: 45,
    finalPrice: null,
    cancelledBy: "customer",
    cancelReason: "Schedule conflict",
    bookedAt: daysAgo(6, 11, 0),
    customer: DEMO_CUSTOMER,
    originalServices: [{ name: "Signature Cut", duration: 45, price: 45 }],
    updatedServices: null,
    barberNotes: null,
    timeline: buildTimeline({
      bookedAt: daysAgo(6, 11, 0),
      acceptedAt: daysAgo(5, 14, 0),
      arrivedAt: null,
      servicesUpdatedAt: null,
      completedAt: null,
      status: "cancelled",
    }),
  },
  {
    id: "bk-1002",
    barber: {
      id: "owen-blake",
      name: "Owen Blake",
      role: "Master Barber",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    },
    shop: { name: "Iron & Oak — Old Town", city: "Chicago, IL" },
    services: [
      { name: "Hot Towel Shave", duration: 30, price: 35 },
      { name: "Beard Sculpt", duration: 25, price: 28 },
    ],
    startAt: daysAgo(18, 13, 0),
    status: "cancelled",
    estimatedPrice: 63,
    finalPrice: null,
    cancelledBy: "barber",
    cancelReason: "Barber unavailable",
    bookedAt: daysAgo(21, 8, 0),
    customer: DEMO_CUSTOMER,
    originalServices: [
      { name: "Hot Towel Shave", duration: 30, price: 35 },
      { name: "Beard Sculpt", duration: 25, price: 28 },
    ],
    updatedServices: null,
    barberNotes: null,
    timeline: buildTimeline({
      bookedAt: daysAgo(21, 8, 0),
      acceptedAt: daysAgo(20, 10, 0),
      arrivedAt: null,
      servicesUpdatedAt: null,
      completedAt: null,
      status: "cancelled",
    }),
  },
];

/** @returns {typeof MY_APPOINTMENTS[number] | undefined} */
export function getAppointmentById(id) {
  return MY_APPOINTMENTS.find((a) => a.id === id);
}

/**
 * @param {{ bookedAt: string, acceptedAt?: string|null, arrivedAt?: string|null, servicesUpdatedAt?: string|null, completedAt?: string|null, status: string }} input
 */
export function buildTimeline(input) {
  const { bookedAt, acceptedAt, arrivedAt, servicesUpdatedAt, completedAt, status } =
    input;
  const hasServiceUpdate = Boolean(servicesUpdatedAt);

  const steps = [
    { key: "created", label: "Booking Created", at: bookedAt },
    { key: "accepted", label: "Barber Accepted", at: acceptedAt ?? null },
    { key: "arrived", label: "Customer Arrived", at: arrivedAt ?? null },
    ...(hasServiceUpdate
      ? [{ key: "servicesUpdated", label: "Services Updated", at: servicesUpdatedAt }]
      : []),
    { key: "completed", label: "Completed", at: completedAt ?? null },
  ];

  if (status === "cancelled") {
    const lastDone = steps.findLastIndex((s) => s.at);
    return steps.map((step, i) => ({
      ...step,
      state: i <= lastDone ? "done" : "cancelled",
    }));
  }

  const lastDoneIndex = steps.findLastIndex((s) => s.at);
  return steps.map((step, i) => ({
    ...step,
    state:
      i < lastDoneIndex || (i === lastDoneIndex && step.at)
        ? "done"
        : i === lastDoneIndex + 1 && status !== "cancelled"
          ? "current"
          : "upcoming",
  }));
}

export function formatDateTime(iso) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    relative: getRelative(d),
  };
}

function getRelative(d) {
  const now = new Date();
  const diffMs = d - now;
  const diffDays = Math.round(diffMs / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 0) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

export { formatMoney } from "@/client/lib/format/formatMoney.js";

export function getTotalDuration(services) {
  return services.reduce((s, sv) => s + sv.duration, 0);
}
