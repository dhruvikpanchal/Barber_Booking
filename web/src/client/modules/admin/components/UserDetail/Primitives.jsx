import Link from "next/link";

import { ChevronRight, Home } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import { BOOKING_STATUS_CONFIG } from "@/client/modules/admin/constants/adminConstants.js";

export function fullDateTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export { default as SectionCard } from "@/client/modules/shared/components/ui/SectionCard";

export function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className="border-outline-variant bg-surface-container rounded-xl border p-4">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          accent ?? "bg-primary/15 text-primary"
        }`}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <p className="text-on-surface mt-3 font-serif text-2xl font-bold">{value}</p>
      <p className="text-on-surface mt-0.5 text-xs font-semibold">{label}</p>
      {sub && <p className="text-on-surface-variant mt-0.5 text-[11px]">{sub}</p>}
    </div>
  );
}

export function DetailRow({ label, value, icon: Icon }) {
  if (value == null || value === "") return null;
  return (
    <div className="border-outline-variant/60 flex items-start gap-3 border-b py-3.5 last:border-b-0">
      {Icon && (
        <span className="bg-surface-container text-on-surface-variant mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-label-caps text-on-surface-variant text-[11px]">{label}</p>
        <p className="text-on-surface mt-0.5 text-sm break-words">{value}</p>
      </div>
    </div>
  );
}

export function Breadcrumb({ user }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-on-surface-variant flex flex-wrap items-center gap-1.5 text-xs"
    >
      <Link
        href={routes.admin.dashboard}
        className="hover:text-primary inline-flex items-center gap-1"
      >
        <Home className="h-3.5 w-3.5" aria-hidden />
        Admin
      </Link>
      <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
      <Link href={routes.admin.users} className="hover:text-primary">
        Users
      </Link>
      <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
      <span className="text-on-surface truncate font-medium">{user.name}</span>
    </nav>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-6">
      <div className="bg-surface-container-high h-4 w-48 rounded" />
      <div className="flex gap-4">
        <div className="bg-surface-container-high h-24 w-24 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="bg-surface-container-high h-8 w-64 rounded" />
          <div className="bg-surface-container-high h-4 w-40 rounded" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-surface-container-high h-28 rounded-xl" />
        ))}
      </div>
      <div className="bg-surface-container-high h-64 rounded-xl" />
    </div>
  );
}

export function BookingStatusPill({ status }) {
  const cfg = BOOKING_STATUS_CONFIG[status] ?? BOOKING_STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

export function PaymentPill({ status }) {
  const styles =
    status === "Paid"
      ? "bg-status-confirmed/15 text-status-confirmed"
      : status === "Pending"
        ? "bg-status-pending/15 text-status-pending"
        : "bg-outline-variant/60 text-on-surface-variant";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${styles}`}>
      {status}
    </span>
  );
}
