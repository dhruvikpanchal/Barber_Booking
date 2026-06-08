"use client";

import { Check, Eye, MapPin, X } from "lucide-react";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { BARBER_REQUEST_STATUSES } from "@/modules/admin/constants/admin.js";

function RequestActions({
  request,
  onApprove,
  onReject,
  onView,
  iconOnly = false,
}) {
  const base =
    "inline-flex items-center justify-center rounded-md text-xs font-semibold transition-colors disabled:opacity-40";
  const sized = iconOnly ? "h-8 w-8" : "h-8 gap-1.5 px-2.5";

  return (
    <div
      className="flex shrink-0 items-center gap-1 flex-row sm:flex-col w-full"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {request.status === "pending" && (
        <>
          <button
            type="button"
            onClick={() => onApprove(request.id)}
            title="Approve"
            className={`${base} ${sized} bg-primary w-full text-on-primary hover:opacity-90`}
          >
            <Check className="h-3.5 w-3.5" aria-hidden />
            {!iconOnly && <span>Approve</span>}
          </button>
          <button
            type="button"
            onClick={() => onReject(request)}
            title="Reject"
            className={`${base} ${sized} border border-outline-variant w-full text-on-surface-variant hover:border-status-cancelled/50 hover:text-status-cancelled`}
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            {!iconOnly && <span>Reject</span>}
          </button>
        </>
      )}
      <button
        type="button"
        onClick={() => onView(request)}
        title="View details"
        className={`${base} ${sized} border border-outline-variant w-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface`}
      >
        <Eye className="h-3.5 w-3.5" aria-hidden />
        {!iconOnly && <span>View</span>}
      </button>
    </div>
  );
}

/** Compact row — same fields on all breakpoints; full data lives on the detail page. */
export function RequestTableRow({ request, onApprove, onReject, onView }) {
  return (
    <tr
      className="cursor-pointer border-t border-outline-variant transition-colors hover:bg-surface-container/40"
      onClick={() => onView(request)}
    >
      <td className="px-4 py-3 md:px-5">
        <p className="truncate text-sm font-semibold text-on-surface">
          {request.shopName}
        </p>
        <p className="mt-0.5 truncate text-xs text-on-surface-variant">
          #{request.id}
        </p>
      </td>
      <td className="hidden px-4 py-3 text-sm text-on-surface sm:table-cell">
        <span className="line-clamp-1">{request.ownerName}</span>
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex max-w-full items-center gap-1 truncate text-xs text-on-surface sm:text-sm">
          <MapPin
            className="hidden h-3.5 w-3.5 shrink-0 text-on-surface-variant sm:inline"
            aria-hidden
          />
          <span className="truncate">{request.city}</span>
        </span>
        <p className="mt-0.5 truncate text-xs text-on-surface-variant sm:hidden">
          {request.ownerName}
        </p>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={request.status} config={BARBER_REQUEST_STATUSES} />
      </td>
      <td className="px-4 py-3 md:px-5">
        <div className="flex justify-end">
          <RequestActions
            request={request}
            onApprove={onApprove}
            onReject={onReject}
            onView={onView}
          />
        </div>
      </td>
    </tr>
  );
}

/** Mobile list item — mirrors table columns (shop, owner, city, status, actions). */
export function RequestCard({ request, onApprove, onReject, onView }) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onView(request)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView(request);
        }
      }}
      className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2.5 transition-colors hover:bg-surface-container/60"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-on-surface">
            {request.shopName}
          </p>
          <p className="mt-0.5 truncate text-xs text-on-surface-variant">
            {request.ownerName} · {request.city}
          </p>
        </div>
        <StatusBadge status={request.status} config={BARBER_REQUEST_STATUSES} />
      </div>
      <div className="mt-2 flex justify-end border-t border-outline-variant/60 pt-2">
        <RequestActions
          request={request}
          onApprove={onApprove}
          onReject={onReject}
          onView={onView}
          iconOnly
        />
      </div>
    </article>
  );
}
