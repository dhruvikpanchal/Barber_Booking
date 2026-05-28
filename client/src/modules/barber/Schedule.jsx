"use client";

import { useMemo, useState } from "react";
import {
  CalendarOff,
  CalendarPlus,
  Clock,
  Coffee,
  Copy,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { DAYS } from "../../constants/barber/schedule.js";
import {
  createInitialDays,
  formatDisplayDate,
  TimeInput,
  DayToggle,
} from "./components/Schedule/helpers.jsx";
import SectionCard from "./components/Schedule/SectionCard.jsx";
import { useHydrated } from "@/lib/hooks/useHydrated.js";
import { createId } from "@/components/common/helpers/createId.js";

export default function BarberSchedule() {
  const hydrated = useHydrated();
  const [days, setDays] = useState(createInitialDays);
  const [defaultOpen, setDefaultOpen] = useState("09:00");
  const [defaultClose, setDefaultClose] = useState("18:00");
  const [breaks, setBreaks] = useState([
    { id: "break-1", label: "Lunch", start: "13:00", end: "14:00" },
  ]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [saved, setSaved] = useState(false);

  const workingCount = useMemo(
    () => Object.values(days).filter((d) => d.enabled).length,
    [days],
  );

  const sortedUnavailable = useMemo(
    () => [...unavailableDates].sort((a, b) => a.localeCompare(b)),
    [unavailableDates],
  );

  const todayIso = useMemo(
    () => (hydrated ? new Date().toISOString().slice(0, 10) : "2000-01-01"),
    [hydrated],
  );

  function updateDay(key, patch) {
    setDays((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  function applyDefaultHours() {
    setDays((prev) => {
      const next = { ...prev };
      for (const { key } of DAYS) {
        if (next[key].enabled) {
          next[key] = { ...next[key], open: defaultOpen, close: defaultClose };
        }
      }
      return next;
    });
  }

  function addBreak() {
    setBreaks((prev) => [
      ...prev,
      { id: createId(), label: "Break", start: "13:00", end: "13:30" },
    ]);
  }

  function updateBreak(id, patch) {
    setBreaks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    );
  }

  function removeBreak(id) {
    setBreaks((prev) => prev.filter((b) => b.id !== id));
  }

  function addUnavailableDate() {
    const value = newDate.trim();
    if (!value || unavailableDates.includes(value)) return;
    setUnavailableDates((prev) => [...prev, value]);
    setNewDate("");
  }

  function removeUnavailableDate(iso) {
    setUnavailableDates((prev) => prev.filter((d) => d !== iso));
  }

  function handleSave() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-4">
      <header className="space-y-2">
        <p className="font-label-caps text-primary">Barber · Schedule</p>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
          Availability
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Set when clients can book you. Working days and hours define your
          weekly window; breaks block slots inside those hours; unavailable
          dates remove whole days from the calendar.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <SectionCard
          icon={Clock}
          title="Working days & hours"
          description={`${workingCount} day${workingCount === 1 ? "" : "s"} open for bookings this week.`}
          className="lg:col-span-3"
        >
          <div className="mb-6 rounded-lg border border-outline-variant/80 bg-surface-container p-4">
            <p className="font-label-caps text-on-surface-variant">
              Default hours
            </p>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="grid flex-1 grid-cols-2 gap-3">
                <TimeInput
                  label="Opens"
                  value={defaultOpen}
                  onChange={setDefaultOpen}
                />
                <TimeInput
                  label="Closes"
                  value={defaultClose}
                  onChange={setDefaultClose}
                />
              </div>
              <button
                type="button"
                onClick={applyDefaultHours}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-outline-variant px-4 text-sm font-medium text-on-surface transition-colors hover:border-primary hover:text-primary"
              >
                <Copy className="h-4 w-4" aria-hidden />
                Apply to working days
              </button>
            </div>
          </div>

          <ul className="divide-y divide-outline-variant/80">
            {DAYS.map(({ key, label, short }) => {
              const day = days[key];
              return (
                <li
                  key={key}
                  className={`flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between ${
                    !day.enabled ? "opacity-55" : ""
                  }`}
                >
                  <div className="flex min-w-[9rem] items-center gap-3">
                    <DayToggle
                      enabled={day.enabled}
                      onChange={(enabled) => updateDay(key, { enabled })}
                      label={label}
                      short={short}
                    />
                    <div>
                      <p className="font-medium text-on-surface">{label}</p>
                      <p className="text-xs text-on-surface-variant md:hidden">
                        {day.enabled ? `${day.open} – ${day.close}` : "Closed"}
                      </p>
                    </div>
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-3 sm:max-w-xs">
                    <TimeInput
                      label="Open"
                      value={day.open}
                      disabled={!day.enabled}
                      onChange={(open) => updateDay(key, { open })}
                    />
                    <TimeInput
                      label="Close"
                      value={day.close}
                      disabled={!day.enabled}
                      onChange={(close) => updateDay(key, { close })}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <SectionCard
          icon={Coffee}
          title="Break time"
          description="Clients cannot book during these windows on working days."
          className="lg:col-span-2"
        >
          <ul className="space-y-4">
            {breaks.map((brk, index) => (
              <li
                key={brk.id}
                className="rounded-lg border border-outline-variant bg-surface-container p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={brk.label}
                    onChange={(e) =>
                      updateBreak(brk.id, { label: e.target.value })
                    }
                    placeholder="Break name"
                    className="min-w-0 flex-1 bg-transparent font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none"
                  />
                  {breaks.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeBreak(brk.id)}
                      aria-label={`Remove break ${index + 1}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <TimeInput
                    label="From"
                    value={brk.start}
                    onChange={(start) => updateBreak(brk.id, { start })}
                  />
                  <TimeInput
                    label="To"
                    value={brk.end}
                    onChange={(end) => updateBreak(brk.id, { end })}
                  />
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={addBreak}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-outline-variant py-2.5 text-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add break
          </button>
        </SectionCard>
      </div>

      <SectionCard
        icon={CalendarOff}
        title="Unavailable dates"
        description="Full days off — vacations, sick days, or shop closures. Overrides your weekly schedule."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="font-label-caps mb-1.5 block text-on-surface-variant">
              Pick a date
            </span>
            <input
              type="date"
              min={todayIso}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="h-10 w-full rounded-md border border-outline-variant bg-surface-container px-3 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={addUnavailableDate}
            disabled={!newDate}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden />
            Add date
          </button>
        </div>

        {sortedUnavailable.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {sortedUnavailable.map((iso) => (
              <li key={iso}>
                <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container px-3 py-1.5 text-sm text-on-surface">
                  <CalendarOff
                    className="h-3.5 w-3.5 text-primary"
                    aria-hidden
                  />
                  {formatDisplayDate(iso)}
                  <button
                    type="button"
                    onClick={() => removeUnavailableDate(iso)}
                    aria-label={`Remove ${formatDisplayDate(iso)}`}
                    className="ml-0.5 rounded-full p-0.5 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed border-outline-variant px-4 py-8 text-center text-sm text-on-surface-variant">
            No blocked dates yet. Add time off when you will not accept
            appointments.
          </p>
        )}
      </SectionCard>

      <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-outline-variant pt-6 sm:flex-row sm:items-center">
        <p className="text-xs text-on-surface-variant">
          Changes are stored locally until your shop backend is connected.
        </p>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-on-primary transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Save className="h-4 w-4" aria-hidden />
          {saved ? "Schedule saved" : "Save schedule"}
        </button>
      </div>
    </div>
  );
}
