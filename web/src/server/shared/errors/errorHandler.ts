import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { captureServerException } from "@/server/shared/monitoring/sentry";
import { AppError, ValidationError } from "@/server/shared/errors/AppError";

export type RouteHandler = (
  req: NextRequest,
  ctx?: unknown,
) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
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

function isDatabaseUnavailable(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const message = [
    (err as Error).message,
    String((err as { cause?: unknown }).cause ?? ""),
    String((err as { cause?: { cause?: unknown } }).cause?.cause ?? ""),
  ].join(" ");
  return (
    message.includes("ECONNREFUSED") ||
    message.includes("pool timeout") ||
    message.includes("DATABASE_URL is not set") ||
    message.includes("connect ETIMEDOUT")
  );
}

export function handleError(err: unknown): NextResponse {
  if (isDatabaseUnavailable(err)) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_UNAVAILABLE",
          message:
            "Database is not reachable. Start MariaDB/MySQL and set DATABASE_URL to use 127.0.0.1 (not localhost), e.g. mysql://user:pass@127.0.0.1:3306/barber_web",
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

  console.error("[Unhandled Error]", err);
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
