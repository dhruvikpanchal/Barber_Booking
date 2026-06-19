"use client";

import Link from "@/lib/AppLink";
import { X } from "lucide-react";
import Drawer from "@/client/modules/shared/components/ui/Drawer";
import NavBadge from "@/client/modules/shared/components/layout/primitives/NavBadge.jsx";

export default function MobileNavDrawer({
  open,
  onClose,
  title = "Menu",
  items = [],
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="bottom"
      className="md:hidden overflow-y-auto border-outline-variant bg-surface-container-low p-5 safe-bottom"
      backdropClassName="bg-black/70 md:hidden"
      panelClassName="border-outline-variant bg-surface-container-low"
    >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant hover:text-on-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="grid grid-cols-3 gap-3 p-3">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <li key={it.label}>
                <Link
                  href={it.href || "#"}
                  prefetch={false}
                  onClick={onClose}
                  className="relative flex h-20 flex-col items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container px-2 text-center text-xs text-on-surface-variant hover:border-primary hover:text-primary"
                >
                  <span className="relative">
                    {Icon ? <Icon className="h-5 w-5" /> : null}
                    <NavBadge
                      count={it.badgeCount ?? 0}
                      compact
                      className="right-0 top-0 translate-x-1/2 -translate-y-1/2 ring-surface-container"
                    />
                  </span>
                  <span className="leading-tight">{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
    </Drawer>
  );
}
