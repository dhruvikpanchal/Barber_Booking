/** Demo seed data until auth / API is wired. */
export const INITIAL_PROFILE = {
  fullName: "Alice Morgan",
  email: "alice.morgan@example.com",
  phone: "+1 (555) 012-3456",
  address: "742 Evergreen Terrace · Springfield, OR 97477",
  /** Remote URL or a temporary object URL after upload */
  photoUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  /** ISO date used to render “Member since” */
  joinedAt: "2024-06-12T14:30:00.000Z",
};

import { formatDateLabel } from "@/lib/format/formatDateTime.js";

export function formatMemberSince(iso) {
  try {
    return formatDateLabel(iso, { month: "long", year: "numeric" });
  } catch {
    return "—";
  }
}
