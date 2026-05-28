import BarberProfileSummary from "@/components/domain/BarberProfileSummary.jsx";
import { mapProfileToPublicSummary } from "@/lib/barber/mapProfileToPublicSummary.js";

export default function PublicPreview({ profile, displayName, experienceLabel }) {
  const barber = mapProfileToPublicSummary(profile, displayName, experienceLabel);

  return <BarberProfileSummary variant="compact" barber={barber} />;
}
