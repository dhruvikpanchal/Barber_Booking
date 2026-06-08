import { BadRequestError } from "@/server/shared/errors/AppError";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
}

/** Verifies Cloudflare Turnstile token when TURNSTILE_SECRET_KEY is configured. */
export async function verifyTurnstile(token: string | undefined): Promise<void> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return;

  if (!token?.trim()) {
    throw new BadRequestError("Captcha verification is required");
  }

  const res = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token.trim() }),
  });

  if (!res.ok) {
    throw new BadRequestError("Captcha verification failed");
  }

  const data = (await res.json()) as { success?: boolean };
  if (!data.success) {
    throw new BadRequestError("Captcha verification failed");
  }
}
