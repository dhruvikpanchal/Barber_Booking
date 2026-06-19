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
  const documentGroups = categorizeDocuments(raw.documents);

  return {
    ...raw,
    fullName: raw.fullName ?? raw.ownerName,
    address: raw.address ?? null,
    profilePhotoUrl: raw.profilePhotoUrl ?? null,
    experienceLabel,
    skills: raw.skills?.length ? raw.skills : (raw.specialties ?? []),
    workingHours: raw.workingHours ?? null,
    previousWork: raw.previousWork ?? null,
    certifications: raw.certifications ?? [],
    documentGroups,
  };
}
