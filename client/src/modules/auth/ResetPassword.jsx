"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, CheckCircle, Circle } from "lucide-react";
import {
  PASSWORD_STRENGTH,
  getPasswordStrength,
  getPasswordChecks,
} from "@/constants/shared/password.js";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [success, setSuccess] = useState(false);

  const passwordChecks = getPasswordChecks(password);
  const strength = getPasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) return;

    setSuccess(true);
  };

  return (
    <section className="bg-[#131313] text-[#e4e2e1] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-black tracking-tight text-[#e4e2e1] hover:text-[#ffb68c] transition-colors block mb-12"
        >
          IRON &amp; OAK
        </Link>

        {!success ? (
          <div>
            <span className="text-[#a08d83] block mb-3 text-xs tracking-[0.1em]">
              ACCOUNT RECOVERY
            </span>

            <h1 className="text-5xl font-bold mb-4">Set New Password</h1>

            <p className="text-[#d8c2b7] leading-relaxed mb-10">
              Choose a strong password that you haven&apos;t used before.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label className="text-[#d8c2b7] block mb-2 text-xs tracking-[0.1em]">
                  NEW PASSWORD
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#1f2020] border border-[#53443c] px-4 py-3 pr-12 text-[#e4e2e1] focus:outline-none focus:border-[#ffb68c] placeholder:text-[#d8c2b7]/40"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d8c2b7]"
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>

                {/* Strength Bars */}
                <div className="mt-2 flex gap-1">
                  {[0, 1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className={`flex-1 h-1 transition-all ${
                        item <= strength
                          ? PASSWORD_STRENGTH[strength]?.color
                          : "bg-[#53443c]"
                      }`}
                    ></div>
                  ))}
                </div>

                <p className="text-[10px] text-[#d8c2b7] mt-1 tracking-[0.1em]">
                  {strength >= 0
                    ? PASSWORD_STRENGTH[strength]?.label
                    : "ENTER A PASSWORD"}
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-[#d8c2b7] block mb-2 text-xs tracking-[0.1em]">
                  CONFIRM NEW PASSWORD
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#1f2020] border border-[#53443c] px-4 py-3 pr-12 text-[#e4e2e1] focus:outline-none focus:border-[#ffb68c] placeholder:text-[#d8c2b7]/40"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d8c2b7]"
                  >
                    {showConfirmPassword ? (
                      <Eye size={20} />
                    ) : (
                      <EyeOff size={20} />
                    )}
                  </button>
                </div>

                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-400 text-[10px] mt-1 tracking-[0.1em]">
                    PASSWORDS DO NOT MATCH
                  </p>
                )}
              </div>

              {/* Requirements */}
              <div className="bg-[#1f2020] border border-[#53443c] p-4 space-y-3">
                <p className="text-[#a08d83] text-[10px] tracking-[0.1em]">
                  PASSWORD REQUIREMENTS
                </p>

                <div
                  className={`flex items-center gap-2 text-[10px] tracking-[0.1em] ${
                    passwordChecks.length ? "text-[#ffb68c]" : "text-[#d8c2b7]"
                  }`}
                >
                  {passwordChecks.length ? (
                    <CheckCircle size={14} />
                  ) : (
                    <Circle size={14} />
                  )}
                  AT LEAST 8 CHARACTERS
                </div>

                <div
                  className={`flex items-center gap-2 text-[10px] tracking-[0.1em] ${
                    passwordChecks.uppercase
                      ? "text-[#ffb68c]"
                      : "text-[#d8c2b7]"
                  }`}
                >
                  {passwordChecks.uppercase ? (
                    <CheckCircle size={14} />
                  ) : (
                    <Circle size={14} />
                  )}
                  ONE UPPERCASE LETTER
                </div>

                <div
                  className={`flex items-center gap-2 text-[10px] tracking-[0.1em] ${
                    passwordChecks.number ? "text-[#ffb68c]" : "text-[#d8c2b7]"
                  }`}
                >
                  {passwordChecks.number ? (
                    <CheckCircle size={14} />
                  ) : (
                    <Circle size={14} />
                  )}
                  ONE NUMBER
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-[#ffb68c] text-[#532200] py-4 text-xs font-semibold tracking-[0.2em] hover:opacity-90 transition-all active:scale-95"
              >
                RESET PASSWORD
              </button>
            </form>
          </div>
        ) : (
          /* Success */
          <div className="text-center">
            <div className="w-16 h-16 bg-[#ffb68c]/10 border border-[#ffb68c]/30 flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={32} className="text-[#ffb68c]" />
            </div>

            <span className="text-[#a08d83] block mb-3 text-xs tracking-[0.1em]">
              ALL DONE
            </span>

            <h2 className="text-5xl font-bold mb-4">Password Reset</h2>

            <p className="text-[#d8c2b7] leading-relaxed mb-10">
              Your password has been successfully updated. You can now sign in
              with your new credentials.
            </p>

            <Link
              href="/login"
              className="block w-full text-center bg-[#ffb68c] text-[#532200] py-4 text-xs font-semibold tracking-[0.2em] hover:opacity-90 transition-all"
            >
              SIGN IN NOW
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
