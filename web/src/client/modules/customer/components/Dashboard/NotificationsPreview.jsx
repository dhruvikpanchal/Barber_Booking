import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import { getNotificationDeepLink } from "@/config/routes/notificationRoutes";
import { TYPE_META } from "@/client/modules/customer/constants/notificationsConstants.js";

export default function NotificationsPreview({ notifications, unreadCount }) {
  return (
    <section
      className="border-outline-variant bg-surface-container-low rounded-xl border"
      aria-labelledby="notifications-preview-heading"
    >
      <div className="border-outline-variant flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="bg-primary/15 text-primary relative flex h-8 w-8 items-center justify-center rounded-lg">
            <Bell className="h-4 w-4" aria-hidden />
            {unreadCount > 0 ? (
              <span className="bg-primary text-on-primary absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </span>
          <h2
            id="notifications-preview-heading"
            className="text-on-surface font-serif text-base font-bold sm:text-lg"
          >
            Notifications
          </h2>
        </div>
        <Link
          href={routes.customer.notifications}
          className="text-primary inline-flex items-center gap-0.5 text-xs font-semibold hover:opacity-80"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      <ul className="divide-outline-variant divide-y">
        {notifications.map((notif) => {
          const meta = TYPE_META[notif.type];
          const Icon = meta?.icon;
          const href = getNotificationDeepLink(notif);

          return (
            <li key={notif.id}>
              <Link
                href={href}
                className={`group hover:bg-surface-container block px-4 py-3.5 transition-colors sm:px-5 ${
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
                        <span className="bg-primary h-1.5 w-1.5 rounded-full" aria-label="Unread" />
                      ) : null}
                      <span className="text-on-surface-variant text-[10px]">{notif.time}</span>
                    </div>
                    <p className="text-on-surface mt-0.5 line-clamp-2 text-sm leading-snug">
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
