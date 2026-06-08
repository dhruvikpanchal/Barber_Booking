"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, KeyRound } from "lucide-react";
import { authHook } from "@/client/modules/auth/hooks/authQuery.jsx";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import { Loader2 } from "lucide-react";

export default function VerifyResetOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyResetTokenMutation = authHook.VerifyResetToken.useVerifyResetToken();
  const email = searchParams.get("email") ?? "";

  const [token, setToken] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (verifyResetTokenMutation.isPending) return;

    const plainToken = token.trim();
    if (!plainToken) {
      toast.error("Enter the reset token you received in your email.");
      return;
    }

    try {
      await toast.promise(verifyResetTokenMutation.mutateAsync({ token: plainToken }), {
        loading: "Verifying reset token...",
        success: "Reset token verified successfully",
        error: (err) => err?.message || "Failed to verify reset token.",
      });
      router.push(`${routes.auth.resetPassword}?token=${encodeURIComponent(plainToken)}`);
    } catch (error) {
      toast.error(error?.message || "Failed to verify reset token.");
    }
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
