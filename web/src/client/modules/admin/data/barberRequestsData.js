/** Mock barber onboarding applications for admin review. */
export const INITIAL_BARBER_REQUESTS = [
  {
    id: "BR-2401",
    shopName: "The Cardinal Barbershop",
    ownerName: "Marcus Stone",
    city: "Brooklyn, NY",
    experience: "5-10",
    documents: [
      { id: "d1", label: "Business license", fileName: "cardinal-license.pdf" },
      { id: "d2", label: "Barber certificate", fileName: "marcus-cert.pdf" },
      { id: "d3", label: "ID verification", fileName: "marcus-id.jpg" },
    ],
    status: "pending",
    submittedAt: "2026-05-17T14:22:00Z",
    email: "marcus.stone@email.com",
    phone: "+1 (718) 555-0142",
    bio: "Precision fades and classic cuts. Chair experience since 2015 in Bed-Stuy.",
    specialties: ["Fade & Taper", "Beard Trim", "Line-ups"],
    portfolio: "https://instagram.com/marcusstonecuts",
  },
  {
    id: "BR-2402",
    shopName: "Iron & Oak — Mission Row",
    ownerName: "Diego Rey",
    city: "San Francisco, CA",
    experience: "10+",
    documents: [
      { id: "d1", label: "Shop lease", fileName: "mission-row-lease.pdf" },
      { id: "d2", label: "Insurance", fileName: "diego-insurance.pdf" },
    ],
    status: "pending",
    submittedAt: "2026-05-18T09:10:00Z",
    email: "diego@reybarber.co",
    phone: "+1 (415) 555-0198",
    bio: "Master barber specializing in skin fades and hot towel shaves.",
    specialties: ["Skin Fades", "Hot Towel Shave", "Razor Fades"],
    portfolio: "https://instagram.com/diegorey_sf",
  },
  {
    id: "BR-2403",
    shopName: "Freelance / Independent",
    ownerName: "Ava Chen",
    city: "Austin, TX",
    experience: "2-5",
    documents: [
      { id: "d1", label: "State license", fileName: "ava-tx-license.pdf" },
    ],
    status: "approved",
    submittedAt: "2026-05-12T16:45:00Z",
    email: "ava.chen@email.com",
    phone: "+1 (512) 555-0331",
    bio: "Colour specialist and modern cuts for downtown clients.",
    specialties: ["Colour & Highlights", "Classic Cuts"],
    portfolio: "https://instagram.com/avachenhair",
  },
  {
    id: "BR-2404",
    shopName: "Brick Lane Cuts",
    ownerName: "Owen Blake",
    city: "London, UK",
    experience: "0-2",
    documents: [
      { id: "d1", label: "Apprenticeship proof", fileName: "owen-apprentice.pdf" },
      { id: "d2", label: "Portfolio PDF", fileName: "owen-portfolio.pdf" },
    ],
    status: "rejected",
    submittedAt: "2026-05-10T11:30:00Z",
    email: "owen.blake@email.com",
    phone: "+44 20 7946 0123",
    bio: "New to the platform — building a classic cuts portfolio.",
    specialties: ["Classic Cuts", "Kids Cuts"],
    portfolio: "",
    rejectionNote: "Incomplete license documentation. Please re-upload a valid certificate.",
  },
  {
    id: "BR-2405",
    shopName: "Steel District Grooming",
    ownerName: "Ezra Finch",
    city: "Pittsburgh, PA",
    experience: "5-10",
    documents: [
      { id: "d1", label: "Business license", fileName: "steel-district-license.pdf" },
      { id: "d2", label: "Health permit", fileName: "health-permit-2026.pdf" },
      { id: "d3", label: "Liability insurance", fileName: "liability-insurance.pdf" },
    ],
    status: "pending",
    submittedAt: "2026-05-19T08:05:00Z",
    email: "ezra@steeldistrict.com",
    phone: "+1 (412) 555-0277",
    bio: "Shop owner expanding to a second location on the platform.",
    specialties: ["Fade & Taper", "Hair Design", "Grey Blending"],
    portfolio: "https://instagram.com/steeldistrictgrooming",
  },
  {
    id: "BR-2406",
    shopName: "Old Town Barbers",
    ownerName: "Noah Pierce",
    city: "Charleston, SC",
    experience: "2-5",
    documents: [
      { id: "d1", label: "Barber license", fileName: "noah-sc-license.pdf" },
      { id: "d2", label: "Shop photos", fileName: "old-town-interior.zip" },
    ],
    status: "pending",
    submittedAt: "2026-05-19T12:40:00Z",
    email: "noah@oldtownbarbers.com",
    phone: "+1 (843) 555-0412",
    bio: "Traditional barbershop atmosphere with modern booking expectations.",
    specialties: ["Classic Cuts", "Beard Trim", "Hot Towel Shave"],
    portfolio: "https://instagram.com/oldtownbarbers_sc",
  },
];

