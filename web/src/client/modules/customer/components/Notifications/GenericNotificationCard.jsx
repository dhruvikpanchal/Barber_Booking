import { Bell } from "lucide-react";
import { getNotificationDeepLink } from "@/config/routes/notificationRoutes";
import { CardActions, ViewLink } from "./helpers.jsx";

export default function GenericNotificationCard({ notif, onRead, onDelete }) {
  const href = getNotificationDeepLink(notif);

  return (
    <div
      className={`group relative rounded-lg border transition-all duration-200 ${
        notif.read
          ? "border-outline-variant bg-surface-container-low"
          : "border-primary/20 bg-surface-container border-l-2"
      }`}
    >
      {!notif.read && (
        <div className="bg-primary absolute top-4 right-4 h-2 w-2 rounded-full" />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="border-outline-variant bg-surface-container-high flex h-8 w-8 shrink-0 items-center justify-center rounded-md border">
            <Bell className="text-on-surface-variant h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-on-surface-variant text-[10px] font-semibold tracking-widest">
                {(notif.title ?? "NOTIFICATION").toUpperCase()}
              </span>
              <span className="text-on-surface-variant text-[10px]">{notif.time}</span>
            </div>
            <p className="text-on-surface mt-0.5 pr-6 text-sm leading-snug font-medium">
              {notif.message}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pl-11">
          {href ? <ViewLink href={href} /> : <span />}
          <CardActions notif={notif} onRead={onRead} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}
