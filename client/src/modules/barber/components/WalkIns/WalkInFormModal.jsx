"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { SERVICE_OPTIONS } from "@/data/barber/walkinsData.js";

export default function WalkInFormModal({
  open,
  form,
  errors,
  onChange,
  onClose,
  onSubmit,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add walk-in customer"
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-t-2xl border border-outline-variant bg-surface-container shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
          <div>
            <p className="font-label-caps text-primary">Walk-in</p>
            <h2 className="font-serif text-lg font-bold text-on-surface">
              Add to queue
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <form
          className="space-y-4 px-5 py-5"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Field label="Customer name" error={errors.name} required>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Marcus Bell"
              className="h-11 w-full rounded-md border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
            />
          </Field>

          <Field label="Phone (optional)" error={errors.phone}>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="+1 555 000 0000"
              className="h-11 w-full rounded-md border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Service" error={errors.service} required>
              <select
                value={form.service}
                onChange={(e) => {
                  const svc = SERVICE_OPTIONS.find(
                    (s) => s.name === e.target.value,
                  );
                  onChange({
                    service: e.target.value,
                    duration: svc ? String(svc.duration) : form.duration,
                  });
                }}
                className="h-11 w-full rounded-md border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="">Select service…</option>
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Duration (min)" error={errors.duration} required>
              <input
                type="number"
                min={5}
                step={5}
                value={form.duration}
                onChange={(e) => onChange({ duration: e.target.value })}
                className="h-11 w-full rounded-md border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </Field>
          </div>

          <Field label="Notes (optional)">
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              placeholder="Preferences, allergies, requests…"
              className="w-full rounded-md border border-outline-variant bg-surface-container-low px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
            />
          </Field>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-md border border-outline-variant px-4 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
            >
              Add to queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, required, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="font-label-caps flex items-center gap-1 text-on-surface-variant">
        {label}
        {required && <span className="text-primary">*</span>}
      </span>
      {children}
      {error && <span className="block text-xs text-error">{error}</span>}
    </label>
  );
}
