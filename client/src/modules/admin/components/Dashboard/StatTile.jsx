import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function StatTile({
  label,
  value,
  hint,
  Icon,
  accent = "text-primary bg-primary/15",
  delta,
}) {
  const positive = typeof delta === "number" && delta >= 0;
  return (
    <div className="min-w-0 rounded-xl border border-outline-variant bg-surface-container-low p-4 transition-colors hover:bg-surface-container">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-label-caps text-on-surface-variant">{label}</p>
          <p className="mt-1 font-serif text-2xl font-bold text-on-surface">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 truncate text-xs text-on-surface-variant">
              {hint}
            </p>
          ) : null}
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
      {typeof delta === "number" ? (
        <div
          className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
            positive
              ? "bg-status-confirmed/15 text-status-confirmed"
              : "bg-status-cancelled/15 text-status-cancelled"
          }`}
        >
          {positive ? (
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          ) : (
            <ArrowDownRight className="h-3 w-3" aria-hidden />
          )}
          {positive ? "+" : ""}
          {delta}%
        </div>
      ) : null}
    </div>
  );
}
