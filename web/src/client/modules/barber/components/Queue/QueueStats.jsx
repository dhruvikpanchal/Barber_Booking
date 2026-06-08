import { Users, Scissors, Armchair, Timer } from "lucide-react";

export default function QueueStats({ stats }) {
  const items = [
    { label: "Waiting", value: stats.waiting, Icon: Users, accent: "text-status-pending bg-status-pending/15" },
    { label: "In service", value: stats.inService, Icon: Scissors, accent: "text-primary bg-primary/15" },
    { label: "Chairs free", value: `${stats.chairsFree}/${stats.chairsTotal}`, Icon: Armchair, accent: "text-status-confirmed bg-status-confirmed/15" },
    { label: "Avg wait", value: stats.avgWait ? `${stats.avgWait}m` : "—", Icon: Timer, accent: "text-on-surface-variant bg-surface-container" },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ label, value, Icon, accent }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3"
        >
          <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-label-caps text-on-surface-variant">{label}</p>
            <p className="font-serif text-xl font-bold text-on-surface">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
