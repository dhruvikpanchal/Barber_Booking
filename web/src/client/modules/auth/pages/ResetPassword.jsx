"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, CheckCircle, Circle, Loader2 } from "lucide-react";
import {
  PASSWORD_STRENGTH,
  getPasswordStrength,
  getPasswordChecks,
} from "@/client/modules/shared/constants/password.js";
import { authHook } from "@/client/modules/auth/hooks/authQuery.jsx";
import {
  canAccessResetStep,
  clearPasswordResetFlow,
  getVerifiedResetToken,
} from "@/client/lib/auth/passwordResetFlow.js";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";

export default function ResetPassword() {
  const router = useRouter();
  const resetPasswordMutation = authHook.ResetPassword.useResetPassword();
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChecks = getPasswordChecks(password);
  const strength = getPasswordStrength(password);

  useEffect(() => {
    if (!canAccessResetStep()) {
      router.replace(routes.auth.forgotPassword);
      return;
    }

    setToken(getVerifiedResetToken());
    setReady(true);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ready || !token) {
      toast.error("Reset session expired. Please start again.");
      router.replace(routes.auth.forgotPassword);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        token,
        password,
        confirmPassword,
      });
      toast.success("Password reset successfully");
      clearPasswordResetFlow();
      router.push(routes.auth.login);
    } catch (error) {
      toast.error(error?.message || "Failed to reset password.");
    }
  };

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
          href={routes.public.home}
          className="mb-12 block text-3xl font-black tracking-tight text-[#e4e2e1] transition-colors hover:text-[#ffb68c]"
        >
          IRON &amp; OAK
        </Link>

        <div>
          <span className="mb-3 block text-xs tracking-[0.1em] text-[#a08d83]">
            ACCOUNT RECOVERY
          </span>

          <h1 className="mb-4 text-5xl font-bold">Set New Password</h1>

          <p className="mb-10 leading-relaxed text-[#d8c2b7]">
            Choose a strong password that you haven&apos;t used before.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-xs tracking-[0.1em] text-[#d8c2b7]">
                NEW PASSWORD
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-[#53443c] bg-[#1f2020] px-4 py-3 pr-12 text-[#e4e2e1] placeholder:text-[#d8c2b7]/40 focus:border-[#ffb68c] focus:outline-none"
                  disabled={resetPasswordMutation.isPending}
                />

                <button
                  type="button"
                  disabled={resetPasswordMutation.isPending}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-[#d8c2b7]"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              <div className="mt-2 flex gap-1">
                {[0, 1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className={`h-1 flex-1 transition-all ${
                      item <= strength ? PASSWORD_STRENGTH[strength]?.color : "bg-[#53443c]"
                    }`}
                  ></div>
                ))}
              </div>

              <p className="mt-1 text-[10px] tracking-[0.1em] text-[#d8c2b7]">
                {strength >= 0 ? PASSWORD_STRENGTH[strength]?.label : "ENTER A PASSWORD"}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs tracking-[0.1em] text-[#d8c2b7]">
                CONFIRM NEW PASSWORD
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-[#53443c] bg-[#1f2020] px-4 py-3 pr-12 text-[#e4e2e1] placeholder:text-[#d8c2b7]/40 focus:border-[#ffb68c] focus:outline-none"
                  disabled={resetPasswordMutation.isPending}
                />

                <button
                  type="button"
                  disabled={resetPasswordMutation.isPending}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-[#d8c2b7]"
                >
                  {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-[10px] tracking-[0.1em] text-red-400">
                  PASSWORDS DO NOT MATCH
                </p>
              )}
            </div>

            <div className="space-y-3 border border-[#53443c] bg-[#1f2020] p-4">
              <p className="text-[10px] tracking-[0.1em] text-[#a08d83]">PASSWORD REQUIREMENTS</p>

              <div
                className={`flex items-center gap-2 text-[10px] tracking-[0.1em] ${
                  passwordChecks.length ? "text-[#ffb68c]" : "text-[#d8c2b7]"
                }`}
              >
                {passwordChecks.length ? <CheckCircle size={14} /> : <Circle size={14} />}
                AT LEAST 8 CHARACTERS
              </div>

              <div
                className={`flex items-center gap-2 text-[10px] tracking-[0.1em] ${
                  passwordChecks.uppercase ? "text-[#ffb68c]" : "text-[#d8c2b7]"
                }`}
              >
                {passwordChecks.uppercase ? <CheckCircle size={14} /> : <Circle size={14} />}
                ONE UPPERCASE LETTER
              </div>

              <div
                className={`flex items-center gap-2 text-[10px] tracking-[0.1em] ${
                  passwordChecks.number ? "text-[#ffb68c]" : "text-[#d8c2b7]"
                }`}
              >
                {passwordChecks.number ? <CheckCircle size={14} /> : <Circle size={14} />}
                ONE NUMBER
              </div>
            </div>

            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="w-full bg-[#ffb68c] py-4 text-xs font-semibold tracking-[0.2em] text-[#532200] transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resetPasswordMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin" />
                </span>
              ) : (
                "RESET PASSWORD"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
