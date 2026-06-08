import type { NextRequest } from "next/server";
import { barberController } from "@/server/modules/barber/controller";
import { barberAuthedRoute, invoke } from "@/server/modules/barber/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getHandler = barberAuthedRoute((req) => barberController.listServices(req));
const postHandler = barberAuthedRoute((req) => barberController.createService(req));

export function GET(req: NextRequest) {
  return invoke(getHandler, req);
}

export function POST(req: NextRequest) {
  return invoke(postHandler, req);
}
