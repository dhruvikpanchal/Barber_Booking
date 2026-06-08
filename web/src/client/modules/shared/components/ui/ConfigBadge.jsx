/**
 * Status pill driven by a `{ [key]: { label, badge, dot } }` config map.
 *
 * @param {{ status: string, config: Record<string, { label: string, badge: string, dot: string }>, fallbackKey?: string }} props
 */
export function ConfigBadge({ status, config, fallbackKey = "inactive" }) {
  const cfg = config[status] ?? config[fallbackKey];
  if (!cfg) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} aria-hidden />
      {cfg.label}
    </span>
  );
}
