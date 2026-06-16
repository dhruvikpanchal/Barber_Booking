import type { NextRequest } from "next/server";
import { publicController } from "@/server/modules/public/controller";
import { invoke, publicRoute } from "@/server/modules/public/route";

export const dynamic = "force-dynamic";

const handler = publicRoute((req) => publicController.search(req));

export function GET(req: NextRequest) {
  return invoke(handler, req);
}
