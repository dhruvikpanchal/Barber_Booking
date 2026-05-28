import Link from "next/link";
import { Bell } from "lucide-react";

export default function NotificationBell({ count = 0, href = "#" }) {
  return (
    <Link
      href={href}
      aria-label={`Notifications${count ? `, ${count} unread` : ""}`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
    >
      <Bell className="h-5 w-5" aria-hidden />
      {count > 0 ? (
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-surface" />
      ) : null}
    </Link>
  );
}
