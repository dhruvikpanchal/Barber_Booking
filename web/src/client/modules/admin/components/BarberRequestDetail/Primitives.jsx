"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Download, Eye, FileText, Home } from "lucide-react";
import { routes } from "@/config/routes/routes.js";

export function fullDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
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

export function Breadcrumb({ request }) {
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
      <Link href={routes.admin.barberRequests} className="hover:text-primary">
        Barber requests
      </Link>
      <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
      <span className="truncate font-medium text-on-surface">{request.id}</span>
    </nav>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-pulse">
      <div className="h-4 w-48 rounded bg-surface-container-high" />
      <div className="h-10 w-2/3 max-w-md rounded bg-surface-container-high" />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="h-64 rounded-xl bg-surface-container-high lg:col-span-2" />
        <div className="h-64 rounded-xl bg-surface-container-high" />
      </div>
      <div className="h-48 rounded-xl bg-surface-container-high" />
      <div className="h-48 rounded-xl bg-surface-container-high" />
    </div>
  );
}

export function ProfilePhoto({ request }) {
  if (request.profilePhotoUrl) {
    return (
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container">
        <Image
          src={request.profilePhotoUrl}
          alt=""
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-outline-variant bg-primary/15 font-serif text-2xl font-bold text-primary"
      aria-hidden
    >
      {initials(request.fullName)}
    </div>
  );
}

export function DocumentList({ documents, emptyLabel }) {
  if (!documents?.length) {
    return <p className="text-sm text-on-surface-variant">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-2">
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="flex flex-col gap-3 rounded-lg border border-outline-variant bg-surface-container px-3 py-3 sm:flex-row sm:items-center"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <FileText className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-on-surface">
                {doc.label}
              </p>
              <p className="truncate text-xs text-on-surface-variant">
                {doc.fileName}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2 sm:ml-auto">
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-outline-variant bg-surface-container-low px-3 py-2 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface sm:flex-initial"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden />
              Preview
            </button>
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-outline-variant bg-surface-container-low px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 sm:flex-initial"
            >
              <Download className="h-3.5 w-3.5" aria-hidden />
              Download
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
