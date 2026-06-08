import { TYPE_META } from "@/modules/customer/constants/notifications.js";
import { BarberAvatar, CardActions } from "./helpers.jsx";

export default function PromotionCard({ notif, onRead, onDelete }) {
  const meta = TYPE_META.promotion;
  const Icon = meta.icon;

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
                {meta.label.toUpperCase()}
              </span>
              <span className="text-on-surface-variant text-[10px]">{notif.time}</span>
            </div>
            <p className="text-on-surface mt-0.5 pr-6 text-sm font-semibold">{notif.title}</p>
            <p className="text-on-surface-variant mt-1 text-sm leading-snug">{notif.message}</p>
          </div>
        </div>

        {notif.barber && (
          <div className="border-outline-variant bg-surface-container-lowest mt-3 ml-11 flex items-center gap-2 rounded-md border p-3">
            <BarberAvatar initials={notif.barber.initials} size="sm" />
            <p className="text-on-surface text-sm">{notif.barber.name}</p>
          </div>
        )}

        <div className="mt-3 ml-11 flex justify-end">
          <CardActions notif={notif} onRead={onRead} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
}
