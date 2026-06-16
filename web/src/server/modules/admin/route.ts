import type { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, type RouteHandler } from "@/server/modules/shared/helpers/errorHandler";
import { withAuth } from "@/server/modules/shared/middleware/auth";
import { withRateLimit, type RateLimitTier } from "@/server/modules/shared/middleware/rateLimit";
import { adminOnly } from "@/server/modules/shared/middleware/role";

export function adminRoute(handler: RouteHandler, tier: RateLimitTier = "relaxed"): RouteHandler {
  return withErrorHandler(withRateLimit(tier)(handler));
}

/** Authenticated admin-only routes */
export function adminAuthedRoute(
  handler: RouteHandler,
  tier: RateLimitTier = "standard",
): RouteHandler {
  return adminRoute(withAuth(adminOnly(handler)), tier);
}

export function invoke(handler: (req: NextRequest) => Promise<NextResponse>, req: NextRequest) {
  return handler(req);
}
