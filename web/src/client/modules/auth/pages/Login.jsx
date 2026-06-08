"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { login } from "@/client/config/assets/ImagePath.js";
import { routes } from "@/client/config/routes/routes.js";
import { authHook } from "@/client/modules/auth/hooks/authQuery.jsx";
import RoleSelector from "@/client/modules/shared/components/forms/auth/RoleSelector.jsx";
import LoginForm from "@/client/modules/shared/components/forms/auth/LoginForm.jsx";
import GoogleButton from "@/client/modules/shared/components/forms/auth/GoogleButton.jsx";
import { clearAuthTokens } from "@/lib/axios";
import { toast } from "sonner";
import {
  ROLE_CONFIG,
  REMEMBER_KEY,
  USER_KEY,
  API_ROLE_TO_PORTAL,
} from "@/client/modules/auth/constants/authConstants.js";

function apiRoleToPortal(apiRole) {
  return API_ROLE_TO_PORTAL[apiRole] ?? null;
}

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
  const loginMutation = authHook.Login.useLogin();
  const googleLoginMutation = authHook.GoogleLogin.useGoogleLogin();
  const router = useRouter();
  const [role, setRole] = useState("customer");
  const [fieldErrors, setFieldErrors] = useState({});
  const [rememberDefaults, setRememberDefaults] = useState({
    email: "",
    remember: false,
  });

  const config = ROLE_CONFIG[role];

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(REMEMBER_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.role && ROLE_CONFIG[saved.role]) {
        setRole(saved.role);
      }
      if (saved.email) {
        setRememberDefaults({
          email: saved.email,
          remember: true,
        });
      }
    } catch {
      localStorage.removeItem(REMEMBER_KEY);
    }
  }, []);

  async function persistRemember(email, remember) {
    if (typeof window === "undefined") return;
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, JSON.stringify({ email, role }));
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }
  }

  async function completeSignIn(targetRole, email, remember, user) {
    await persistRemember(email, remember);
    if (typeof window !== "undefined") {
      localStorage.setItem("io.auth.role", targetRole);
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    }
    router.push(ROLE_CONFIG[targetRole].redirect);
  }

  async function handleSubmit({ email, password, remember, turnstileToken }) {
    setFieldErrors({});
    const errors = validateLogin({ email, password });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const result = await loginMutation.mutateAsync({ email, password, turnstileToken });
      const portalRole = apiRoleToPortal(result?.user?.role);

      if (!portalRole) {
        clearAuthTokens();
        setFieldErrors({ form: "Unable to sign in with this account." });
        return;
      }

      if (portalRole !== role) {
        clearAuthTokens();
        setFieldErrors({
          form: `This account belongs to the ${ROLE_CONFIG[portalRole].portalLabel}. Switch portals and try again.`,
        });
        return;
      }

      toast.success("Signed in successfully");
      await completeSignIn(portalRole, email, remember, result.user);
    } catch (error) {
      const fieldMessages =
        error.fields &&
        Object.entries(error.fields)
          .flatMap(([field, messages]) => messages.map((msg) => `${field}: ${msg}`))
          .join(" ");
      setFieldErrors({
        form: fieldMessages || error.message || "Invalid email or password.",
      });
      toast.error(error.message || "Invalid email or password.");
    }
  }

  async function handleGoogle() {
    if (role !== "customer") return;
    setFieldErrors({});
    try {
      const result = await googleLoginMutation.mutateAsync();
      if (!result?.user?.email) {
        const message = "Invalid Google login response. Please try again.";

        setFieldErrors({
          form: message,
        });

        toast.error(message);

        return;
      }

      toast.success("Signed in with Google successfully");
      await completeSignIn("customer", result.user.email, false, result.user);
    } catch (error) {
      const message = error.message || "Google sign-in failed. Please try again.";

      setFieldErrors({
        form: message,
      });

      toast.error(message);
    }
  }

  function handleRoleChange(next) {
    setRole(next);
    setFieldErrors({});
  }

  const busy = loginMutation.isPending || googleLoginMutation.isPending;

  return (
    <section className="flex min-h-screen bg-[#131313] text-[#e4e2e1]">
      {/* Left Side */}
      <div className="relative hidden overflow-hidden lg:block lg:w-1/2">
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={login}
            alt="barbershop"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 420px"
            fill
            className="object-cover brightness-[0.35] grayscale"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#131313]/80" />

        <div className="absolute right-12 bottom-12 left-12">
          <span className="mb-4 block text-xs font-semibold tracking-[0.3em] text-[#ffb68c]">
            IRON &amp; OAK BARBERSHOP
          </span>

          <h2 className="mb-4 text-5xl font-bold">Welcome back.</h2>

          <p className="leading-relaxed text-[#d8c2b7]">{config.blurb}</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-full flex-col justify-center px-8 py-16 md:px-16 lg:w-1/2 lg:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link
            href={routes.public.home}
            className="mb-12 block text-3xl font-black tracking-tight text-[#e4e2e1] transition-colors hover:text-[#ffb68c] disabled:cursor-not-allowed disabled:opacity-50 lg:hidden"
          >
            IRON &amp; OAK
          </Link>

          <span className="mb-3 block text-xs tracking-[0.1em] text-[#a08d83]">
            {config.portalLabel}
          </span>

          <h1 className="mb-6 text-5xl font-bold">{config.headline}</h1>

          <RoleSelector
            value={role}
            onChange={handleRoleChange}
            disabled={loginMutation.isPending}
          />

          <LoginForm
            onSubmit={handleSubmit}
            loading={loginMutation.isPending}
            disabled={busy}
            fieldErrors={fieldErrors}
            defaultEmail={rememberDefaults.email}
            defaultRemember={rememberDefaults.remember}
          />

          {config.showGoogle && (
            <>
              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#53443c]" />
                <span className="text-[10px] tracking-[0.1em] text-[#a08d83]">OR</span>
                <div className="h-px flex-1 bg-[#53443c]" />
              </div>

              <GoogleButton
                onClick={handleGoogle}
                loading={googleLoginMutation.isPending}
                disabled={busy}
              />
            </>
          )}

          {config.register && (
            <p className="mt-8 text-center text-[#d8c2b7]">
              {config.register.prefix}{" "}
              <Link
                href={config.register.href}
                className="text-[#ffb68c] transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {config.register.linkText}
              </Link>
            </p>
          )}

          {role === "admin" && (
            <p className="mt-8 text-center text-xs tracking-[0.08em] text-[#a08d83]">
              Admin accounts are provisioned by the platform team.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
