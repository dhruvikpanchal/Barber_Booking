"use client";

import { regionConfig } from "@/config/region.js";

import { useState } from "react";
import Image from "next/image";
import Link from "@/lib/AppLink";
import { register } from "@/client/assets/ImagePath.js";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  getPasswordChecks,
  getPasswordStrength,
  PASSWORD_STRENGTH,
} from "@/client/modules/shared/constants/password.js";
import { isTurnstileEnabled } from "@/client/lib/turnstile.js";
import TurnstileField from "@/client/modules/shared/components/forms/auth/TurnstileField.jsx";
import { authHook } from "@/client/modules/auth/hooks/authQuery.jsx";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import { PHONE_REGEX } from "@/client/modules/auth/constants/authConstants.js";

export default function Register() {
  const router = useRouter();

  const registerMutation = authHook.Register.useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const strength = getPasswordStrength(password);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const passwordChecks = getPasswordChecks(formData.password);
    if (!passwordChecks.length || !passwordChecks.uppercase || !passwordChecks.number) {
      toast.error(
        "Password must be at least 8 characters and include an uppercase letter and a number.",
      );
      return;
    }

    const phone = formData.phone.trim();
    if (phone && !PHONE_REGEX.test(phone)) {
      toast.error(`Please enter a valid phone number (e.g. ${regionConfig.phoneExample}).`);
      return;
    }

    if (isTurnstileEnabled() && !turnstileToken) {
      toast.error("Please complete the captcha verification.");
      return;
    }

    try {
      await toast.promise(
        registerMutation.mutateAsync({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          turnstileToken: turnstileToken || undefined,
        }),
        {
          loading: "Creating your account...",
          success: "Account created successfully",
          error: (err) => err?.message || "Registration failed",
        },
      );
      router.push(routes.customer.dashboard);
    } catch (error) {
      toast.error(error?.message || "Registration failed");
    }
  };

  return (
    <section className="flex min-h-screen bg-[#131313] text-[#e4e2e1]">
      {/* Left Side */}
      <div className="relative hidden overflow-hidden lg:block lg:w-1/2">
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={register}
            alt="barber"
            fill
            loading="lazy"
            sizes="50vw"
            className="object-cover brightness-[0.3] grayscale"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#131313]/80"></div>

        <div className="absolute right-12 bottom-12 left-12">
          <span className="mb-4 block text-xs font-semibold tracking-[0.3em] text-[#ffb68c]">
            JOIN THE BROTHERHOOD
          </span>

          <h2 className="mb-4 text-5xl font-bold">Your first cut awaits.</h2>

          <p className="leading-relaxed text-[#d8c2b7]">
            Create your account to book with our master barbers, track your style history, and earn
            loyalty rewards.
          </p>

          <div className="mt-8 flex gap-8">
            <div>
              <span className="block text-3xl font-bold text-[#ffb68c]">Free</span>

              <span className="text-[10px] tracking-[0.1em] text-[#a08d83]">TO JOIN</span>
            </div>

            <div>
              <span className="block text-3xl font-bold text-[#ffb68c]">Instant</span>

              <span className="text-[10px] tracking-[0.1em] text-[#a08d83]">BOOKING</span>
            </div>

            <div>
              <span className="block text-3xl font-bold text-[#ffb68c]">Points</span>

              <span className="text-[10px] tracking-[0.1em] text-[#a08d83]">REWARDS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-full flex-col justify-center overflow-y-auto px-8 py-16 md:px-16 lg:w-1/2 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link
            href={routes.public.home}
            className="mb-12 block text-3xl font-black tracking-tight text-[#e4e2e1] transition-colors hover:text-[#ffb68c] lg:hidden"
          >
            IRON &amp; OAK
          </Link>

          <span className="mb-3 block text-xs tracking-[0.1em] text-[#a08d83]">NEW CLIENT</span>

          <h1 className="mb-10 text-5xl font-bold">Create Account</h1>

          <form className="space-y-5" onSubmit={handleRegister}>
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-xs tracking-[0.1em] text-[#d8c2b7]">
                  FIRST NAME
                </label>

                <input
                  name="firstName"
                  type="text"
                  placeholder="James"
                  value={formData.firstName}
                  disabled={registerMutation.isPending}
                  onChange={handleChange}
                  className="w-full border border-[#53443c] bg-[#1f2020] px-4 py-3 text-[#e4e2e1] placeholder:text-[#d8c2b7]/40 focus:border-[#ffb68c] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs tracking-[0.1em] text-[#d8c2b7]">
                  LAST NAME
                </label>

                <input
                  name="lastName"
                  type="text"
                  placeholder="Wilson"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={registerMutation.isPending}
                  className="w-full border border-[#53443c] bg-[#1f2020] px-4 py-3 text-[#e4e2e1] placeholder:text-[#d8c2b7]/40 focus:border-[#ffb68c] focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-xs tracking-[0.1em] text-[#d8c2b7]">
                EMAIL ADDRESS
              </label>

              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={registerMutation.isPending}
                className="w-full border border-[#53443c] bg-[#1f2020] px-4 py-3 text-[#e4e2e1] placeholder:text-[#d8c2b7]/40 focus:border-[#ffb68c] focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-xs tracking-[0.1em] text-[#d8c2b7]">
                PHONE NUMBER
              </label>

              <input
                name="phone"
                type="tel"
                placeholder={regionConfig.phonePlaceholder}
                disabled={registerMutation.isPending}
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-[#53443c] bg-[#1f2020] px-4 py-3 text-[#e4e2e1] placeholder:text-[#d8c2b7]/40 focus:border-[#ffb68c] focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-xs tracking-[0.1em] text-[#d8c2b7]">PASSWORD</label>

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="8+ chars, uppercase & number"
                  value={formData.password}
                  disabled={registerMutation.isPending}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }));
                  }}
                  className="w-full border border-[#53443c] bg-[#1f2020] px-4 py-3 pr-12 text-[#e4e2e1] placeholder:text-[#d8c2b7]/40 focus:border-[#ffb68c] focus:outline-none"
                />

                <button
                  type="button"
                  disabled={registerMutation.isPending}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-[#d8c2b7]"
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>

              {/* Strength Bar */}
              <div className="mt-2 flex gap-1">
                {[0, 1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className={`h-1 flex-1 transition-colors ${
                      item <= strength ? PASSWORD_STRENGTH[strength]?.color : "bg-[#53443c]"
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-xs tracking-[0.1em] text-[#d8c2b7]">
                CONFIRM PASSWORD
              </label>

              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={registerMutation.isPending}
                  className="w-full border border-[#53443c] bg-[#1f2020] px-4 py-3 pr-12 text-[#e4e2e1] placeholder:text-[#d8c2b7]/40 focus:border-[#ffb68c] focus:outline-none"
                />

                <button
                  type="button"
                  disabled={registerMutation.isPending}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-[#d8c2b7]"
                >
                  {showConfirmPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[#ffb68c]"
                disabled={registerMutation.isPending}
              />

              <p className="text-[11px] leading-relaxed text-[#d8c2b7]">
                I AGREE TO THE{" "}
                <Link href="#" className="text-[#ffb68c] hover:underline">
                  TERMS OF SERVICE
                </Link>{" "}
                AND{" "}
                <Link href="#" className="text-[#ffb68c] hover:underline">
                  PRIVACY POLICY
                </Link>
              </p>
            </div>

            <TurnstileField className="flex justify-center" onToken={setTurnstileToken} />

            {/* Button */}
            <button
              type="submit"
              disabled={registerMutation.isPending || (isTurnstileEnabled() && !turnstileToken)}
              className="w-full bg-[#ffb68c] py-4 text-xs font-semibold tracking-[0.2em] text-[#532200] transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {registerMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin" />
                </span>
              ) : (
                "CREATE ACCOUNT"
              )}
            </button>
          </form>

          {/* Login */}
          <p className="mt-8 text-center text-[#d8c2b7]">
            Already a member?{" "}
            <Link href={routes.auth.login} className="text-[#ffb68c] transition hover:opacity-70">
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
