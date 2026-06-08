import type { NextRequest } from "next/server";
import { customerController } from "@/server/modules/customer/controller";
import { customerBookingRoute, invoke } from "@/server/modules/customer/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = customerBookingRoute((req) => customerController.listBookingBarbers(req));

export function GET(req: NextRequest) {
  return invoke(handler, req);
}
