"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import { isTurnstileEnabled } from "@/client/lib/turnstile.js";
import TurnstileField from "@/client/modules/shared/components/forms/auth/TurnstileField.jsx";

/**
 * @param {{
 *   onSubmit: (data: { email: string; password: string; remember: boolean; turnstileToken?: string }) => void | Promise<void>;
 *   loading?: boolean;
 *   disabled?: boolean;
 *   fieldErrors?: { email?: string; password?: string; form?: string };
 *   forgotPasswordHref?: string;
 *   defaultEmail?: string;
 *   defaultRemember?: boolean;
 * }} props
 */
export default function LoginForm({
  onSubmit,
  loading = false,
  disabled = false,
  fieldErrors = {},
  forgotPasswordHref = routes.auth.forgotPassword,
  defaultEmail = "",
  defaultRemember = false,
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(defaultRemember);
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  useEffect(() => {
    setEmail(defaultEmail);
    setRemember(defaultRemember);
  }, [defaultEmail, defaultRemember]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (isTurnstileEnabled() && !turnstileToken) return;
    await onSubmit({
      email: email.trim(),
      password,
      remember,
      turnstileToken: turnstileToken || undefined,
    });
  }

  const captchaReady = !isTurnstileEnabled() || Boolean(turnstileToken);

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="login-email" className="mb-2 block text-xs tracking-[0.1em] text-[#d8c2b7]">
          EMAIL ADDRESS
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={loading}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
          className={`w-full border bg-[#1f2020] px-4 py-3 text-[#e4e2e1] transition-colors placeholder:text-[#d8c2b7]/40 focus:outline-none disabled:opacity-60 ${
            fieldErrors.email
              ? "border-red-400/60 focus:border-red-400"
              : "border-[#53443c] focus:border-[#ffb68c]"
          }`}
        />
        {fieldErrors.email && (
          <p id="login-email-error" className="mt-1.5 text-[10px] tracking-[0.08em] text-[#ffdad6]">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="login-password" className="text-xs tracking-[0.1em] text-[#d8c2b7]">
            PASSWORD
          </label>
          <Link
            href={forgotPasswordHref}
            className="text-[10px] tracking-[0.1em] text-[#ffb68c] transition hover:opacity-70"
          >
            FORGOT PASSWORD?
          </Link>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
            className={`w-full border bg-[#1f2020] px-4 py-3 pr-12 text-[#e4e2e1] transition-colors placeholder:text-[#d8c2b7]/40 focus:outline-none disabled:opacity-60 ${
              fieldErrors.password
                ? "border-red-400/60 focus:border-red-400"
                : "border-[#53443c] focus:border-[#ffb68c]"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            disabled={loading}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-[#d8c2b7] transition-colors hover:text-[#ffb68c] disabled:opacity-50"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <Eye className="h-5 w-5" aria-hidden />
            ) : (
              <EyeOff className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p
            id="login-password-error"
            className="mt-1.5 text-[10px] tracking-[0.08em] text-[#ffdad6]"
          >
            {fieldErrors.password}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          id="login-remember"
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          disabled={loading}
          className="h-4 w-4 accent-[#ffb68c]"
        />
        <label
          htmlFor="login-remember"
          className="cursor-pointer text-xs tracking-[0.1em] text-[#d8c2b7]"
        >
          REMEMBER ME
        </label>
      </div>

      <TurnstileField className="flex justify-center" onToken={setTurnstileToken} />

      <button
        type="submit"
        disabled={disabled || !captchaReady}
        className="flex w-full items-center justify-center gap-2 bg-[#ffb68c] py-4 text-xs font-semibold tracking-[0.2em] text-[#532200] transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "SIGNING IN..." : "SIGN IN"}
      </button>
    </form>
  );
}
