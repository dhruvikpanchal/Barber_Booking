import type { NextRequest } from "next/server";
import { publicController } from "@/server/modules/public/controller";
import { invoke, publicCachedRoute } from "@/server/modules/public/route";

export const revalidate = 3600;

const handler = publicCachedRoute((req) => publicController.contactInfo(req));

export function GET(req: NextRequest) {
  return invoke(handler, req);
}
