import type { NextRequest } from "next/server";
import { customerController } from "@/server/modules/customer/controller";
import { customerBookingRoute, invoke } from "@/server/modules/customer/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ slug: string }> };

const handler = (slug: string) =>
  customerBookingRoute((req) => customerController.getAvailableSlots(req, slug));

export async function GET(req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  return invoke(handler(slug), req);
}
