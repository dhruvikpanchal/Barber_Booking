function hoursAgo(h) {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}
function daysAgo(d, h = 11) {
  return new Date(Date.now() - d * 86400 * 1000 - h * 3600 * 1000).toISOString();
}

// Completed appointments that already have a review
export const INITIAL_REVIEWS = [
  {
    id: "rev-001",
    appointmentId: "bk-4001",
    barber: {
      id: "marcus-vale",
      name: "Marcus Vale",
      role: "Master Barber",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    services: ["Skin Fade", "Beard Sculpt"],
    completedAt: daysAgo(7),
    createdAt: daysAgo(7, 9), // well outside 24h edit window
    rating: 5,
    comment:
      "Sharpest fade I've had in years. Marcus is a genuine craftsman — every line is razor-precise. Already locked in my next appointment.",
    barberReply: "Thanks so much — always great to have you in the chair. See you next month!",
  },
  {
    id: "rev-002",
    appointmentId: "bk-4002",
    barber: {
      id: "ezra-finch",
      name: "Ezra Finch",
      role: "Head Barber",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    },
    services: ["Classic Cut"],
    completedAt: daysAgo(14),
    createdAt: daysAgo(14, 8),
    rating: 4,
    comment:
      "Solid cut and great conversation. Minor wait time but nothing unreasonable. Will definitely be back.",
    barberReply: null,
  },
  {
    id: "rev-003",
    appointmentId: "bk-4003",
    barber: {
      id: "lena-park",
      name: "Lena Park",
      role: "Senior Barber",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    },
    services: ["Hot Towel Shave"],
    completedAt: hoursAgo(10), // within 24h edit window
    createdAt: hoursAgo(10),
    rating: 5,
    comment:
      "Came in before a big meeting and left looking like a CEO. The straight razor technique is flawless.",
    barberReply: null,
  },
];

// Completed appointments without a review (eligible to add one within 24h)
export const REVIEWABLE_APPOINTMENTS = [
  {
    id: "bk-4004",
    barber: {
      id: "marcus-vale",
      name: "Marcus Vale",
      role: "Master Barber",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    },
    services: [{ name: "Signature Cut", price: 45 }],
    completedAt: hoursAgo(5), // within 24h
  },
];
