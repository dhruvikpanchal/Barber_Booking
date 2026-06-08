/** Cloudflare Turnstile site key (public). Leave unset to disable captcha in development. */
export const TURNSTILE_SITE_KEY =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || ""
    : "";

export function isTurnstileEnabled() {
  return Boolean(TURNSTILE_SITE_KEY);
}
