/** Experience tiers — matches `EXP_TIERS` in client barber constants */
export const BARBER_EXPERIENCE_TIERS = ["0-2", "2-5", "5-10", "10+"] as const;
export type BarberExperienceTier = (typeof BARBER_EXPERIENCE_TIERS)[number];

/** Typical availability — matches BarberRegister.jsx select values */
export const BARBER_AVAILABILITY = [
  "full-time",
  "part-time",
  "weekends",
  "flexible",
] as const;
export type BarberAvailability = (typeof BARBER_AVAILABILITY)[number];
