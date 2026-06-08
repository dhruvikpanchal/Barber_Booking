export const ROLES = {
  ADMIN: "ADMIN",
  BARBER: "BARBER",
  CUSTOMER: "CUSTOMER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
