"use client";

import {
  BarChart3,
  Calendar,
  Clock,
  LayoutDashboard,
  Scissors,
  Star,
  UserPlus,
  Users,
} from "lucide-react";
import { routes } from "@/config/routes/routes";
import { BARBER } from "@/client/modules/shared/constants/roles.js";
import {
  getNavBadgeCount,
  useNavBadgeCounts,
} from "@/client/modules/shared/hooks/useNavBadgeCounts.js";
import SidebarShell from "./SidebarShell";
import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";

export default function BarberSidebar() {
  const badgeCounts = useNavBadgeCounts(BARBER);

  return (
    <SidebarShell>
      <SidebarSection label="Today">
        <SidebarItem
          href={routes.barber.dashboard}
          icon={LayoutDashboard}
          label="Dashboard"
        />
        <SidebarItem
          href={routes.barber.queue}
          icon={Users}
          label="Queue"
          badgeCount={getNavBadgeCount(badgeCounts, routes.barber.queue)}
        />
        <SidebarItem
          href={routes.barber.walkIns}
          icon={UserPlus}
          label="Walk-ins"
        />
      </SidebarSection>
      <SidebarSection label="Schedule">
        <SidebarItem
          href={routes.barber.appointments}
          icon={Calendar}
          label="Appointments"
          badgeCount={getNavBadgeCount(badgeCounts, routes.barber.appointments)}
        />
        <SidebarItem
          href={routes.barber.schedule}
          icon={Clock}
          label="Schedule"
        />
        <SidebarItem
          href={routes.barber.services}
          icon={Scissors}
          label="Services"
        />
      </SidebarSection>
      <SidebarSection label="Insights">
        <SidebarItem
          href={routes.barber.reviews}
          icon={Star}
          label="Reviews"
          badgeCount={getNavBadgeCount(badgeCounts, routes.barber.reviews)}
        />
        <SidebarItem
          href={routes.barber.analytics}
          icon={BarChart3}
          label="Analytics"
        />
      </SidebarSection>
    </SidebarShell>
  );
}
