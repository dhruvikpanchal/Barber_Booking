import type { NextRequest } from "next/server";
import { publicController } from "@/server/modules/public/controller";
import { invoke, publicCachedRoute } from "@/server/modules/public/route";

export const dynamic = "force-dynamic";

const handler = publicCachedRoute((req) => publicController.listServices(req));

export function GET(req: NextRequest) {
  return invoke(handler, req);
}
