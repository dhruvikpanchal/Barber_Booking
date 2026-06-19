"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/layout/sidebar/SidebarShell";
import DashboardHeader from "@/components/layout/navbar/DashboardHeader";
import ProfileHydrator from "@/client/modules/shared/components/auth/ProfileHydrator.jsx";
import AdminNavSeenHydrator from "@/client/modules/shared/components/auth/AdminNavSeenHydrator.jsx";
import BarberNavSeenHydrator from "@/client/modules/shared/components/auth/BarberNavSeenHydrator.jsx";
import NotificationUnreadHydrator from "@/client/modules/shared/components/auth/NotificationUnreadHydrator.jsx";

/**
 * Generic dashboard shell shared by Customer, Barber, Admin.
 * Headers stay in the flex column (never scroll); only `<main>` scrolls.
 */
export default function AppShell({
  role = "customer",
  sidebar,
  bottomNav,
  topbarActions,
  children,
}) {
  const mainRef = useRef(null);
  const pathname = usePathname();

  // Client navigations reuse the same <main> node — reset scroll so headers
  // are not pushed out of view (contact message detail was affected).
  useLayoutEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    main.scrollTop = 0;
    main.scrollLeft = 0;
  }, [pathname]);

  return (
    <SidebarProvider storageKey={`io.sidebar.${role}`}>
      <ProfileHydrator role={role} />
      <AdminNavSeenHydrator role={role} />
      <BarberNavSeenHydrator role={role} />
      <NotificationUnreadHydrator role={role} />
      <div className="app-dashboard-root flex h-dvh w-full overflow-hidden bg-background text-on-surface">
        {sidebar}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div
            className="relative z-50 shrink-0 bg-surface"
            style={{ minHeight: "var(--header-height)" }}
          >
            <DashboardHeader role={role} actions={topbarActions} />
          </div>
          <main
            ref={mainRef}
            className="scrollbar-thin relative z-0 min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8"
            style={{ paddingBottom: "calc(var(--bottom-nav-height) + 1rem)" }}
          >
            {children}
          </main>
        </div>
        {bottomNav}
      </div>
    </SidebarProvider>
  );
}
