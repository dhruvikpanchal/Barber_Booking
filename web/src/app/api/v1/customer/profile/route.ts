import type { NextRequest } from "next/server";
import { customerController } from "@/server/modules/customer/controller";
import { customerAuthedRoute, invoke } from "@/server/modules/customer/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getHandler = customerAuthedRoute((req) => customerController.getProfile(req));
const patchHandler = customerAuthedRoute((req) => customerController.updateProfile(req));

export function GET(req: NextRequest) {
  return invoke(getHandler, req);
}

export function PATCH(req: NextRequest) {
  return invoke(patchHandler, req);
}
