"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Home, Loader2, X } from "lucide-react";
import Modal from "@/client/modules/shared/components/ui/Modal";
import { routes } from "@/config/routes/routes.js";
import { ACCOUNT_STATUS_CONFIG } from "@/client/modules/admin/constants/barberDetailConstants.js";

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

export { default as SectionCard } from "@/client/modules/shared/components/ui/SectionCard";

export function DetailRow({ label, value, icon: Icon }) {
  if (value == null || value === "") return null;
  return (
    <div className="border-outline-variant/60 flex items-start gap-3 border-b py-3.5 last:border-b-0">
      {Icon && (
        <span className="bg-surface-container text-on-surface-variant mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-label-caps text-on-surface-variant text-[11px]">{label}</p>
        <p className="text-on-surface mt-0.5 text-sm break-words">{value}</p>
      </div>
    </div>
  );
}

export function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className="border-outline-variant bg-surface-container rounded-xl border p-4">
      <div className="flex items-start justify-between gap-2">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            accent ?? "bg-primary/15 text-primary"
          }`}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <p className="text-on-surface mt-3 font-serif text-2xl font-bold">{value}</p>
      <p className="text-on-surface mt-0.5 text-xs font-semibold">{label}</p>
      {sub && <p className="text-on-surface-variant mt-0.5 text-[11px]">{sub}</p>}
    </div>
  );
}

export function Breadcrumb({ barber }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-on-surface-variant flex flex-wrap items-center gap-1.5 text-xs"
    >
      <Link
        href={routes.admin.dashboard}
        className="hover:text-primary inline-flex items-center gap-1"
      >
        <Home className="h-3.5 w-3.5" aria-hidden />
        Admin
      </Link>
      <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
      <Link href={routes.admin.barbers} className="hover:text-primary">
        Barbers
      </Link>
      <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
      <span className="text-on-surface truncate font-medium">{barber.name}</span>
    </nav>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-6">
      <div className="bg-surface-container-high h-4 w-48 rounded" />
      <div className="flex gap-4">
        <div className="bg-surface-container-high h-24 w-24 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="bg-surface-container-high h-8 w-64 rounded" />
          <div className="bg-surface-container-high h-4 w-40 rounded" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-surface-container-high h-28 rounded-xl" />
        ))}
      </div>
      <div className="bg-surface-container-high h-64 rounded-xl" />
    </div>
  );
}

export function ProfileAvatar({ barber }) {
  return (
    <div
      className="border-outline-variant bg-primary/15 text-primary flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border font-serif text-2xl font-bold"
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
    <Modal
      open={Boolean(barber)}
      onClose={onClose}
      size="lg"
      zIndex="z-[60]"
      labelledBy="edit-barber-title"
      panelClassName="border-outline-variant bg-surface-container-low rounded-xl border p-6 shadow-2xl"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 id="edit-barber-title" className="text-on-surface font-serif text-lg font-bold">
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
            <span className="font-label-caps text-on-surface-variant">{label}</span>
            <input
              type={type}
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="border-outline-variant bg-surface-container text-on-surface focus:border-primary mt-1.5 w-full rounded-md border px-3 py-2.5 text-sm focus:outline-none"
            />
          </label>
        ))}
        <label className="block">
          <span className="font-label-caps text-on-surface-variant">Bio</span>
          <textarea
            rows={3}
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            className="border-outline-variant bg-surface-container text-on-surface focus:border-primary mt-1.5 w-full resize-y rounded-md border px-3 py-2.5 text-sm focus:outline-none"
          />
        </label>
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-md border px-4 py-2.5 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-on-primary inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Save changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
