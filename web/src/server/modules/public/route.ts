import type { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, type RouteHandler } from "@/server/modules/shared/helpers/errorHandler";
import { withRateLimit, type RateLimitTier } from "@/server/modules/shared/middleware/rateLimit";

/** Read-only public GET routes that use ISR — no rate-limit (headers access would force dynamic). */
export function publicCachedRoute(handler: RouteHandler): RouteHandler {
  return withErrorHandler(handler);
}

export function publicRoute(handler: RouteHandler, tier: RateLimitTier = "public"): RouteHandler {
  return withErrorHandler(withRateLimit(tier)(handler));
}

export function invoke(handler: (req: NextRequest) => Promise<NextResponse>, req: NextRequest) {
  return handler(req);
}
