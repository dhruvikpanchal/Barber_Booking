import type { NextRequest } from "next/server";
import { barberController } from "@/server/modules/barber/controller";
import { barberAuthedRoute, invoke } from "@/server/modules/barber/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const deleteHandler = (id: string) =>
  barberAuthedRoute((req) => barberController.removeFromQueue(req, id));

export async function DELETE(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return await invoke(deleteHandler(id), req);
}
