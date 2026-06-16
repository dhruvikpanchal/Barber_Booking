import type { NextRequest } from "next/server";
import { barberController } from "@/server/modules/barber/controller";
import { barberAuthedRoute, invoke } from "@/server/modules/barber/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const postHandler = barberAuthedRoute((req) => barberController.uploadGalleryPhoto(req));

export function POST(req: NextRequest) {
  return invoke(postHandler, req);
}
