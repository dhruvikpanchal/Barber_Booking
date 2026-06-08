export function SummaryCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className="border-outline-variant bg-surface-container-low rounded-xl border p-4">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <p className="text-on-surface mt-3 font-serif text-2xl font-bold">{value}</p>
      <p className="text-on-surface text-xs font-semibold">{label}</p>
      {sub && <p className="text-on-surface-variant mt-0.5 text-[11px]">{sub}</p>}
    </div>
  );
}

export function StatusCell({ value }) {
  const v = String(value).toLowerCase();
  let cls = "bg-surface-container-high text-on-surface-variant border border-outline-variant";
  if (v.includes("complet") || v.includes("active") || v.includes("approv")) {
    cls = "bg-status-confirmed/15 text-status-confirmed border-status-confirmed/25";
  } else if (v.includes("cancel") || v.includes("reject") || v.includes("disabled")) {
    cls = "bg-status-cancelled/15 text-status-cancelled border-status-cancelled/25";
  } else if (v.includes("pending") || v.includes("confirm") || v.includes("no-show")) {
    cls = "bg-status-pending/15 text-status-pending border-status-pending/25";
  }
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cls}`}
    >
      {value}
    </span>
  );
}
