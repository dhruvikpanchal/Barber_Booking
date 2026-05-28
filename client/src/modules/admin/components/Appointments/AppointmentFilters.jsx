"use client";

import { CalendarDays, Filter, MapPin, Scissors, Search } from "lucide-react";
import {
  APPOINTMENT_STATUSES,
  APPOINTMENT_STATUS_FILTER_ORDER,
} from "@/constants/admin/admin.js";
import { BARBERS, CITIES } from "../../../../data/admin/appointmentsData.js";

const DATE_OPTIONS = [
  { value: "all", label: "All dates" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "week", label: "This week" },
  { value: "past", label: "Past" },
];

function SelectField({ label, icon: Icon, value, onChange, children }) {
  return (
    <label className="block min-w-0 flex-1 sm:max-w-[180px]">
      <span className="mb-1.5 flex items-center gap-1.5 font-label-caps text-[10px] text-on-surface-variant">
        <Icon className="h-3 w-3" aria-hidden />
        {label}
      </span>
      <select
        value={value}
        onChange={onChange}
        className="h-10 w-full rounded-md border border-outline-variant bg-surface-container px-3 text-sm text-on-surface focus:border-primary focus:outline-none"
      >
        {children}
      </select>
    </label>
  );
}

export default function AppointmentFilters({
  status,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  city,
  onCityChange,
  barberId,
  onBarberChange,
  query,
  onQueryChange,
  counts,
}) {
  return (
    <div className="space-y-4 border-b border-outline-variant px-4 py-4 md:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 font-label-caps text-xs text-on-surface-variant">
          <Filter className="h-3.5 w-3.5" aria-hidden />
          Status
        </span>
        {APPOINTMENT_STATUS_FILTER_ORDER.map((key) => {
          const active = status === key;
          const label =
            key === "all" ? "All" : (APPOINTMENT_STATUSES[key]?.label ?? key);
          const count = counts[key] ?? 0;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onStatusChange(key)}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              {label}
              <span
                className={`rounded-full px-1.5 text-[10px] font-bold ${
                  active
                    ? "bg-on-primary/20 text-on-primary"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
        <SelectField
          label="Date"
          icon={CalendarDays}
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
        >
          {DATE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="City"
          icon={MapPin}
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
        >
          <option value="all">All cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectField>

        <SelectField
          label="Barber"
          icon={Scissors}
          value={barberId}
          onChange={(e) => onBarberChange(e.target.value)}
        >
          <option value="all">All barbers</option>
          {BARBERS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} · {b.shop}
            </option>
          ))}
        </SelectField>

        <label className="relative block min-w-0 flex-1 lg:max-w-xs">
          <span className="mb-1.5 block font-label-caps text-[10px] text-on-surface-variant">
            Search
          </span>
          <Search
            className="pointer-events-none absolute bottom-2.5 left-3 h-4 w-4 text-on-surface-variant"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Customer, booking ID, service…"
            className="h-10 w-full rounded-md border border-outline-variant bg-surface-container py-2 pr-3 pl-9 text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none"
          />
        </label>
      </div>
    </div>
  );
}
