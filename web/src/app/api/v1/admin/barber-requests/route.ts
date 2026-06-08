import type { NextRequest } from "next/server";
import { adminController } from "@/server/modules/admin/controller";
import { adminAuthedRoute, invoke } from "@/server/modules/admin/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = adminAuthedRoute((req) => adminController.listBarberRequests(req));

export function GET(req: NextRequest) {
  return invoke(handler, req);
}
