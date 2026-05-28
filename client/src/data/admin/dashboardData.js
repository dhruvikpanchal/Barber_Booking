export const ADMIN_STATS = {
  totalUsers: 12480,
  usersDelta: 8.4,
  totalBarbers: 326,
  barbersDelta: 5.1,
  pendingApprovals: 14,
  totalBookings: 4827,
  bookingsDelta: 12.6,
  systemGrowth: 18.2,
};

export const BOOKING_TREND = [
  { label: "Mon", value: 420 },
  { label: "Tue", value: 510 },
  { label: "Wed", value: 480 },
  { label: "Thu", value: 612 },
  { label: "Fri", value: 760 },
  { label: "Sat", value: 880 },
  { label: "Sun", value: 690 },
];

export const RECENT_ACTIVITY = [
  {
    id: "a1",
    type: "barber_approved",
    title: "Approved barber",
    subject: "Marco Devlin",
    meta: "Iron & Oak · Brooklyn",
    time: "2m ago",
  },
  {
    id: "a2",
    type: "user_signup",
    title: "New user signup",
    subject: "Sophia Martin",
    meta: "via Google",
    time: "8m ago",
  },
  {
    id: "a3",
    type: "booking",
    title: "Booking confirmed",
    subject: "Beard & Cut · $48",
    meta: "Manhattan",
    time: "12m ago",
  },
  {
    id: "a4",
    type: "report",
    title: "Report filed",
    subject: "Inappropriate review",
    meta: "User #2241",
    time: "21m ago",
  },
  {
    id: "a5",
    type: "barber_request",
    title: "Barber request",
    subject: "Liam Carter",
    meta: "Awaiting review",
    time: "34m ago",
  },
  {
    id: "a6",
    type: "payout",
    title: "Payout processed",
    subject: "$2,340 · 14 barbers",
    meta: "Weekly cycle",
    time: "1h ago",
  },
];

export const RECENT_REPORTS = [
  {
    id: "r1",
    title: "Abusive language in chat",
    reporter: "Customer #4012",
    target: "Barber · Jay R.",
    severity: "high",
    time: "9m ago",
  },
  {
    id: "r2",
    title: "No-show by barber",
    reporter: "Customer #3987",
    target: "Barber · Tom K.",
    severity: "medium",
    time: "1h ago",
  },
  {
    id: "r3",
    title: "Fake review suspicion",
    reporter: "Shop · Iron & Oak",
    target: "Review #882",
    severity: "low",
    time: "3h ago",
  },
];

export const QUEUE_OVERVIEW = [
  { city: "New York", waiting: 42, inService: 18, freeChairs: 7 },
  { city: "Los Angeles", waiting: 31, inService: 14, freeChairs: 5 },
  { city: "Chicago", waiting: 22, inService: 9, freeChairs: 4 },
  { city: "Miami", waiting: 17, inService: 6, freeChairs: 3 },
];

export const CITY_GROWTH = [
  { city: "New York", users: 4820, delta: 14.2, hot: true },
  { city: "Los Angeles", users: 3110, delta: 9.7, hot: true },
  { city: "Chicago", users: 1980, delta: 6.4, hot: false },
  { city: "Miami", users: 1420, delta: 4.1, hot: false },
  { city: "Austin", users: 980, delta: 22.8, hot: true },
  { city: "Seattle", users: 760, delta: -2.3, hot: false },
];
