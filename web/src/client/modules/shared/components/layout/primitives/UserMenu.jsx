"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { authServices } from "@/client/modules/auth/services/authServices";
import { useRouter } from "next/navigation";
import { routes } from "@/client/config/routes/routes";
import { Loader2 } from "lucide-react";

export default function UserMenu({
  name = "Guest User",
  email = "guest@ironandoak.app",
  initials = "G",
  profileHref,
  settingsHref,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await authServices.logout();
    setOpen(false);
    setLoading(false);
    router.push(routes.auth.login);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="bg-surface-container-low text-on-surface hover:bg-surface-container-high flex items-center gap-2 rounded-full p-1 pr-3 text-sm transition-colors"
      >
        <span className="bg-primary text-on-primary flex h-8 w-8 items-center justify-center rounded-full font-semibold">
          {initials}
        </span>
        <span className="hidden sm:inline">{name}</span>
        <ChevronDown className="text-on-surface-variant h-4 w-4" />
      </button>
      {open ? (
        <div
          role="menu"
          className="border-outline-variant bg-surface-container absolute right-0 z-[100] mt-2 w-60 overflow-hidden rounded-lg border shadow-2xl"
        >
          <div className="border-outline-variant border-b px-4 py-3">
            <div className="text-on-surface text-sm font-semibold">{name}</div>
            <div className="text-on-surface-variant truncate text-xs">{email}</div>
          </div>
          <div className="py-1 text-sm">
            <Link
              onClick={() => setOpen(false)}
              href={profileHref}
              className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex items-center gap-3 px-4 py-2"
            >
              <User className="h-4 w-4" /> Profile
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href={settingsHref}
              className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex items-center gap-3 px-4 py-2"
            >
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </div>
          <div className="border-outline-variant border-t py-1 text-sm">
            <button
              disabled={loading}
              onClick={handleLogout}
              className="text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface flex items-center gap-3 px-4 py-2"
            >
              <LogOut className="h-4 w-4" />
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
