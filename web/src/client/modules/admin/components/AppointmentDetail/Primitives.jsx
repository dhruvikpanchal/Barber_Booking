"use client";

import Link from "@/lib/AppLink";
import {
  Activity,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Circle,
  CreditCard,
  Home,
} from "lucide-react";
import { routes } from "@/config/routes/routes.js";

export function fullDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export { default as SectionCard } from "@/client/modules/shared/components/ui/SectionCard";

export function DetailRow({ label, value, icon: Icon }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex items-start gap-3 border-b border-outline-variant/60 py-3.5 last:border-b-0">
      {Icon && (
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-container text-on-surface-variant">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-label-caps text-[11px] text-on-surface-variant">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-on-surface break-words">{value}</p>
      </div>
    </div>
  );
}

export function Breadcrumb({ appt }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-xs text-on-surface-variant"
    >
      <Link
        href={routes.admin.dashboard}
        className="inline-flex items-center gap-1 hover:text-primary"
      >
        <Home className="h-3.5 w-3.5" aria-hidden />
        Admin
      </Link>
      <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
      <Link href={routes.admin.appointments} className="hover:text-primary">
        Appointments
      </Link>
      <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
      <span className="truncate font-medium text-on-surface">{appt.id}</span>
    </nav>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-pulse">
      <div className="h-4 w-56 rounded bg-surface-container-high" />
      <div className="h-32 rounded-xl bg-surface-container-high" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-48 rounded-xl bg-surface-container-high" />
        <div className="h-48 rounded-xl bg-surface-container-high" />
      </div>
      <div className="h-64 rounded-xl bg-surface-container-high" />
    </div>
  );
}

export function PaymentBadge({ status }) {
  const paid = status.toLowerCase().includes("paid");
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        paid
          ? "bg-status-confirmed/15 text-status-confirmed"
          : status.toLowerCase().includes("not")
            ? "bg-outline-variant/60 text-on-surface-variant"
            : "bg-status-pending/15 text-status-pending"
      }`}
    >
      {status}
    </span>
  );
}

export const TIMELINE_ICONS = {
  created: CalendarCheck,
  payment: CreditCard,
  activity: Activity,
};

export function StatusHistoryTrack({ steps }) {
  return (
    <ol className="space-y-0">
      {steps.map((step, index) => (
        <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
          {index < steps.length - 1 && (
            <span
              className="absolute left-[11px] top-6 bottom-0 w-px bg-outline-variant"
              aria-hidden
            />
          )}
          <span
            className={`relative z-[1] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
              step.state === "complete"
                ? "border-status-confirmed bg-status-confirmed/20 text-status-confirmed"
                : step.state === "current"
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-outline-variant bg-surface-container-low text-on-surface-variant"
            }`}
          >
            {step.state === "complete" ? (
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Circle className="h-2 w-2 fill-current" aria-hidden />
            )}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p
              className={`text-sm font-semibold ${
                step.state === "upcoming"
                  ? "text-on-surface-variant"
                  : "text-on-surface"
              }`}
            >
              {step.label}
            </p>
            {step.at && (
              <p className="mt-0.5 text-xs text-on-surface-variant">
                {fullDateTime(step.at)}
              </p>
            )}
            {step.state === "current" && !step.at && (
              <p className="mt-0.5 text-xs text-primary">Current status</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
