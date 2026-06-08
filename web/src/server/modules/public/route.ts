import type { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, type RouteHandler } from "@/server/shared/errors/errorHandler";
import { withRateLimit, type RateLimitTier } from "@/server/shared/middleware/rateLimit";

export function publicRoute(handler: RouteHandler, tier: RateLimitTier = "public"): RouteHandler {
  return withErrorHandler(withRateLimit(tier)(handler));
}

export function invoke(handler: (req: NextRequest) => Promise<NextResponse>, req: NextRequest) {
  return handler(req);
}
