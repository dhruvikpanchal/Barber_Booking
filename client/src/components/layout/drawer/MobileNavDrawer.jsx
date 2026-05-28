"use client";

import Link from "next/link";
import { X } from "lucide-react";

export default function MobileNavDrawer({
  open,
  onClose,
  title = "Menu",
  items = [],
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-outline-variant bg-surface-container-low p-5 safe-bottom">
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
                  onClick={onClose}
                  className="flex h-20 flex-col items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container px-2 text-center text-xs text-on-surface-variant hover:border-primary hover:text-primary"
                >
                  {Icon ? <Icon className="h-5 w-5" /> : null}
                  <span className="leading-tight">{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
