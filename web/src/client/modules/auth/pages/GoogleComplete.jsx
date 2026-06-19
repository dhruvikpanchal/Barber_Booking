"use client";

import { useEffect, useState } from "react";
import Link from "@/lib/AppLink";
import { useRouter } from "next/navigation";
import { routes } from "@/client/config/routes/routes.js";
import { persistAuthSession } from "@/client/lib/auth/session.js";
import { toast } from "sonner";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

export default function GoogleComplete() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function completeGoogleSignIn() {
      try {
        const response = await fetch("/api/v1/auth/google/complete", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const body = await response.json();
        const data = body?.data ?? body;

        if (!response.ok) {
          throw new Error(body?.error?.message ?? "Google sign-in failed. Please try again.");
        }

        if (!data?.user?.email || !data?.tokens?.accessToken) {
          throw new Error("Invalid Google login response. Please try again.");
        }

        if (cancelled) return;

        persistAuthSession({
          tokens: data.tokens,
          user: data.user,
          portalRole: "customer",
        });

        toast.success("Signed in with Google successfully");

        const nextPath =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("next")
            : null;
        const fallback = routes.customer.dashboard;
        const isSafeNext =
          nextPath &&
          nextPath.startsWith("/") &&
          !nextPath.startsWith("//") &&
          nextPath.startsWith("/customer");
        router.replace(isSafeNext ? nextPath : fallback);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Google sign-in failed. Please try again.";
        setError(message);
        toast.error(message);
      }
    }

    completeGoogleSignIn();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#131313] px-6 text-center text-[#e4e2e1]">
        <p className="mb-6 max-w-md text-sm leading-relaxed text-[#d8c2b7]">{error}</p>
        <Link
          href={routes.auth.login}
          className="text-sm font-semibold tracking-[0.08em] text-[#ffb68c] transition hover:opacity-70"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return <PageLoader fullScreen label="Completing Google sign-in..." />;
}
