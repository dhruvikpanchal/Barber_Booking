import { formatDateLabel } from "@/lib/format/formatDateTime.js";

export function cacheBustUrl(url) {
  if (!url || url.startsWith("blob:")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${Date.now()}`;
}

export function formatMemberSince(iso) {
  try {
    return formatDateLabel(iso, { month: "long", year: "numeric" });
  } catch {
    return "—";
  }
}
