export const SPECIALTIES = [
  "Classic Cuts",
  "Fade & Taper",
  "Beard Trim",
  "Hot Towel Shave",
  "Skin Fades",
  "Razor Fades",
  "Line-ups",
  "Hair Design",
  "Colour & Highlights",
  "Keratin Treatment",
  "Kids Cuts",
  "Grey Blending",
];

export const EXP_TIERS = [
  { label: "Apprentice", sub: "0–2 yrs", value: "0-2" },
  { label: "Journeyman", sub: "2–5 yrs", value: "2-5" },
  { label: "Senior", sub: "5–10 yrs", value: "5-10" },
  { label: "Master", sub: "10+ yrs", value: "10+" },
];

/** Keep in sync with server MAX_GALLERY_IMAGES */
export const MAX_PORTFOLIO_IMAGES = 20;

export const PHONE_PATTERN = /^\+?[\d\s\-().]{7,20}$/;

export const APPOINTMENT_TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "rescheduled", label: "Rescheduled" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "all", label: "All" },
];

export const QUEUE_TABS = [
  { key: "active", label: "Active" },
  { key: "waiting", label: "Waiting" },
  { key: "in-service", label: "In service" },
  { key: "done", label: "Done" },
  { key: "cancelled", label: "Cancelled" },
  { key: "all", label: "All" },
];

export const QUEUE_SOURCE_TABS = [
  { key: "all", label: "All sources" },
  { key: "online", label: "Online" },
  { key: "walk-in", label: "Walk-in" },
];

export const INPUT_CLASS =
  "h-10 w-full rounded-md border border-outline-variant bg-surface-container px-3 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none";
