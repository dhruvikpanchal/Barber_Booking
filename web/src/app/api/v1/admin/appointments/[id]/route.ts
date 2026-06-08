import type { NextRequest } from "next/server";
import { adminController } from "@/server/modules/admin/controller";
import { adminAuthedRoute, invoke } from "@/server/modules/admin/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const getHandler = (id: string) =>
  adminAuthedRoute((req) => adminController.getAppointment(req, id));

const patchHandler = (id: string) =>
  adminAuthedRoute((req) => adminController.updateAppointmentStatus(req, id));

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return invoke(getHandler(id), req);
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return invoke(patchHandler(id), req);
}
