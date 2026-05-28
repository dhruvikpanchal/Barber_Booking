import { useEffect } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteConfirmModal({ service, onConfirm, onCancel }) {
  useEffect(() => {
    if (service) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [service]);

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden overscroll-contain">
      <div className="flex min-h-full items-center justify-center p-4">
        <button
          type="button"
          className="absolute inset-0 bg-black/70"
          aria-label="Close dialog"
          onClick={onCancel}
        />

        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-service-title"
          aria-describedby="delete-service-desc"
          className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low shadow-2xl"
        >
          <div className="border-b border-outline-variant px-5 py-4">
            <h2
              id="delete-service-title"
              className="font-serif text-lg font-bold text-on-surface"
            >
              Delete service?
            </h2>
          </div>

          <div className="space-y-4 px-5 py-5">
            <p
              id="delete-service-desc"
              className="text-sm leading-relaxed text-on-surface-variant"
            >
              <span className="font-medium text-on-surface">
                &ldquo;{service.name}&rdquo;
              </span>{" "}
              will be removed from your menu. Clients will no longer be able to
              book it. This cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="h-10 flex-1 rounded-md border border-outline-variant text-sm font-medium text-on-surface transition-colors hover:border-primary hover:text-primary"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-error text-sm font-semibold text-on-error transition-opacity hover:opacity-90"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
