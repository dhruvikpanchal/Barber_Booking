"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/config/assets/ImagePath.js";
import { routes } from "@/config/routes/routes.js";
import RoleSelector from "@/components/forms/auth/RoleSelector.jsx";
import LoginForm from "@/components/forms/auth/LoginForm.jsx";
import GoogleButton from "@/components/forms/auth/GoogleButton.jsx";

const ROLE_CONFIG = {
  customer: {
    portalLabel: "CLIENT PORTAL",
    headline: "Sign In",
    blurb:
      "Sign in to manage your bookings and discover your next perfect cut.",
    redirect: routes.customer.dashboard,
    showGoogle: true,
    register: {
      prefix: "New client?",
      linkText: "CREATE ACCOUNT",
      href: routes.auth.register,
    },
  },
  barber: {
    portalLabel: "BARBER PORTAL",
    headline: "Sign In",
    blurb: "Access your chair, queue, appointments, and shop tools.",
    redirect: routes.barber.dashboard,
    showGoogle: false,
    register: {
      prefix: "New to Iron & Oak?",
      linkText: "VIEW APPLICATION PROCESS",
      href: routes.auth.barberRegisterRules,
    },
  },
  admin: {
    portalLabel: "ADMIN PORTAL",
    headline: "Sign In",
    blurb: "Platform operations, users, barbers, and appointment oversight.",
    redirect: routes.admin.dashboard,
    showGoogle: false,
    register: null,
  },
};

const REMEMBER_KEY = "io.auth.remember";

function validateLogin({ email, password }) {
  const errors = {};
  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  return errors;
}

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const config = ROLE_CONFIG[role];

  async function persistRemember(email, remember) {
    if (typeof window === "undefined") return;
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, JSON.stringify({ email, role }));
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
  }

  async function completeSignIn(targetRole, email, remember) {
    await persistRemember(email, remember);
    if (typeof window !== "undefined") {
      localStorage.setItem("io.auth.role", targetRole);
    }
    router.push(ROLE_CONFIG[targetRole].redirect);
  }

  async function handleSubmit({ email, password, remember }) {
    setFieldErrors({});
    const errors = validateLogin({ email, password });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      await completeSignIn(role, email, remember);
    } catch {
      setFieldErrors({ form: "Invalid email or password." });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (role !== "customer") return;
    setFieldErrors({});
    setGoogleLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      await completeSignIn("customer", "google@demo.user", true);
    } catch {
      setFieldErrors({ form: "Google sign-in failed. Please try again." });
    } finally {
      setGoogleLoading(false);
    }
  }

  function handleRoleChange(next) {
    setRole(next);
    setFieldErrors({});
  }

  const busy = loading || googleLoading;

  return (
    <section className="bg-[#131313] text-[#e4e2e1] min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={login}
            alt="barbershop"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 420px"
            fill
            className="object-cover grayscale brightness-[0.35]"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#131313]/80" />

        <div className="absolute bottom-12 left-12 right-12">
          <span className="text-[#ffb68c] tracking-[0.3em] block mb-4 text-xs font-semibold">
            IRON &amp; OAK BARBERSHOP
          </span>

          <h2 className="text-5xl font-bold mb-4">Welcome back.</h2>

          <p className="text-[#d8c2b7] leading-relaxed">{config.blurb}</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16">
        <div className="max-w-md w-full mx-auto">
          <Link
            href={routes.public.home}
            className="text-3xl font-black tracking-tight text-[#e4e2e1] hover:text-[#ffb68c] transition-colors mb-12 block lg:hidden"
          >
            IRON &amp; OAK
          </Link>

          <span className="text-[#a08d83] block mb-3 text-xs tracking-[0.1em]">
            {config.portalLabel}
          </span>

          <h1 className="text-5xl font-bold mb-6">{config.headline}</h1>

          <RoleSelector
            value={role}
            onChange={handleRoleChange}
            disabled={busy}
          />

          <LoginForm
            onSubmit={handleSubmit}
            loading={loading}
            fieldErrors={fieldErrors}
          />

          {config.showGoogle && (
            <>
              <div className="my-8 flex items-center gap-4">
                <div className="flex-1 h-px bg-[#53443c]" />
                <span className="text-[#a08d83] text-[10px] tracking-[0.1em]">
                  OR
                </span>
                <div className="flex-1 h-px bg-[#53443c]" />
              </div>

              <GoogleButton
                onClick={handleGoogle}
                loading={googleLoading}
                disabled={loading}
              />
            </>
          )}

          {config.register && (
            <p className="mt-8 text-center text-[#d8c2b7]">
              {config.register.prefix}{" "}
              <Link
                href={config.register.href}
                className="text-[#ffb68c] hover:opacity-70 transition"
              >
                {config.register.linkText}
              </Link>
            </p>
          )}

          {role === "admin" && (
            <p className="mt-8 text-center text-[#a08d83] text-xs tracking-[0.08em]">
              Admin accounts are provisioned by the platform team.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
