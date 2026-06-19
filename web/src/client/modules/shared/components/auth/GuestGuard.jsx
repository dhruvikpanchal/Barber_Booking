"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearAuthSession,
  getDashboardPath,
  getPortalRoleFromToken,
  hasValidSession,
  isTokenExpired,
} from "@/client/lib/auth/session.js";
import { getAccessToken } from "@/lib/axios";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

function canShowGuestPageImmediately() {
  if (typeof window === "undefined") return false;
  const token = getAccessToken();
  if (!token) return true;
  if (isTokenExpired(token)) return true;
  return !hasValidSession();
}

/** Redirects authenticated users away from login/register pages. */
export default function GuestGuard({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(canShowGuestPageImmediately);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      setReady(true);
      return;
    }

    if (hasValidSession()) {
      const portalRole = getPortalRoleFromToken();
      if (portalRole) {
        router.replace(getDashboardPath(portalRole));
        return;
      }
    }

    if (isTokenExpired(token)) {
      clearAuthSession();
      setReady(true);
      return;
    }

    clearAuthSession();
    setReady(true);
  }, [router]);

  if (!ready) return <PageLoader fullScreen label="Loading..." />;
  return children;
}
