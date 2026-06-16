import type { NextRequest } from "next/server";
import { publicController } from "@/server/modules/public/controller";
import { invoke, publicCachedRoute } from "@/server/modules/public/route";

export const revalidate = 60;

type RouteContext = { params: Promise<{ slug: string }> };

const handler = (slug: string) => publicCachedRoute((req) => publicController.getService(req, slug));

export async function GET(req: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  return invoke(handler(slug), req);
}
