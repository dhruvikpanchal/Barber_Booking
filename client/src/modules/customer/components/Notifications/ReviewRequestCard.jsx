import { TYPE_META } from "@/constants/customer/notifications.js";
import { getNotificationDeepLink } from "@/config/routes/notificationRoutes";
import { BarberAvatar, CardActions, ViewLink } from "./helpers.jsx";

export default function ReviewRequestCard({ notif, onRead, onDelete }) {
  const meta = TYPE_META.review_request;
  const Icon = meta.icon;
  const href = getNotificationDeepLink(notif);

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
          className={`absolute right-4 top-4 h-2 w-2 rounded-full ${meta.dot}`}
        />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${meta.border} ${meta.bg}`}
          >
            <Icon className={`h-4 w-4 ${meta.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[10px] font-semibold tracking-widest ${meta.color}`}
              >
                {meta.label.toUpperCase()}
              </span>
              <span className="text-[10px] text-on-surface-variant">
                {notif.time}
              </span>
            </div>
            <p className="mt-0.5 pr-6 text-sm font-medium leading-snug text-on-surface">
              {notif.message}
            </p>
          </div>
        </div>

        <div className="ml-11 mt-3 rounded-md border border-outline-variant bg-surface-container-lowest p-3">
          <div className="flex items-center gap-2">
            <BarberAvatar initials={notif.barber.initials} size="sm" />
            <div>
              <p className="text-sm font-semibold text-on-surface">
                {notif.barber.name}
              </p>
              <p className="text-xs text-on-surface-variant">
                {notif.service} · completed {notif.completedAt}
              </p>
            </div>
          </div>
        </div>

        <div className="ml-11 mt-3 flex flex-wrap items-center justify-between gap-2">
          <ViewLink href={href} label="Leave a review" />
          <CardActions notif={notif} onRead={onRead} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}
