"use client";

import { X } from "lucide-react";
import Modal from "@/client/modules/shared/components/ui/Modal";
import { SERVICE_OPTIONS } from "@/modules/barber/data/walkinsData.js";
import { Field } from "@/client/modules/shared/components/forms/FormPrimitives.jsx";

export default function WalkInFormModal({ open, form, errors, onChange, onClose, onSubmit }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      backdropClassName="bg-background/70 backdrop-blur-sm"
      className="rounded-t-2xl sm:rounded-2xl"
      panelClassName="border-outline-variant bg-surface-container border shadow-2xl"
      labelledBy="walk-in-form-title"
    >
        <div className="border-outline-variant flex items-center justify-between border-b px-5 py-4">
          <div>
            <p className="font-label-caps text-primary">Walk-in</p>
            <h2 className="text-on-surface font-serif text-lg font-bold">Add to queue</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex h-9 w-9 items-center justify-center rounded-md transition-colors"
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
              className="border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary h-11 w-full rounded-md border px-3 text-sm focus:outline-none"
            />
          </Field>

          <Field label="Phone (optional)" error={errors.phone}>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="+1 555 000 0000"
              className="border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary h-11 w-full rounded-md border px-3 text-sm focus:outline-none"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Service" error={errors.service} required>
              <select
                value={form.service}
                onChange={(e) => {
                  const svc = SERVICE_OPTIONS.find((s) => s.name === e.target.value);
                  onChange({
                    service: e.target.value,
                    duration: svc ? String(svc.duration) : form.duration,
                  });
                }}
                className="border-outline-variant bg-surface-container-low text-on-surface focus:border-primary h-11 w-full rounded-md border px-3 text-sm focus:outline-none"
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
                className="border-outline-variant bg-surface-container-low text-on-surface focus:border-primary h-11 w-full rounded-md border px-3 text-sm focus:outline-none"
              />
            </Field>
          </div>

          <Field label="Notes (optional)">
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              placeholder="Preferences, allergies, requests…"
              className="border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
            />
          </Field>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface inline-flex h-11 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-on-primary inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              Add to queue
            </button>
          </div>
        </form>
    </Modal>
  );
}
