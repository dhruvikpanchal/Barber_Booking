export function collectErrorText(err: unknown, depth = 0): string {
  if (!err || depth > 4) return "";
  if (typeof err === "string") return err;

  const parts: string[] = [];
  if (err instanceof Error) {
    parts.push(err.message);
    if (err.stack) parts.push(err.stack);
  } else if (typeof err === "object" && "message" in err) {
    parts.push(String((err as { message: unknown }).message));
  }

  if (typeof err === "object" && err !== null) {
    const cause = (err as { cause?: unknown }).cause;
    if (cause) parts.push(collectErrorText(cause, depth + 1));
  }

  return parts.join(" ");
}

/** True when a query failed due to connectivity, not business/SQL logic. */
export function isTransientDbError(err: unknown): boolean {
  const message = collectErrorText(err);

  return (
    message.includes("ECONNREFUSED") ||
    message.includes("ECONNRESET") ||
    message.includes("ENOTFOUND") ||
    message.includes("ETIMEDOUT") ||
    message.includes("EPIPE") ||
    message.includes("EAI_AGAIN") ||
    message.includes("pool timeout") ||
    message.includes("Connection terminated") ||
    message.includes("connection terminated") ||
    message.includes("connection is closed") ||
    message.includes("Client has encountered a connection error") ||
    message.includes("server closed the connection unexpectedly") ||
    message.includes("Connection ended unexpectedly") ||
    message.includes("socket hang up") ||
    message.includes("57P01") ||
    message.includes("08006") ||
    message.includes("08003") ||
    message.includes("08000") ||
    message.includes("57P03") ||
    (message.includes("Failed query") &&
      (message.includes("ECONNRESET") ||
        message.includes("ETIMEDOUT") ||
        message.includes("terminated") ||
        message.includes("closed") ||
        message.includes("timeout")))
  );
}
