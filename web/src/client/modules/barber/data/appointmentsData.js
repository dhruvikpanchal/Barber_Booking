import { demoDayOffset } from "@/lib/demoDates.js";
import { DEMO_CUSTOMER } from "@/modules/customer/data/appointmentsData.js";

const dayOffset = demoDayOffset;

/**
 * Customer booking id used by service-change localStorage (bk-*).
 * Falls back to barber appointment id when no link exists.
 */
export function getServiceChangeAppointmentId(appt) {
  return appt?.bookingId ?? appt?.id;
}

export function buildBarberTimeline({
  bookedAt,
  acceptedAt = null,
  arrivedAt = null,
  inServiceAt = null,
  completedAt = null,
  status,
}) {
  const steps = [
    { key: "created", label: "Booking Created", at: bookedAt },
    { key: "accepted", label: "Booking Accepted", at: acceptedAt },
    { key: "arrived", label: "Customer Arrived", at: arrivedAt },
    { key: "inService", label: "In Service", at: inServiceAt },
    { key: "completed", label: "Completed", at: completedAt },
  ];

  if (status === "cancelled") {
    const lastDone = steps.findLastIndex((s) => s.at);
    return steps.map((step, i) => ({
      ...step,
      state: i <= lastDone ? "done" : "cancelled",
    }));
  }

  if (status === "completed") {
    return steps.map((step) => ({
      ...step,
      state: step.at ? "done" : "upcoming",
    }));
  }

  const lastDoneIndex = steps.findLastIndex((s) => s.at);
  return steps.map((step, i) => ({
    ...step,
    state:
      i < lastDoneIndex || (i === lastDoneIndex && step.at)
        ? "done"
        : i === lastDoneIndex + 1
          ? "current"
          : "upcoming",
  }));
}

/** Normalize legacy single-service rows for detail UI. */
export function normalizeBarberAppointment(appt) {
  const services =
    appt.services ??
    (appt.service
      ? [
          {
            name: appt.service,
            duration: appt.duration ?? 30,
            price: appt.price ?? 0,
          },
        ]
      : []);

  const price = appt.price ?? services.reduce((sum, s) => sum + (s.price ?? 0), 0);
  const duration = appt.duration ?? services.reduce((sum, s) => sum + (s.duration ?? 0), 0);

  return {
    ...appt,
    services,
    service: appt.service ?? services.map((s) => s.name).join(" + "),
    price,
    duration,
    bookedAt: appt.bookedAt ?? appt.createdAt,
    timeline:
      appt.timeline ??
      buildBarberTimeline({
        bookedAt: appt.bookedAt ?? appt.createdAt,
        acceptedAt:
          appt.status !== "pending" && appt.status !== "cancelled"
            ? (appt.acceptedAt ?? appt.bookedAt ?? appt.createdAt)
            : null,
        arrivedAt: appt.arrivedAt ?? null,
        inServiceAt: appt.inServiceAt ?? null,
        completedAt: appt.status === "completed" ? (appt.completedAt ?? appt.startAt) : null,
        status: appt.status,
      }),
  };
}

export const INITIAL_APPOINTMENTS = [
  {
    id: "ap-1001",
    bookingId: "bk-3001",
    customer: { ...DEMO_CUSTOMER },
    services: [{ name: "Signature Cut", duration: 45, price: 45 }],
    service: "Signature Cut",
    price: 45,
    duration: 45,
    startAt: dayOffset(2, 10, 30),
    status: "confirmed",
    notes: "Going for a shorter taper on the sides.",
    createdAt: dayOffset(-1, 14, 22),
    bookedAt: dayOffset(-1, 14, 22),
    acceptedAt: dayOffset(-1, 15, 0),
    arrivedAt: null,
    inServiceAt: null,
    completedAt: null,
    timeline: buildBarberTimeline({
      bookedAt: dayOffset(-1, 14, 22),
      acceptedAt: dayOffset(-1, 15, 0),
      arrivedAt: null,
      inServiceAt: null,
      completedAt: null,
      status: "confirmed",
    }),
  },
  {
    id: "ap-1002",
    bookingId: "bk-3002",
    customer: { ...DEMO_CUSTOMER },
    services: [
      { name: "Skin Fade", duration: 40, price: 40 },
      { name: "Beard Sculpt", duration: 25, price: 28 },
    ],
    service: "Skin Fade + Beard Sculpt",
    price: 68,
    duration: 65,
    startAt: dayOffset(5, 14, 0),
    status: "pending",
    notes: "",
    createdAt: dayOffset(0, 9, 5),
    bookedAt: dayOffset(0, 9, 5),
    timeline: buildBarberTimeline({
      bookedAt: dayOffset(0, 9, 5),
      acceptedAt: null,
      arrivedAt: null,
      inServiceAt: null,
      completedAt: null,
      status: "pending",
    }),
  },
  {
    id: "ap-1003",
    customer: {
      name: "Aaron Cole",
      phone: "+1 555 220 7732",
      email: "aaron@example.com",
    },
    service: "Beard Sculpt",
    price: 25,
    duration: 25,
    startAt: dayOffset(0, 14, 15),
    status: "confirmed",
    notes: "Allergic to scented balm.",
    createdAt: dayOffset(-1, 18, 30),
  },
  {
    id: "ap-1004",
    customer: {
      name: "Jamal Price",
      phone: "+1 555 220 9871",
      email: "jamal@example.com",
    },
    service: "Hot Towel Shave",
    price: 40,
    duration: 30,
    startAt: dayOffset(-1, 11, 0),
    status: "completed",
    notes: "",
    createdAt: dayOffset(-3, 10, 0),
    completedAt: dayOffset(-1, 11, 35),
    arrivedAt: dayOffset(-1, 10, 55),
    inServiceAt: dayOffset(-1, 11, 0),
  },
  {
    id: "ap-1005",
    customer: {
      name: "Liam Carter",
      phone: "+1 555 661 7780",
      email: "liam@example.com",
    },
    service: "Kids Cut",
    price: 20,
    duration: 25,
    startAt: dayOffset(1, 9, 30),
    status: "pending",
    notes: "Son is 7, gets nervous around clippers.",
    createdAt: dayOffset(0, 8, 22),
  },
  {
    id: "ap-1006",
    customer: {
      name: "Noah Patel",
      phone: "+1 555 442 1122",
      email: "noah@example.com",
    },
    service: "Signature Cut",
    price: 45,
    duration: 45,
    startAt: dayOffset(1, 16, 0),
    status: "confirmed",
    notes: "",
    createdAt: dayOffset(-1, 12, 0),
  },
  {
    id: "ap-1007",
    customer: {
      name: "Ethan Brooks",
      phone: "+1 555 887 4421",
      email: "ethan@example.com",
    },
    service: "Skin Fade",
    price: 35,
    duration: 40,
    startAt: dayOffset(-2, 13, 30),
    status: "cancelled",
    notes: "Cancelled morning of.",
    createdAt: dayOffset(-4, 9, 0),
  },
].map(normalizeBarberAppointment);

/** @returns {ReturnType<typeof normalizeBarberAppointment> | undefined} */
export function getAppointmentById(id) {
  const appt = INITIAL_APPOINTMENTS.find((a) => a.id === id);
  return appt ? normalizeBarberAppointment(appt) : undefined;
}

export const SERVICE_OPTIONS = [
  "Signature Cut",
  "Skin Fade",
  "Beard Sculpt",
  "Hot Towel Shave",
  "Kids Cut",
];
