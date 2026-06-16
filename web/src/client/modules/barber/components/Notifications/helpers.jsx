import { ArrowRight } from "lucide-react";
import { getNotificationActionLabel } from "@/client/modules/barber/helpers/notificationNavigation.js";

export function Badge({ label, color = "primary" }) {
  const styles = {
    primary: "bg-primary/10 text-primary border-primary/20",
    pending:
      "bg-status-pending/10 text-status-pending border-status-pending/20",
    cancelled:
      "bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20",
    confirmed:
      "bg-status-confirmed/10 text-status-confirmed border-status-confirmed/20",
    yellow: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold tracking-wide ${styles[color]}`}
    >
      {label}
    </span>
  );
}

export function ViewDetailsLink({ notif, onNavigate, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      disabled={disabled}
      className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {getNotificationActionLabel(notif)}
      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
    </button>
  );
}
