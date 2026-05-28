"use client";

import {
  BarChart3,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  MessageSquare,
  MoreHorizontal,
  Scissors,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";
import BottomNav from "./BottomNav";
import { routes } from "@/config/routes/routes.js";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: routes.admin.dashboard },
  { label: "Users", icon: Users, href: routes.admin.users },
  { label: "Barbers", icon: Scissors, href: routes.admin.barbers },
  {
    label: "Messages",
    icon: MessageSquare,
    href: routes.admin.contactMessages,
  },
  { label: "More", icon: MoreHorizontal, more: true },
];

const drawer = [
  {
    label: "Barber requests",
    icon: UserCheck,
    href: routes.admin.barberRequests,
  },
  { label: "Analytics", icon: BarChart3, href: routes.admin.analytics },
  { label: "Reports", icon: FileText, href: routes.admin.reports },
  {
    label: "Appts",
    icon: CalendarCheck,
    href: routes.admin.appointments,
  },
  { label: "Settings", icon: Settings, href: routes.admin.settings },
];

export default function AdminBottomNav() {
  return (
    <BottomNav items={items} drawerItems={drawer} drawerTitle="Admin menu" />
  );
}
