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
import { customerHook } from "@/client/modules/customer/hooks/customerQuery.jsx";

export default function CustomerSidebar() {
  const { data: unreadData } = customerHook.Notifications.useGetUnreadNotificationCount();
  const unreadCount = unreadData?.count ?? 0;

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
          badge={unreadCount > 0 ? (unreadCount > 9 ? "9+" : String(unreadCount)) : undefined}
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
