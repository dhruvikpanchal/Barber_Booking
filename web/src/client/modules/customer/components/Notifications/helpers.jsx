"use client";

import Link from "@/lib/AppLink";
import { CheckCheck, Trash2, ChevronRight } from "lucide-react";

export { InitialsAvatar as BarberAvatar } from "@/client/modules/shared/components/ui/InitialsAvatar.jsx";

export function CardActions({ notif, onRead, onDelete }) {
  return (
    <div className="flex items-center gap-1 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
      {!notif.read && (
        <button
          type="button"
          onClick={() => onRead(notif.id)}
          className="rounded p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
          title="Mark as read"
        >
          <CheckCheck className="h-3.5 w-3.5" />
        </button>
      )}
      <button
        type="button"
        onClick={() => onDelete(notif.id)}
        className="rounded p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error"
        title="Dismiss"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ViewLink({ href, label = "View details" }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-opacity hover:opacity-75"
    >
      {label}
      <ChevronRight className="h-3.5 w-3.5" />
    </Link>
  );
}
