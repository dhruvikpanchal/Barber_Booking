import type { NextRequest } from "next/server";
import { adminController } from "@/server/modules/admin/controller";
import { adminAuthedRoute, invoke } from "@/server/modules/admin/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const postHandler = adminAuthedRoute((req) => adminController.markNavSectionSeen(req));

export function POST(req: NextRequest) {
  return invoke(postHandler, req);
}
