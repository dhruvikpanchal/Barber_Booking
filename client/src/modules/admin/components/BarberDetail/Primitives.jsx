"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Home, Loader2, X } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import { ACCOUNT_STATUS_CONFIG } from "@/data/admin/barberDetailsData.js";

export function fullDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AccountStatusBadge({ status }) {
  const cfg = ACCOUNT_STATUS_CONFIG[status] ?? ACCOUNT_STATUS_CONFIG.inactive;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.badge}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {cfg.label}
    </span>
  );
}

export function SectionCard({ title, description, children, className = "" }) {
  return (
    <section
      className={`rounded-xl border border-outline-variant bg-surface-container-low ${className}`}
    >
      <header className="border-b border-outline-variant px-5 py-4 md:px-6">
        <h2 className="font-serif text-base font-bold text-on-surface md:text-lg">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
        )}
      </header>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

export function DetailRow({ label, value, icon: Icon }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex items-start gap-3 border-b border-outline-variant/60 py-3.5 last:border-b-0">
      {Icon && (
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-container text-on-surface-variant">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-label-caps text-[11px] text-on-surface-variant">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-on-surface break-words">{value}</p>
      </div>
    </div>
  );
}

export function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container p-4">
      <div className="flex items-start justify-between gap-2">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            accent ?? "bg-primary/15 text-primary"
          }`}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <p className="mt-3 font-serif text-2xl font-bold text-on-surface">
        {value}
      </p>
      <p className="mt-0.5 text-xs font-semibold text-on-surface">{label}</p>
      {sub && (
        <p className="mt-0.5 text-[11px] text-on-surface-variant">{sub}</p>
      )}
    </div>
  );
}

export function Breadcrumb({ barber }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-xs text-on-surface-variant"
    >
      <Link
        href={routes.admin.dashboard}
        className="inline-flex items-center gap-1 hover:text-primary"
      >
        <Home className="h-3.5 w-3.5" aria-hidden />
        Admin
      </Link>
      <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
      <Link href={routes.admin.barbers} className="hover:text-primary">
        Barbers
      </Link>
      <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
      <span className="truncate font-medium text-on-surface">
        {barber.name}
      </span>
    </nav>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-pulse">
      <div className="h-4 w-48 rounded bg-surface-container-high" />
      <div className="flex gap-4">
        <div className="h-24 w-24 rounded-xl bg-surface-container-high" />
        <div className="flex-1 space-y-2">
          <div className="h-8 w-64 rounded bg-surface-container-high" />
          <div className="h-4 w-40 rounded bg-surface-container-high" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-28 rounded-xl bg-surface-container-high" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-surface-container-high" />
    </div>
  );
}

export function ProfileAvatar({ barber }) {
  return (
    <div
      className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-outline-variant bg-primary/15 font-serif text-2xl font-bold text-primary"
      aria-hidden
    >
      {barber.initials}
    </div>
  );
}

export function EditBarberModal({ barber, onClose, onSave }) {
  const [form, setForm] = useState({
    name: barber.name,
    email: barber.email,
    phone: barber.phone,
    bio: barber.bio,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 350));
    onSave(form);
    setSaving(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-barber-title"
        className="w-full max-w-lg rounded-xl border border-outline-variant bg-surface-container-low p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2
            id="edit-barber-title"
            className="font-serif text-lg font-bold text-on-surface"
          >
            Edit barber
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-on-surface-variant hover:text-on-surface"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {[
            { key: "name", label: "Full name" },
            { key: "email", label: "Email", type: "email" },
            { key: "phone", label: "Phone" },
          ].map(({ key, label, type = "text" }) => (
            <label key={key} className="block">
              <span className="font-label-caps text-on-surface-variant">
                {label}
              </span>
              <input
                type={type}
                value={form[key]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value }))
                }
                className="mt-1.5 w-full rounded-md border border-outline-variant bg-surface-container px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </label>
          ))}
          <label className="block">
            <span className="font-label-caps text-on-surface-variant">Bio</span>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              className="mt-1.5 w-full resize-y rounded-md border border-outline-variant bg-surface-container px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </label>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-outline-variant px-4 py-2.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-on-primary hover:opacity-90 disabled:opacity-50"
            >
              {saving && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              )}
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
