import { demoDayOffset, demoMinutesAgo } from "@/lib/demoDates.js";

const todayAt = demoDayOffset;
const minsAgo = demoMinutesAgo;

export const TODAY_APPOINTMENTS = [
  {
    id: "td-1",
    customer: "Marcus Bell",
    service: "Skin Fade",
    duration: 40,
    price: 35,
    startAt: todayAt(9, 30),
    status: "completed",
  },
  {
    id: "td-2",
    customer: "Devon Reyes",
    service: "Signature Cut",
    duration: 45,
    price: 45,
    startAt: todayAt(11, 0),
    status: "in-service",
  },
  {
    id: "td-3",
    customer: "Khalil Mensah",
    service: "Hot Towel Shave",
    duration: 30,
    price: 30,
    startAt: todayAt(12, 30),
    status: "confirmed",
  },
  {
    id: "td-4",
    customer: "Theo Vance",
    service: "Skin Fade",
    duration: 40,
    price: 35,
    startAt: todayAt(14, 15),
    status: "confirmed",
  },
  {
    id: "td-5",
    customer: "Jamal Price",
    service: "Beard Sculpt",
    duration: 25,
    price: 25,
    startAt: todayAt(16, 0),
    status: "confirmed",
  },
];

export const PENDING_REQUESTS = [
  {
    id: "pr-1",
    customer: "Aaron Cole",
    service: "Beard Sculpt",
    requestedAt: minsAgo(8),
    startAt: todayAt(17, 30),
    price: 25,
  },
  {
    id: "pr-2",
    customer: "Owen Hart",
    service: "Signature Cut",
    requestedAt: minsAgo(42),
    startAt: todayAt(18, 15),
    price: 45,
  },
  {
    id: "pr-3",
    customer: "Sean Briggs",
    service: "Hot Towel Shave",
    requestedAt: minsAgo(95),
    startAt: todayAt(19, 0),
    price: 30,
  },
];

export const QUEUE_SNAPSHOT = {
  chairsTotal: 3,
  chairsBusy: 2,
  waiting: 4,
  avgWaitMin: 18,
  nextUp: [
    { id: "q-3", name: "Aaron Cole", service: "Beard Sculpt", source: "walk-in", waitMin: 12 },
    { id: "q-4", name: "Khalil Mensah", service: "Hot Towel Shave", source: "online", waitMin: 6 },
    { id: "q-5", name: "Theo Vance", service: "Skin Fade", source: "walk-in", waitMin: 2 },
  ],
};

export const EARNINGS = {
  today: 240,
  yesterday: 195,
  weekToDate: 1320,
  weekTarget: 1800,
  trend: [120, 180, 150, 240, 195, 200, 240],
  tips: 38,
};

export const CUSTOMER_STATS = {
  servedToday: 6,
  newClients: 2,
  returning: 4,
  avgRating: 4.8,
  reviewsThisWeek: 9,
  rebookRate: 72,
};
