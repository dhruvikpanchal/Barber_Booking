import type { NextRequest } from "next/server";
import { barberController } from "@/server/modules/barber/controller";
import { barberAuthedRoute, invoke } from "@/server/modules/barber/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string; reqId: string }> };

const patchHandler = (id: string, reqId: string) =>
  barberAuthedRoute((req) => barberController.respondServiceChange(req, id, reqId));

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { id, reqId } = await context.params;
  return await invoke(patchHandler(id, reqId), req);
}
