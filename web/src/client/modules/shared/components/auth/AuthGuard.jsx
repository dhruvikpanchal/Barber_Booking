"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/client/config/routes/routes.js";
import {
  clearAuthSession,
  ensureAuthenticated,
  hasValidSession,
} from "@/client/lib/auth/session.js";

function AuthLoading() {
  return (
    <div className="bg-background text-on-surface flex min-h-dvh items-center justify-center">
      <p className="text-on-surface-variant text-sm">Checking your session…</p>
    </div>
  );
}

/**
 * Blocks dashboard routes until a valid access token exists for the required portal role.
 * Re-validates on navigation and when the browser restores a page from the back/forward cache.
 */
export default function AuthGuard({ role, children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(() =>
    typeof window !== "undefined" ? hasValidSession(role) : false,
  );

  useEffect(() => {
    let active = true;

    async function verifySession() {
      if (hasValidSession(role)) {
        if (active) setAllowed(true);
        return;
      }

      const result = await ensureAuthenticated(role);

      if (!active) return;

      if (!result.ok) {
        clearAuthSession();
        const loginUrl = `${routes.auth.login}?next=${encodeURIComponent(pathname)}`;
        router.replace(loginUrl);
        return;
      }

      setAllowed(true);
    }

    verifySession();

    function handlePageShow(event) {
      if (event.persisted) {
        verifySession();
      }
    }

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      active = false;
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [role, pathname, router]);

  if (!allowed) return <AuthLoading />;
  return children;
}
