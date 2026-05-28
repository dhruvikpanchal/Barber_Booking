import { CheckCheck, Trash2, Clock, Scissors, MapPin } from "lucide-react";
import { TYPE_META } from "../../../../constants/barber/notifications.js";
import { Avatar, ActionButtons } from "./helpers.jsx";

export default function BookingCard({ notif, onAction, onRead, onDelete }) {
  const meta = TYPE_META.booking_request;
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
      {/* Unread dot */}
      {!notif.read && (
        <div
          className={`absolute top-4 right-4 w-2 h-2 rounded-full ${meta.dot}`}
        />
      )}

      <div className="p-4">
        {/* Top row */}
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
                {meta.label.toUpperCase()}
              </span>
              <span className="text-[10px] text-on-surface-variant">
                {notif.time}
              </span>
            </div>
            <p className="text-sm text-on-surface font-medium mt-0.5 leading-snug pr-6">
              {notif.message}
            </p>
          </div>
        </div>

        {/* Detail card */}
        <div className="mt-3 ml-11 rounded-md border border-outline-variant bg-surface-container-lowest p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Avatar initials={notif.avatar} size="sm" />
            <div>
              <p className="text-sm font-semibold text-on-surface">
                {notif.client}
              </p>
              <p className="text-xs text-on-surface-variant">{notif.service}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant pt-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary/60" />
              {notif.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-primary/60" />
              {notif.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary/60" />
              {notif.shop}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 ml-11 flex items-center justify-between flex-wrap gap-2">
          {notif.actionable ? (
            <ActionButtons
              id={notif.id}
              type="booking_request"
              onAction={onAction}
            />
          ) : (
            <span className="text-xs text-on-surface-variant italic">
              No action required
            </span>
          )}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!notif.read && (
              <button
                onClick={() => onRead(notif.id)}
                className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                title="Mark as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onDelete(notif.id)}
              className="p-1.5 rounded text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors"
              title="Dismiss"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
