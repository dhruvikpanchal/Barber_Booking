import { AlertTriangle, ShieldCheck, Ban, Trash2 } from "lucide-react";

export default function ConfirmModal({
  open,
  variant,
  user,
  onClose,
  onConfirm,
}) {
  if (!open || !user) return null;

  const configs = {
    disable: {
      icon: Ban,
      iconBg: "bg-status-pending/15 text-status-pending",
      title: `Disable ${user.name}?`,
      body: "This user will lose access to booking and platform features. You can re-enable their account at any time.",
      confirmLabel: "Disable User",
      confirmClass: "bg-status-pending text-background hover:opacity-90",
      warning: null,
    },
    enable: {
      icon: ShieldCheck,
      iconBg: "bg-status-confirmed/15 text-status-confirmed",
      title: `Re-enable ${user.name}?`,
      body: "This will restore full platform access and allow the user to book appointments again.",
      confirmLabel: "Re-enable User",
      confirmClass: "bg-status-confirmed text-background hover:opacity-90",
      warning: null,
    },
    delete: {
      icon: Trash2,
      iconBg: "bg-status-cancelled/15 text-status-cancelled",
      title: `Delete ${user.name}?`,
      body: "All profile data, booking history, and reviews submitted by this user will be permanently removed. This cannot be undone.",
      confirmLabel: "Delete Permanently",
      confirmClass: "bg-status-cancelled text-on-error hover:opacity-90",
      warning:
        "This will permanently erase all data including booking history and reviews. Export any necessary records before continuing.",
    },
  };

  const cfg = configs[variant];
  if (!cfg) return null;
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
        {cfg.warning && (
          <div className="flex items-start gap-2.5 rounded-lg border border-status-cancelled/25 bg-status-cancelled/8 px-4 py-3">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-status-cancelled"
              aria-hidden
            />
            <p className="text-xs text-on-surface-variant">{cfg.warning}</p>
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
              onConfirm(user.id, variant);
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
