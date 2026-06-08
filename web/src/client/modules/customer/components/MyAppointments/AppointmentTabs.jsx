"use client";

import { Clock, CheckCircle2, XCircle } from "lucide-react";

const TAB_CONFIG = [
  { key: "upcoming", label: "Upcoming", icon: Clock },
  { key: "past",     label: "Past",     icon: CheckCircle2 },
  { key: "cancelled",label: "Cancelled",icon: XCircle },
];

export default function AppointmentTabs({ activeTab, counts, onTabChange }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-outline-variant bg-surface-container p-1">
      {TAB_CONFIG.map(({ key, label, icon: Icon }) => {
        const active = key === activeTab;
        const count = counts[key] ?? 0;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange(key)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150
              ${active
                ? "bg-surface-container-low text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
              }`}
          >
            <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : ""}`} />
            <span className="hidden sm:inline">{label}</span>
            {count > 0 && (
              <span
                className={`inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none
                  ${active
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-highest text-on-surface-variant"
                  }`}
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
