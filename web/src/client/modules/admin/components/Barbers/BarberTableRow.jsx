import { Scissors, Star, MapPin, Eye } from "lucide-react";
import { BarberStatusBadge } from "@/client/modules/admin/helpers/badges.jsx";
import ActionsMenu from "./ActionsMenu.jsx";

export default function BarberTableRow({ barber, onAction }) {
  return (
    <tr className="border-b border-outline-variant/60 transition-colors hover:bg-surface-container/50 last:border-b-0">
      {/* Barber identity */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 font-serif text-sm font-bold text-primary">
            {barber.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-on-surface">
              {barber.name}
            </p>
            <p className="truncate text-xs text-on-surface-variant">
              {barber.email}
            </p>
          </div>
        </div>
      </td>
      {/* Shop */}
      <td className="px-4 py-4">
        <p className="truncate text-sm font-medium text-on-surface">
          {barber.shop.name}
        </p>
        <p className="flex items-center gap-1 truncate text-xs text-on-surface-variant">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden />
          {barber.shop.city}
        </p>
      </td>
      {/* Rating */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-primary text-primary" aria-hidden />
          <span className="font-semibold text-on-surface">
            {barber.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-on-surface-variant">
          {barber.reviewCount} reviews
        </p>
      </td>
      {/* Services */}
      <td className="hidden px-4 py-4 lg:table-cell">
        <div className="flex items-center gap-1.5">
          <Scissors
            className="h-3.5 w-3.5 text-on-surface-variant"
            aria-hidden
          />
          <span className="text-sm text-on-surface">
            {barber.servicesCount}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-on-surface-variant">
          {barber.appointmentsThisMonth} this month
        </p>
      </td>
      {/* Status */}
      <td className="px-4 py-4">
        <BarberStatusBadge status={barber.status} />
      </td>
      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-1.5 flex-wrap">
          <button
            onClick={() => onAction("view", barber)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
            title="View Profile"
          >
            <Eye className="h-4 w-4" aria-hidden />
          </button>
          <ActionsMenu barber={barber} onAction={onAction} />
        </div>
      </td>
    </tr>
  );
}
