"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { getUserActionsMenuItems } from "@/constants/admin/admin.js";

export default function ActionsMenu({ user, onAction }) {
  const [open, setOpen] = useState(false);
  const menuItems = getUserActionsMenuItems(user);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
        aria-label="User actions"
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-lg border border-outline-variant bg-surface-container shadow-xl">
            {menuItems.map(({ key, label, Icon, color }) => (
              <button
                key={key}
                onClick={() => {
                  setOpen(false);
                  onAction(key, user);
                }}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-medium transition-colors hover:bg-surface-container-high ${color ?? "text-on-surface-variant"}`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
