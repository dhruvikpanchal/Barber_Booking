"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogIn, Scissors, UserPlus } from "lucide-react";
import { routes } from "@/config/routes/routes";

const accountLinks = [
  {
    href: routes.auth.login,
    label: "Sign in",
    description: "Existing customer or barber",
    icon: LogIn,
  },
  {
    href: routes.auth.register,
    label: "Create account",
    description: "Book appointments & save favorites",
    icon: UserPlus,
  },
  {
    href: routes.auth.barberRegister,
    label: "Become a barber",
    description: "Apply to join a shop on the platform",
    icon: Scissors,
  },
];

export default function PublicAccountMenu() {
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
        className="flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-low px-3 py-1.5 text-sm font-medium text-on-surface transition-colors hover:border-primary hover:text-primary"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
          <UserPlus className="h-4 w-4" aria-hidden />
        </span>
        <span>Account</span>
        <ChevronDown
          className={`h-4 w-4 text-on-surface-variant transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-outline-variant bg-surface-container shadow-2xl"
        >
          <div className="border-b border-outline-variant px-4 py-3">
            <p className="text-sm font-semibold text-on-surface">Welcome</p>
            <p className="text-xs text-on-surface-variant">
              Sign in or choose how you want to join Iron &amp; Oak.
            </p>
          </div>
          <ul className="py-1">
            {accountLinks.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex gap-3 px-4 py-3 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
                  >
                    <Icon
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      aria-hidden
                    />
                    <span>
                      <span className="block text-sm font-medium text-on-surface">
                        {item.label}
                      </span>
                      <span className="block text-xs leading-snug text-on-surface-variant">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-outline-variant p-3">
            <Link
              href={routes.auth.register}
              onClick={() => setOpen(false)}
              className="font-label-caps block rounded-md bg-primary py-2.5 text-center text-sm text-on-primary transition-opacity hover:opacity-90"
            >
              Sign up
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
