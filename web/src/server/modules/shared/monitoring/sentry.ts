/** Report server errors to Sentry when SENTRY_DSN is configured. */
export function captureServerException(err: unknown): void {
  const dsn = process.env.SENTRY_DSN?.trim();
  if (!dsn) return;

  void import("@sentry/nextjs").then((Sentry) => {
    Sentry.captureException(err);
  });
}
