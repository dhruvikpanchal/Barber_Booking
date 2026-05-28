import { CheckCheck, Trash2, Clock, ArrowRight } from "lucide-react";
import { TYPE_META } from "../../../../constants/barber/notifications.js";
import { Avatar, Badge, ActionButtons } from "./helpers.jsx";

export default function ModificationCard({
  notif,
  onAction,
  onRead,
  onDelete,
}) {
  const meta = TYPE_META.modification;
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
                MODIFICATION REQUEST
              </span>
              <span className="text-[10px] text-on-surface-variant">
                {notif.time}
              </span>
            </div>
            <p className="text-sm text-on-surface font-medium mt-0.5 pr-6">
              {notif.message}
            </p>
          </div>
        </div>

        {/* Time change visual */}
        <div className="mt-3 ml-11 rounded-md border border-outline-variant bg-surface-container-lowest p-3">
          <div className="flex items-center gap-2 mb-2">
            <Avatar initials={notif.avatar} size="sm" />
            <div>
              <p className="text-sm font-semibold text-on-surface">
                {notif.client}
              </p>
              <p className="text-xs text-on-surface-variant">{notif.service}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <div
              className="flex items-center gap-1.5 rounded bg-status-cancelled/10 border border-status-cancelled/20
                px-2.5 py-1.5 text-xs text-status-cancelled line-through decoration-status-cancelled/60"
            >
              <Clock className="w-3 h-3" /> {notif.oldDate}
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
            <div
              className="flex items-center gap-1.5 rounded bg-status-confirmed/10 border border-status-confirmed/20
                px-2.5 py-1.5 text-xs text-status-confirmed"
            >
              <Clock className="w-3 h-3" /> {notif.newDate}
            </div>
          </div>
          {notif.reason && (
            <p className="mt-2 text-[11px] text-on-surface-variant italic">
              Reason: "{notif.reason}"
            </p>
          )}
        </div>

        <div className="mt-3 ml-11 flex items-center justify-between flex-wrap gap-2">
          {notif.actionable ? (
            <ActionButtons
              id={notif.id}
              type="modification"
              onAction={onAction}
            />
          ) : (
            <Badge label="Resolved" color="confirmed" />
          )}
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
