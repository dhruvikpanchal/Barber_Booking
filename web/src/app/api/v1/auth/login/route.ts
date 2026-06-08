import type { NextRequest } from "next/server";
import { authController } from "@/server/modules/auth/controller";
import { invoke, publicAuthRoute } from "@/server/modules/auth/route";

const handler = publicAuthRoute((req) => authController.login(req));

export function POST(req: NextRequest) {
  return invoke(handler, req);
}
