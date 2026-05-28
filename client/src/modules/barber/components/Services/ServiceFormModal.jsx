import { Clock, DollarSign, Save, X } from "lucide-react";

const INPUT_CLASS =
  "h-10 w-full rounded-md border border-outline-variant bg-surface-container px-3 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none";

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="font-label-caps mb-1.5 block text-on-surface-variant">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1 block text-xs text-on-surface-variant">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export default function ServiceFormModal({
  open,
  title,
  form,
  errors,
  onChange,
  onClose,
  onSubmit,
  submitLabel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden overscroll-contain">
      <div className="flex min-h-full items-center justify-center p-4">
        <button
          type="button"
          className="absolute inset-0 bg-black/70"
          aria-label="Close dialog"
          onClick={onClose}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-form-title"
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low shadow-2xl"
        >
        <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
          <h2
            id="service-form-title"
            className="font-serif text-lg font-bold text-on-surface"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="max-h-[min(70vh,32rem)] space-y-4 overflow-y-auto p-5 scrollbar-thin"
        >
          <Field label="Service name">
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="e.g. Signature Cut"
              className={INPUT_CLASS}
            />
            {errors.name ? (
              <span className="mt-1 block text-xs text-error">
                {errors.name}
              </span>
            ) : null}
          </Field>

          <Field label="Description" hint="Shown to clients when booking.">
            <textarea
              value={form.description}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={3}
              placeholder="What is included in this service?"
              className={`${INPUT_CLASS} min-h-22 resize-y py-2.5`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (USD)">
              <div className="relative">
                <DollarSign
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
                  aria-hidden
                />
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(e) => onChange({ price: e.target.value })}
                  placeholder="45"
                  className={`${INPUT_CLASS} pl-9`}
                />
              </div>
              {errors.price ? (
                <span className="mt-1 block text-xs text-error">
                  {errors.price}
                </span>
              ) : null}
            </Field>

            <Field label="Duration (min)">
              <div className="relative">
                <Clock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
                  aria-hidden
                />
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={form.duration}
                  onChange={(e) => onChange({ duration: e.target.value })}
                  placeholder="45"
                  className={`${INPUT_CLASS} pl-9`}
                />
              </div>
              {errors.duration ? (
                <span className="mt-1 block text-xs text-error">
                  {errors.duration}
                </span>
              ) : null}
            </Field>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-outline-variant bg-surface-container px-4 py-3">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => onChange({ active: e.target.checked })}
              className="h-4 w-4 rounded border-outline-variant accent-primary"
            />
            <span>
              <span className="block text-sm font-medium text-on-surface">
                Available for booking
              </span>
              <span className="block text-xs text-on-surface-variant">
                Turn off to hide without deleting the service.
              </span>
            </span>
          </label>

          <div className="flex gap-3 border-t border-outline-variant pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-10 flex-1 rounded-md border border-outline-variant text-sm font-medium text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
            >
              <Save className="h-4 w-4" aria-hidden />
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}
