"use client";

import Link from "@/lib/AppLink";
import { usePathname } from "next/navigation";
import NavBadge from "@/client/modules/shared/components/layout/primitives/NavBadge.jsx";
import { useSidebar } from "./SidebarShell";

function isNavActive(pathname, href) {
  if (!href || href === "#") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SidebarItem({
  href = "#",
  icon: Icon,
  label,
  badgeCount = 0,
  prefetch = true,
}) {
  const { collapsed } = useSidebar();
  const pathname = usePathname() || "";
  const active = isNavActive(pathname, href);

  return (
    <li>
      <Link
        href={href}
        prefetch={prefetch}
        title={collapsed ? label : undefined}
        data-active={active ? "true" : undefined}
        className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
          collapsed ? "justify-center" : ""
        } ${
          active
            ? "bg-primary/10 text-primary font-medium"
            : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
        }`}
      >
        {Icon ? (
          <span className="relative shrink-0">
            <Icon className="h-5 w-5" />
            {collapsed ? <NavBadge count={badgeCount} compact className="ring-surface-container" /> : null}
          </span>
        ) : null}
        {!collapsed ? (
          <>
            <span className="flex-1 truncate">{label}</span>
            <NavBadge count={badgeCount} />
          </>
        ) : null}
      </Link>
    </li>
  );
}
