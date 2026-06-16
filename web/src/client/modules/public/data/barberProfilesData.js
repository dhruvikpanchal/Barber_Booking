const DEFAULT_HOURS = [
  { day: "Monday", hours: "9:00 AM – 7:00 PM", closed: false },
  { day: "Tuesday", hours: "9:00 AM – 7:00 PM", closed: false },
  { day: "Wednesday", hours: "9:00 AM – 7:00 PM", closed: false },
  { day: "Thursday", hours: "9:00 AM – 8:00 PM", closed: false },
  { day: "Friday", hours: "9:00 AM – 8:00 PM", closed: false },
  { day: "Saturday", hours: "8:00 AM – 5:00 PM", closed: false },
  { day: "Sunday", hours: "Closed", closed: true },
];

/** @type {Record<string, { bio: string, gallery: Array<{ id: string, src: string, alt: string }>, workingHours: typeof DEFAULT_HOURS, reviews: Array<{ id: string, name: string, rating: number, text: string, date: string, service?: string }>, ratingBreakdown: Record<number, number> }>} */
export const BARBER_PROFILE_DETAILS = {
  "marcus-vale": {
    bio: "Marcus Vale has spent over a decade refining precision fades and classic cuts at Iron & Oak. Known for calm chair-side consultation and razor-sharp line work, he builds long-term relationships with clients who value consistency and craft.",
    gallery: [
      {
        id: "g1",
        src: "https://images.unsplash.com/photo-1622286342621-4bd786c244f8?w=600&q=80",
        alt: "Skin fade finish",
      },
      {
        id: "g2",
        src: "https://images.unsplash.com/photo-1599351431203-1a0c577ef696?w=600&q=80",
        alt: "Classic cut styling",
      },
      {
        id: "g3",
        src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80",
        alt: "Shop interior",
      },
      {
        id: "g4",
        src: "https://images.unsplash.com/photo-1585747860715-2a3975f8b502?w=600&q=80",
        alt: "Beard sculpt detail",
      },
    ],
    workingHours: DEFAULT_HOURS,
    ratingBreakdown: { 5: 118, 4: 8, 3: 2, 2: 0, 1: 0 },
    reviews: [
      {
        id: "rv-m1",
        name: "James W.",
        rating: 5,
        text: "Sharpest fade I've had in years. Marcus is a genuine craftsman — shows up every single time.",
        date: "2 weeks ago",
        service: "Skin Fade",
      },
      {
        id: "rv-m2",
        name: "Marcus T.",
        rating: 5,
        text: "None come close in Brooklyn. The precision on the fade line is something else entirely.",
        date: "1 month ago",
        service: "Skin Fade",
      },
      {
        id: "rv-m3",
        name: "Isaiah F.",
        rating: 5,
        text: "He remembered exactly how I like my fade without me saying a word. My go-to barber.",
        date: "6 weeks ago",
        service: "Signature Cut",
      },
      {
        id: "rv-m4",
        name: "Kevin L.",
        rating: 4,
        text: "Really solid cut and great conversation. Minor wait but totally worth it.",
        date: "2 months ago",
        service: "Signature Cut",
      },
    ],
  },
  "jay-brooks": {
    bio: "Jay Brooks specializes in textured crops and hot towel shaves with a relaxed, detail-oriented approach. Clients appreciate his patience with first-time visitors and steady hand on beard work.",
    gallery: [
      {
        id: "g1",
        src: "https://images.unsplash.com/photo-1593702275687-f8b402ff5250?w=600&q=80",
        alt: "Textured crop",
      },
      {
        id: "g2",
        src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80",
        alt: "Hot towel prep",
      },
      {
        id: "g3",
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
        alt: "Finished style",
      },
    ],
    workingHours: DEFAULT_HOURS,
    ratingBreakdown: { 5: 72, 4: 16, 3: 4, 2: 1, 1: 1 },
    reviews: [
      {
        id: "rv-j1",
        name: "Theo H.",
        rating: 5,
        text: "Great beard sculpt and the hot towel treatment was top tier.",
        date: "3 weeks ago",
        service: "Beard Sculpt",
      },
      {
        id: "rv-j2",
        name: "Aaron Cole",
        rating: 4,
        text: "Patient and thorough — perfect for my son's first real haircut.",
        date: "1 month ago",
        service: "Signature Cut",
      },
    ],
  },
  "ezra-finch": {
    bio: "Ezra Finch is Head Barber at Brick Lane with a reputation for bald fades and crisp line-ups. He trains junior barbers on fade mechanics and keeps a full book through word of mouth.",
    gallery: [
      {
        id: "g1",
        src: "https://images.unsplash.com/photo-1620331319259-0818a2c1f0e0?w=600&q=80",
        alt: "Bald fade",
      },
      {
        id: "g2",
        src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
        alt: "Line-up detail",
      },
      {
        id: "g3",
        src: "https://images.unsplash.com/photo-1622286342621-4bd786c244f8?w=600&q=80",
        alt: "Fade profile",
      },
    ],
    workingHours: DEFAULT_HOURS,
    ratingBreakdown: { 5: 88, 4: 10, 3: 3, 2: 1, 1: 0 },
    reviews: [
      {
        id: "rv-e1",
        name: "Daniel K.",
        rating: 5,
        text: "Booking was painless and the fade was immaculate.",
        date: "3 weeks ago",
        service: "Skin Fade",
      },
      {
        id: "rv-e2",
        name: "Quincy M.",
        rating: 5,
        text: "Straight razor work was flawless before my interview.",
        date: "2 months ago",
        service: "Hot Towel Shave",
      },
    ],
  },
  "sam-hart": {
    bio: "Sam Hart brings fresh energy to classic scissor work and youth cuts. Ideal for clients who want a approachable vibe and careful consultation on growing-out phases.",
    gallery: [
      {
        id: "g1",
        src: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&q=80",
        alt: "Scissor cut",
      },
      {
        id: "g2",
        src: "https://images.unsplash.com/photo-1599351431203-1a0c577ef696?w=600&q=80",
        alt: "Youth cut",
      },
    ],
    workingHours: DEFAULT_HOURS,
    ratingBreakdown: { 5: 42, 4: 12, 3: 3, 2: 1, 1: 0 },
    reviews: [
      {
        id: "rv-s1",
        name: "Liam C.",
        rating: 5,
        text: "Sam was amazing with my nervous 7-year-old. Patient and kind.",
        date: "1 week ago",
        service: "Father & Son Cut",
      },
    ],
  },
  "lena-park": {
    bio: "Lena Park is a Senior Barber focused on undercuts, precision fades, and colour-aware styling. She documents each client's preferred lengths to deliver repeatable results visit after visit.",
    gallery: [
      {
        id: "g1",
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
        alt: "Precision fade",
      },
      {
        id: "g2",
        src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
        alt: "Styled finish",
      },
      {
        id: "g3",
        src: "https://images.unsplash.com/photo-1622286342621-4bd786c244f8?w=600&q=80",
        alt: "Undercut detail",
      },
    ],
    workingHours: DEFAULT_HOURS,
    ratingBreakdown: { 5: 102, 4: 10, 3: 2, 2: 0, 1: 1 },
    reviews: [
      {
        id: "rv-l1",
        name: "Jordan S.",
        rating: 5,
        text: "Best I've looked in years — wife agrees. Lena nailed the texture.",
        date: "2 weeks ago",
        service: "Signature Cut",
      },
      {
        id: "rv-l2",
        name: "Nina R.",
        rating: 5,
        text: "Undercut grow-out advice was spot on. Booking again.",
        date: "1 month ago",
        service: "Skin Fade",
      },
    ],
  },
  "diego-rey": {
    bio: "Diego Rey masters drop fades and curly-hair textures with a focus on scalp health and hydration. Currently on a short waitlist — book when slots open.",
    gallery: [
      {
        id: "g1",
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80",
        alt: "Curly texture cut",
      },
      {
        id: "g2",
        src: "https://images.unsplash.com/photo-1620331319259-0818a2c1f0e0?w=600&q=80",
        alt: "Drop fade",
      },
    ],
    workingHours: DEFAULT_HOURS,
    ratingBreakdown: { 5: 70, 4: 14, 3: 4, 2: 1, 1: 0 },
    reviews: [
      {
        id: "rv-d1",
        name: "Anthony R.",
        rating: 5,
        text: "Finally someone who understands curly hair without damaging it.",
        date: "1 month ago",
        service: "Skin Fade",
      },
    ],
  },
  "owen-blake": {
    bio: "Owen Blake is a Master Barber with 15 years behind the chair — pompadours, executive cuts, and straight-razor shaves are his signature. Old Town's most booked veteran.",
    gallery: [
      {
        id: "g1",
        src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
        alt: "Executive cut",
      },
      {
        id: "g2",
        src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80",
        alt: "Straight razor shave",
      },
      {
        id: "g3",
        src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80",
        alt: "Pompadour styling",
      },
    ],
    workingHours: DEFAULT_HOURS,
    ratingBreakdown: { 5: 185, 4: 12, 3: 3, 2: 1, 1: 0 },
    reviews: [
      {
        id: "rv-o1",
        name: "Quincy M.",
        rating: 5,
        text: "Came in before a big meeting — left looking like a CEO.",
        date: "3 weeks ago",
        service: "Hot Towel Shave",
      },
      {
        id: "rv-o2",
        name: "James W.",
        rating: 5,
        text: "Fifteen years of skill shows in every pass. Worth every penny.",
        date: "2 months ago",
        service: "Signature Cut",
      },
    ],
  },
  "priya-nair": {
    bio: "Priya Nair excels at tapers, beard design, and scissor-over-comb work for medium lengths. She prioritizes clean growth lines and low-maintenance daily styling.",
    gallery: [
      {
        id: "g1",
        src: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80",
        alt: "Taper fade",
      },
      {
        id: "g2",
        src: "https://images.unsplash.com/photo-1585747860715-2a3975f8b502?w=600&q=80",
        alt: "Beard design",
      },
    ],
    workingHours: DEFAULT_HOURS,
    ratingBreakdown: { 5: 58, 4: 7, 3: 2, 2: 0, 1: 0 },
    reviews: [
      {
        id: "rv-p1",
        name: "Devon R.",
        rating: 5,
        text: "Clean taper and beard line — exactly what I asked for.",
        date: "2 weeks ago",
        service: "Skin Fade",
      },
    ],
  },
  "nina-cross": {
    bio: "Nina Cross offers precision cuts, subtle colour blending, and kids cuts with a calm, organized chair flow. Popular with families and creative professionals.",
    gallery: [
      {
        id: "g1",
        src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
        alt: "Precision cut",
      },
      {
        id: "g2",
        src: "https://images.unsplash.com/photo-1593702275687-f8b402ff5250?w=600&q=80",
        alt: "Colour blend",
      },
    ],
    workingHours: DEFAULT_HOURS,
    ratingBreakdown: { 5: 68, 4: 6, 3: 2, 2: 0, 1: 0 },
    reviews: [
      {
        id: "rv-n1",
        name: "Sarah M.",
        rating: 5,
        text: "Kids cut was quick and my daughter actually smiled after.",
        date: "1 week ago",
        service: "Father & Son Cut",
      },
    ],
  },
};

export const DEFAULT_PROFILE = {
  bio: "Experienced barber at Iron & Oak delivering precision cuts and grooming services tailored to your style.",
  gallery: [
    {
      id: "g1",
      src: "https://images.unsplash.com/photo-1622286342621-4bd786c244f8?w=600&q=80",
      alt: "Barber work",
    },
  ],
  workingHours: DEFAULT_HOURS,
  ratingBreakdown: { 5: 40, 4: 8, 3: 2, 2: 0, 1: 0 },
  reviews: [
    {
      id: "rv-d",
      name: "Guest",
      rating: 5,
      text: "Excellent service and attention to detail.",
      date: "Recently",
      service: "Signature Cut",
    },
  ],
};
