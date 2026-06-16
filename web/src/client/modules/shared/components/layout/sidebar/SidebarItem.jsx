"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarShell";

function isNavActive(pathname, href) {
  if (!href || href === "#") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SidebarItem({ href = "#", icon: Icon, label, badge }) {
  const { collapsed } = useSidebar();
  const pathname = usePathname() || "";
  const active = isNavActive(pathname, href);

  return (
    <li>
      <Link
        href={href}
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
        {Icon ? <Icon className="h-5 w-5 shrink-0" /> : null}
        {!collapsed ? (
          <>
            <span className="flex-1 truncate">{label}</span>
            {badge ? (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                {badge}
              </span>
            ) : null}
          </>
        ) : null}
      </Link>
    </li>
  );
}
