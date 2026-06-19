import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { withDbRetry } from "@/server/db/retry";
import { isTransientDbError, collectErrorText } from "@/server/db/transientErrors";
import { captureServerException } from "@/server/modules/shared/monitoring/sentry";
import { AppError, ValidationError } from "@/server/modules/shared/helpers/AppError";

export type RouteHandler = (req: NextRequest, ctx?: unknown) => Promise<NextResponse>;

function logRouteError(req: NextRequest, err: unknown) {
  const path = req.nextUrl?.pathname ?? "unknown";
  const method = req.method ?? "GET";

  if (isDatabaseUnavailable(err)) {
    console.error(`[API ${method} ${path}] Database unavailable`, summarizeError(err));
    return;
  }

  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      console.error(`[API ${method} ${path}] ${err.code}: ${err.message}`);
    }
    return;
  }

  if (err instanceof ZodError) return;

  console.error(`[API ${method} ${path}] Unhandled error`, summarizeError(err));
}

function summarizeError(err: unknown) {
  if (err instanceof Error) {
    return { message: err.message, stack: err.stack };
  }
  return { message: String(err) };
}

/**
 * Next.js uses thrown errors carrying a `digest` for internal control flow
 * (dynamic-server bailouts during static generation, redirect(), notFound()).
 * These must propagate to Next.js, never be swallowed/logged as app errors.
 */
function isNextControlFlowError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const digest = (err as { digest?: unknown }).digest;
  return (
    typeof digest === "string" &&
    (digest === "DYNAMIC_SERVER_USAGE" ||
      digest.startsWith("NEXT_REDIRECT") ||
      digest === "NEXT_NOT_FOUND" ||
      digest.startsWith("NEXT_HTTP_ERROR_FALLBACK"))
  );
}

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await withDbRetry(() => handler(req, ctx));
    } catch (err) {
      if (isNextControlFlowError(err)) throw err;
      logRouteError(req, err);
      return handleError(err);
    }
  };
}

function zodIssuesToFields(err: ZodError): Record<string, string[]> {
  const fields: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_root";
    if (!fields[key]) fields[key] = [];
    fields[key].push(issue.message);
  }
  return fields;
}

export function isDatabaseUnavailable(err: unknown): boolean {
  if (!err) return false;
  const message = collectErrorText(err);
  if (message.includes("DATABASE_URL is not set")) return true;
  if (message.includes("password authentication failed")) return true;
  return isTransientDbError(err);
}

function isQueryBindingError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const message = [
    (err as Error).message,
    String((err as { cause?: unknown }).cause ?? ""),
  ].join(" ");
  return message.includes("ERR_INVALID_ARG_TYPE");
}

const DATABASE_UNAVAILABLE_MESSAGE =
  "Database is not reachable. Verify DATABASE_URL points to your PostgreSQL database (Neon/local) and that the instance is running.";

export function handleError(err: unknown): NextResponse {
  if (isDatabaseUnavailable(err) && !isQueryBindingError(err)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_UNAVAILABLE",
          message: DATABASE_UNAVAILABLE_MESSAGE,
        },
      },
      { status: 503 },
    );
  }

  if (err instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: err.code,
          message: err.message,
          ...(err instanceof ValidationError && err.fields ? { fields: err.fields } : {}),
        },
      },
      { status: err.statusCode },
    );
  }

  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          fields: zodIssuesToFields(err),
        },
      },
      { status: 422 },
    );
  }

  captureServerException(err);
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      },
    },
    { status: 500 },
  );
}
