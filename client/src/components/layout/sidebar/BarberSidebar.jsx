"use client";

import {
  BarChart3,
  Calendar,
  Clock,
  LayoutDashboard,
  Scissors,
  Settings,
  Star,
  UserPlus,
  Users,
  User,
} from "lucide-react";
import { routes } from "@/config/routes/routes";
import SidebarShell from "./SidebarShell";
import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";

export default function BarberSidebar() {
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
          badge="4"
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
      <SidebarSection label="Profile">
        <SidebarItem
          href={routes.barber.profile}
          icon={User}
          label="My profile"
        />
        <SidebarItem href={routes.barber.reviews} icon={Star} label="Reviews" />
        <SidebarItem
          href={routes.barber.analytics}
          icon={BarChart3}
          label="Analytics"
        />
      </SidebarSection>
      <SidebarSection label="Account">
        <SidebarItem
          href={routes.barber.settings}
          icon={Settings}
          label="Settings"
        />
      </SidebarSection>
    </SidebarShell>
  );
}
