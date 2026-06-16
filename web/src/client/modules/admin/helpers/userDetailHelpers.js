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

/** Map GET /admin/users/:id payload for the detail page. */
export function mapAdminUserDetailFromApi(raw) {
  const bookingHistory = enrichBookings(raw.bookingHistory ?? []);
  const upcomingBookings = bookingHistory.filter((bk) =>
    ["pending", "confirmed"].includes(bk.status),
  );

  const activityEvents = [
    {
      id: `${raw.id}-act-join`,
      type: "account",
      title: "Account created",
      description: `${raw.name} registered on Iron & Oak.`,
      at: new Date(raw.joinedAt).toISOString(),
    },
    {
      id: `${raw.id}-act-login`,
      type: "login",
      title: "Last login",
      description: "Most recent session.",
      at: new Date(raw.lastActive).toISOString(),
    },
    ...bookingHistory.slice(0, 5).map((bk, i) => ({
      id: `${raw.id}-act-bk-${i}`,
      type: "booking",
      title: `Booking ${bk.status}`,
      description: `${bk.service} with ${bk.barber}`,
      at: new Date(bk.date).toISOString(),
    })),
  ].sort((a, b) => new Date(b.at) - new Date(a.at));

  if (raw.status === "disabled") {
    activityEvents.unshift({
      id: `${raw.id}-act-off`,
      type: "status",
      title: "Account deactivated",
      description: "Access restricted by admin.",
      at: new Date(raw.lastActive).toISOString(),
    });
  }

  return {
    ...raw,
    address: raw.city ?? "—",
    favoriteBarber: raw.favoriteBarber ?? "—",
    favoriteShop: "—",
    bookingHistory,
    upcomingBookings,
    reviewHistory: [],
    activityLevel: raw.activity,
    activityEvents,
    stats: {
      totalBookings: raw.bookingsTotal ?? 0,
      completed: bookingHistory.filter((bk) => bk.status === "completed").length,
      cancelled: raw.cancelledBookings ?? 0,
      upcoming: upcomingBookings.length,
      totalSpent: raw.totalSpent ?? 0,
      reviewsGiven: raw.reviewsGiven ?? 0,
    },
  };
}
