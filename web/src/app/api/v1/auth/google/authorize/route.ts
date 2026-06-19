import type { NextRequest } from "next/server";
import { authController } from "@/server/modules/auth/controller";
import { invoke, publicAuthRoute } from "@/server/modules/auth/route";

const handler = publicAuthRoute((req) => authController.googleAuthorize(req), "relaxed");

export function GET(req: NextRequest) {
  return invoke(handler, req);
}
