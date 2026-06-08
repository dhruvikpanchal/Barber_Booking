import type { NextRequest } from "next/server";
import { customerController } from "@/server/modules/customer/controller";
import { customerAuthedRoute, invoke } from "@/server/modules/customer/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const patchHandler = (id: string) =>
  customerAuthedRoute((req) => customerController.updateReview(req, id));

const deleteHandler = (id: string) =>
  customerAuthedRoute((req) => customerController.deleteReview(req, id));

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return invoke(patchHandler(id), req);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return invoke(deleteHandler(id), req);
}
