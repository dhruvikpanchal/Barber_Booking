/** Do not auto-retry when the backend or database is clearly unavailable. */
export function shouldRetryQuery(failureCount, error) {
  const status = error?.status;
  const code = error?.code;

  if (status === 503 || code === "DATABASE_UNAVAILABLE") return false;
  if (status === 500 || status === 401 || status === 403 || status === 404) return false;
  if (status === 422) return false;

  return failureCount < 1;
}
