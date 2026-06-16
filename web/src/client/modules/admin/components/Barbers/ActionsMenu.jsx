"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { getBarberActionsMenuItems } from "@/client/modules/admin/constants/adminConstants.js";

export default function ActionsMenu({ barber, onAction }) {
  const [open, setOpen] = useState(false);
  const menuItems = getBarberActionsMenuItems(barber);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
        aria-label="Actions"
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="border-outline-variant bg-surface-container absolute top-full right-0 z-20 mt-1 w-48 overflow-hidden rounded-lg border shadow-xl">
            {menuItems.map(({ key, label, Icon, color }) => (
              <button
                key={key}
                onClick={() => {
                  setOpen(false);
                  onAction(key, barber);
                }}
                className={`hover:bg-surface-container-high flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-medium transition-colors ${color ?? "text-on-surface-variant"}`}
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
