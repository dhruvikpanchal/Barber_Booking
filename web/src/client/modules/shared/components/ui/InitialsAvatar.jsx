/**
 * @param {{ initials: string, size?: "sm" | "md", className?: string }} props
 */
export function InitialsAvatar({ initials, size = "md", className = "" }) {
  const sz = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  return (
    <div
      className={`${sz} flex shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/15 font-semibold text-primary ${className}`}
    >
      {initials}
    </div>
  );
}
