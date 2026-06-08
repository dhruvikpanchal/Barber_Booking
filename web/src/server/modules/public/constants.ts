/** Contact form subjects — matches client `data/contact.js` */
export const CONTACT_SUBJECTS = [
  "General inquiry",
  "Booking issue",
  "Account & login",
  "Payment & billing",
  "Report a problem",
  "Partnership inquiry",
  "Press & media",
  "Other",
] as const;

/** Public support panel — matches client `CONTACT_INFO` (icons as string ids) */
export const PUBLIC_CONTACT_INFO = {
  phone: "+1 (555) 018-2049",
  email: "support@ironandoak.app",
  address: {
    street: "114 West Barrow Street",
    suite: "Suite 3B",
    city: "Brooklyn",
    state: "NY",
    zip: "11201",
    country: "United States",
  },
  hours: [
    { days: "Monday – Friday", time: "9:00 AM – 6:00 PM EST" },
    { days: "Saturday", time: "10:00 AM – 4:00 PM EST" },
    { days: "Sunday", time: "Closed" },
  ],
  social: [
    {
      id: "facebook",
      label: "Facebook",
      handle: "@ironandoak",
      href: "https://facebook.com/ironandoak",
    },
    {
      id: "instagram",
      label: "Instagram",
      handle: "@iron.and.oak",
      href: "https://instagram.com/iron.and.oak",
    },
    {
      id: "twitter",
      label: "X / Twitter",
      handle: "@ironandoak",
      href: "https://x.com/ironandoak",
    },
  ],
} as const;

/** Marketing fields not stored on `Service` — keyed by slug */
export const SERVICE_MARKETING: Record<
  string,
  {
    category: string;
    tagline: string;
    benefits: string[];
    note?: string;
    relatedIds: string[];
  }
> = {
  "signature-cut": {
    category: "Haircut",
    tagline: "Precision, personalised — every time.",
    benefits: [
      "Personal consultation before the cut begins",
      "Scissor and clipper blending for natural movement",
      "Hot-towel neckline finish for a clean close",
      "Style advice and product recommendations",
      "Suitable for all hair types and textures",
    ],
    note: "Duration may extend by 10–15 min for longer or denser hair. Price varies by barber and location.",
    relatedIds: ["skin-fade", "the-works", "hot-towel-shave"],
  },
  "skin-fade": {
    category: "Haircut",
    tagline: "Sharp taper, clean finish — zero compromise.",
    benefits: [
      "Seamless gradient from skin to full length",
      "Razor-detailed hairline, temples, and neckline",
      "High, mid, or low taper placement to suit your style",
      "Aftershave balm applied to faded areas",
      "Lasts 3–4 weeks before a touch-up is needed",
    ],
    note: "Exact fade height and contrast are agreed during the consultation. Price varies by barber.",
    relatedIds: ["signature-cut", "the-works", "beard-sculpt"],
  },
  "beard-sculpt": {
    category: "Beard",
    tagline: "Define, condition, repeat.",
    benefits: [
      "Custom length setting to your preference",
      "Straight-razor cheek and neckline definition",
      "Warm towel wrap to open pores before shaping",
      "Conditioning beard oil applied after sculpting",
      "Tips on home maintenance to hold the shape longer",
    ],
    note: "Can be added as an add-on to any haircut service for a reduced combined rate. Price varies by barber.",
    relatedIds: ["hot-towel-shave", "the-works", "signature-cut"],
  },
  "hot-towel-shave": {
    category: "Beard",
    tagline: "The old-school ritual, done properly.",
    benefits: [
      "Multi-stage hot-towel prep for a closer shave",
      "Pre-shave oil to protect and soften the skin",
      "Straight-razor shave with the grain",
      "Cold towel and soothing aftershave balm",
      "Ideal before events or interviews",
    ],
    note: "Allow 30–40 minutes. Not recommended immediately after sunburn or active breakouts.",
    relatedIds: ["beard-sculpt", "the-works", "signature-cut"],
  },
  "father-son": {
    category: "Haircut",
    tagline: "Two chairs, one appointment.",
    benefits: [
      "Back-to-back precision cuts for adult and child",
      "Patient, kid-friendly barber options available",
      "Coordinated styling advice for both",
      "Single booking, single checkout",
    ],
    relatedIds: ["signature-cut", "skin-fade", "kids-cuts"],
  },
  "the-works": {
    category: "Package",
    tagline: "Cut, shave, beard — the full treatment.",
    benefits: [
      "Signature cut with consultation",
      "Hot towel shave or beard sculpt",
      "Scalp treatment and styling finish",
      "Best value for a full refresh",
    ],
    note: "Typically 75–90 minutes. Book when you have time to relax.",
    relatedIds: ["signature-cut", "skin-fade", "hot-towel-shave"],
  },
};

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;
