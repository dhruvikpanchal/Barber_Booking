"use client";

import { useSidebar } from "./SidebarShell";

export default function SidebarSection({ label, children }) {
  const { collapsed } = useSidebar();
  return (
    <div className="mb-2 px-3">
      {!collapsed && label ? (
        <div className="font-label-caps mb-2 px-2 text-[10px] text-on-surface-variant/70">
          {label}
        </div>
      ) : (
        <div className="my-3 border-t border-outline-variant/60" />
      )}
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}
