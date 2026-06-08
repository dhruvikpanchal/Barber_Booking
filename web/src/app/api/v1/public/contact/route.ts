import type { NextRequest } from "next/server";
import { publicController } from "@/server/modules/public/controller";
import { invoke, publicRoute } from "@/server/modules/public/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = publicRoute((req) => publicController.submitContact(req), "standard");

export function POST(req: NextRequest) {
  return invoke(handler, req);
}
