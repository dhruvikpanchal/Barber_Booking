import Logo from "@/components/layout/primitives/Logo";
import NotificationBell from "@/components/layout/primitives/NotificationBell";
import UserMenu from "@/components/layout/primitives/UserMenu";
import { getNotificationsHref } from "@/config/routes/notificationRoutes";
import {
  getProfileHref,
  getSettingsHref,
} from "@/config/routes/profileRoutes.js";

export default function MobileHeader({ role = "customer" }) {
  const notificationsHref = getNotificationsHref(role);
  const ProfileHref = getProfileHref(role);
  const SettingsHref = getSettingsHref(role);

  const profile =
    role === "admin"
      ? { name: "Admin", initials: "A", email: "admin@ironandoak.app" }
      : role === "barber"
        ? { name: "Marco D.", initials: "M", email: "marco@ironandoak.app" }
        : { name: "Alex K.", initials: "A", email: "alex@ironandoak.app" };

  return (
    <header
      className="flex shrink-0 items-center justify-between gap-2 border-b border-outline-variant bg-surface px-4 backdrop-blur md:hidden"
      style={{ height: "var(--header-height)" }}
    >
      <Logo />
      <div className="flex items-center gap-1">
        <NotificationBell count={3} href={notificationsHref} />
        <UserMenu
          {...profile}
          profileHref={ProfileHref}
          settingsHref={SettingsHref}
        />
      </div>
    </header>
  );
}
