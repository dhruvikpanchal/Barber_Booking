import type { NextRequest, NextResponse } from "next/server";
import { withErrorHandler, type RouteHandler } from "@/server/modules/shared/helpers/errorHandler";
import { withAuth } from "@/server/modules/shared/middleware/auth";
import { withRateLimit, type RateLimitTier } from "@/server/modules/shared/middleware/rateLimit";
import { customerOnly } from "@/server/modules/shared/middleware/role";

export function customerRoute(
  handler: RouteHandler,
  tier: RateLimitTier = "relaxed",
): RouteHandler {
  return withErrorHandler(withRateLimit(tier)(handler));
}

/** Authenticated customer-only routes (dashboard, profile, bookings, etc.) */
export function customerAuthedRoute(
  handler: RouteHandler,
  tier: RateLimitTier = "standard",
): RouteHandler {
  return customerRoute(withAuth(customerOnly(handler)), tier);
}

/** Booking discovery — no login required to browse barbers/slots */
export function customerBookingRoute(handler: RouteHandler): RouteHandler {
  return customerRoute(handler, "public");
}

export function invoke(handler: (req: NextRequest) => Promise<NextResponse>, req: NextRequest) {
  return handler(req);
}
