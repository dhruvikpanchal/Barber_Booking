"use client";

import {
  BarChart3,
  Bell,
  Calendar,
  Clock,
  LayoutDashboard,
  MoreHorizontal,
  Scissors,
  Settings,
  Star,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { routes } from "@/config/routes/routes";
import { BARBER } from "@/client/modules/shared/constants/roles.js";
import {
  getNavBadgeCount,
  sumNavBadgeCounts,
  useNavBadgeCounts,
} from "@/client/modules/shared/hooks/useNavBadgeCounts.js";
import BottomNav from "./BottomNav";

export default function BarberBottomNav() {
  const badgeCounts = useNavBadgeCounts(BARBER);

  const items = [
    { label: "Today", icon: LayoutDashboard, href: routes.barber.dashboard },
    {
      label: "Queue",
      icon: Users,
      href: routes.barber.queue,
      badgeCount: getNavBadgeCount(badgeCounts, routes.barber.queue),
    },
    {
      label: "Appts",
      icon: Calendar,
      href: routes.barber.appointments,
      badgeCount: getNavBadgeCount(badgeCounts, routes.barber.appointments),
    },
    { label: "Schedule", icon: Clock, href: routes.barber.schedule },
    {
      label: "More",
      icon: MoreHorizontal,
      more: true,
      badgeCount: sumNavBadgeCounts(badgeCounts, [routes.barber.reviews]),
    },
  ];

  const drawer = [
    { label: "Walk-ins", icon: UserPlus, href: routes.barber.walkIns },
    { label: "Services", icon: Scissors, href: routes.barber.services },
    {
      label: "Reviews",
      icon: Star,
      href: routes.barber.reviews,
      badgeCount: getNavBadgeCount(badgeCounts, routes.barber.reviews),
    },
    { label: "Analytics", icon: BarChart3, href: routes.barber.analytics },
    { label: "Notifications", icon: Bell, href: routes.barber.notifications },
    { label: "Profile", icon: User, href: routes.barber.profile },
    { label: "Settings", icon: Settings, href: routes.barber.settings },
  ];

  return (
    <BottomNav items={items} drawerItems={drawer} drawerTitle="Barber menu" />
  );
}
