import { AlertTriangle } from "lucide-react";
import { getBarberStatusConfig } from "@/client/modules/admin/constants/adminConstants.js";
import Modal from "@/client/modules/shared/components/ui/Modal";

export default function ConfirmModal({ open, variant, barber, onClose, onConfirm }) {
  if (!barber) return null;

  const cfg = getBarberStatusConfig(barber)[variant];
  const Icon = cfg.icon;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      panelClassName="border-outline-variant bg-surface-container space-y-5 rounded-xl border p-6 shadow-2xl"
    >
      <div className="flex items-start gap-4">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cfg.iconBg}`}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-on-surface font-serif text-lg font-bold">{cfg.title}</h3>
          <p className="text-on-surface-variant mt-1.5 text-sm leading-relaxed">{cfg.body}</p>
        </div>
      </div>
      {variant === "delete" && (
        <div className="border-status-cancelled/25 bg-status-cancelled/8 flex items-start gap-2.5 rounded-lg border px-4 py-3">
          <AlertTriangle className="text-status-cancelled mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p className="text-on-surface-variant text-xs">
            This deactivates the barber account. Profile and appointment history remain in the
            system and can be restored by re-enabling the account.
          </p>
        </div>
      )}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="border-outline-variant text-on-surface-variant hover:bg-surface-container-high flex-1 rounded-md border py-2.5 text-sm font-medium transition-colors"
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
    </Modal>
  );
}
