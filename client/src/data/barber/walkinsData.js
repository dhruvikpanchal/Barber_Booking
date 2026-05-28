const minutesAgo = (m) => Date.now() - m * 60_000;

export const INITIAL = [
  {
    id: "w-1",
    name: "Marcus Bell",
    phone: "+1 555 010 2233",
    service: "Skin Fade",
    duration: 40,
    notes: "Prefers a tight taper.",
    status: "in-service",
    addedAt: minutesAgo(12),
  },
  {
    id: "w-2",
    name: "Devon Reyes",
    phone: "+1 555 884 1190",
    service: "Signature Cut",
    duration: 45,
    notes: "",
    status: "waiting",
    addedAt: minutesAgo(8),
  },
  {
    id: "w-3",
    name: "Aaron Cole",
    phone: "",
    service: "Beard Sculpt",
    duration: 25,
    notes: "Walk-in from Front Street.",
    status: "waiting",
    addedAt: minutesAgo(3),
  },
  {
    id: "w-4",
    name: "Jamal Price",
    phone: "+1 555 220 9871",
    service: "Hot Towel Shave",
    duration: 30,
    notes: "",
    status: "done",
    addedAt: minutesAgo(75),
  },
];

export const SERVICE_OPTIONS = [
  { name: "Signature Cut", duration: 45 },
  { name: "Skin Fade", duration: 40 },
  { name: "Beard Sculpt", duration: 25 },
  { name: "Hot Towel Shave", duration: 30 },
  { name: "Kids Cut", duration: 25 },
];
