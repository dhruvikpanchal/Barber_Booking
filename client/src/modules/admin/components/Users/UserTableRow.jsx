import { Eye } from "lucide-react";
import ActionsMenu from "./ActionsMenu.jsx";
import { USER_STATUS_CONFIG } from "@/constants/admin/admin.js";
import {
  fmtRelative,
  StatusBadge,
  ActivityBadge,
  MiniStars,
} from "./helpers.jsx";

export default function UserTableRow({ user, onAction }) {
  return (
    <tr className="border-b border-outline-variant/60 transition-colors hover:bg-surface-container/50 last:border-b-0">
      {/* Identity */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 font-serif text-sm font-bold text-primary">
              {user.initials}
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface-container-low ${USER_STATUS_CONFIG[user.status]?.dot ?? "bg-outline"}`}
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-on-surface">
              {user.name}
            </p>
            <p className="truncate text-xs text-on-surface-variant">
              {user.email}
            </p>
          </div>
        </div>
      </td>
      {/* Activity */}
      <td className="px-4 py-4">
        <ActivityBadge level={user.activity} />
        <p className="mt-1 text-xs text-on-surface-variant">
          {fmtRelative(user.lastActive)}
        </p>
      </td>
      {/* Bookings */}
      <td className="px-4 py-4">
        <p className="font-semibold text-on-surface">{user.bookingsTotal}</p>
        <p className="text-xs text-on-surface-variant">
          {user.bookingsThisMonth} this month
        </p>
      </td>
      {/* Reviews */}
      <td className="hidden px-4 py-4 lg:table-cell">
        <p className="font-semibold text-on-surface">{user.reviewsGiven}</p>
        <div className="mt-0.5">
          <MiniStars rating={user.avgRatingGiven} />
        </div>
      </td>
      {/* Spent */}
      <td className="hidden px-4 py-4 xl:table-cell">
        <p className="font-semibold text-on-surface">
          ${user.totalSpent.toLocaleString()}
        </p>
        <p className="text-xs text-on-surface-variant">lifetime</p>
      </td>
      {/* Status */}
      <td className="px-4 py-4">
        <StatusBadge status={user.status} />
      </td>
      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onAction("view", user)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
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
