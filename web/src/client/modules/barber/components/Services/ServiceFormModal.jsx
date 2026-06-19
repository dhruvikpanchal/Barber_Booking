import { Clock, Save, X, IndianRupee } from "lucide-react";
import { Field, INPUT_CLASS } from "@/client/modules/shared/components/forms/FormPrimitives.jsx";
import Modal from "@/client/modules/shared/components/ui/Modal";

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
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      zIndex="z-[60]"
      labelledBy="service-form-title"
      backdropClassName="bg-black/70"
      panelClassName="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low shadow-2xl"
    >
      <div className="border-outline-variant flex items-center justify-between border-b px-5 py-4">
        <h2 id="service-form-title" className="text-on-surface font-serif text-lg font-bold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface inline-flex h-9 w-9 items-center justify-center rounded-md"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="scrollbar-thin max-h-[min(70vh,32rem)] space-y-4 overflow-y-auto p-5"
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
            <span className="text-error mt-1 block text-xs">{errors.name}</span>
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
          <Field label="Price (INR)">
            <div className="relative">
              <IndianRupee
                className="text-on-surface-variant pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
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
              <span className="text-error mt-1 block text-xs">{errors.price}</span>
            ) : null}
          </Field>

          <Field label="Duration (min)">
            <div className="relative">
              <Clock
                className="text-on-surface-variant pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
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
              <span className="text-error mt-1 block text-xs">{errors.duration}</span>
            ) : null}
          </Field>
        </div>

        <label className="border-outline-variant bg-surface-container flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => onChange({ active: e.target.checked })}
            className="border-outline-variant accent-primary h-4 w-4 rounded"
          />
          <span>
            <span className="text-on-surface block text-sm font-medium">Available for booking</span>
            <span className="text-on-surface-variant block text-xs">
              Turn off to hide without deleting the service.
            </span>
          </span>
        </label>

        <div className="border-outline-variant flex gap-3 border-t pt-4">
          <button
            type="button"
            onClick={onClose}
            className="border-outline-variant text-on-surface hover:border-primary hover:text-primary h-10 flex-1 rounded-md border text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary text-on-primary inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
          >
            <Save className="h-4 w-4" aria-hidden />
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  );
}
