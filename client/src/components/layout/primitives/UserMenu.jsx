"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";

export default function UserMenu({
  name = "Guest User",
  email = "guest@ironandoak.app",
  initials = "G",
  profileHref,
  settingsHref,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full bg-surface-container-low p-1 pr-3 text-sm text-on-surface transition-colors hover:bg-surface-container-high"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary font-semibold">
          {initials}
        </span>
        <span className="hidden sm:inline">{name}</span>
        <ChevronDown className="h-4 w-4 text-on-surface-variant" />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-[100] mt-2 w-60 overflow-hidden rounded-lg border border-outline-variant bg-surface-container shadow-2xl"
        >
          <div className="border-b border-outline-variant px-4 py-3">
            <div className="text-sm font-semibold text-on-surface">{name}</div>
            <div className="truncate text-xs text-on-surface-variant">
              {email}
            </div>
          </div>
          <div className="py-1 text-sm">
            <Link
              onClick={() => setOpen(false)}
              href={profileHref}
              className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            >
              <User className="h-4 w-4" /> Profile
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href={settingsHref}
              className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            >
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </div>
          <div className="border-t border-outline-variant py-1 text-sm">
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
