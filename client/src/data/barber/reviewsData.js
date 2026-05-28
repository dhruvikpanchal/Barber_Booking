export const CATEGORY_LABELS = {
  service: "Service quality",
  ambiance: "Shop ambiance",
  professionalism: "Professionalism",
  value: "Value for money",
};

function categoryRatingsFromOverall(rating) {
  const clamp = (n) => Math.min(5, Math.max(1, Math.round(n)));
  return {
    service: rating,
    ambiance: clamp(rating - (rating <= 2 ? 0 : 1)),
    professionalism: rating,
    value: clamp(rating - (rating >= 4 ? 0 : 1)),
  };
}

export function buildHistory(review) {
  const items = [
    {
      id: `${review.id}-review`,
      type: "review",
      at: review.date,
      title: "Review posted",
      body: review.text,
    },
  ];
  if (review.reply) {
    items.push({
      id: `${review.id}-reply`,
      type: "reply",
      at: review.replyAt ?? review.date,
      title: "Barber replied",
      body: review.reply,
    });
  }
  return items;
}

function enrich(review) {
  const categoryRatings =
    review.categoryRatings ?? categoryRatingsFromOverall(review.rating);
  const hasReply = Boolean(review.reply);
  return {
    ...review,
    categoryRatings,
    hasReply,
    history: review.history ?? buildHistory({ ...review, hasReply }),
  };
}

