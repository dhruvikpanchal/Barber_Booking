"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import { authHook } from "@/client/modules/auth/hooks/authQuery.jsx";
import { authServices } from "@/client/modules/auth/services/authServices.jsx";
import {
  canAccessVerifyStep,
  getVerifyStepEmail,
  markTokenVerified,
  startPasswordReset,
} from "@/client/lib/auth/passwordResetFlow.js";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";

export default function VerifyResetOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyResetTokenMutation = authHook.VerifyResetToken.useVerifyResetToken();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function initFlow() {
      const flowFromUrl = searchParams.get("flow");

      if (flowFromUrl) {
        try {
          const result = await authServices.validateResetFlow({ resetFlowToken: flowFromUrl });
          if (result?.email) {
            startPasswordReset(result.email, flowFromUrl);
          }
        } catch {
          if (!cancelled) router.replace(routes.auth.forgotPassword);
          return;
        }
      }

      if (!canAccessVerifyStep()) {
        if (!cancelled) router.replace(routes.auth.forgotPassword);
        return;
      }

      if (!cancelled) {
        setEmail(getVerifyStepEmail());
        setReady(true);
      }
    }

    initFlow();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (verifyResetTokenMutation.isPending || !ready) return;

    const plainToken = token.trim();
    if (!plainToken) {
      toast.error("Enter the reset token you received in your email.");
      return;
    }

    try {
      await verifyResetTokenMutation.mutateAsync({ token: plainToken });
      toast.success("Reset token verified successfully");
      markTokenVerified(plainToken);
      router.push(routes.auth.resetPassword);
    } catch (error) {
      toast.error(error?.message || "Failed to verify reset token.");
    }
  }

  if (!ready) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#131313] px-4 text-[#e4e2e1]">
        <Loader2 className="h-8 w-8 animate-spin text-[#ffb68c]" aria-label="Loading" />
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#131313] px-4 text-[#e4e2e1]">
      <div className="w-full max-w-md">
        <Link
          href={routes.auth.forgotPassword}
          className="mb-12 flex items-center gap-2 text-xs tracking-[0.1em] text-[#d8c2b7] transition-colors hover:text-[#ffb68c]"
        >
          <ArrowLeft size={18} />
          BACK
        </Link>

        <Link
          href={routes.public.home}
          className="mb-12 block text-3xl font-black tracking-tight text-[#e4e2e1] transition-colors hover:text-[#ffb68c]"
        >
          IRON &amp; OAK
        </Link>

        <span className="mb-3 block text-xs tracking-[0.1em] text-[#a08d83]">ACCOUNT RECOVERY</span>

        <h1 className="mb-4 text-5xl font-bold">Verify Reset</h1>

        <p className="mb-6 leading-relaxed text-[#d8c2b7]">
          {email ? (
            <>
              Enter the reset token sent to <strong>{email}</strong>.
            </>
          ) : (
            <>Enter the reset token you received in your email.</>
          )}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-xs tracking-[0.1em] text-[#d8c2b7]">
              RESET TOKEN
            </label>
            <div className="relative">
              <KeyRound
                size={16}
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#a08d83]"
              />
              <input
                type="text"
                required
                placeholder="Paste the token from your email"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full border border-[#53443c] bg-[#1f2020] px-4 py-3 pl-10 text-[#e4e2e1] placeholder:text-[#d8c2b7]/40 focus:border-[#ffb68c] focus:outline-none"
                disabled={verifyResetTokenMutation.isPending}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#ffb68c] py-4 text-xs font-semibold tracking-[0.2em] text-[#532200] transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={verifyResetTokenMutation.isPending}
          >
            {verifyResetTokenMutation.isPending ? (
              <span className="flex items-center justify-center">
                <Loader2 size={16} className="animate-spin" />
              </span>
            ) : (
              "VERIFY TOKEN"
            )}
          </button>

          <Link
            href={routes.auth.login}
            className="block w-full text-center text-xs tracking-[0.15em] text-[#a08d83] transition-colors hover:text-[#ffb68c]"
          >
            RETURN TO SIGN IN
          </Link>
        </form>
      </div>
    </section>
  );
}
