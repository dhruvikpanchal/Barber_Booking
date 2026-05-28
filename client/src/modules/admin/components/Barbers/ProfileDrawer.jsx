import {
  MapPin,
  Store,
  Ban,
  Trash2,
  MessageSquare,
  CalendarCheck,
  X,
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { STATUS_CONFIG } from "../../../../data/admin/barberData.js";
import { StatusBadge, formatDate } from "./helpers.jsx";
import { getBarberStats } from "@/constants/admin/admin.js";

export default function ProfileDrawer({ barber, onClose, onAction }) {
  if (!barber) return null;
  const cfg = STATUS_CONFIG[barber.status] ?? STATUS_CONFIG.inactive;
  const barberStats = getBarberStats(barber);

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-black/60"
      onClick={onClose}
    >
      <aside
        className="scrollbar-thin h-full w-full max-w-md overflow-y-auto border-l border-outline-variant bg-surface-container-low shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-outline-variant bg-surface-container-low/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="font-label-caps text-primary">
              Admin · Barber Profile
            </p>
            <p className="text-xs text-on-surface-variant">ID: {barber.id}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="space-y-6 p-5">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/20 font-serif text-xl font-bold text-primary">
              {barber.initials}
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                {barber.name}
              </h2>
              <p className="mt-0.5 text-sm text-on-surface-variant">
                {barber.experience} · Joined {formatDate(barber.joinedAt)}
              </p>
              <div className="mt-2">
                <StatusBadge status={barber.status} />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-xl border border-outline-variant bg-surface-container px-4">
            {[
              { Icon: Mail, label: "Email", value: barber.email },
              { Icon: Phone, label: "Phone", value: barber.phone },
              { Icon: Store, label: "Shop", value: barber.shop.name },
              { Icon: MapPin, label: "Location", value: barber.shop.address },
            ].map(({ Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 border-b border-outline-variant/60 py-3 last:border-b-0"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-container-high text-on-surface-variant">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="font-label-caps text-on-surface-variant">
                    {label}
                  </p>
                  <p className="text-sm text-on-surface">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {barberStats.map(({ label, value, sub, Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low p-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="font-label-caps text-on-surface-variant">
                    {label}
                  </p>
                  <p className="font-serif text-lg font-bold leading-tight text-on-surface">
                    {value}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Specialties */}
          {barber.specialties.length > 0 && (
            <div>
              <p className="font-label-caps mb-2 text-on-surface-variant">
                Specialties
              </p>
              <div className="flex flex-wrap gap-2">
                {barber.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-outline-variant px-3 py-1 text-xs text-on-surface-variant"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 border-t border-outline-variant pt-4">
            <p className="font-label-caps mb-3 text-on-surface-variant">
              Admin Actions
            </p>
            <button
              onClick={() => onAction("reviews", barber)}
              className="flex w-full items-center gap-3 rounded-lg border border-outline-variant px-4 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
            >
              <MessageSquare className="h-4 w-4 text-primary" aria-hidden />
              View Reviews
            </button>
            <button
              onClick={() => onAction("appointments", barber)}
              className="flex w-full items-center gap-3 rounded-lg border border-outline-variant px-4 py-3 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
            >
              <CalendarCheck className="h-4 w-4 text-primary" aria-hidden />
              View Appointments
            </button>
            {barber.status === "disabled" ? (
              <button
                onClick={() => onAction("enable", barber)}
                className="flex w-full items-center gap-3 rounded-lg border border-status-confirmed/30 bg-status-confirmed/8 px-4 py-3 text-sm font-medium text-status-confirmed transition-colors hover:bg-status-confirmed/15"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden />
                Re-enable Barber
              </button>
            ) : (
              <button
                onClick={() => onAction("disable", barber)}
                className="flex w-full items-center gap-3 rounded-lg border border-status-pending/30 bg-status-pending/8 px-4 py-3 text-sm font-medium text-status-pending transition-colors hover:bg-status-pending/15"
              >
                <Ban className="h-4 w-4" aria-hidden />
                Disable Barber
              </button>
            )}
            <button
              onClick={() => onAction("delete", barber)}
              className="flex w-full items-center gap-3 rounded-lg border border-status-cancelled/30 bg-status-cancelled/8 px-4 py-3 text-sm font-medium text-status-cancelled transition-colors hover:bg-status-cancelled/15"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Delete Barber
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
