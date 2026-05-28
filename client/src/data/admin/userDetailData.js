import { INITIAL_USERS } from "@/data/admin/usersData.js";

const REVIEW_SAMPLES = [
  "Great experience — on time and exactly what I asked for.",
  "Solid cut and friendly service. Will book again.",
  "Professional from start to finish. Highly recommend.",
  "Good value for the service. Chair was comfortable and clean.",
  "One of my best fades in a while. Marcus nailed it.",
];

function paymentStatusFor(bookingStatus) {
  if (bookingStatus === "completed") return "Paid";
  if (bookingStatus === "cancelled" || bookingStatus === "no-show") {
    return "N/A";
  }
  return "Pending";
}

function enrichBookings(bookings = []) {
  return bookings.map((bk) => ({
    ...bk,
    paymentStatus: paymentStatusFor(bk.status),
  }));
}

function buildUpcomingBookings(user) {
  if (user.status === "disabled" || user.bookingsThisMonth === 0) {
    return [];
  }
  const future = new Date();
  future.setDate(future.getDate() + 7);
  const future2 = new Date();
  future2.setDate(future2.getDate() + 14);

  const items = [
    {
      id: `${user.id}-up-1`,
      barber: user.favoriteBarber,
      service: "Signature Cut",
      date: future.toISOString().slice(0, 10),
      status: "pending",
      price: 45,
      paymentStatus: "Pending",
    },
  ];

  if (user.activity === "high" && user.bookingsThisMonth >= 3) {
    items.push({
      id: `${user.id}-up-2`,
      barber: user.favoriteBarber,
      service: "Skin Fade",
      date: future2.toISOString().slice(0, 10),
      status: "pending",
      price: 40,
      paymentStatus: "Pending",
    });
  }

  return items;
}

function buildReviewHistory(user) {
  const count = Math.min(user.reviewsGiven, 5);
  const reviews = [];

  for (let i = 0; i < count; i += 1) {
    const bk = user.bookingHistory[i % user.bookingHistory.length];
    const daysAgo = 5 + i * 12;
    reviews.push({
      id: `${user.id}-rev-${i}`,
      rating: Math.min(5, Math.max(1, Math.round(user.avgRatingGiven + (i % 2 === 0 ? 0 : -0.5)))),
      comment: REVIEW_SAMPLES[i % REVIEW_SAMPLES.length],
      date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      barber: bk?.barber ?? user.favoriteBarber,
      service: bk?.service ?? "Signature Cut",
    });
  }

  return reviews;
}

function buildActivity(user, bookings, reviews) {
  const events = [
    {
      id: `${user.id}-act-join`,
      type: "account",
      title: "Account created",
      description: `${user.name} registered on Iron & Oak.`,
      at: new Date(user.joinedAt).toISOString(),
    },
    {
      id: `${user.id}-act-login`,
      type: "login",
      title: "Last login",
      description: "Signed in from mobile app.",
      at: new Date(user.lastActive).toISOString(),
    },
  ];

  bookings.slice(0, 2).forEach((bk, i) => {
    events.push({
      id: `${user.id}-act-bk-${i}`,
      type: "booking",
      title: `Booking ${bk.status}`,
      description: `${bk.service} with ${bk.barber}`,
      at: new Date(bk.date).toISOString(),
    });
  });

  reviews.slice(0, 2).forEach((rev, i) => {
    events.push({
      id: `${user.id}-act-rev-${i}`,
      type: "review",
      title: "Review submitted",
      description: `${rev.rating}★ · ${rev.service} · ${rev.barber}`,
      at: new Date(rev.date).toISOString(),
    });
  });

  if (user.status === "disabled") {
    events.push({
      id: `${user.id}-act-off`,
      type: "status",
      title: "Account deactivated",
      description: "Access restricted by admin.",
      at: new Date(user.lastActive).toISOString(),
    });
  }

  return events.sort((a, b) => new Date(b.at) - new Date(a.at));
}

/** Enrich list row for the admin user detail page. */
export function buildAdminUserDetail(raw) {
  const bookingHistory = enrichBookings(raw.bookingHistory);
  const upcomingBookings = buildUpcomingBookings(raw);
  const reviewHistory = buildReviewHistory(raw);

  const allBookings = [...upcomingBookings, ...bookingHistory].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const completedCount = Math.max(
    0,
    raw.bookingsTotal - raw.cancelledBookings - upcomingBookings.length,
  );

  return {
    ...raw,
    address: raw.address ?? raw.city,
    bookingHistory: allBookings,
    upcomingBookings,
    reviewHistory,
    stats: {
      totalBookings: raw.bookingsTotal,
      completed: completedCount,
      cancelled: raw.cancelledBookings,
      upcoming: upcomingBookings.length,
      totalSpent: raw.totalSpent,
      reviewsGiven: raw.reviewsGiven,
    },
    activity: buildActivity(raw, allBookings, reviewHistory),
  };
}

/** @returns {ReturnType<typeof buildAdminUserDetail> | undefined} */
export function getAdminUserById(id) {
  const raw = INITIAL_USERS.find((u) => u.id === id);
  return raw ? buildAdminUserDetail(raw) : undefined;
}
