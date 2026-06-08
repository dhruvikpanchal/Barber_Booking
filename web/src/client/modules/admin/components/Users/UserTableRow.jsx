import { Eye } from "lucide-react";
import ActionsMenu from "./ActionsMenu.jsx";
import { USER_STATUS_CONFIG } from "@/modules/admin/constants/admin.js";
import { ActivityBadge, UserStatusBadge } from "@/client/modules/admin/helpers/badges.jsx";
import { formatRelativeAge } from "@/client/lib/format/formatDateTime.js";
import { StarRow } from "@/client/modules/shared/components/ui/StarRow.jsx";

export default function UserTableRow({ user, onAction }) {
  return (
    <tr className="border-outline-variant/60 hover:bg-surface-container/50 border-b transition-colors last:border-b-0">
      {/* Identity */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-primary/20 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-serif text-sm font-bold">
              {user.initials}
            </div>
            <span
              className={`border-surface-container-low absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 ${USER_STATUS_CONFIG[user.status]?.dot ?? "bg-outline"}`}
            />
          </div>
          <div className="min-w-0">
            <p className="text-on-surface truncate font-semibold">{user.name}</p>
            <p className="text-on-surface-variant truncate text-xs">{user.email}</p>
          </div>
        </div>
      </td>
      {/* Activity */}
      <td className="px-4 py-4">
        <ActivityBadge level={user.activity} />
        <p className="text-on-surface-variant mt-1 text-xs">{formatRelativeAge(user.lastActive)}</p>
      </td>
      {/* Bookings */}
      <td className="px-4 py-4">
        <p className="text-on-surface font-semibold">{user.bookingsTotal}</p>
        <p className="text-on-surface-variant text-xs">{user.bookingsThisMonth} this month</p>
      </td>
      {/* Reviews */}
      <td className="hidden px-4 py-4 lg:table-cell">
        <p className="text-on-surface font-semibold">{user.reviewsGiven}</p>
        <div className="mt-0.5">
          <StarRow rating={user.avgRatingGiven} />
        </div>
      </td>
      {/* Spent */}
      <td className="hidden px-4 py-4 xl:table-cell">
        <p className="text-on-surface font-semibold">${user.totalSpent.toLocaleString()}</p>
        <p className="text-on-surface-variant text-xs">lifetime</p>
      </td>
      {/* Status */}
      <td className="px-4 py-4">
        <UserStatusBadge status={user.status} />
      </td>
      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onAction("view", user)}
            className="border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" aria-hidden />
          </button>
          <ActionsMenu user={user} onAction={onAction} />
        </div>
      </td>
    </tr>
  );
}
