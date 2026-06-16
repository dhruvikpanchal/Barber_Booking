import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/server/db/health";
import { withErrorHandler } from "@/server/modules/shared/helpers/errorHandler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handler(_req: NextRequest) {
  const db = await checkDatabaseHealth(true);

  if (!db.ok) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DATABASE_UNAVAILABLE",
          message: db.message ?? "Database is not reachable",
        },
        data: { database: "down" },
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    success: true,
    data: { database: "up" },
  });
}

export const GET = withErrorHandler(handler);
