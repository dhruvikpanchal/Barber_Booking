/** Retry once on transient DB wake-up; avoid hammering real outages. */
export function shouldRetryQuery(failureCount, error) {
  const status = error?.status;
  const code = error?.code;

  if (code === "DATABASE_UNAVAILABLE" || status === 503) {
    return failureCount < 1;
  }
  if (status === 500 || status === 401 || status === 403 || status === 404) return false;
  if (status === 422) return false;

  return failureCount < 1;
}
