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
import { STATUS_CONFIG } from "@/client/modules/admin/constants/barberConstants.js";
import { BarberStatusBadge } from "@/client/modules/shared/components/ui/badges.jsx";
import { formatShortDate } from "@/client/lib/format/formatDateTime.js";
import { getBarberStats } from "@/client/modules/admin/constants/adminConstants.js";
import Drawer from "@/client/modules/shared/components/ui/Drawer";

export default function ProfileDrawer({ barber, onClose, onAction }) {
  if (!barber) return null;
  const cfg = STATUS_CONFIG[barber.status] ?? STATUS_CONFIG.inactive;
  const barberStats = getBarberStats(barber);

  return (
    <Drawer
      open
      onClose={onClose}
      zIndex="z-40"
      panelClassName="scrollbar-thin border-outline-variant bg-surface-container-low w-full max-w-md overflow-y-auto"
    >
      {/* Drawer header */}
      <header className="border-outline-variant bg-surface-container-low/95 sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur">
        <div>
          <p className="font-label-caps text-primary">Admin · Barber Profile</p>
          <p className="text-on-surface-variant text-xs">ID: {barber.id}</p>
        </div>
        <button
          onClick={onClose}
          className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-9 w-9 items-center justify-center rounded-md"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </header>

      <div className="space-y-6 p-5">
        {/* Identity */}
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 text-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-serif text-xl font-bold">
            {barber.initials}
          </div>
          <div className="min-w-0">
            <h2 className="text-on-surface font-serif text-2xl font-bold">{barber.name}</h2>
            <p className="text-on-surface-variant mt-0.5 text-sm">
              {barber.experience} · Joined {formatShortDate(barber.joinedAt)}
            </p>
            <div className="mt-2">
              <BarberStatusBadge status={barber.status} />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="border-outline-variant bg-surface-container rounded-xl border px-4">
          {[
            { Icon: Mail, label: "Email", value: barber.email },
            { Icon: Phone, label: "Phone", value: barber.phone },
            { Icon: Store, label: "Shop", value: barber.shop.name },
            { Icon: MapPin, label: "Location", value: barber.shop.address },
          ].map(({ Icon, label, value }) => (
            <div
              key={label}
              className="border-outline-variant/60 flex items-start gap-3 border-b py-3 last:border-b-0"
            >
              <span className="bg-surface-container-high text-on-surface-variant mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="font-label-caps text-on-surface-variant">{label}</p>
                <p className="text-on-surface text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {barberStats.map(({ label, value, sub, Icon }) => (
            <div
              key={label}
              className="border-outline-variant bg-surface-container-low flex items-center gap-3 rounded-xl border p-3"
            >
              <span className="bg-primary/15 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="font-label-caps text-on-surface-variant">{label}</p>
                <p className="text-on-surface font-serif text-lg leading-tight font-bold">
                  {value}
                </p>
                <p className="text-on-surface-variant text-[10px]">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Specialties */}
        {barber.specialties.length > 0 && (
          <div>
            <p className="font-label-caps text-on-surface-variant mb-2">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {barber.specialties.map((s) => (
                <span
                  key={s}
                  className="border-outline-variant text-on-surface-variant rounded-full border px-3 py-1 text-xs"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="border-outline-variant space-y-2 border-t pt-4">
          <p className="font-label-caps text-on-surface-variant mb-3">Admin Actions</p>
          <button
            onClick={() => onAction("reviews", barber)}
            className="border-outline-variant text-on-surface hover:bg-surface-container flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors"
          >
            <MessageSquare className="text-primary h-4 w-4" aria-hidden />
            View Reviews
          </button>
          <button
            onClick={() => onAction("appointments", barber)}
            className="border-outline-variant text-on-surface hover:bg-surface-container flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors"
          >
            <CalendarCheck className="text-primary h-4 w-4" aria-hidden />
            View Appointments
          </button>
          {barber.status === "disabled" ? (
            <button
              onClick={() => onAction("enable", barber)}
              className="border-status-confirmed/30 bg-status-confirmed/8 text-status-confirmed hover:bg-status-confirmed/15 flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Re-enable Barber
            </button>
          ) : (
            <button
              onClick={() => onAction("disable", barber)}
              className="border-status-pending/30 bg-status-pending/8 text-status-pending hover:bg-status-pending/15 flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors"
            >
              <Ban className="h-4 w-4" aria-hidden />
              Disable Barber
            </button>
          )}
          <button
            onClick={() => onAction("delete", barber)}
            className="border-status-cancelled/30 bg-status-cancelled/8 text-status-cancelled hover:bg-status-cancelled/15 flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Delete Barber
          </button>
        </div>
      </div>
    </Drawer>
  );
}
