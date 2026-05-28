"use client";

import {
  BarChart3,
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
import BottomNav from "./BottomNav";

const items = [
  { label: "Today", icon: LayoutDashboard, href: routes.barber.dashboard },
  { label: "Queue", icon: Users, href: routes.barber.queue },
  { label: "Appts", icon: Calendar, href: routes.barber.appointments },
  { label: "Schedule", icon: Clock, href: routes.barber.schedule },
  { label: "More", icon: MoreHorizontal, more: true },
];

const drawer = [
  { label: "Walk-ins", icon: UserPlus, href: routes.barber.walkIns },
  { label: "Services", icon: Scissors, href: routes.barber.services },
  { label: "Profile", icon: User, href: routes.barber.profile },
  { label: "Reviews", icon: Star, href: routes.barber.reviews },
  { label: "Analytics", icon: BarChart3, href: routes.barber.analytics },
  { label: "Settings", icon: Settings, href: routes.barber.settings },
];

export default function BarberBottomNav() {
  return (
    <BottomNav items={items} drawerItems={drawer} drawerTitle="Barber menu" />
  );
}
