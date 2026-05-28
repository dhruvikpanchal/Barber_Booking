"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  XCircle,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";
import { routes } from "@/config/routes/routes";

// ---------------------------------------------------------------------------
// Static contact data — update once, reflects everywhere
// ---------------------------------------------------------------------------

const CONTACT_INFO = {
  phone: "+1 (555) 018-2049",
  email: "support@ironandoak.app",
  address: {
    street: "114 West Barrow Street",
    suite: "Suite 3B",
    city: "Brooklyn",
    state: "NY",
    zip: "11201",
    country: "United States",
  },
  hours: [
    { days: "Monday – Friday", time: "9:00 AM – 6:00 PM EST" },
    { days: "Saturday", time: "10:00 AM – 4:00 PM EST" },
    { days: "Sunday", time: "Closed" },
  ],
  social: [
    {
      id: "facebook",
      label: "Facebook",
      handle: "@ironandoak",
      href: "https://facebook.com/ironandoak",
      Icon: FaFacebookF,
    },
    {
      id: "instagram",
      label: "Instagram",
      handle: "@iron.and.oak",
      href: "https://instagram.com/iron.and.oak",
      Icon: FaInstagram,
    },
    {
      id: "twitter",
      label: "X / Twitter",
      handle: "@ironandoak",
      href: "https://x.com/ironandoak",
      Icon: FaXTwitter,
    },
  ],
};

const SUBJECTS = [
  "General inquiry",
  "Booking issue",
  "Account & login",
  "Payment & billing",
  "Report a problem",
  "Partnership inquiry",
  "Press & media",
  "Other",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function validate(fields) {
  const errs = {};
  if (!fields.name.trim()) errs.name = "Full name is required.";
  if (!fields.email.trim()) errs.email = "Email address is required.";
  else if (!isValidEmail(fields.email)) errs.email = "Enter a valid email address.";
  if (!fields.subject) errs.subject = "Please choose a subject.";
  if (!fields.message.trim()) errs.message = "Message cannot be empty.";
  else if (fields.message.trim().length < 20)
    errs.message = "Please write at least 20 characters.";
  return errs;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Breadcrumb */
function Breadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-on-surface-variant"
    >
      <Link
        href={routes.public.home}
        className="inline-flex items-center gap-1 transition-colors hover:text-primary"
      >
        <Home className="h-3 w-3" aria-hidden />
        Home
      </Link>
      <ChevronRight className="h-3 w-3 shrink-0 opacity-40" aria-hidden />
      <span className="font-medium text-on-surface" aria-current="page">
        Contact
      </span>
    </nav>
  );
}

/** Single info row used inside info cards */
function InfoRow({ Icon, label, children }) {
  return (
    <div className="flex gap-3.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface-container text-primary">
        <Icon className="h-3.5 w-3.5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase">
          {label}
        </p>
        <div className="mt-0.5 text-sm text-on-surface">{children}</div>
      </div>
    </div>
  );
}

/** Inline form field error */
function FieldError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-error">
      <XCircle className="h-3 w-3 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

