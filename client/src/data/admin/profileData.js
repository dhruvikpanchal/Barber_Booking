/** Demo seed data until auth / API is wired. */
export const INITIAL_PROFILE = {
  fullName: "Marcus Vance",
  email: "marcus.vance@ironandoak.com",
  phone: "+1 (555) 831-2940",
  role: "Admin",
  /** Remote URL or a temporary object URL after upload */
  photoUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  /** ISO date used to render “Member since” */
  joinedAt: "2023-01-10T09:00:00.000Z",
};

import { formatDateLabel } from "@/lib/format/formatDateTime.js";

export function formatMemberSince(iso) {
  try {
    return formatDateLabel(iso, { month: "long", year: "numeric" });
  } catch {
    return "—";
  }
}
