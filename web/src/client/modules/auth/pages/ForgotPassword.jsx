"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { authHook } from "@/client/modules/auth/hooks/authQuery.jsx";
import { isTurnstileEnabled } from "@/client/lib/turnstile.js";
import TurnstileField from "@/client/modules/shared/components/forms/auth/TurnstileField.jsx";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import { startPasswordReset } from "@/client/lib/auth/passwordResetFlow.js";
import { Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const router = useRouter();
  const forgotPasswordMutation = authHook.ForgotPassword.useForgotPassword();

  const [form, setForm] = useState({ email: "" });
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (forgotPasswordMutation.isPending) return;
    if (isTurnstileEnabled() && !turnstileToken) {
      toast.error("Please complete the captcha verification.");
      return;
    }
    const email = form.email.trim();
    try {
      const result = await forgotPasswordMutation.mutateAsync({
        email,
        turnstileToken: turnstileToken || undefined,
      });
      toast.success("Reset email sent successfully");
      if (result?.resetFlowToken) {
        startPasswordReset(email, result.resetFlowToken);
      }
      router.push(routes.auth.verifyOtp);
    } catch (error) {
      toast.error(error?.message || "Failed to send reset email.");
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#131313] px-4 text-[#e4e2e1]">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href={routes.auth.login}
          className="mb-12 flex items-center gap-2 text-xs tracking-[0.1em] text-[#d8c2b7] transition-colors hover:text-[#ffb68c]"
        >
          <ArrowLeft size={18} />
          BACK TO SIGN IN
        </Link>

        {/* Logo */}
        <Link
          href={routes.public.home}
          className="mb-12 block text-3xl font-black tracking-tight text-[#e4e2e1] transition-colors hover:text-[#ffb68c]"
        >
          IRON &amp; OAK
        </Link>

        <div>
          <span className="mb-3 block text-xs tracking-[0.1em] text-[#a08d83]">
            ACCOUNT RECOVERY
          </span>

          <h1 className="mb-4 text-5xl font-bold">Forgot Password</h1>

          <p className="mb-10 leading-relaxed text-[#d8c2b7]">
            Enter the email address linked to your account. We&apos;ll send you a reset token for
            verification.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-xs tracking-[0.1em] text-[#d8c2b7]">
                EMAIL ADDRESS
              </label>

              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                name="email"
                disabled={forgotPasswordMutation.isPending}
                onChange={handleChange}
                className="w-full border border-[#53443c] bg-[#1f2020] px-4 py-3 text-[#e4e2e1] transition-colors placeholder:text-[#d8c2b7]/40 focus:border-[#ffb68c] focus:outline-none"
              />
            </div>

            <TurnstileField className="flex justify-center" onToken={setTurnstileToken} />

            <button
              type="submit"
              className="w-full bg-[#ffb68c] py-4 text-xs font-semibold tracking-[0.2em] text-[#532200] transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={
                forgotPasswordMutation.isPending || (isTurnstileEnabled() && !turnstileToken)
              }
            >
              {forgotPasswordMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin" />
                </span>
              ) : (
                "SEND RESET TOKEN"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
