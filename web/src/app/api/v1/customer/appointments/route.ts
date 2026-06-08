import type { NextRequest } from "next/server";
import { customerController } from "@/server/modules/customer/controller";
import { customerAuthedRoute, invoke } from "@/server/modules/customer/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const listHandler = customerAuthedRoute((req) => customerController.listAppointments(req));
const createHandler = customerAuthedRoute((req) => customerController.createAppointment(req));

export function GET(req: NextRequest) {
  return invoke(listHandler, req);
}

export function POST(req: NextRequest) {
  return invoke(createHandler, req);
}
