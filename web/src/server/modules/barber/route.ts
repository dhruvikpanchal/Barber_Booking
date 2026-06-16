import type { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, type RouteHandler } from "@/server/modules/shared/helpers/errorHandler";
import { withAuth } from "@/server/modules/shared/middleware/auth";
import { withRateLimit, type RateLimitTier } from "@/server/modules/shared/middleware/rateLimit";
import { barberOnly } from "@/server/modules/shared/middleware/role";

export function barberRoute(handler: RouteHandler, tier: RateLimitTier = "relaxed"): RouteHandler {
  return withErrorHandler(withRateLimit(tier)(handler));
}

/** Authenticated barber-only routes (dashboard, appointments, queue, etc.) */
export function barberAuthedRoute(
  handler: RouteHandler,
  tier: RateLimitTier = "standard",
): RouteHandler {
  return barberRoute(withAuth(barberOnly(handler)), tier);
}

export function invoke(handler: (req: NextRequest) => Promise<NextResponse>, req: NextRequest) {
  return handler(req);
}
