// Saved barbers – enriched with shop, last-visited, total visits, last service
export const SAVED_BARBERS = [
  {
    id: "marcus-vale",
    name: "Marcus Vale",
    role: "Master Barber",
    shopId: "steel-district",
    shopName: "Iron & Oak — Steel District",
    shopCity: "New York, NY",
    rating: 4.9,
    reviews: 128,
    experience: 12,
    startingPrice: 45,
    available: true,
    specialties: ["Skin Fades", "Classic Cuts", "Beard Sculpting"],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    savedAt: "2025-03-12T10:00:00Z",
    lastVisited: "2025-04-28T10:30:00Z",
    totalVisits: 8,
    lastService: "Signature Cut",
    yourRating: 5,
    nextAvailable: "Tomorrow, 10:30 AM",
  },
  {
    id: "lena-park",
    name: "Lena Park",
    role: "Senior Barber",
    shopId: "mission-row",
    shopName: "Iron & Oak — Mission Row",
    shopCity: "San Francisco, CA",
    rating: 4.9,
    reviews: 115,
    experience: 9,
    startingPrice: 44,
    available: true,
    specialties: ["Undercuts", "Colour Treatment", "Precision Fades"],
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    savedAt: "2025-02-01T09:00:00Z",
    lastVisited: "2025-04-10T14:00:00Z",
    totalVisits: 4,
    lastService: "The Works",
    yourRating: 5,
    nextAvailable: "Today, 3:00 PM",
  },
  {
    id: "owen-blake",
    name: "Owen Blake",
    role: "Master Barber",
    shopId: "old-town",
    shopName: "Iron & Oak — Old Town",
    shopCity: "Chicago, IL",
    rating: 4.9,
    reviews: 201,
    experience: 15,
    startingPrice: 50,
    available: false,
    specialties: ["Pompadours", "Classic Shaves", "Executive Cuts"],
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    savedAt: "2025-01-18T11:00:00Z",
    lastVisited: "2025-03-05T11:00:00Z",
    totalVisits: 3,
    lastService: "Hot Towel Shave",
    yourRating: 4,
    nextAvailable: "Wed, 9:00 AM",
  },
  {
    id: "ezra-finch",
    name: "Ezra Finch",
    role: "Head Barber",
    shopId: "brick-lane",
    shopName: "Iron & Oak — Brick Lane",
    shopCity: "Brooklyn, NY",
    rating: 4.8,
    reviews: 102,
    experience: 8,
    startingPrice: 38,
    available: true,
    specialties: ["Bald Fades", "Line-ups", "Beard Sculpting"],
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    savedAt: "2025-04-02T14:00:00Z",
    lastVisited: null,
    totalVisits: 0,
    lastService: null,
    yourRating: null,
    nextAvailable: "Today, 11:00 AM",
  },
];

// Saved shops – enriched with visit count, last visited, opening status
export const SAVED_SHOPS = [
  {
    id: "steel-district",
    name: "Iron & Oak — Steel District",
    city: "New York, NY",
    address: "142 W 36th St, New York, NY 10018",
    rating: 4.9,
    reviews: 312,
    barberCount: 6,
    openHours: "Mon–Sat 9am–8pm",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=80",
    startingPrice: 35,
    savedAt: "2025-01-05T08:00:00Z",
    lastVisited: "2025-04-28T10:30:00Z",
    totalVisits: 11,
    isOpen: true,
    tags: ["Classic", "Beard", "Walk-ins"],
  },
  {
    id: "brick-lane",
    name: "Iron & Oak — Brick Lane",
    city: "Brooklyn, NY",
    address: "88 Bedford Ave, Brooklyn, NY 11211",
    rating: 4.8,
    reviews: 184,
    barberCount: 4,
    openHours: "Tue–Sun 10am–7pm",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80",
    startingPrice: 30,
    savedAt: "2025-03-20T10:00:00Z",
    lastVisited: "2025-03-21T15:00:00Z",
    totalVisits: 2,
    isOpen: true,
    tags: ["Fades", "Affordable", "Brooklyn"],
  },
  {
    id: "old-town",
    name: "Iron & Oak — Old Town",
    city: "Chicago, IL",
    address: "1547 N Wells St, Chicago, IL 60610",
    rating: 4.9,
    reviews: 276,
    barberCount: 5,
    openHours: "Mon–Sun 9am–8pm",
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=900&q=80",
    startingPrice: 32,
    savedAt: "2024-12-10T09:00:00Z",
    lastVisited: "2025-03-05T11:00:00Z",
    totalVisits: 5,
    isOpen: false,
    tags: ["Premium", "Executive", "Shave"],
  },
];

export function formatSavedDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatLastVisited(iso) {
  if (!iso) return "Never visited";
  const d = new Date(iso);
  const diffDays = Math.round((Date.now() - d) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.round(diffDays / 30)}mo ago`;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
