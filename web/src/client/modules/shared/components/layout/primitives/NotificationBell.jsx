import Link from "@/lib/AppLink";
import { Bell } from "lucide-react";
import NavBadge from "@/client/modules/shared/components/layout/primitives/NavBadge.jsx";

export default function NotificationBell({ count = 0, href = "#" }) {
  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={`Notifications${count ? `, ${count} unread` : ""}`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
    >
      <span className="relative">
        <Bell className="h-5 w-5" aria-hidden />
        <NavBadge count={count} compact className="right-0 top-0 translate-x-1/2 -translate-y-1/2 ring-surface" />
      </span>
    </Link>
  );
}
