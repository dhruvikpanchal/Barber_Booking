export default function CustomerStatTile({
  label,
  value,
  hint,
  Icon,
  accent = "text-primary bg-primary/15",
  className = "",
}) {
  return (
    <div
      className={`min-w-0 rounded-xl border border-outline-variant bg-surface-container-low p-3.5 transition-colors hover:bg-surface-container sm:p-4 ${className}`.trim()}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-label-caps text-on-surface-variant">{label}</p>
          <p className="text-on-surface mt-1 font-serif text-xl font-bold sm:text-2xl">{value}</p>
          {hint ? (
            <p className="text-on-surface-variant mt-1 text-xs leading-snug">{hint}</p>
          ) : null}
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
    </div>
  );
}
