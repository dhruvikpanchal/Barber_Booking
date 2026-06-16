import type { NextRequest } from "next/server";
import { barberController } from "@/server/modules/barber/controller";
import { barberAuthedRoute, invoke } from "@/server/modules/barber/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = barberAuthedRoute((req) => barberController.updatePassword(req));

export function PATCH(req: NextRequest) {
  return invoke(handler, req);
}
