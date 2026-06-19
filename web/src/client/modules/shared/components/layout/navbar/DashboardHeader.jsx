"use client";

import Logo from "@/components/layout/primitives/Logo";
import { SidebarToggle } from "@/components/layout/sidebar/SidebarShell";
import NotificationBell from "@/components/layout/primitives/NotificationBell";
import UserMenu from "@/components/layout/primitives/UserMenu";
import { getNotificationsHref } from "@/config/routes/notificationRoutes";
import {
  getProfileHref,
  getSettingsHref,
} from "@/config/routes/profileRoutes.js";
import { useHeaderProfile } from "@/client/modules/shared/hooks/useHeaderProfile.js";
import { useDashboardUnreadCount } from "@/client/modules/shared/hooks/useDashboardUnreadCount.js";

export default function DashboardHeader({ role = "customer", actions }) {
  const notificationsHref = getNotificationsHref(role);
  const profileHref = getProfileHref(role);
  const settingsHref = getSettingsHref(role);
  const profile = useHeaderProfile(role);
  const notificationCount = useDashboardUnreadCount(role);

  return (
    <header
      className="flex shrink-0 items-center gap-3 border-b border-outline-variant bg-surface px-4 backdrop-blur md:px-6"
      style={{ height: "var(--header-height)" }}
    >
      <SidebarToggle />
      <div className="md:hidden">
        <Logo />
      </div>
      <div className="min-w-0 flex-1" />
      <div className="flex items-center gap-1 md:gap-2">
        {actions}
        <NotificationBell count={notificationCount ?? 0} href={notificationsHref} />
        <UserMenu
          {...profile}
          profileHref={profileHref}
          settingsHref={settingsHref}
        />
      </div>
    </header>
  );
}
