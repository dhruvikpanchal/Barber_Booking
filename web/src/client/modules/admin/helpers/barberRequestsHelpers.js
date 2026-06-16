import {
  DEFAULT_WORKING_HOURS,
  DEFAULT_SKILLS,
} from "@/client/modules/admin/constants/barberRequestsConstants.js";
import { EXPERIENCE_LABELS } from "@/client/modules/admin/constants/barberRequestsConstants.js";

function categorizeDocuments(documents = []) {
  const identity = [];
  const license = [];
  const other = [];

  for (const doc of documents) {
    const label = (doc.label || "").toLowerCase();
    if (label.includes("id") || label.includes("identity") || label.includes("verification")) {
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
  const experienceLabel = EXPERIENCE_LABELS[raw.experience] ?? raw.experience;

  const certifications =
    raw.certifications ??
    (raw.experience === "10+"
      ? ["Master Barber License", "State Board Certified"]
      : raw.experience === "5-10"
        ? ["Licensed Barber", "Health & Safety Certified"]
        : ["State Barber License (pending renewal)"]);

  const previousWork =
    raw.previousWork ??
    (raw.bio ? raw.bio : `Previously operated in ${raw.city} before applying to Iron & Oak.`);

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
