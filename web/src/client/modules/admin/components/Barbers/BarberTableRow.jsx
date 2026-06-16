import { Scissors, Star, MapPin, Eye } from "lucide-react";
import { BarberStatusBadge } from "@/client/modules/shared/components/ui/badges.jsx";
import ActionsMenu from "./ActionsMenu.jsx";

export default function BarberTableRow({ barber, onAction }) {
  return (
    <tr className="border-outline-variant/60 hover:bg-surface-container/50 border-b transition-colors last:border-b-0">
      {/* Barber identity */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-serif text-sm font-bold">
            {barber.initials}
          </div>
          <div className="min-w-0">
            <p className="text-on-surface truncate font-semibold">{barber.name}</p>
            <p className="text-on-surface-variant truncate text-xs">{barber.email}</p>
          </div>
        </div>
      </td>
      {/* Shop */}
      <td className="px-4 py-4">
        <p className="text-on-surface truncate text-sm font-medium">{barber.shop.name}</p>
        <p className="text-on-surface-variant flex items-center gap-1 truncate text-xs">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden />
          {barber.shop.city}
        </p>
      </td>
      {/* Rating */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <Star className="fill-primary text-primary h-4 w-4" aria-hidden />
          <span className="text-on-surface font-semibold">{barber.rating.toFixed(1)}</span>
        </div>
        <p className="text-on-surface-variant mt-0.5 text-xs">{barber.reviewCount} reviews</p>
      </td>
      {/* Services */}
      <td className="hidden px-4 py-4 lg:table-cell">
        <div className="flex items-center gap-1.5">
          <Scissors className="text-on-surface-variant h-3.5 w-3.5" aria-hidden />
          <span className="text-on-surface text-sm">{barber.servicesCount}</span>
        </div>
        <p className="text-on-surface-variant mt-0.5 text-xs">
          {barber.appointmentsThisMonth} this month
        </p>
      </td>
      {/* Status */}
      <td className="px-4 py-4">
        <BarberStatusBadge status={barber.status} />
      </td>
      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <button
            onClick={() => onAction("view", barber)}
            className="border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
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
