import { AlertTriangle } from "lucide-react";
import { getBarberStatusConfig } from "@/constants/admin/admin.js";

export default function ConfirmModal({
  open,
  variant,
  barber,
  onClose,
  onConfirm,
}) {
  if (!open || !barber) return null;

  const cfg = getBarberStatusConfig(barber)[variant];
  const Icon = cfg.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md space-y-5 rounded-xl border border-outline-variant bg-surface-container p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cfg.iconBg}`}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h3 className="font-serif text-lg font-bold text-on-surface">
              {cfg.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
              {cfg.body}
            </p>
          </div>
        </div>
        {variant === "delete" && (
          <div className="flex items-start gap-2.5 rounded-lg border border-status-cancelled/25 bg-status-cancelled/8 px-4 py-3">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-status-cancelled"
              aria-hidden
            />
            <p className="text-xs text-on-surface-variant">
              This will permanently erase all data. Please make sure you have
              exported any necessary records before continuing.
            </p>
          </div>
        )}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-outline-variant py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(barber.id, variant);
              onClose();
            }}
            className={`flex-1 rounded-md py-2.5 text-sm font-semibold transition-all ${cfg.confirmClass}`}
          >
            {cfg.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
