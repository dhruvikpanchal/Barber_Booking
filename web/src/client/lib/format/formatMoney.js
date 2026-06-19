import { regionConfig } from "@/config/region.js";

/** Fixed locale so SSR and the browser format the same text. */
export function formatMoney(value, options = {}) {
  if (value == null) return "—";
  return new Intl.NumberFormat(regionConfig.locale, {
    style: "currency",
    currency: regionConfig.currency,
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
}
