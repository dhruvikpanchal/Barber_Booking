import { Clock, Scissors, CheckCircle2, Users } from "lucide-react";

export default function QueueStats({ stats }) {
  const items = [
    { label: "In queue", value: stats.waiting, Icon: Users },
    { label: "In service", value: stats.inService, Icon: Scissors },
    { label: "Done today", value: stats.done, Icon: CheckCircle2 },
    {
      label: "Avg wait",
      value: stats.avgWait ? `${stats.avgWait}m` : "—",
      Icon: Clock,
    },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ label, value, Icon }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-label-caps text-on-surface-variant">{label}</p>
            <p className="font-serif text-xl font-bold text-on-surface">
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
