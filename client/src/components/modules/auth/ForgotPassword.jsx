"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setEmailSent(true);
  };

  return (
    <section className="bg-[#131313] text-[#e4e2e1] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/login"
          className="flex items-center gap-2 text-[#d8c2b7] hover:text-[#ffb68c] transition-colors mb-12 text-xs tracking-[0.1em]"
        >
          <ArrowLeft size={18} />
          BACK TO SIGN IN
        </Link>

        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-black tracking-tight text-[#e4e2e1] hover:text-[#ffb68c] transition-colors block mb-12"
        >
          IRON &amp; OAK
        </Link>

        {/* Step 1 */}
        {!emailSent ? (
          <div>
            <span className="text-[#a08d83] block mb-3 text-xs tracking-[0.1em]">
              ACCOUNT RECOVERY
            </span>

            <h1 className="text-5xl font-bold mb-4">Forgot Password</h1>

            <p className="text-[#d8c2b7] leading-relaxed mb-10">
              Enter the email address linked to your account. We&apos;ll send
              you a link to reset your password.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[#d8c2b7] block mb-2 text-xs tracking-[0.1em]">
                  EMAIL ADDRESS
                </label>

                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1f2020] border border-[#53443c] px-4 py-3 text-[#e4e2e1] focus:outline-none focus:border-[#ffb68c] transition-colors placeholder:text-[#d8c2b7]/40"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#ffb68c] text-[#532200] py-4 text-xs font-semibold tracking-[0.2em] hover:opacity-90 transition-all active:scale-95"
              >
                SEND RESET LINK
              </button>
            </form>
          </div>
        ) : (
          /* Step 2 */
          <div className="text-center">
            <div className="w-16 h-16 bg-[#ffb68c]/10 border border-[#ffb68c]/30 flex items-center justify-center mx-auto mb-8">
              <MailCheck size={32} className="text-[#ffb68c]" />
            </div>

            <span className="text-[#a08d83] block mb-3 text-xs tracking-[0.1em]">
              CHECK YOUR INBOX
            </span>

            <h2 className="text-5xl font-bold mb-4">Email Sent</h2>

            <p className="text-[#d8c2b7] leading-relaxed mb-8">
              We&apos;ve sent a password reset link to{" "}
              <strong className="text-[#e4e2e1]">{email}</strong>. It expires in
              30 minutes.
            </p>

            <p className="text-[#d8c2b7] text-sm mb-10">
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button className="text-[#ffb68c] hover:underline text-xs tracking-[0.1em]">
                resend the email
              </button>
              .
            </p>

            <Link
              href="/login"
              className="block w-full text-center border border-[#a08d83] text-[#e4e2e1] py-4 text-xs font-semibold tracking-[0.15em] hover:border-[#ffb68c] hover:text-[#ffb68c] transition-colors"
            >
              RETURN TO SIGN IN
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
