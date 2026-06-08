import type { NextRequest } from "next/server";
import { barberController } from "@/server/modules/barber/controller";
import { barberAuthedRoute, invoke } from "@/server/modules/barber/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getHandler = barberAuthedRoute((req) => barberController.getQueue(req));
const postHandler = barberAuthedRoute((req) => barberController.addToQueue(req));

export async function GET(req: NextRequest) {
  return await invoke(getHandler, req);
}

export async function POST(req: NextRequest) {
  return await invoke(postHandler, req);
}