/** Contact form */
function ContactForm() {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const set = (key) => (e) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("submitting");
    try {
      // Simulate API call — replace with real endpoint
      await new Promise((res, rej) =>
        setTimeout(() => (Math.random() > 0.05 ? res() : rej()), 1400),
      );
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFields({ name: "", email: "", subject: "", message: "" });
    setErrors({});
    setStatus("idle");
  };

  /* ── Success state ── */
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-5 rounded-xl border border-status-confirmed/25 bg-status-confirmed/8 px-6 py-14 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-status-confirmed/30 bg-status-confirmed/15 text-status-confirmed">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <div>
          <p className="font-serif text-xl font-bold text-on-surface">
            Message sent!
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-on-surface-variant">
            Thanks for reaching out,{" "}
            <span className="font-semibold text-on-surface">
              {fields.name.split(" ")[0]}
            </span>
            . Our support team will reply to{" "}
            <span className="font-semibold text-on-surface">{fields.email}</span>{" "}
            within one business day.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputBase =
    "w-full rounded-lg border bg-surface-container px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 transition-colors focus:outline-none";
  const inputNormal =
    "border-outline-variant focus:border-primary focus:bg-surface-container-high";
  const inputError = "border-error/60 focus:border-error bg-error/5";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact inquiry form"
      className="space-y-5"
    >
      {/* Error banner */}
      {status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-error/30 bg-error/8 px-4 py-3 text-sm"
        >
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden />
          <p className="text-on-surface">
            Something went wrong on our end. Please try again or email us
            directly at{" "}
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="font-semibold text-primary underline underline-offset-2"
            >
              {CONTACT_INFO.email}
            </a>
            .
          </p>
        </div>
      )}

      {/* Name + Email row */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Full name */}
        <div>
          <label
            htmlFor="contact-name"
            className="font-label-caps mb-1.5 block text-[10px] tracking-widest text-on-surface uppercase"
          >
            Full name <span className="text-error" aria-hidden>*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={set("name")}
            placeholder="Jane Smith"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
          />
          <FieldError message={errors.name} />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="contact-email"
            className="font-label-caps mb-1.5 block text-[10px] tracking-widest text-on-surface uppercase"
          >
            Email address <span className="text-error" aria-hidden>*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={set("email")}
            placeholder="jane@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
          />
          <FieldError message={errors.email} />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="contact-subject"
          className="font-label-caps mb-1.5 block text-[10px] tracking-widest text-on-surface uppercase"
        >
          Subject <span className="text-error" aria-hidden>*</span>
        </label>
        <select
          id="contact-subject"
          value={fields.subject}
          onChange={set("subject")}
          aria-invalid={!!errors.subject}
          className={`${inputBase} ${errors.subject ? inputError : inputNormal} appearance-none`}
        >
          <option value="">Choose a subject…</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <FieldError message={errors.subject} />
      </div>

      {/* Message */}
      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <label
            htmlFor="contact-message"
            className="font-label-caps text-[10px] tracking-widest text-on-surface uppercase"
          >
            Message <span className="text-error" aria-hidden>*</span>
          </label>
          <span className="text-[11px] text-on-surface-variant">
            {fields.message.length}/2000
          </span>
        </div>
        <textarea
          id="contact-message"
          rows={6}
          value={fields.message}
          onChange={(e) =>
            setFields((p) => ({
              ...p,
              message: e.target.value.slice(0, 2000),
            }))
          }
          placeholder="Describe your question or issue in as much detail as possible…"
          aria-invalid={!!errors.message}
          className={`${inputBase} resize-y ${errors.message ? inputError : inputNormal}`}
        />
        <FieldError message={errors.message} />
      </div>

      {/* Submit */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-on-surface-variant">
          <span className="text-error" aria-hidden>*</span> Required fields
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-bold text-on-primary transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden />
              Send Message
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/** Contact information panel */
function ContactInfoPanel() {
  const { phone, email, address, hours, social } = CONTACT_INFO;
  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(
    `${address.street}, ${address.city}, ${address.state} ${address.zip}`,
  )}`;

  return (
    <aside className="space-y-5">
      {/* Contact details card */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-low">
        <header className="border-b border-outline-variant px-5 py-4">
          <p className="font-label-caps text-[10px] tracking-widest text-primary uppercase">
            Get in touch
          </p>
          <h2 className="mt-0.5 font-serif text-base font-bold text-on-surface">
            Platform support
          </h2>
        </header>

        <div className="space-y-5 p-5">
          {/* Phone */}
          <InfoRow Icon={Phone} label="Support phone">
            <a
              href={`tel:${phone.replace(/\s|\(|\)|-/g, "")}`}
              className="font-medium text-primary hover:underline"
            >
              {phone}
            </a>
          </InfoRow>

          {/* Email */}
          <InfoRow Icon={Mail} label="Support email">
            <a
              href={`mailto:${email}`}
              className="break-all font-medium text-primary hover:underline"
            >
              {email}
            </a>
          </InfoRow>

          {/* Address */}
          <InfoRow Icon={MapPin} label="Office address">
            <address className="not-italic leading-relaxed text-on-surface">
              {address.street}
              {address.suite && (
                <>
                  , {address.suite}
                </>
              )}
              <br />
              {address.city}, {address.state} {address.zip}
              <br />
              {address.country}
            </address>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View on map
              <ArrowRight className="h-3 w-3" aria-hidden />
            </a>
          </InfoRow>
        </div>
      </section>

      {/* Working hours card */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-low">
        <header className="flex items-center gap-2.5 border-b border-outline-variant px-5 py-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <Clock className="h-3.5 w-3.5" aria-hidden />
          </span>
          <h2 className="font-serif text-sm font-bold text-on-surface">
            Support hours
          </h2>
        </header>

        <ul className="divide-y divide-outline-variant/60 px-5">
          {hours.map(({ days, time }) => {
            const isClosed = time === "Closed";
            return (
              <li
                key={days}
                className="flex items-center justify-between gap-4 py-3 text-sm"
              >
                <span className="text-on-surface-variant">{days}</span>
                <span
                  className={
                    isClosed
                      ? "font-medium text-on-surface-variant/60"
                      : "font-semibold text-on-surface"
                  }
                >
                  {time}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="px-5 pb-4 pt-2">
          <p className="rounded-lg border border-outline-variant bg-surface-container px-3.5 py-2.5 text-xs leading-relaxed text-on-surface-variant">
            Response time is typically within{" "}
            <span className="font-semibold text-on-surface">1 business day</span>
            . For urgent booking issues, call or email directly.
          </p>
        </div>
      </section>

      {/* Social media card */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-low">
        <header className="flex items-center gap-2.5 border-b border-outline-variant px-5 py-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <MessageSquare className="h-3.5 w-3.5" aria-hidden />
          </span>
          <h2 className="font-serif text-sm font-bold text-on-surface">
            Follow us
          </h2>
        </header>

        <ul className="space-y-1.5 p-4">
          {social.map(({ id, label, handle, href, Icon }) => (
            <li key={id}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border border-outline-variant bg-surface-container px-3.5 py-2.5 transition-colors hover:border-primary/40 hover:bg-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                aria-label={`${label} — ${handle}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-outline-variant bg-surface-container-high text-on-surface-variant transition-colors group-hover:border-primary/30 group-hover:text-primary">
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-on-surface transition-colors group-hover:text-primary">
                    {label}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">{handle}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-on-surface-variant/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Drop this into src/modules/public/Contact.jsx.
 * The page is already wired at src/app/(public)/contact/page.js.
 */
export default function Contact() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-24 pt-4 md:px-16">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Page header */}
      <header className="mt-5 max-w-2xl">
        <p className="font-label-caps text-primary">Support</p>
        <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-on-surface md:text-4xl lg:text-5xl">
          Get in touch.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant md:text-base">
          Have a question about a booking, your account, or the platform? Fill in
          the form and our support team will get back to you — usually within one
          business day.
        </p>
      </header>

      {/* Decorative divider */}
      <div className="my-8 h-px w-full bg-gradient-to-r from-primary/30 via-outline-variant to-transparent" />

      {/* Main layout — form left, info right */}
      <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start xl:grid-cols-[1fr_360px]">
        {/* Left — contact form */}
        <section className="rounded-xl border border-outline-variant bg-surface-container-low">
          <header className="border-b border-outline-variant px-5 py-4 sm:px-6">
            <p className="font-label-caps text-[10px] tracking-widest text-primary uppercase">
              Send a message
            </p>
            <h2 className="mt-0.5 font-serif text-lg font-bold text-on-surface">
              Contact form
            </h2>
            <p className="mt-1 text-xs text-on-surface-variant">
              All fields marked with{" "}
              <span className="text-error" aria-hidden>
                *
              </span>{" "}
              are required.
            </p>
          </header>

          <div className="p-5 sm:p-6">
            <ContactForm />
          </div>
        </section>

        {/* Right — info panel (sticky on large screens) */}
        <div className="lg:sticky lg:top-28">
          <ContactInfoPanel />
        </div>
      </div>

      {/* Bottom disclaimer */}
      <p className="mt-10 text-center text-xs text-on-surface-variant">
        Iron &amp; Oak is a platform team — we manage the booking system, not individual
        barber shops. For shop-specific inquiries (pricing, availability, walk-ins),
        please contact the shop or barber directly via their profile page.
      </p>
    </div>
  );
}
