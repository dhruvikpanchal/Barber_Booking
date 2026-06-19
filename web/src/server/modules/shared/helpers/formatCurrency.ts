import { regionConfig } from "@/server/config/region";

/** Format a rupee amount (already in rupees, not paise). */
export function formatCurrency(amount: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat(regionConfig.locale, {
    style: "currency",
    currency: regionConfig.currency,
    maximumFractionDigits: 0,
    ...options,
  }).format(amount);
}
