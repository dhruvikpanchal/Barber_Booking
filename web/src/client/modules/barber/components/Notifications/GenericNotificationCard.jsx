import { Bell } from "lucide-react";
import { TYPE_META } from "@/client/modules/barber/constants/notificationsConstants.js";
import { ViewDetailsLink } from "./helpers.jsx";

export default function GenericNotificationCard({ notif, onNavigate, onRead, onDelete, disabled }) {
  const meta = TYPE_META[notif.type] ?? {
    icon: Bell,
    color: "text-on-surface-variant",
    bg: "bg-surface-container-high",
    border: "border-outline-variant",
    dot: "bg-primary",
  };
  const Icon = meta.icon ?? Bell;

  return (
    <div
      className={`group relative rounded-lg border transition-all duration-200 ${
        notif.read
          ? "border-outline-variant bg-surface-container-low"
          : `border-l-2 ${meta.border ?? "border-primary/20"} bg-surface-container`
      }`}
    >
      {!notif.read && (
        <div
          className={`absolute top-4 right-4 h-2 w-2 rounded-full ${meta.dot ?? "bg-primary"}`}
        />
      )}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${meta.bg ?? "bg-surface-container-high"} ${meta.border ?? "border-outline-variant"}`}
          >
            <Icon className={`h-4 w-4 ${meta.color ?? "text-on-surface-variant"}`} aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[10px] font-semibold tracking-widest ${meta.color ?? "text-on-surface-variant"}`}
              >
                {(notif.title ?? "Notification").toUpperCase()}
              </span>
              <span className="text-on-surface-variant text-[10px]">{notif.time}</span>
            </div>
            <p className="text-on-surface mt-0.5 pr-6 text-sm font-medium">{notif.message}</p>
          </div>
        </div>

        <div className="mt-3 ml-11 flex flex-wrap items-center justify-between gap-2">
          <ViewDetailsLink notif={notif} onNavigate={onNavigate} disabled={disabled} />
        </div>
      </div>
    </div>
  );
}
