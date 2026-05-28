import { Sparkles, CheckCheck, Trash2 } from "lucide-react";
import { TYPE_META } from "../../../../constants/barber/notifications.js";
import { Avatar, Badge } from "./helpers.jsx";

export default function CancellationCard({ notif, onRead, onDelete }) {
  const meta = TYPE_META.cancellation;
  const Icon = meta.icon;
  return (
    <div
      className={`group relative rounded-lg border transition-all duration-200
        ${
          notif.read
            ? "border-outline-variant bg-surface-container-low"
            : `border-l-2 ${meta.border} bg-surface-container`
        }`}
    >
      {!notif.read && (
        <div
          className={`absolute top-4 right-4 w-2 h-2 rounded-full ${meta.dot}`}
        />
      )}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-8 h-8 rounded-md ${meta.bg} border ${meta.border} flex items-center justify-center shrink-0`}
          >
            <Icon className={`w-4 h-4 ${meta.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-semibold tracking-widest ${meta.color}`}
              >
                CANCELLATION
              </span>
              <Badge
                label={
                  notif.cancelledBy === "client"
                    ? "By Client"
                    : "Auto · No-show"
                }
                color={notif.cancelledBy === "client" ? "cancelled" : "pending"}
              />
              <span className="text-[10px] text-on-surface-variant">
                {notif.time}
              </span>
            </div>
            <p className="text-sm text-on-surface font-medium mt-0.5 pr-6">
              {notif.message}
            </p>
          </div>
        </div>

        {/* Detail strip */}
        <div className="mt-3 ml-11 rounded-md border border-outline-variant bg-surface-container-lowest p-3">
          <div className="flex items-center gap-2 mb-2">
            <Avatar initials={notif.avatar} size="sm" />
            <div>
              <p className="text-sm font-semibold text-on-surface line-through decoration-status-cancelled/60 text-status-cancelled/80">
                {notif.client}
              </p>
              <p className="text-xs text-on-surface-variant">
                {notif.service} · {notif.date}
              </p>
            </div>
          </div>
          {notif.reason && (
            <div className="flex items-start gap-1.5 mt-1">
              <span className="text-[10px] text-on-surface-variant">
                Reason:
              </span>
              <span className="text-[10px] text-on-surface-variant italic">
                "{notif.reason}"
              </span>
            </div>
          )}
          {/* Slot hint */}
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-primary font-medium cursor-pointer hover:opacity-70 transition w-fit">
            <Sparkles className="w-3 h-3" /> Slot is now open — fill it?
          </div>
        </div>

        <div className="mt-3 ml-11 flex justify-end">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!notif.read && (
              <button
                onClick={() => onRead(notif.id)}
                className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onDelete(notif.id)}
              className="p-1.5 rounded text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
