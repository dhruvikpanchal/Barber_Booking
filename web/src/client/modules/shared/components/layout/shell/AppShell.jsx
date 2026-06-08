"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/layout/sidebar/SidebarShell";
import DashboardTopbar from "@/components/layout/navbar/DashboardTopbar";
import MobileHeader from "@/components/layout/navbar/MobileHeader";

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
      <div className="app-dashboard-root flex h-dvh w-full overflow-hidden bg-background text-on-surface">
        {sidebar}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div
            className="relative z-50 hidden shrink-0 bg-surface md:block"
            style={{ minHeight: "var(--header-height)" }}
          >
            <DashboardTopbar role={role} actions={topbarActions} />
          </div>
          <div
            className="relative z-50 shrink-0 bg-surface md:hidden"
            style={{ minHeight: "var(--header-height)" }}
          >
            <MobileHeader role={role} />
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
