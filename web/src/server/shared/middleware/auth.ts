import type { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/server/infrastructure/auth/jwt";
import { UnauthorizedError } from "@/server/shared/errors/AppError";
import type { AuthedRequest, AuthUser } from "@/server/shared/types/request";

export type MiddlewareHandler = (
  req: NextRequest,
  ctx?: unknown,
) => Promise<NextResponse>;

function extractBearerToken(req: NextRequest): string | null {
  const header = req.headers.get("authorization") ?? "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : null;
}

function attachUser(req: NextRequest, user: AuthUser): AuthedRequest {
  const authed = req as AuthedRequest;
  authed.user = user;
  return authed;
}

export function withAuth(handler: MiddlewareHandler): MiddlewareHandler {
  return async (req, ctx) => {
    const token = extractBearerToken(req);
    if (!token) throw new UnauthorizedError("Authentication required");

    const payload = verifyAccessToken(token);
    return handler(attachUser(req, { id: payload.sub, role: payload.role }), ctx);
  };
}

export function withOptionalAuth(handler: MiddlewareHandler): MiddlewareHandler {
  return async (req, ctx) => {
    try {
      const token = extractBearerToken(req);
      if (token) {
        const payload = verifyAccessToken(token);
        return handler(attachUser(req, { id: payload.sub, role: payload.role }), ctx);
      }
    } catch {
      // unauthenticated is fine
    }
    return handler(req, ctx);
  };
}
