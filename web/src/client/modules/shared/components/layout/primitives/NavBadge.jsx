"use client";

/** Compact red count badge for navigation items. */
export function formatNavBadgeCount(count) {
  if (!count || count <= 0) return null;
  return count > 99 ? "99+" : String(count);
}

export default function NavBadge({ count, className = "", compact = false }) {
  const label = formatNavBadgeCount(count);
  if (!label) return null;

  if (compact) {
    return (
      <span
        className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-surface ${className}`}
        aria-hidden
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ${className}`}
      aria-hidden
    >
      {label}
    </span>
  );
}
