"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ensureAuthenticated,
  getDashboardPath,
} from "@/client/lib/auth/session.js";

function AuthLoading() {
  return (
    <div className="bg-background text-on-surface flex min-h-dvh items-center justify-center">
      <p className="text-on-surface-variant text-sm">Loading…</p>
    </div>
  );
}

/** Redirects authenticated users away from login/register pages. */
export default function GuestGuard({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function verifyGuest() {
      const result = await ensureAuthenticated();
      if (!active) return;

      if (result.ok && result.portalRole) {
        router.replace(getDashboardPath(result.portalRole));
        return;
      }

      setReady(true);
    }

    verifyGuest();
    return () => {
      active = false;
    };
  }, [router]);

  if (!ready) return <AuthLoading />;
  return children;
}
