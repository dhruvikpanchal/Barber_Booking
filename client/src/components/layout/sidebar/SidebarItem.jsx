"use client";

import Link from "next/link";
import { useSidebar } from "./SidebarShell";

export default function SidebarItem({ href = "#", icon: Icon, label, badge }) {
  const { collapsed } = useSidebar();
  return (
    <li>
      <Link
        href={href}
        title={collapsed ? label : undefined}
        className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface ${
          collapsed ? "justify-center" : ""
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
