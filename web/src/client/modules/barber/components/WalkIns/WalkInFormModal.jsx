"use client";

import { X } from "lucide-react";
import Modal from "@/client/modules/shared/components/ui/Modal";
import { Field } from "@/client/modules/shared/components/forms/FormPrimitives.jsx";

export default function WalkInFormModal({
  open,
  form,
  errors,
  services = [],
  onChange,
  onClose,
  onSubmit,
  disabled = false,
}) {
  const hasServices = services.length > 0;

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
            disabled={disabled}
            className="border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary h-11 w-full rounded-md border px-3 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </Field>

        <Field label="Phone (optional)" error={errors.phone}>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+1 555 000 0000"
            disabled={disabled}
            className="border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary h-11 w-full rounded-md border px-3 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Service" error={errors.service} required>
            {hasServices ? (
              <select
                value={form.service}
                onChange={(e) => {
                  const svc = services.find((s) => s.name === e.target.value);
                  onChange({
                    service: e.target.value,
                    duration: svc ? String(svc.duration) : form.duration,
                  });
                }}
                disabled={disabled}
                className="border-outline-variant bg-surface-container-low text-on-surface focus:border-primary h-11 w-full rounded-md border px-3 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select service…</option>
                {services.map((s) => (
                  <option key={s.id ?? s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="border-outline-variant bg-surface-container-low text-on-surface-variant rounded-md border px-3 py-2.5 text-sm">
                No services available. Please add a service first.
              </p>
            )}
          </Field>
          <Field label="Duration (min)" error={errors.duration} required>
            <input
              type="number"
              min={5}
              step={5}
              value={form.duration}
              onChange={(e) => onChange({ duration: e.target.value })}
              disabled={disabled || !hasServices}
              className="border-outline-variant bg-surface-container-low text-on-surface focus:border-primary h-11 w-full rounded-md border px-3 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </Field>
        </div>

        <Field label="Notes (optional)">
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Preferences, allergies, requests…"
            disabled={disabled}
            className="border-outline-variant bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
            disabled={disabled || !hasServices}
            className="bg-primary text-on-primary inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add to queue
          </button>
        </div>
      </form>
    </Modal>
  );
}
