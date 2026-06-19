"use client";

import {
  BarChart3,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Scissors,
  UserCheck,
  Users,
} from "lucide-react";
import SidebarShell from "./SidebarShell";
import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";
import { routes } from "@/config/routes/routes.js";
import { ADMIN } from "@/client/modules/shared/constants/roles.js";
import {
  getNavBadgeCount,
  useNavBadgeCounts,
} from "@/client/modules/shared/hooks/useNavBadgeCounts.js";

export default function AdminSidebar() {
  const badgeCounts = useNavBadgeCounts(ADMIN);

  return (
    <SidebarShell>
      <SidebarSection label="Overview">
        <SidebarItem
          href={routes.admin.dashboard}
          icon={LayoutDashboard}
          label="Dashboard"
        />
        <SidebarItem
          href={routes.admin.analytics}
          icon={BarChart3}
          label="Analytics"
        />
        <SidebarItem
          href={routes.admin.reports}
          icon={FileText}
          label="Reports"
        />
      </SidebarSection>
      <SidebarSection label="Operations">
        <SidebarItem
          href={routes.admin.appointments}
          icon={CalendarCheck}
          label="Appointments"
          badgeCount={getNavBadgeCount(badgeCounts, routes.admin.appointments)}
        />
        <SidebarItem
          href={routes.admin.barberRequests}
          icon={UserCheck}
          label="Barber requests"
          badgeCount={getNavBadgeCount(badgeCounts, routes.admin.barberRequests)}
        />
      </SidebarSection>
      <SidebarSection label="People">
        <SidebarItem
          href={routes.admin.users}
          icon={Users}
          label="Users"
          badgeCount={getNavBadgeCount(badgeCounts, routes.admin.users)}
        />
        <SidebarItem
          href={routes.admin.barbers}
          icon={Scissors}
          label="Barbers"
          badgeCount={getNavBadgeCount(badgeCounts, routes.admin.barbers)}
        />
      </SidebarSection>
      <SidebarSection label="Communication">
        <SidebarItem
          href={routes.admin.contactMessages}
          icon={MessageSquare}
          label="Messages"
          badgeCount={getNavBadgeCount(badgeCounts, routes.admin.contactMessages)}
        />
      </SidebarSection>
    </SidebarShell>
  );
}
