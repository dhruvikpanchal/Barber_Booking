import {
  Bell,
  CalendarCheck,
  MessageSquare,
  Scissors,
  ShieldAlert,
  Activity,
} from "lucide-react";

import { NOTIFICATION_TABS, NOTIFICATION_VARIANT_CONFIG } from "@/modules/admin/constants/admin.js";

export { formatActivityTimestamp as formatTimestamp } from "@/client/lib/format/formatDateTime.js";

export function fullTimestamp(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function groupByDate(notifications) {
  const groups = [];
  const map = new Map();

  notifications.forEach((n) => {
    const d = new Date(n.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let label;
    if (d.toDateString() === today.toDateString()) label = "Today";
    else if (d.toDateString() === yesterday.toDateString()) label = "Yesterday";
    else
      label = d.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

    if (!map.has(label)) {
      map.set(label, []);
      groups.push({ label, items: map.get(label) });
    }
    map.get(label).push(n);
  });

  return groups;
}

export function TabBar({ active, onChange, counts }) {
  return (
    <div className="scrollbar-none flex items-center gap-1 overflow-x-auto pb-0.5">
      {NOTIFICATION_TABS.map((tab) => {
        const isActive = tab.key === active;
        const count = counts[tab.key] ?? 0;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={[
              "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
            ].join(" ")}
          >
            {tab.label}
            {count > 0 && (
              <span
                className={[
                  "rounded-full px-1.5 py-px text-[10px] font-bold",
                  isActive
                    ? "bg-on-primary/20 text-on-primary"
                    : "bg-surface-container text-on-surface-variant",
                ].join(" ")}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function TypeBadge({ variant }) {
  const cfg = NOTIFICATION_VARIANT_CONFIG[variant] ?? NOTIFICATION_VARIANT_CONFIG.system_info;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${cfg.accent}`}
    >
      {cfg.label}
    </span>
  );
}

export function DateGroupLabel({ label }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="font-label-caps text-on-surface-variant text-[10px] tracking-widest uppercase">
        {label}
      </span>
      <span className="bg-outline-variant/60 h-px flex-1" />
    </div>
  );
}

export function StatsRow({ notifications }) {
  const total = notifications.length;
  const unread = notifications.filter((n) => !n.read).length;
  const byType = {
    appointments: notifications.filter((n) => n.type === "appointments").length,
    barbers: notifications.filter((n) => n.type === "barber").length,
    contact: notifications.filter((n) => n.type === "contact").length,
    system: notifications.filter((n) => n.type === "system").length,
  };

  const tiles = [
    {
      label: "Total",
      value: total,
      Icon: Bell,
      accent: "text-primary bg-primary/12",
    },
    {
      label: "Unread",
      value: unread,
      Icon: Activity,
      accent: "text-status-pending bg-status-pending/12",
    },
    {
      label: "Appointments",
      value: byType.appointments,
      Icon: CalendarCheck,
      accent: "text-primary bg-primary/10",
    },
    {
      label: "Barbers",
      value: byType.barbers,
      Icon: Scissors,
      accent: "text-status-pending bg-status-pending/10",
    },
    {
      label: "Contact",
      value: byType.contact,
      Icon: MessageSquare,
      accent: "text-on-surface-variant bg-surface-container-high",
    },
    {
      label: "System",
      value: byType.system,
      Icon: ShieldAlert,
      accent: "text-status-cancelled bg-status-cancelled/10",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {tiles.map((t) => {
        const Icon = t.Icon;
        return (
          <div
            key={t.label}
            className="border-outline-variant bg-surface-container-low flex flex-col gap-1.5 rounded-xl border p-3 sm:p-4"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${t.accent}`}>
              <Icon className="h-4 w-4" aria-hidden />
            </div>
            <p className="text-on-surface font-serif text-xl font-bold">{t.value}</p>
            <p className="font-label-caps text-on-surface-variant truncate text-[10px] tracking-wide uppercase">
              {t.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
