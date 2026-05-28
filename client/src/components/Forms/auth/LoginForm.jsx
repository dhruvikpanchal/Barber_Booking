"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { routes } from "@/config/routes/routes.js";

/**
 * @param {{
 *   onSubmit: (data: { email: string; password: string; remember: boolean }) => void | Promise<void>;
 *   loading?: boolean;
 *   fieldErrors?: { email?: string; password?: string; form?: string };
 *   forgotPasswordHref?: string;
 * }} props
 */
export default function LoginForm({
  onSubmit,
  loading = false,
  fieldErrors = {},
  forgotPasswordHref = routes.auth.forgotPassword,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit({ email: email.trim(), password, remember });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {fieldErrors.form && (
        <div
          className="flex bg-[#93000a] border border-red-400/30 px-4 py-3 items-center gap-3"
          role="alert"
        >
          <span className="material-symbols-outlined text-red-300 text-[20px]">
            error
          </span>
          <p className="text-[#ffdad6] text-[11px] tracking-[0.1em]">
            {fieldErrors.form}
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor="login-email"
          className="text-[#d8c2b7] block mb-2 text-xs tracking-[0.1em]"
        >
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
          className={`w-full bg-[#1f2020] border px-4 py-3 text-[#e4e2e1] focus:outline-none transition-colors placeholder:text-[#d8c2b7]/40 disabled:opacity-60 ${
            fieldErrors.email
              ? "border-red-400/60 focus:border-red-400"
              : "border-[#53443c] focus:border-[#ffb68c]"
          }`}
        />
        {fieldErrors.email && (
          <p
            id="login-email-error"
            className="mt-1.5 text-[10px] tracking-[0.08em] text-[#ffdad6]"
          >
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="login-password"
            className="text-[#d8c2b7] text-xs tracking-[0.1em]"
          >
            PASSWORD
          </label>
          <Link
            href={forgotPasswordHref}
            className="text-[#ffb68c] hover:opacity-70 transition text-[10px] tracking-[0.1em]"
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
            aria-describedby={
              fieldErrors.password ? "login-password-error" : undefined
            }
            className={`w-full bg-[#1f2020] border px-4 py-3 pr-12 text-[#e4e2e1] focus:outline-none transition-colors placeholder:text-[#d8c2b7]/40 disabled:opacity-60 ${
              fieldErrors.password
                ? "border-red-400/60 focus:border-red-400"
                : "border-[#53443c] focus:border-[#ffb68c]"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            disabled={loading}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d8c2b7] hover:text-[#ffb68c] transition-colors disabled:opacity-50"
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
          className="w-4 h-4 accent-[#ffb68c]"
        />
        <label
          htmlFor="login-remember"
          className="text-[#d8c2b7] text-xs tracking-[0.1em] cursor-pointer"
        >
          REMEMBER ME
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#ffb68c] text-[#532200] py-4 text-xs font-semibold tracking-[0.2em] hover:opacity-90 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        SIGN IN
      </button>
    </form>
  );
}
