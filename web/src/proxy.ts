import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMaintenanceState } from "@/server/modules/shared/settings/maintenanceState";

const PROTECTED_PREFIXES = ["/admin", "/barber", "/customer"];
const AUTH_PREFIXES = [
  "/login",
  "/register",
  "/barber-register",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isAuthPath(pathname: string) {
  return AUTH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isMaintenanceBypass(pathname: string) {
  if (pathname === "/maintenance") return true;
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/api/v1/admin")) return true;
  if (pathname.startsWith("/api/v1/auth")) return true;
  if (pathname.startsWith("/api/v1/public/maintenance")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/icon.png" || pathname.startsWith("/icon.")) return true;
  return false;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isMaintenanceBypass(pathname)) {
    const maintenance = getMaintenanceState();
    if (maintenance.enabled) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "MAINTENANCE",
              message:
                maintenance.message ||
                "The platform is temporarily unavailable for maintenance.",
            },
          },
          { status: 503 },
        );
      }

      const url = request.nextUrl.clone();
      url.pathname = "/maintenance";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();

  if (isProtectedPath(pathname) || isAuthPath(pathname)) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
