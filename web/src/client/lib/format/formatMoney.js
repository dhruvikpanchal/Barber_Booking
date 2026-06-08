/** Fixed locale so SSR and the browser format the same text. */
const MONEY_LOCALE = "en-US";

export function formatMoney(value) {
  if (value == null) return "—";
  return new Intl.NumberFormat(MONEY_LOCALE, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
