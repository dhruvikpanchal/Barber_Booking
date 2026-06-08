const SIZE_CLASSES = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  compact: "px-2.5 py-1 text-[11px] gap-1.5",
  md: "px-2.5 py-1 text-xs gap-1.5",
};

const ICON_SIZE = {
  sm: "h-3 w-3",
  compact: "h-3.5 w-3.5",
  md: "h-3.5 w-3.5",
};

/**
 * Icon status pill driven by a config map: `{ [key]: { label, icon, badge? | className? } }`.
 */
export default function StatusBadge({
  status,
  config,
  fallback = "pending",
  className = "",
  size = "md",
}) {
  const cfg = config?.[status] ?? config?.[fallback];
  if (!cfg) return null;

  const Icon = cfg.icon;
  const badgeClass = cfg.badge ?? cfg.className ?? "";
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;
  const iconClass = ICON_SIZE[size] ?? ICON_SIZE.md;

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClass} ${badgeClass} ${className}`.trim()}
    >
      {Icon ? <Icon className={iconClass} aria-hidden /> : null}
      {cfg.label}
    </span>
  );
}
