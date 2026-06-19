import { isTransientDbError } from "@/server/db/transientErrors";

const DEFAULT_ATTEMPTS = 3;
const BASE_DELAY_MS = 250;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Retry short-lived DB connection failures (e.g. Neon wake-up after idle). */
export async function withDbRetry<T>(
  fn: () => Promise<T>,
  attempts = DEFAULT_ATTEMPTS,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const canRetry = isTransientDbError(err) && attempt < attempts - 1;
      if (!canRetry) throw err;
      await wait(BASE_DELAY_MS * 2 ** attempt);
    }
  }

  throw lastError;
}
