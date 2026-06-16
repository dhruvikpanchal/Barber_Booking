import { EXP_TIERS } from "@/client/modules/barber/constants/barberConstants.js";

/** Map barber panel profile state → public-facing summary card fields. */
export function mapProfileToPublicSummary(profile, displayName, experienceLabel) {
  const tier = EXP_TIERS.find((t) => t.value === profile.experience);
  const experienceText = tier
    ? `${tier.sub} experience`
    : experienceLabel
      ? `${experienceLabel} experience`
      : undefined;

  const location = profile.shopName?.trim() || profile.city?.trim() || "Your shop";

  return {
    name: displayName,
    role: profile.shopName ? `Barber · ${profile.shopName}` : "Barber",
    image: profile.photoPreview || null,
    available: Boolean(profile.availableToday),
    location,
    address: profile.shopAddress?.trim() || profile.city?.trim() || undefined,
    city: profile.city,
    rating: 4.9,
    reviewCount: 128,
    experienceText,
    startingPrice: 35,
    bio: profile.bio?.trim() || undefined,
    specialties: profile.specialties ?? [],
    services: (profile.specialties ?? []).slice(0, 4),
  };
}
