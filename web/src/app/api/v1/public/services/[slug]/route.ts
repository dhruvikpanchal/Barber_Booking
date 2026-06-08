import type { NextRequest } from "next/server";
import { publicController } from "@/server/modules/public/controller";
import { invoke, publicRoute } from "@/server/modules/public/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ slug: string }> };

const handler = (slug: string) =>
  publicRoute((req) => publicController.getService(req, slug));

export async function GET(req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  return invoke(handler(slug), req);
}
