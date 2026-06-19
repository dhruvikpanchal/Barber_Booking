"use client";

import {
  BarChart3,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  MessageSquare,
  MoreHorizontal,
  Scissors,
  UserCheck,
  Users,
} from "lucide-react";
import BottomNav from "./BottomNav";
import { routes } from "@/config/routes/routes.js";
import { ADMIN } from "@/client/modules/shared/constants/roles.js";
import {
  getNavBadgeCount,
  sumNavBadgeCounts,
  useNavBadgeCounts,
} from "@/client/modules/shared/hooks/useNavBadgeCounts.js";

export default function AdminBottomNav() {
  const badgeCounts = useNavBadgeCounts(ADMIN);

  const items = [
    { label: "Dashboard", icon: LayoutDashboard, href: routes.admin.dashboard },
    {
      label: "Users",
      icon: Users,
      href: routes.admin.users,
      badgeCount: getNavBadgeCount(badgeCounts, routes.admin.users),
    },
    {
      label: "Barbers",
      icon: Scissors,
      href: routes.admin.barbers,
      badgeCount: getNavBadgeCount(badgeCounts, routes.admin.barbers),
    },
    {
      label: "Messages",
      icon: MessageSquare,
      href: routes.admin.contactMessages,
      badgeCount: getNavBadgeCount(badgeCounts, routes.admin.contactMessages),
    },
    {
      label: "More",
      icon: MoreHorizontal,
      more: true,
      badgeCount: sumNavBadgeCounts(badgeCounts, [
        routes.admin.barberRequests,
        routes.admin.appointments,
      ]),
    },
  ];

  const drawer = [
    {
      label: "Barber requests",
      icon: UserCheck,
      href: routes.admin.barberRequests,
      badgeCount: getNavBadgeCount(badgeCounts, routes.admin.barberRequests),
    },
    { label: "Analytics", icon: BarChart3, href: routes.admin.analytics },
    { label: "Reports", icon: FileText, href: routes.admin.reports },
    {
      label: "Appts",
      icon: CalendarCheck,
      href: routes.admin.appointments,
      badgeCount: getNavBadgeCount(badgeCounts, routes.admin.appointments),
    },
  ];

  return (
    <BottomNav items={items} drawerItems={drawer} drawerTitle="Admin menu" />
  );
}
