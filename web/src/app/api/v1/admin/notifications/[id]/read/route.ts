import type { NextRequest } from "next/server";
import { adminController } from "@/server/modules/admin/controller";
import { adminAuthedRoute, invoke } from "@/server/modules/admin/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const handler = (id: string) =>
  adminAuthedRoute((req) => adminController.markNotificationRead(req, id));

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return invoke(handler(id), req);
}
