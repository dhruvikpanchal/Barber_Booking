import { CheckCheck, Trash2 } from "lucide-react";
import {
  formatTimestamp,
  fullTimestamp,
  TypeBadge,
} from "@/modules/admin/components/Notifications/Primitives.jsx";
import { NOTIFICATION_VARIANT_CONFIG } from "@/client/modules/admin/constants/adminConstants.js";

export function NotificationCard({ notification, onMarkRead, onDelete, busy = false }) {
  const cfg =
    NOTIFICATION_VARIANT_CONFIG[notification.variant] ?? NOTIFICATION_VARIANT_CONFIG.system_info;
  const Icon = cfg.Icon;
  const isUnread = !notification.read;

  return (
    <li
      className={[
        "group relative flex gap-3 rounded-xl border px-4 py-3.5 transition-colors sm:gap-4 sm:px-5 sm:py-4",
        isUnread
          ? "border-outline bg-surface-container"
          : "border-outline-variant bg-surface-container-low hover:bg-surface-container",
      ].join(" ")}
    >
      {isUnread && (
        <span
          className={`absolute top-4 bottom-4 left-0 w-[3px] rounded-full ${cfg.dot}`}
          aria-hidden
        />
      )}

      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${cfg.accent} mt-0.5`}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm leading-snug font-semibold text-on-surface">{notification.title}</p>
            {isUnread && (
              <span className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" aria-label="Unread" />
            )}
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <span
              className="text-on-surface-variant text-[11px]"
              title={fullTimestamp(notification.timestamp)}
            >
              {formatTimestamp(notification.timestamp)}
            </span>
          </div>
        </div>

        <p className="text-on-surface-variant mt-1 line-clamp-2 text-xs leading-relaxed">
          {notification.body}
        </p>

        <div className="mt-2.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <TypeBadge variant={notification.variant} />

          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            {isUnread && (
              <button
                type="button"
                onClick={() => onMarkRead(notification.id)}
                disabled={busy}
                title="Mark as read"
                className="border-outline-variant bg-surface-container text-on-surface-variant hover:border-primary/40 hover:bg-primary/8 hover:text-primary focus-visible:ring-primary/60 inline-flex h-8 items-center gap-1 rounded-md border px-2.5 text-[11px] font-medium transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCheck className="h-3 w-3" aria-hidden />
                Mark read
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              disabled={busy}
              title="Dismiss notification"
              className="border-outline-variant bg-surface-container text-on-surface-variant hover:border-status-cancelled/40 hover:bg-status-cancelled/8 hover:text-status-cancelled focus-visible:ring-status-cancelled/40 inline-flex h-8 items-center gap-1 rounded-md border px-2.5 text-[11px] font-medium transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-3 w-3" aria-hidden />
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
