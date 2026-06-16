"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send, XCircle } from "lucide-react";
import { toast } from "sonner";

import { CONTACT_INFO, SUBJECTS } from "@/client/modules/public/constants/contactConstants.js";
import { publicHook } from "@/client/modules/public/hooks/publicQuery.jsx";
import { FieldError } from "@/client/modules/public/components/Contact/Primitives.jsx";
import { validate } from "@/client/modules/public/helpers/contactHelpers.js";

export function ContactForm({ disabled = false }) {
  const submitMutation = publicHook.ContactInfo.useSubmitContact();
  const isPending = disabled || submitMutation.isPending;

  const [fields, setFields] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | success | error

  const set = (key) => (e) => setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPending) return;

    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      await toast.promise(
        submitMutation.mutateAsync({
          name: fields.name.trim(),
          email: fields.email.trim(),
          subject: fields.subject,
          message: fields.message.trim(),
        }),
        {
          loading: "Sending your message…",
          success: "Message sent successfully!",
          error: "Something went wrong. Please try again.",
        },
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

  if (status === "success") {
    return (
      <div className="border-status-confirmed/25 bg-status-confirmed/8 flex flex-col items-center justify-center gap-5 rounded-xl border px-6 py-14 text-center">
        <span className="border-status-confirmed/30 bg-status-confirmed/15 text-status-confirmed flex h-14 w-14 items-center justify-center rounded-full border">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <div>
          <p className="text-on-surface font-serif text-xl font-bold">Message sent!</p>
          <p className="text-on-surface-variant mt-2 max-w-xs text-sm leading-relaxed">
            Thanks for reaching out,{" "}
            <span className="text-on-surface font-semibold">{fields.name.split(" ")[0]}</span>. Our
            support team will reply to{" "}
            <span className="text-on-surface font-semibold">{fields.email}</span> within one
            business day.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          disabled={isPending}
          className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high mt-1 inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputBase =
    "w-full rounded-lg border bg-surface-container px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";
  const inputNormal = "border-outline-variant focus:border-primary focus:bg-surface-container-high";
  const inputError = "border-error/60 focus:border-error bg-error/5";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact inquiry form"
      className="space-y-5"
    >
      {status === "error" && (
        <div
          role="alert"
          className="border-error/30 bg-error/8 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm"
        >
          <XCircle className="text-error mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p className="text-on-surface">
            Something went wrong on our end. Please try again or email us directly at{" "}
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="text-primary font-semibold underline underline-offset-2"
            >
              {CONTACT_INFO.email}
            </a>
            .
          </p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="font-label-caps text-on-surface mb-1.5 block text-[10px] tracking-widest uppercase"
          >
            Full name{" "}
            <span className="text-error" aria-hidden>
              *
            </span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={fields.name}
            onChange={set("name")}
            placeholder="Jane Smith"
            disabled={isPending}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
          />
          <FieldError message={errors.name} />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="font-label-caps text-on-surface mb-1.5 block text-[10px] tracking-widest uppercase"
          >
            Email address{" "}
            <span className="text-error" aria-hidden>
              *
            </span>
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={set("email")}
            placeholder="jane@example.com"
            disabled={isPending}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
          />
          <FieldError message={errors.email} />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="font-label-caps text-on-surface mb-1.5 block text-[10px] tracking-widest uppercase"
        >
          Subject{" "}
          <span className="text-error" aria-hidden>
            *
          </span>
        </label>
        <select
          id="contact-subject"
          value={fields.subject}
          onChange={set("subject")}
          disabled={isPending}
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

      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <label
            htmlFor="contact-message"
            className="font-label-caps text-on-surface text-[10px] tracking-widest uppercase"
          >
            Message{" "}
            <span className="text-error" aria-hidden>
              *
            </span>
          </label>
          <span className="text-on-surface-variant text-[11px]">{fields.message.length}/2000</span>
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
          disabled={isPending}
          aria-invalid={!!errors.message}
          className={`${inputBase} resize-y ${errors.message ? inputError : inputNormal}`}
        />
        <FieldError message={errors.message} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-on-surface-variant text-xs">
          <span className="text-error" aria-hidden>
            *
          </span>{" "}
          Required fields
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-on-primary hover:bg-primary/90 focus-visible:ring-primary/60 inline-flex h-11 items-center justify-center gap-2 rounded-lg px-6 text-sm font-bold transition-all focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitMutation.isPending ? (
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
