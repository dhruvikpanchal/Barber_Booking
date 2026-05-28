import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import { getNotificationDeepLink } from "@/config/routes/notificationRoutes";
import { TYPE_META } from "@/constants/customer/notifications.js";

/**
 * @param {{ notifications: typeof import('@/data/customer/notificationsData.js').INITIAL_NOTIFICATIONS, unreadCount: number }} props
 */
export default function NotificationsPreview({ notifications, unreadCount }) {
  return (
    <section
      className="rounded-xl border border-outline-variant bg-surface-container-low"
      aria-labelledby="notifications-preview-heading"
    >
      <div className="flex items-center justify-between gap-3 border-b border-outline-variant px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Bell className="h-4 w-4" aria-hidden />
            {unreadCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-on-primary">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </span>
          <h2
            id="notifications-preview-heading"
            className="font-serif text-base font-bold text-on-surface sm:text-lg"
          >
            Notifications
          </h2>
        </div>
        <Link
          href={routes.customer.notifications}
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:opacity-80"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      <ul className="divide-y divide-outline-variant">
        {notifications.map((notif) => {
          const meta = TYPE_META[notif.type];
          const Icon = meta?.icon;
          const href = getNotificationDeepLink(notif);

          return (
            <li key={notif.id}>
              <Link
                href={href}
                className={`group block px-4 py-3.5 transition-colors hover:bg-surface-container sm:px-5 ${
                  !notif.read ? "bg-surface-container/50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {Icon ? (
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${meta.border} ${meta.bg}`}
                    >
                      <Icon className={`h-4 w-4 ${meta.color}`} aria-hidden />
                    </span>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold tracking-widest ${meta?.color ?? "text-on-surface-variant"}`}
                      >
                        {(meta?.label ?? notif.type).toUpperCase()}
                      </span>
                      {!notif.read ? (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-primary"
                          aria-label="Unread"
                        />
                      ) : null}
                      <span className="text-[10px] text-on-surface-variant">
                        {notif.time}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-on-surface">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
