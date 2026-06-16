import { ArrowRight } from "lucide-react";
import { TYPE_META } from "@/client/modules/customer/constants/notificationsConstants.js";
import { getNotificationDeepLink } from "@/config/routes/notificationRoutes";
import { BarberAvatar, CardActions, ViewLink } from "./helpers.jsx";

export default function ServiceChangeCard({ notif, onRead, onDelete }) {
  const meta = TYPE_META.service_change;
  const Icon = meta.icon;
  const href = getNotificationDeepLink(notif);
  const accepted = notif.outcome === "accepted";

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
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${meta.border} ${meta.bg}`}
          >
            <Icon className={`h-4 w-4 ${meta.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-semibold tracking-widest ${meta.color}`}>
                {accepted ? "CHANGE APPROVED" : "CHANGE DECLINED"}
              </span>
              <span className="text-on-surface-variant text-[10px]">{notif.time}</span>
            </div>
            <p className="text-on-surface mt-0.5 pr-6 text-sm leading-snug font-medium">
              {notif.message}
            </p>
          </div>
        </div>

        <div className="border-outline-variant bg-surface-container-lowest mt-3 ml-11 space-y-3 rounded-md border p-3">
          <div className="flex items-center gap-2">
            <BarberAvatar initials={notif.barber.initials} size="sm" />
            <p className="text-on-surface text-sm font-semibold">{notif.barber.name}</p>
          </div>
          <div className="text-on-surface-variant flex flex-wrap items-center gap-2 text-xs">
            <span className="border-outline-variant bg-surface-container rounded border px-2 py-1">
              {notif.previousServices}
            </span>
            <ArrowRight className="text-primary/60 h-3.5 w-3.5 shrink-0" />
            <span
              className={`rounded border px-2 py-1 ${
                accepted
                  ? "border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed"
                  : "border-outline-variant bg-surface-container line-through opacity-70"
              }`}
            >
              {notif.updatedServices}
            </span>
          </div>
        </div>

        <div className="mt-3 ml-11 flex flex-wrap items-center justify-between gap-2">
          <ViewLink href={href} label="View appointment" />
          <CardActions notif={notif} onRead={onRead} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}
