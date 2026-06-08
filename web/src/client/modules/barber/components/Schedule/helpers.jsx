import { DAYS } from "../../constants/schedule.js";
import { formatDateLabel } from "@/lib/format/formatDateTime.js";

export function createInitialDays() {
  return Object.fromEntries(
    DAYS.map(({ key }, i) => [
      key,
      {
        enabled: i < 6,
        open: "09:00",
        close: "18:00",
      },
    ]),
  );
}

export function formatDisplayDate(iso) {
  if (!iso) return "";
  return formatDateLabel(`${iso}T12:00:00`, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TimeInput({ value, onChange, disabled, label }) {
  return (
    <label className="block">
      {label ? (
        <span className="font-label-caps text-on-surface-variant mb-1.5 block">{label}</span>
      ) : null}
      <input
        type="time"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="border-outline-variant bg-surface-container text-on-surface focus:border-primary h-10 w-full min-w-[6.5rem] rounded-md border px-3 text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
      />
    </label>
  );
}

export function DayToggle({ enabled, onChange, label, short }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={`${label} ${enabled ? "on" : "off"}`}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors ${
        enabled ? "border-primary bg-primary" : "border-outline-variant bg-surface-container"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full shadow transition-transform ${
          enabled ? "bg-on-primary translate-x-5" : "bg-on-surface-variant translate-x-1"
        }`}
      />
      <span className="sr-only">{short}</span>
    </button>
  );
}
