"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNavDrawer from "@/components/layout/drawer/MobileNavDrawer";

/**
 * Generic mobile bottom-nav primitive.
 * `items`: [{ label, icon: LucideIcon, href, more?: boolean }]
 * If an item has `more: true`, it opens the MobileNavDrawer with `drawerItems`.
 */
function isNavActive(pathname, href) {
  if (!href || href === "#") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function BottomNav({ items = [], drawerItems = [], drawerTitle = "More" }) {
  const [openMore, setOpenMore] = useState(false);
  const pathname = usePathname() || "";

  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant bg-surface-container-low/95 backdrop-blur md:hidden"
        style={{ minHeight: "var(--bottom-nav-height)" }}
      >
        <ul className="mx-auto grid max-w-md grid-flow-col auto-cols-fr">
          {items.map((it) => {
            const Icon = it.icon;
            const active = it.more ? false : isNavActive(pathname, it.href);
            const content = (
              <span
                className={`flex min-h-[var(--bottom-nav-height)] flex-col items-center justify-center gap-1 px-2 py-2 transition-colors ${
                  active
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
                <span className="text-[11px] font-medium leading-none">
                  {it.label}
                </span>
              </span>
            );
            return (
              <li key={it.label}>
                {it.more ? (
                  <button
                    type="button"
                    onClick={() => setOpenMore(true)}
                    className="block w-full"
                    aria-label="Open more menu"
                  >
                    {content}
                  </button>
                ) : (
                  <Link href={it.href || "#"} className="block">
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <MobileNavDrawer
        open={openMore}
        onClose={() => setOpenMore(false)}
        title={drawerTitle}
        items={drawerItems}
      />
    </>
  );
}
