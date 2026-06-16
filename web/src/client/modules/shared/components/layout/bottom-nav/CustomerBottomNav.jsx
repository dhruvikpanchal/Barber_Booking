"use client";

import {
  Bell,
  CalendarDays,
  CalendarPlus,
  Heart,
  Home,
  User,
  MoreHorizontal,
  Star,
  Settings,
} from "lucide-react";
import BottomNav from "./BottomNav";
import { routes } from "@/config/routes/routes.js";

const items = [
  { label: "Home", icon: Home, href: routes.customer.dashboard },
  { label: "Book", icon: CalendarPlus, href: routes.customer.bookAppointment },
  {
    label: "My Book",
    icon: CalendarDays,
    href: routes.customer.myAppointments,
  },
  { label: "Alerts", icon: Bell, href: routes.customer.notifications },
  { label: "More", icon: MoreHorizontal, more: true },
];

const drawer = [
  { label: "Favorites", icon: Heart, href: routes.customer.favorites },
  { label: "Reviews", icon: Star, href: routes.customer.reviews },
  { label: "Profile", icon: User, href: routes.customer.profile },
  { label: "Settings", icon: Settings, href: routes.customer.settings },
];

export default function CustomerBottomNav() {
  return (
    <BottomNav items={items} drawerItems={drawer} drawerTitle="Customer menu" />
  );
}
