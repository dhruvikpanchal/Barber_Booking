"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Check,
  Scissors,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  ChevronLeft,
  Upload,
  User,
  Briefcase,
  Lock,
  Loader2,
} from "lucide-react";
import {
  getPasswordStrength,
  getPasswordChecks,
  PASSWORD_STRENGTH,
} from "@/client/modules/shared/constants/password.js";
import { SPECIALTIES, EXP_TIERS } from "@/client/modules/barber/constants/barberConstants.js";
import { authHook } from "@/client/modules/auth/hooks/authQuery.jsx";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import { BARBER_REGISTER_STEPS } from "@/client/modules/auth/constants/authConstants.js";

/* ─── Input primitive ─── */
function Field({ label, children, hint }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold tracking-[0.12em] text-[#d8c2b7]">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[10px] text-[#a08d83]">{hint}</p>}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full border border-[#3a2e28] bg-[#1c1c1c] px-4 py-3 text-sm text-[#e4e2e1] transition-colors duration-200 placeholder:text-[#d8c2b7]/30 focus:border-[#ffb68c] focus:bg-[#1f1a17] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
}

function Select({ className = "", children, ...props }) {
  return (
    <select
      {...props}
      className={`w-full cursor-pointer appearance-none border border-[#3a2e28] bg-[#1c1c1c] px-4 py-3 text-sm text-[#e4e2e1] transition-colors duration-200 focus:border-[#ffb68c] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </select>
  );
}

/* ─── Step 1: Personal Info ─── */
function StepPersonal({ data, setData, disabled = false }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="FIRST NAME">
          <Input
            type="text"
            placeholder="Marcus"
            value={data.firstName}
            disabled={disabled}
            onChange={(e) => setData({ ...data, firstName: e.target.value })}
          />
        </Field>
        <Field label="LAST NAME">
          <Input
            type="text"
            placeholder="Stone"
            value={data.lastName}
            disabled={disabled}
            onChange={(e) => setData({ ...data, lastName: e.target.value })}
          />
        </Field>
      </div>

      <Field label="EMAIL ADDRESS">
        <Input
          type="email"
          placeholder="you@example.com"
          value={data.email}
          disabled={disabled}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </Field>

      <Field label="PHONE NUMBER">
        <Input
          type="tel"
          placeholder="+1 (212) 555-0100"
          value={data.phone}
          disabled={disabled}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
        />
      </Field>

      <Field label="CITY / BOROUGH">
        <div className="relative">
          <MapPin
            size={16}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#a08d83]"
          />
          <Input
            type="text"
            placeholder="Brooklyn, NY"
            className="pl-10"
            value={data.city}
            disabled={disabled}
            onChange={(e) => setData({ ...data, city: e.target.value })}
          />
        </div>
      </Field>

      {/* Avatar upload */}
      <Field label="PROFILE PHOTO" hint="Square image recommended. JPG, PNG or WEBP · max 4 MB.">
        <label
          className={`group flex items-center gap-4 border border-dashed border-[#3a2e28] px-4 py-4 transition-colors ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-[#ffb68c]/60"}`}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#3a2e28] bg-[#1f1a17] transition-colors group-hover:border-[#ffb68c]/40">
            {data.photoName ? (
              <Check size={18} className="text-[#ffb68c]" />
            ) : (
              <Upload size={18} className="text-[#a08d83]" />
            )}
          </div>
          <div>
            <p className="text-[12px] tracking-wide text-[#d8c2b7]">
              {data.photoName ? data.photoName : "Click to upload photo"}
            </p>
            <p className="mt-0.5 text-[10px] text-[#a08d83]">Optional — you can add it later</p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={disabled}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setData({
                ...data,
                photoName: file?.name ?? "",
                photoFile: file,
              });
            }}
          />
        </label>
      </Field>
    </div>
  );
}

/* ─── Step 2: Professional Info ─── */
function StepProfessional({ data, setData, disabled = false }) {
  const toggleSpecialty = (s) => {
    setData({
      ...data,
      specialties: data.specialties.includes(s)
        ? data.specialties.filter((x) => x !== s)
        : [...data.specialties, s],
    });
  };

  return (
    <div className="space-y-6">
      {/* Experience */}
      <Field label="EXPERIENCE LEVEL">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {EXP_TIERS.map((tier) => (
            <button
              key={tier.value}
              type="button"
              disabled={disabled}
              onClick={() => setData({ ...data, experience: tier.value })}
              className={`border px-2 py-3 text-center transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                data.experience === tier.value
                  ? "border-[#ffb68c] bg-[#ffb68c]/8 text-[#ffb68c]"
                  : "border-[#3a2e28] text-[#d8c2b7] hover:border-[#a08d83]"
              }`}
            >
              <span className="block text-[11px] font-semibold tracking-wide">{tier.label}</span>
              <span className="mt-0.5 block text-[10px] opacity-60">{tier.sub}</span>
            </button>
          ))}
        </div>
      </Field>

      {/* Shop name */}
      <Field
        label="CURRENT OR PREVIOUS SHOP"
        hint="Leave blank if you are independent / freelance."
      >
        <Input
          type="text"
          placeholder="The Cardinal Barbershop"
          value={data.shopName}
          disabled={disabled}
          onChange={(e) => setData({ ...data, shopName: e.target.value })}
        />
      </Field>

      {/* Bio */}
      <Field label="SHORT BIO" hint="Shown on your public barber profile. 200 chars max.">
        <textarea
          maxLength={200}
          rows={3}
          placeholder="Precision fades, classic cuts. I've been behind the chair since 2015 in Bed-Stuy…"
          value={data.bio}
          disabled={disabled}
          onChange={(e) => setData({ ...data, bio: e.target.value })}
          className="w-full resize-none border border-[#3a2e28] bg-[#1c1c1c] px-4 py-3 text-sm text-[#e4e2e1] transition-colors placeholder:text-[#d8c2b7]/30 focus:border-[#ffb68c] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <p className="mt-1 text-right text-[10px] text-[#a08d83]">{data.bio.length}/200</p>
      </Field>

      {/* Availability */}
      <Field label="TYPICAL AVAILABILITY">
        <div className="relative">
          <Clock
            size={16}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#a08d83]"
          />
          <Select
            className="pl-10"
            value={data.availability}
            disabled={disabled}
            onChange={(e) => setData({ ...data, availability: e.target.value })}
          >
            <option value="">Select schedule…</option>
            <option value="full-time">Full-time (5–6 days/week)</option>
            <option value="part-time">Part-time (2–4 days/week)</option>
            <option value="weekends">Weekends only</option>
            <option value="flexible">Flexible / project-based</option>
          </Select>
        </div>
      </Field>

      {/* Specialties */}
      <Field label="SPECIALTIES" hint="Select all that apply.">
        <div className="mt-1 flex flex-wrap gap-2">
          {SPECIALTIES.map((s) => {
            const active = data.specialties.includes(s);
            return (
              <button
                key={s}
                type="button"
                disabled={disabled}
                onClick={() => toggleSpecialty(s)}
                className={`border px-3 py-1.5 text-[11px] tracking-wide transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                  active
                    ? "border-[#ffb68c] bg-[#ffb68c]/10 text-[#ffb68c]"
                    : "border-[#3a2e28] text-[#a08d83] hover:border-[#a08d83] hover:text-[#d8c2b7]"
                }`}
              >
                {active && <Check size={10} className="-mt-0.5 mr-1 inline" />}
                {s}
              </button>
            );
          })}
        </div>
      </Field>

      {/* Portfolio link */}
      <Field label="INSTAGRAM / PORTFOLIO" hint="Optional — helps admin verify your work.">
        <div className="relative">
          <Star
            size={16}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#a08d83]"
          />
          <Input
            type="url"
            placeholder="https://instagram.com/yourhandle"
            className="pl-10"
            value={data.portfolio}
            disabled={disabled}
            onChange={(e) => setData({ ...data, portfolio: e.target.value })}
          />
        </div>
      </Field>
    </div>
  );
}

/* ─── Step 3: Security ─── */
function StepSecurity({ data, setData, disabled = false }) {
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);

  const strength = getPasswordStrength(data.password);

  return (
    <div className="space-y-6">
      <div className="border border-[#3a2e28] bg-[#1a1310] px-4 py-4">
        <p className="text-[11px] leading-relaxed tracking-wide text-[#a08d83]">
          Your account requires admin approval before your barber dashboard unlocks. You&apos;ll
          receive a confirmation email within 1–2 business days.
        </p>
      </div>

      <Field label="PASSWORD">
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            placeholder="Min. 8 characters"
            value={data.password}
            disabled={disabled}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className="w-full border border-[#3a2e28] bg-[#1c1c1c] px-4 py-3 pr-12 text-sm text-[#e4e2e1] transition-colors placeholder:text-[#d8c2b7]/30 focus:border-[#ffb68c] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowPw(!showPw)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-[#a08d83] transition-colors hover:text-[#ffb68c]"
          >
            {showPw ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        {/* Strength meter */}
        {strength >= 0 && (
          <div className="mt-2.5">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 transition-all duration-300 ${
                    i <= strength ? PASSWORD_STRENGTH[strength]?.color : "bg-[#2e2319]"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1.5 text-[10px] text-[#a08d83]">
              {PASSWORD_STRENGTH[strength]?.label} password
            </p>
          </div>
        )}
      </Field>

      <Field label="CONFIRM PASSWORD">
        <div className="relative">
          <input
            type={showCp ? "text" : "password"}
            placeholder="Re-enter password"
            value={data.confirmPassword}
            disabled={disabled}
            onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
            className="w-full border border-[#3a2e28] bg-[#1c1c1c] px-4 py-3 pr-12 text-sm text-[#e4e2e1] transition-colors placeholder:text-[#d8c2b7]/30 focus:border-[#ffb68c] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowCp(!showCp)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-[#a08d83] transition-colors hover:text-[#ffb68c]"
          >
            {showCp ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
        {data.confirmPassword && data.password !== data.confirmPassword && (
          <p className="mt-1.5 text-[10px] text-red-400">Passwords do not match.</p>
        )}
      </Field>

      {/* Terms */}
      <div className="space-y-3 pt-2">
        <label
          className={`group flex items-start gap-3 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
          <div
            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${data.terms ? "border-[#ffb68c] bg-[#ffb68c]/10" : "border-[#3a2e28] group-hover:border-[#a08d83]"}`}
            onClick={() => !disabled && setData({ ...data, terms: !data.terms })}
          >
            {data.terms && <Check size={10} className="text-[#ffb68c]" />}
          </div>
          <p className="text-[11px] leading-relaxed text-[#d8c2b7]">
            I agree to the{" "}
            <Link href="#" className="text-[#ffb68c] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-[#ffb68c] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </label>

        <label
          className={`group flex items-start gap-3 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
          <div
            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${data.barberAgreement ? "border-[#ffb68c] bg-[#ffb68c]/10" : "border-[#3a2e28] group-hover:border-[#a08d83]"}`}
            onClick={() =>
              !disabled && setData({ ...data, barberAgreement: !data.barberAgreement })
            }
          >
            {data.barberAgreement && <Check size={10} className="text-[#ffb68c]" />}
          </div>
          <p className="text-[11px] leading-relaxed text-[#d8c2b7]">
            I understand my profile requires <span className="text-[#ffb68c]">admin approval</span>{" "}
            before I can accept live bookings.
          </p>
        </label>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function BarberRegister() {
  const barberRegisterMutation = authHook.BarberRegister.useBarberRegister();
  const isPending = barberRegisterMutation.isPending;

  const [step, setStep] = useState(1);

  const [personal, setPersonal] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    photoName: "",
    photoFile: null,
  });

  const [professional, setProfessional] = useState({
    experience: "",
    shopName: "",
    bio: "",
    availability: "",
    specialties: [],
    portfolio: "",
  });

  const [security, setSecurity] = useState({
    password: "",
    confirmPassword: "",
    terms: false,
    barberAgreement: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitResponse, setSubmitResponse] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!personal.firstName.trim() || !personal.lastName.trim()) {
        return "First and last name are required.";
      }
      if (!personal.email.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email.trim())) {
        return "Enter a valid email address.";
      }
      if (personal.phone.trim() && !PHONE_REGEX.test(personal.phone.trim())) {
        return "Enter a valid phone number.";
      }
    }
    if (currentStep === 2) {
      if (!professional.experience) {
        return "Select your experience level before continuing.";
      }
    }
    return "";
  };

  const handleNext = () => {
    if (isPending) return;
    const message = validateStep(step);
    if (message) {
      setSubmitError(message);
      toast.error(message);
      return;
    }
    setSubmitError("");
    setStep((s) => Math.min(s + 1, 3));
  };
  const handleBack = () => {
    if (isPending) return;
    setSubmitError("");
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isPending) return;
    setSubmitError("");

    const passwordChecks = getPasswordChecks(security.password);
    const passwordLooksValid =
      passwordChecks.length && passwordChecks.uppercase && passwordChecks.number;

    if (!passwordLooksValid) {
      const message =
        "Password must be at least 8 characters and include at least one uppercase letter and one number.";
      setSubmitError(message);
      toast.error(message);
      return;
    }

    if (security.password !== security.confirmPassword) {
      setSubmitError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    if (!security.terms || !security.barberAgreement) {
      const message = "Please accept the Terms and the admin approval acknowledgement.";
      setSubmitError(message);
      toast.error(message);
      return;
    }

    if (!professional.experience) {
      setSubmitError("Select your experience level.");
      setStep(2);
      toast.error("Select your experience level.");
      return;
    }

    const stepMessage = validateStep(1) || validateStep(2);
    if (stepMessage) {
      setSubmitError(stepMessage);
      toast.error(stepMessage);
      return;
    }

    const formData = new FormData();
    formData.append("firstName", personal.firstName.trim());
    formData.append("lastName", personal.lastName.trim());
    formData.append("email", personal.email.trim().toLowerCase());
    formData.append("phone", personal.phone.trim() || "");
    formData.append("city", personal.city.trim() || "");

    if (personal.photoFile) {
      formData.append("photo", personal.photoFile);
    }

    formData.append("experience", professional.experience);
    formData.append("shopName", professional.shopName || "");
    formData.append("bio", professional.bio || "");
    formData.append("availability", professional.availability || "");
    formData.append("specialties", JSON.stringify(professional.specialties || []));
    formData.append("portfolio", professional.portfolio || "");
    formData.append("password", security.password);
    formData.append("confirmPassword", security.confirmPassword);
    formData.append("terms", security.terms ? "true" : "false");
    formData.append("barberAgreement", security.barberAgreement ? "true" : "false");

    try {
      const result = await toast.promise(barberRegisterMutation.mutateAsync(formData), {
        loading: "Submitting your application...",
        success: "Application submitted successfully",
        error: (err) => err?.message || "Submission failed.",
      });
      setSubmitResponse(result);
      setSubmitted(true);
    } catch (err) {
      if (err?.fields && typeof err.fields === "object") {
        const fieldMessages = Object.entries(err.fields)
          .flatMap(([field, messages]) => messages.map((m) => `${field}: ${m}`))
          .join(" ");
        setSubmitError(fieldMessages || err.message || "Validation failed.");
      } else {
        setSubmitError(err?.message || "Submission failed.");
      }
    }
  };

  /* ── Success screen ── */
  if (submitted) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#131313] px-6 text-[#e4e2e1]">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center border-2 border-[#ffb68c]">
            <Scissors size={28} className="text-[#ffb68c]" />
          </div>
          <span className="mb-4 block text-xs tracking-[0.2em] text-[#a08d83]">
            APPLICATION RECEIVED
          </span>
          <h1 className="mb-5 text-4xl font-bold">You&apos;re in the queue.</h1>
          <p className="mb-10 text-sm leading-relaxed text-[#d8c2b7]">
            {submitResponse?.message ||
              "Our admin team will review your profile and send a confirmation email within 1–2 business days. Once approved, your barber dashboard will unlock automatically."}
          </p>
          <div className="mb-10 grid grid-cols-3 gap-4">
            {[
              { val: "Submitted", sub: "APPLICATION" },
              { val: "1–2 days", sub: "REVIEW TIME" },
              { val: "Instant", sub: "ON APPROVAL" },
            ].map((item) => (
              <div key={item.sub} className="border border-[#3a2e28] py-4">
                <span className="block text-lg font-bold text-[#ffb68c]">{item.val}</span>
                <span className="text-[10px] tracking-[0.1em] text-[#a08d83]">{item.sub}</span>
              </div>
            ))}
          </div>
          <Link
            href={routes.public.home}
            className="inline-block bg-[#ffb68c] px-8 py-3 text-xs font-semibold tracking-[0.2em] text-[#532200] transition-all hover:opacity-90 active:scale-95"
          >
            BACK TO HOME
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen bg-[#131313] text-[#e4e2e1]">
      {/* ── Left panel ── */}
      <div className="relative hidden flex-col overflow-hidden lg:flex lg:w-[42%] xl:w-[38%]">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/register.webp"
            alt="Iron & Oak Barbershop"
            fill
            priority
            sizes="(max-width: 1280px) 42vw, 480px"
            className="object-cover brightness-[0.25] grayscale"
          />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#131313]/20 via-transparent to-[#131313]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />

        {/* Decorative vertical rule */}
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#ffb68c]/20 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col px-12 py-12">
          {/* Logo */}
          <Link href={routes.public.home} className="group flex items-center gap-3">
            <Scissors
              size={20}
              className="text-[#ffb68c] transition-transform group-hover:rotate-12"
            />
            <span className="text-xl font-black tracking-tight text-[#e4e2e1] transition-colors group-hover:text-[#ffb68c]">
              IRON &amp; OAK
            </span>
          </Link>

          {/* Steps indicator */}
          <div className="mt-16 space-y-2">
            {BARBER_REGISTER_STEPS.map((s) => {
              const Icon = s.icon;
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-4 border-l-2 px-4 py-3 transition-all duration-300 ${
                    active
                      ? "border-[#ffb68c] bg-[#ffb68c]/5"
                      : done
                        ? "border-[#ffb68c]/40"
                        : "border-[#3a2e28]"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center border transition-colors ${active ? "border-[#ffb68c] text-[#ffb68c]" : done ? "border-[#ffb68c]/50 text-[#ffb68c]/50" : "border-[#3a2e28] text-[#3a2e28]"}`}
                  >
                    {done ? <Check size={13} /> : <Icon size={13} />}
                  </div>
                  <div>
                    <p
                      className={`text-[11px] font-semibold tracking-[0.12em] transition-colors ${active ? "text-[#ffb68c]" : done ? "text-[#a08d83]" : "text-[#3a2e28]"}`}
                    >
                      STEP {s.id}
                    </p>
                    <p
                      className={`text-xs transition-colors ${active ? "text-[#e4e2e1]" : done ? "text-[#a08d83]" : "text-[#3a2e28]"}`}
                    >
                      {s.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA copy */}
          <div className="mt-auto">
            <span className="mb-4 block text-[11px] font-semibold tracking-[0.25em] text-[#ffb68c]">
              JOIN THE BROTHERHOOD
            </span>
            <h2 className="mb-4 text-4xl leading-tight font-bold">
              Your chair.
              <br />
              Your clients.
              <br />
              Your schedule.
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-[#d8c2b7]">
              Register as a barber on Iron &amp; Oak to manage bookings, build your client base, and
              track your earnings — all in one place.
            </p>

            <div className="mt-8 flex gap-8">
              {[
                { val: "Free", sub: "TO JOIN" },
                { val: "Instant", sub: "BOOKINGS" },
                { val: "Full", sub: "DASHBOARD" },
              ].map((item) => (
                <div key={item.sub}>
                  <span className="block text-2xl font-bold text-[#ffb68c]">{item.val}</span>
                  <span className="text-[10px] tracking-[0.1em] text-[#a08d83]">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex w-full flex-col justify-center overflow-y-auto px-6 py-14 md:px-14 lg:w-[58%] lg:px-16 xl:w-[62%] xl:px-24">
        <div className="mx-auto w-full max-w-lg">
          {/* Mobile logo */}
          <Link
            href={routes.public.home}
            className="mb-10 flex items-center gap-2 text-2xl font-black tracking-tight text-[#e4e2e1] transition-colors hover:text-[#ffb68c] lg:hidden"
          >
            <Scissors size={20} className="text-[#ffb68c]" />
            IRON &amp; OAK
          </Link>

          {/* Mobile step dots */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            {BARBER_REGISTER_STEPS.map((s) => (
              <div
                key={s.id}
                className={`h-1 transition-all duration-300 ${
                  step === s.id
                    ? "w-8 bg-[#ffb68c]"
                    : step > s.id
                      ? "w-4 bg-[#ffb68c]/40"
                      : "w-4 bg-[#3a2e28]"
                }`}
              />
            ))}
            <span className="ml-2 text-[10px] tracking-[0.1em] text-[#a08d83]">
              STEP {step} OF 3
            </span>
          </div>

          {/* Header */}
          <span className="mb-2 block text-[11px] tracking-[0.15em] text-[#a08d83]">
            BARBER REGISTRATION
          </span>
          <h1 className="mb-1 text-4xl font-bold sm:text-5xl">
            {step === 1 && "Your Details"}
            {step === 2 && "Your Craft"}
            {step === 3 && "Secure Your Seat"}
          </h1>
          <p className="mb-8 text-sm text-[#a08d83]">
            {step === 1 && "Tell us who you are."}
            {step === 2 && "Show us what you do."}
            {step === 3 && "Set your password and confirm."}
          </p>

          {/* Divider */}
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#2a2017]" />
            <Scissors size={14} className="text-[#3a2e28]" />
            <div className="h-px flex-1 bg-[#2a2017]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <StepPersonal data={personal} setData={setPersonal} disabled={isPending} />
            )}
            {step === 2 && (
              <StepProfessional
                data={professional}
                setData={setProfessional}
                disabled={isPending}
              />
            )}
            {step === 3 && (
              <StepSecurity data={security} setData={setSecurity} disabled={isPending} />
            )}

            {submitError && (
              <div
                className="mb-6 border border-red-400/60 bg-red-950/20 px-4 py-3 text-[12px] leading-relaxed text-red-200"
                role="alert"
              >
                {submitError}
              </div>
            )}

            {/* Navigation */}
            <div className={`mt-8 flex gap-4 ${step > 1 ? "justify-between" : "justify-end"}`}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isPending}
                  className="flex items-center gap-2 border border-[#3a2e28] px-6 py-3 text-xs tracking-[0.15em] text-[#d8c2b7] transition-all hover:border-[#a08d83] hover:text-[#e4e2e1] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={14} />
                  BACK
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isPending}
                  className="ml-auto flex items-center gap-2 bg-[#ffb68c] px-8 py-3 text-xs font-semibold tracking-[0.2em] text-[#532200] transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  NEXT
                  <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto flex items-center gap-2 bg-[#ffb68c] px-8 py-3 text-xs font-semibold tracking-[0.2em] text-[#532200] transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={
                    !security.terms ||
                    !security.barberAgreement ||
                    security.password !== security.confirmPassword ||
                    security.password.length < 8 ||
                    isPending ||
                    (() => {
                      const { length, uppercase, number } = getPasswordChecks(security.password);
                      return !length || !uppercase || !number;
                    })()
                  }
                >
                  {isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>
                      SUBMIT
                      <Check size={14} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Footer links */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#2a2017] pt-6">
            <p className="text-xs text-[#a08d83]">
              Already registered?{" "}
              <Link href={routes.auth.login} className="text-[#ffb68c] transition hover:opacity-70">
                SIGN IN
              </Link>
            </p>
            <Link
              href={routes.auth.barberRegisterRules}
              className="text-[10px] tracking-[0.1em] text-[#a08d83] transition hover:text-[#ffb68c]"
            >
              HOW APPROVAL WORKS →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
