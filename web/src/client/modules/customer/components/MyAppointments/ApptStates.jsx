"use client";

import { CalendarX, Wifi, Clock, CheckCircle2, XCircle } from "lucide-react";

// ── Empty state ───────────────────────────────────────────────────────────────

const EMPTY_CONFIG = {
  upcoming: {
    icon: Clock,
    heading: "No upcoming appointments",
    sub: "You don't have any bookings scheduled. Ready for a fresh cut?",
    cta: "Book an Appointment",
    ctaHref: "/customer/book-appointment",
  },
  past: {
    icon: CheckCircle2,
    heading: "No past appointments",
    sub: "Your completed appointments will show up here after your first visit.",
    cta: "Book your first appointment",
    ctaHref: "/customer/book-appointment",
  },
  cancelled: {
    icon: XCircle,
    heading: "No cancelled appointments",
    sub: "Any bookings you or a barber cancel will appear here.",
    cta: null,
  },
};

export function EmptyState({ tab }) {
  const cfg = EMPTY_CONFIG[tab] ?? EMPTY_CONFIG.upcoming;
  const Icon = cfg.icon;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container">
        <Icon className="h-8 w-8 text-on-surface-variant/50" />
      </div>
      <h3 className="font-serif text-xl font-bold text-on-surface">{cfg.heading}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-on-surface-variant">{cfg.sub}</p>
      {cfg.cta && (
        <a
          href={cfg.ctaHref}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-on-primary transition-all hover:opacity-90"
        >
          {cfg.cta}
        </a>
      )}
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-start gap-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low p-4">
      <div className="h-12 w-12 shrink-0 rounded-xl bg-surface-container-highest" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3.5 w-1/3 rounded bg-surface-container-highest" />
        <div className="h-3 w-1/4 rounded bg-surface-container-highest/70" />
        <div className="mt-2 h-3 w-2/3 rounded bg-surface-container-highest/50" />
      </div>
      <div className="h-6 w-16 rounded-full bg-surface-container-highest/60" />
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────

export function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-status-cancelled/30 bg-status-cancelled/10">
        <Wifi className="h-8 w-8 text-status-cancelled/70" />
      </div>
      <h3 className="font-serif text-xl font-bold text-on-surface">Couldn't load appointments</h3>
      <p className="mt-2 max-w-sm text-sm text-on-surface-variant">
        There was a problem fetching your bookings. Please check your connection and try again.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-outline-variant px-6 text-sm font-semibold text-on-surface transition-all hover:bg-surface-container-high"
        >
          Try again
        </button>
      )}
    </div>
  );
}
