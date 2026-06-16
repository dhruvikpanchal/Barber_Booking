import { CheckCheck, Trash2, Clock, ArrowRight } from "lucide-react";
import { TYPE_META } from "../../constants/notificationsConstants.js";
import { InitialsAvatar } from "@/client/modules/shared/components/ui/InitialsAvatar.jsx";
import { ViewDetailsLink } from "./helpers.jsx";

export default function ModificationCard({ notif, onNavigate, onRead, onDelete, disabled }) {
  const meta = TYPE_META.modification;
  const Icon = meta.icon;
  return (
    <div
      className={`group relative rounded-lg border transition-all duration-200 ${
        notif.read
          ? "border-outline-variant bg-surface-container-low"
          : `border-l-2 ${meta.border} bg-surface-container`
      }`}
    >
      {!notif.read && <div className={`absolute top-4 right-4 h-2 w-2 rounded-full ${meta.dot}`} />}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`h-8 w-8 rounded-md ${meta.bg} border ${meta.border} flex shrink-0 items-center justify-center`}
          >
            <Icon className={`h-4 w-4 ${meta.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-semibold tracking-widest ${meta.color}`}>
                MODIFICATION REQUEST
              </span>
              <span className="text-on-surface-variant text-[10px]">{notif.time}</span>
            </div>
            <p className="text-on-surface mt-0.5 pr-6 text-sm font-medium">{notif.message}</p>
          </div>
        </div>

        {/* Time change visual */}
        <div className="border-outline-variant bg-surface-container-lowest mt-3 ml-11 rounded-md border p-3">
          <div className="mb-2 flex items-center gap-2">
            <InitialsAvatar initials={notif.avatar} size="sm" />
            <div>
              <p className="text-on-surface text-sm font-semibold">{notif.client}</p>
              <p className="text-on-surface-variant text-xs">{notif.service}</p>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="bg-status-cancelled/10 border-status-cancelled/20 text-status-cancelled decoration-status-cancelled/60 flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs line-through">
              <Clock className="h-3 w-3" /> {notif.oldDate}
            </div>
            <ArrowRight className="text-on-surface-variant h-3.5 w-3.5 shrink-0" />
            <div className="bg-status-confirmed/10 border-status-confirmed/20 text-status-confirmed flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs">
              <Clock className="h-3 w-3" /> {notif.newDate}
            </div>
          </div>
          {notif.reason && (
            <p className="text-on-surface-variant mt-2 text-[11px] italic">
              Reason: "{notif.reason}"
            </p>
          )}
        </div>

        <div className="mt-3 ml-11 flex flex-wrap items-center justify-between gap-2">
          <ViewDetailsLink notif={notif} onNavigate={onNavigate} disabled={disabled} />
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {!notif.read && (
              <button
                onClick={() => onRead(notif.id)}
                className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded p-1.5 transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => onDelete(notif.id)}
              className="text-on-surface-variant hover:text-error hover:bg-surface-container-high rounded p-1.5 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