export const EXPERIENCE_LABELS = {
  "0-2": "Apprentice · 0–2 yrs",
  "2-5": "Journeyman · 2–5 yrs",
  "5-10": "Senior · 5–10 yrs",
  "10+": "Master · 10+ yrs",
};

const DEFAULT_WORKING_HOURS = [
  { day: "Mon", hours: "9:00 AM – 7:00 PM" },
  { day: "Tue", hours: "9:00 AM – 7:00 PM" },
  { day: "Wed", hours: "9:00 AM – 7:00 PM" },
  { day: "Thu", hours: "9:00 AM – 8:00 PM" },
  { day: "Fri", hours: "9:00 AM – 8:00 PM" },
  { day: "Sat", hours: "8:00 AM – 6:00 PM" },
  { day: "Sun", hours: "Closed" },
];

const DEFAULT_SKILLS = [
  "Client consultation",
  "Sanitation & safety",
  "Appointment management",
];

function categorizeDocuments(documents = []) {
  const identity = [];
  const license = [];
  const other = [];

  for (const doc of documents) {
    const label = (doc.label || "").toLowerCase();
    if (
      label.includes("id") ||
      label.includes("identity") ||
      label.includes("verification")
    ) {
      identity.push(doc);
    } else if (
      label.includes("license") ||
      label.includes("certificate") ||
      label.includes("cert") ||
      label.includes("permit") ||
      label.includes("insurance") ||
      label.includes("lease")
    ) {
      license.push(doc);
    } else {
      other.push(doc);
    }
  }

  return { identity, license, other };
}

/** Enrich list row with detail-only fields for the full application view. */
export function buildBarberRequestDetail(raw) {
  const experienceLabel =
    EXPERIENCE_LABELS[raw.experience] ?? raw.experience;

  const certifications =
    raw.certifications ??
    (raw.experience === "10+"
      ? ["Master Barber License", "State Board Certified"]
      : raw.experience === "5-10"
        ? ["Licensed Barber", "Health & Safety Certified"]
        : ["State Barber License (pending renewal)"]);

  const previousWork =
    raw.previousWork ??
    (raw.bio
      ? raw.bio
      : `Previously operated in ${raw.city} before applying to Iron & Oak.`);

  const address = raw.address ?? `${raw.shopName}, ${raw.city}`;

  const skills = raw.skills?.length
    ? raw.skills
    : [...(raw.specialties ?? []), ...DEFAULT_SKILLS].slice(0, 8);

  const documentGroups = categorizeDocuments(raw.documents);

  return {
    ...raw,
    fullName: raw.fullName ?? raw.ownerName,
    address,
    profilePhotoUrl: raw.profilePhotoUrl ?? null,
    experienceLabel,
    skills,
    workingHours: raw.workingHours ?? DEFAULT_WORKING_HOURS,
    previousWork,
    certifications,
    documentGroups,
  };
}

/** @returns {ReturnType<typeof buildBarberRequestDetail> | undefined} */
export function getBarberRequestById(id) {
  const raw = INITIAL_BARBER_REQUESTS.find((r) => r.id === id);
  return raw ? buildBarberRequestDetail(raw) : undefined;
}