export const INITIAL_REVIEWS = [
  {
    id: "r1",
    customer: {
      name: "James W.",
      initials: "JW",
      email: "james.w@example.com",
      phone: "+1 (555) 201-4401",
      visits: 6,
      memberSince: "2024-03-10",
    },
    appointmentId: "ap-1003",
    rating: 5,
    categoryRatings: {
      service: 5,
      ambiance: 5,
      professionalism: 5,
      value: 5,
    },
    service: "Skin Fade",
    date: "2025-05-12",
    text: "Sharpest fade I've had in years. Marcus is a genuine craftsman — shows up every single time without fail. Already booked my next appointment.",
    helpful: 12,
    reply: null,
    replyAt: null,
    reported: false,
  },
  {
    id: "r2",
    customer: {
      name: "Daniel K.",
      initials: "DK",
      email: "daniel.k@example.com",
      phone: "+1 (555) 882-1190",
      visits: 4,
      memberSince: "2024-08-22",
    },
    rating: 5,
    service: "Hot Towel Shave",
    date: "2025-04-30",
    text: "Booking was painless and the shop feels like a vault. Worth every cent. The hot towel shave was an experience I didn't know I was missing.",
    helpful: 9,
    reply: "Thanks Daniel — that means a lot. See you next time!",
    replyAt: "2025-05-01T10:15:00.000Z",
    reported: false,
  },
  {
    id: "r3",
    customer: {
      name: "Anthony R.",
      initials: "AR",
      email: "anthony.r@example.com",
      phone: "+1 (555) 330-7782",
      visits: 2,
      memberSince: "2025-01-05",
    },
    rating: 5,
    service: "Beard Sculpt",
    date: "2025-04-18",
    text: "Walked in for a beard sculpt, left feeling like new money. Attention to detail is next level. My go-to spot now.",
    helpful: 14,
    reply: null,
    replyAt: null,
    reported: false,
  },
  {
    id: "r4",
    customer: {
      name: "Kevin L.",
      initials: "KL",
      email: "kevin.l@example.com",
      phone: "+1 (555) 441-9023",
      visits: 3,
      memberSince: "2024-11-18",
    },
    rating: 4,
    service: "Signature Cut",
    date: "2025-04-10",
    text: "Really solid cut, clean lines and great conversation. Only minor thing was a small wait but totally worth it. Will be back.",
    helpful: 7,
    reply: null,
    replyAt: null,
    reported: false,
  },
  {
    id: "r5",
    customer: {
      name: "Marcus T.",
      initials: "MT",
      email: "marcus.t@example.com",
      phone: "+1 (555) 772-3310",
      visits: 9,
      memberSince: "2023-06-02",
    },
    rating: 5,
    service: "Skin Fade",
    date: "2025-03-28",
    text: "I've been to a lot of barbers in Brooklyn and none come close. The precision on the fade line is something else entirely.",
    helpful: 18,
    reply: "Always appreciate the kind words, Marcus!",
    replyAt: "2025-03-29T14:20:00.000Z",
    reported: false,
  },
  {
    id: "r6",
    customer: {
      name: "Dre B.",
      initials: "DB",
      email: "dre.b@example.com",
      phone: "+1 (555) 119-4400",
      visits: 1,
      memberSince: "2025-03-01",
    },
    rating: 3,
    service: "Classic Cut",
    date: "2025-03-14",
    text: "Good cut but felt a bit rushed. Usually it's better. I know it was a busy day but I'd expect more consistency at this price point.",
    helpful: 3,
    reply: null,
    replyAt: null,
    reported: false,
  },
  {
    id: "r7",
    customer: {
      name: "Isaiah F.",
      initials: "IF",
      email: "isaiah.f@example.com",
      phone: "+1 (555) 908-2211",
      visits: 12,
      memberSince: "2022-09-14",
    },
    rating: 5,
    service: "Skin Fade",
    date: "2025-03-05",
    text: "Marcus remembered exactly how I like my fade without me saying a word. That level of attention to regulars is rare. This is my place.",
    helpful: 21,
    reply:
      "You've been coming through for years — I know your cut by heart now. See you soon!",
    replyAt: "2025-03-06T09:45:00.000Z",
    reported: false,
  },
  {
    id: "r8",
    customer: {
      name: "Theo H.",
      initials: "TH",
      email: "theo.h@example.com",
      phone: "+1 (555) 664-1188",
      visits: 2,
      memberSince: "2024-12-20",
    },
    rating: 4,
    service: "Beard Sculpt",
    date: "2025-02-21",
    text: "Great beard sculpt, smells amazing after the treatment. The experience is top tier. Will definitely be a regular.",
    helpful: 6,
    reply: null,
    replyAt: null,
    reported: false,
  },
  {
    id: "r9",
    customer: {
      name: "Quincy M.",
      initials: "QM",
      email: "quincy.m@example.com",
      phone: "+1 (555) 221-9900",
      visits: 1,
      memberSince: "2025-02-01",
    },
    rating: 5,
    service: "Hot Towel Shave",
    date: "2025-02-07",
    text: "Came in before a big interview, left looking and feeling like a CEO. The straight razor shave was immaculate. Zero cuts, perfect lines.",
    helpful: 11,
    reply: null,
    replyAt: null,
    reported: false,
  },
  {
    id: "r10",
    customer: {
      name: "Nate C.",
      initials: "NC",
      email: "nate.c@example.com",
      phone: "+1 (555) 440-5566",
      visits: 1,
      memberSince: "2025-01-20",
    },
    rating: 2,
    service: "Classic Cut",
    date: "2025-01-29",
    text: "Had to wait almost 40 minutes past my appointment time. The cut itself was decent but the scheduling needs serious work. Disappointing.",
    helpful: 2,
    reply: null,
    replyAt: null,
    reported: false,
  },
  {
    id: "r11",
    customer: {
      name: "Jordan S.",
      initials: "JS",
      email: "jordan.s@example.com",
      phone: "+1 (555) 881-2233",
      visits: 5,
      memberSince: "2024-05-30",
    },
    rating: 5,
    service: "Signature Cut",
    date: "2025-01-14",
    text: "Worth every penny and then some. My wife said it was the best I've looked in years. The shop vibe is unmatched in the borough.",
    helpful: 16,
    reply: "Ha, tell her I said thank you! See you next month.",
    replyAt: "2025-01-15T16:30:00.000Z",
    reported: false,
  },
].map(enrich);

/** @returns {ReturnType<typeof enrich> | undefined} */
export function getReviewById(id) {
  const review = INITIAL_REVIEWS.find((r) => r.id === id);
  return review ? enrich(review) : undefined;
}
