"use client";

import { Search } from "lucide-react";
import { SidebarToggle } from "@/components/layout/sidebar/SidebarShell";
import NotificationBell from "@/components/layout/primitives/NotificationBell";
import UserMenu from "@/components/layout/primitives/UserMenu";
import { getNotificationsHref } from "@/config/routes/notificationRoutes";
import {
  getProfileHref,
  getSettingsHref,
} from "@/config/routes/profileRoutes.js";
import { useHeaderProfile } from "@/client/modules/shared/hooks/useHeaderProfile.js";
import { barberHook } from "@/client/modules/barber/hooks/barberQuery.jsx";

export default function DashboardTopbar({ role = "customer", actions }) {
  const notificationsHref = getNotificationsHref(role);
  const ProfileHref = getProfileHref(role);
  const SettingsHref = getSettingsHref(role);
  const profile = useHeaderProfile(role);
  const { data: barberUnread } = barberHook.Notifications.useUnreadNotificationCount({
    enabled: role === "barber",
    refetchInterval: 60_000,
  });

  const notificationCount =
    role === "barber" ? (barberUnread?.count ?? 0) : role === "customer" ? undefined : 0;

  const placeholder =
    role === "admin"
      ? "Search users, shops, reports…"
      : role === "barber"
        ? "Search clients or appointments…"
        : "Search shops, barbers, services…";

  return (
    <header
      className="flex shrink-0 items-center gap-3 border-b border-outline-variant bg-surface px-4 backdrop-blur md:px-6"
      style={{ height: "var(--header-height)" }}
    >
      <SidebarToggle />

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="search"
          placeholder={placeholder}
          className="h-10 w-full rounded-md border border-outline-variant bg-surface-container-low pl-9 pr-3 text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex-1 md:hidden" />

      <div className="ml-auto flex items-center gap-1 md:gap-2">
        {actions}
        <NotificationBell count={notificationCount ?? 0} href={notificationsHref} />
        <UserMenu
          {...profile}
          profileHref={ProfileHref}
          settingsHref={SettingsHref}
        />
      </div>
    </header>
  );
}
