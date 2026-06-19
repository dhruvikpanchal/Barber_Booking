"use client";

import {
  CalendarDays,
  CalendarPlus,
  Heart,
  LayoutDashboard,
  Star,
} from "lucide-react";
import SidebarShell from "./SidebarShell";
import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";
import { routes } from "@/config/routes/routes.js";
import { CUSTOMER } from "@/client/modules/shared/constants/roles.js";
import {
  getNavBadgeCount,
  useNavBadgeCounts,
} from "@/client/modules/shared/hooks/useNavBadgeCounts.js";

export default function CustomerSidebar() {
  const badgeCounts = useNavBadgeCounts(CUSTOMER);

  return (
    <SidebarShell>
      <SidebarSection label="Main">
        <SidebarItem
          href={routes.customer.dashboard}
          icon={LayoutDashboard}
          label="Dashboard"
        />
        <SidebarItem
          href={routes.customer.bookAppointment}
          icon={CalendarPlus}
          label="Book appointment"
        />
        <SidebarItem
          href={routes.customer.myAppointments}
          icon={CalendarDays}
          label="My appointments"
          badgeCount={getNavBadgeCount(badgeCounts, routes.customer.myAppointments)}
        />
        <SidebarItem
          href={routes.customer.favorites}
          icon={Heart}
          label="Favorites"
        />
      </SidebarSection>
      <SidebarSection label="Activity">
        <SidebarItem
          href={routes.customer.reviews}
          icon={Star}
          label="Reviews"
          badgeCount={getNavBadgeCount(badgeCounts, routes.customer.reviews)}
        />
      </SidebarSection>
    </SidebarShell>
  );
}
