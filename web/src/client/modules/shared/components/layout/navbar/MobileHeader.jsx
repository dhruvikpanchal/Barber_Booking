"use client";

import Logo from "@/components/layout/primitives/Logo";
import NotificationBell from "@/components/layout/primitives/NotificationBell";
import UserMenu from "@/components/layout/primitives/UserMenu";
import { getNotificationsHref } from "@/config/routes/notificationRoutes";
import {
  getProfileHref,
  getSettingsHref,
} from "@/config/routes/profileRoutes.js";
import { useHeaderProfile } from "@/client/modules/shared/hooks/useHeaderProfile.js";
import { barberHook } from "@/client/modules/barber/hooks/barberQuery.jsx";

export default function MobileHeader({ role = "customer" }) {
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

  return (
    <header
      className="flex shrink-0 items-center justify-between gap-2 border-b border-outline-variant bg-surface px-4 backdrop-blur md:hidden"
      style={{ height: "var(--header-height)" }}
    >
      <Logo />
      <div className="flex items-center gap-1">
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
