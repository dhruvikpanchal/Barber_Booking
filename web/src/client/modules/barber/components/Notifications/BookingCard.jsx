import { CheckCheck, Trash2, Clock, Scissors, MapPin } from "lucide-react";
import { TYPE_META } from "../../constants/notifications.js";
import { InitialsAvatar } from "@/client/modules/shared/components/ui/InitialsAvatar.jsx";
import { ActionButtons } from "./helpers.jsx";

export default function BookingCard({ notif, onAction, onRead, onDelete }) {
  const meta = TYPE_META.booking_request;
  const Icon = meta.icon;
  return (
    <div
      className={`group relative rounded-lg border transition-all duration-200 ${
        notif.read
          ? "border-outline-variant bg-surface-container-low"
          : `border-l-2 ${meta.border} bg-surface-container`
      }`}
    >
      {/* Unread dot */}
      {!notif.read && <div className={`absolute top-4 right-4 h-2 w-2 rounded-full ${meta.dot}`} />}

      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start gap-3">
          <div
            className={`h-8 w-8 rounded-md ${meta.bg} border ${meta.border} flex shrink-0 items-center justify-center`}
          >
            <Icon className={`h-4 w-4 ${meta.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-semibold tracking-widest ${meta.color}`}>
                {meta.label.toUpperCase()}
              </span>
              <span className="text-on-surface-variant text-[10px]">{notif.time}</span>
            </div>
            <p className="text-on-surface mt-0.5 pr-6 text-sm leading-snug font-medium">
              {notif.message}
            </p>
          </div>
        </div>

        {/* Detail card */}
        <div className="border-outline-variant bg-surface-container-lowest mt-3 ml-11 space-y-2 rounded-md border p-3">
          <div className="flex items-center gap-2">
            <InitialsAvatar initials={notif.avatar} size="sm" />
            <div>
              <p className="text-on-surface text-sm font-semibold">{notif.client}</p>
              <p className="text-on-surface-variant text-xs">{notif.service}</p>
            </div>
          </div>
          <div className="text-on-surface-variant flex flex-wrap gap-3 pt-1 text-xs">
            <span className="flex items-center gap-1.5">
              <Clock className="text-primary/60 h-3.5 w-3.5" />
              {notif.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Scissors className="text-primary/60 h-3.5 w-3.5" />
              {notif.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="text-primary/60 h-3.5 w-3.5" />
              {notif.shop}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 ml-11 flex flex-wrap items-center justify-between gap-2">
          {notif.actionable ? (
            <ActionButtons id={notif.id} type="booking_request" onAction={onAction} />
          ) : (
            <span className="text-on-surface-variant text-xs italic">No action required</span>
          )}
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {!notif.read && (
              <button
                onClick={() => onRead(notif.id)}
                className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded p-1.5 transition-colors"
                title="Mark as read"
              >
                <CheckCheck className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => onDelete(notif.id)}
              className="text-on-surface-variant hover:text-error hover:bg-surface-container-high rounded p-1.5 transition-colors"
              title="Dismiss"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
