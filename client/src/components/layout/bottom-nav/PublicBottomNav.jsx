"use client";

import { Home, Info, Mail, Scissors, Users } from "lucide-react";
import BottomNav from "./BottomNav";
import { routes } from "@/config/routes/routes";

const items = [
  { label: "Home", icon: Home, href: routes.public.home },
  { label: "Services", icon: Scissors, href: routes.public.services },
  { label: "Barbers", icon: Users, href: routes.public.barbers },
  { label: "About", icon: Info, href: routes.public.about },
  { label: "Contact", icon: Mail, href: routes.public.contact },
];

export default function PublicBottomNav() {
  return <BottomNav items={items} />;
}
