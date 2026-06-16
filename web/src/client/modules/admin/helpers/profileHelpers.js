import { formatDateLabel } from "@/lib/format/formatDateTime.js";

export function formatMemberSince(iso) {
  try {
    return formatDateLabel(iso, { month: "long", year: "numeric" });
  } catch {
    return "—";
  }
}
