import { Sparkles, CheckCheck, Trash2 } from "lucide-react";
import { TYPE_META } from "../../constants/notifications.js";
import { InitialsAvatar } from "@/client/modules/shared/components/ui/InitialsAvatar.jsx";
import { Badge } from "./helpers.jsx";

export default function CancellationCard({ notif, onRead, onDelete }) {
  const meta = TYPE_META.cancellation;
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
                CANCELLATION
              </span>
              <Badge
                label={notif.cancelledBy === "client" ? "By Client" : "Auto · No-show"}
                color={notif.cancelledBy === "client" ? "cancelled" : "pending"}
              />
              <span className="text-on-surface-variant text-[10px]">{notif.time}</span>
            </div>
            <p className="text-on-surface mt-0.5 pr-6 text-sm font-medium">{notif.message}</p>
          </div>
        </div>

        {/* Detail strip */}
        <div className="border-outline-variant bg-surface-container-lowest mt-3 ml-11 rounded-md border p-3">
          <div className="mb-2 flex items-center gap-2">
            <InitialsAvatar initials={notif.avatar} size="sm" />
            <div>
              <p className="text-on-surface decoration-status-cancelled/60 text-status-cancelled/80 text-sm font-semibold line-through">
                {notif.client}
              </p>
              <p className="text-on-surface-variant text-xs">
                {notif.service} · {notif.date}
              </p>
            </div>
          </div>
          {notif.reason && (
            <div className="mt-1 flex items-start gap-1.5">
              <span className="text-on-surface-variant text-[10px]">Reason:</span>
              <span className="text-on-surface-variant text-[10px] italic">"{notif.reason}"</span>
            </div>
          )}
          {/* Slot hint */}
          <div className="text-primary mt-2 flex w-fit cursor-pointer items-center gap-1.5 text-[11px] font-medium transition hover:opacity-70">
            <Sparkles className="h-3 w-3" /> Slot is now open — fill it?
          </div>
        </div>

        <div className="mt-3 ml-11 flex justify-end">
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
