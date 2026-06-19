"use client";

import { CalendarDays, CalendarPlus, Heart, Home, Star } from "lucide-react";
import BottomNav from "./BottomNav";
import { routes } from "@/config/routes/routes.js";
import { CUSTOMER } from "@/client/modules/shared/constants/roles.js";
import {
  getNavBadgeCount,
  useNavBadgeCounts,
} from "@/client/modules/shared/hooks/useNavBadgeCounts.js";

export default function CustomerBottomNav() {
  const badgeCounts = useNavBadgeCounts(CUSTOMER);

  const items = [
    { label: "Home", icon: Home, href: routes.customer.dashboard },
    { label: "Book", icon: CalendarPlus, href: routes.customer.bookAppointment },
    {
      label: "My Book",
      icon: CalendarDays,
      href: routes.customer.myAppointments,
      badgeCount: getNavBadgeCount(badgeCounts, routes.customer.myAppointments),
    },
    { label: "Favorites", icon: Heart, href: routes.customer.favorites },
    {
      label: "Reviews",
      icon: Star,
      href: routes.customer.reviews,
      badgeCount: getNavBadgeCount(badgeCounts, routes.customer.reviews),
    },
  ];

  return <BottomNav items={items} />;
}
