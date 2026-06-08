import type { NextRequest } from "next/server";
import { barberController } from "@/server/modules/barber/controller";
import { barberAuthedRoute, invoke } from "@/server/modules/barber/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const patchHandler = (id: string) =>
  barberAuthedRoute((req) => barberController.updateGalleryImage(req, id));
const deleteHandler = (id: string) =>
  barberAuthedRoute((req) => barberController.deleteGalleryImage(req, id));

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return invoke(patchHandler(id), req);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return invoke(deleteHandler(id), req);
}
