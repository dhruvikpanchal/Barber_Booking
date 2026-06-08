"use client";

import { X } from "lucide-react";
import { Field } from "@/client/modules/shared/components/forms/FormPrimitives.jsx";
import Modal from "@/client/modules/shared/components/ui/Modal";

const SERVICES = [
  { label: "Signature Cut", duration: 45 },
  { label: "Skin Fade", duration: 40 },
  { label: "Beard Sculpt", duration: 25 },
  { label: "Hot Towel Shave", duration: 30 },
  { label: "Kids Cut", duration: 25 },
];

const EMPTY = {
  name: "",
  phone: "",
  service: "",
  duration: "",
  source: "walk-in",
  notes: "",
};

export { EMPTY as EMPTY_FORM };

export default function AddToQueueModal({ open, form, errors, onChange, onClose, onSubmit }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      backdropClassName="bg-black/50"
      className="rounded-t-2xl sm:rounded-2xl"
      panelClassName="overflow-hidden border border-outline-variant bg-surface-container shadow-2xl"
    >
        <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
          <div>
            <p className="font-label-caps text-primary">New entry</p>
            <h2 className="font-serif text-lg font-bold text-on-surface">
              Add to queue
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "walk-in", label: "Walk-in" },
              { key: "online", label: "Online" },
            ].map((opt) => {
              const active = form.source === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onChange({ source: opt.key })}
                  className={`h-10 rounded-md border text-sm font-semibold transition-colors ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-outline-variant text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <Field label="Customer name" error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Marcus Bell"
              className="input"
            />
          </Field>

          <Field label="Phone (optional)">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="+1 555 000 0000"
              className="input"
            />
          </Field>

          <Field label="Service" error={errors.service}>
            <select
              value={form.service}
              onChange={(e) => {
                const svc = SERVICES.find((s) => s.label === e.target.value);
                onChange({
                  service: e.target.value,
                  duration: svc ? String(svc.duration) : form.duration,
                });
              }}
              className="input"
            >
              <option value="">Select a service</option>
              {SERVICES.map((s) => (
                <option key={s.label} value={s.label}>
                  {s.label} · {s.duration}m
                </option>
              ))}
            </select>
          </Field>

          <Field label="Estimated duration (min)" error={errors.duration}>
            <input
              type="number"
              min="5"
              value={form.duration}
              onChange={(e) => onChange({ duration: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="Notes (optional)">
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              placeholder="Anything the barber should know"
              className="input resize-none"
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-outline-variant bg-surface-container-low px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-outline-variant px-4 text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="h-10 rounded-md bg-primary px-5 text-sm font-semibold text-on-primary hover:opacity-90"
          >
            Add to queue
          </button>
        </div>

      <style jsx>{`
        .input {
          width: 100%;
          height: 2.5rem;
          border-radius: 0.375rem;
          border: 1px solid var(--color-outline-variant);
          background: var(--color-surface-container-low);
          padding: 0 0.75rem;
          font-size: 0.875rem;
          color: var(--color-on-surface);
          outline: none;
        }
        .input:focus {
          border-color: var(--color-primary);
        }
        textarea.input {
          padding: 0.5rem 0.75rem;
          height: auto;
        }
      `}</style>
    </Modal>
  );
}
