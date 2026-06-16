"use client";

import Link from "next/link";
import { ChevronRight, Home, XCircle } from "lucide-react";

import { routes } from "@/client/config/routes/routes";

import { validate, isValidEmail } from "@/client/modules/public/helpers/contactHelpers.js";

export function Breadcrumb({ disabled = false }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-on-surface-variant flex items-center gap-1.5 text-xs"
    >
      <Link
        href={routes.public.home}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        className="hover:text-primary inline-flex items-center gap-1 transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        <Home className="h-3 w-3" aria-hidden />
        Home
      </Link>
      <ChevronRight className="h-3 w-3 shrink-0 opacity-40" aria-hidden />
      <span className="text-on-surface font-medium" aria-current="page">
        Contact
      </span>
    </nav>
  );
}

export function InfoRow({ Icon, label, children }) {
  return (
    <div className="flex gap-3.5">
      <span className="border-outline-variant bg-surface-container text-primary mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
        <Icon className="h-3.5 w-3.5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="font-label-caps text-on-surface-variant text-[10px] tracking-widest uppercase">
          {label}
        </p>
        <div className="text-on-surface mt-0.5 text-sm">{children}</div>
      </div>
    </div>
  );
}

export function FieldError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-error mt-1.5 flex items-center gap-1.5 text-xs">
      <XCircle className="h-3 w-3 shrink-0" aria-hidden />
      {message}
    </p>
  );
}
