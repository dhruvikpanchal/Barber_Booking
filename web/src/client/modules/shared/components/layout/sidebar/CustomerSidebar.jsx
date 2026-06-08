"use client";

import {
  Bell,
  CalendarDays,
  CalendarPlus,
  Heart,
  LayoutDashboard,
  Settings,
  Star,
  User,
} from "lucide-react";
import SidebarShell from "./SidebarShell";
import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";
import { routes } from "@/config/routes/routes.js";

export default function CustomerSidebar() {
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
          badge="2"
        />
        <SidebarItem
          href={routes.customer.favorites}
          icon={Heart}
          label="Favorites"
        />
      </SidebarSection>
      <SidebarSection label="Activity">
        <SidebarItem
          href={routes.customer.notifications}
          icon={Bell}
          label="Notifications"
        />
        <SidebarItem
          href={routes.customer.reviews}
          icon={Star}
          label="Reviews"
        />
      </SidebarSection>
      <SidebarSection label="Account">
        <SidebarItem
          href={routes.customer.profile}
          icon={User}
          label="Profile"
        />
        <SidebarItem
          href={routes.customer.settings}
          icon={Settings}
          label="Settings"
        />
      </SidebarSection>
    </SidebarShell>
  );
}
