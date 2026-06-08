import type { NextRequest } from "next/server";
import { barberController } from "@/server/modules/barber/controller";
import { barberAuthedRoute, invoke } from "@/server/modules/barber/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ date: string }> };

const deleteHandler = (date: string) =>
  barberAuthedRoute((req) => barberController.removeUnavailableDate(req, date));

export async function DELETE(req: NextRequest, context: RouteContext) {
  const { date } = await context.params;
  return await invoke(deleteHandler(date), req);
}
