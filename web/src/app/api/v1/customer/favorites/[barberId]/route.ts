import type { NextRequest } from "next/server";
import { customerController } from "@/server/modules/customer/controller";
import { customerAuthedRoute, invoke } from "@/server/modules/customer/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ barberId: string }> };

const addHandler = (barberId: string) =>
  customerAuthedRoute((req) => customerController.addFavorite(req, barberId));

const removeHandler = (barberId: string) =>
  customerAuthedRoute((req) => customerController.removeFavorite(req, barberId));

export async function POST(req: NextRequest, context: RouteContext) {
  const { barberId } = await context.params;
  return invoke(addHandler(barberId), req);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const { barberId } = await context.params;
  return invoke(removeHandler(barberId), req);
}
