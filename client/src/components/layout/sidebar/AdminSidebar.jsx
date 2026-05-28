"use client";

import {
  BarChart3,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Scissors,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";
import SidebarShell from "./SidebarShell";
import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";
import { routes } from "@/config/routes/routes.js";

export default function AdminSidebar() {
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
        />
        <SidebarItem
          href={routes.admin.barberRequests}
          icon={UserCheck}
          label="Barber requests"
          badge="7"
        />
      </SidebarSection>
      <SidebarSection label="People">
        <SidebarItem href={routes.admin.users} icon={Users} label="Users" />
        <SidebarItem
          href={routes.admin.barbers}
          icon={Scissors}
          label="Barbers"
        />
      </SidebarSection>
      <SidebarSection label="Communication">
        <SidebarItem
          href={routes.admin.contactMessages}
          icon={MessageSquare}
          label="Messages"
        />
      </SidebarSection>
      <SidebarSection label="System">
        <SidebarItem
          href={routes.admin.settings}
          icon={Settings}
          label="Settings"
        />
      </SidebarSection>
    </SidebarShell>
  );
}
