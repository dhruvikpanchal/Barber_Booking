"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { generateTimeSlots } from "@/data/customer/bookingData.js";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
  );
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default function BookingStep3DateTime({ booking, onSelect }) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const selectedDate = booking.date ? new Date(booking.date) : null;

  const monthStart = startOfMonth(cursor);
  const firstDow = monthStart.getDay();
  const daysInMonth = new Date(
    cursor.getFullYear(),
    cursor.getMonth() + 1,
    0,
  ).getDate();

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function goMonth(delta) {
    setCursor((prev) => {
      const n = new Date(prev);
      n.setMonth(n.getMonth() + delta, 1);
      return n;
    });
  }

  function pickDate(day) {
    const d = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    if (d < today) return;
    onSelect({ date: d.toISOString(), time: null });
  }

  function pickTime(slot) {
    if (!slot.available) return;
    onSelect({ time: slot.id, timeLabel: slot.label });
  }

  const timeSlots = useMemo(
    () => (selectedDate ? generateTimeSlots(selectedDate) : []),
    [selectedDate],
  );

  const morningSlots = timeSlots.filter((s) => {
    const [h] = s.id.split(":").map(Number);
    return h < 12;
  });
  const afternoonSlots = timeSlots.filter((s) => {
    const [h] = s.id.split(":").map(Number);
    return h >= 12;
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
      <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => goMonth(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-outline hover:text-on-surface"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="font-serif text-sm font-bold text-on-surface">
            {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
          </p>
          <button
            type="button"
            onClick={() => goMonth(1)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-outline hover:text-on-surface"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1">
          {DAYS.map((d) => (
            <div
              key={d}
              className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (!day) return <div key={`e${idx}`} />;

            const cellDate = new Date(
              cursor.getFullYear(),
              cursor.getMonth(),
              day,
            );
            const isPast = cellDate < today;
            const isToday = isSameDay(cellDate, today);
            const isSelected =
              selectedDate && isSameDay(cellDate, selectedDate);

            return (
              <button
                key={day}
                type="button"
                disabled={isPast}
                onClick={() => pickDate(day)}
                className={`relative flex h-9 w-full items-center justify-center rounded-lg text-sm transition-all
                  ${
                    isPast
                      ? "cursor-not-allowed text-on-surface-variant/30"
                      : isSelected
                        ? "bg-primary font-semibold text-on-primary shadow-sm"
                        : isToday
                          ? "border border-primary/50 font-semibold text-primary hover:bg-primary/10"
                          : "hover:bg-surface-container-high text-on-surface"
                  }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0 lg:w-64">
        {!selectedDate ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-outline-variant p-8">
            <div className="text-center">
              <Clock className="mx-auto mb-2 h-8 w-8 text-on-surface-variant/40" />
              <p className="text-sm text-on-surface-variant">
                Pick a date to see available times
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 rounded-xl border border-outline-variant bg-surface-container-low p-4">
            <p className="font-label-caps text-xs text-on-surface-variant">
              Available times
            </p>

            {morningSlots.length > 0 && (
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant/70">
                  Morning
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {morningSlots.map((slot) => {
                    const sel = booking.time === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => pickTime(slot)}
                        className={`rounded-md border py-2 text-xs font-medium transition-all
                          ${
                            !slot.available
                              ? "cursor-not-allowed border-outline-variant/40 text-on-surface-variant/30 line-through"
                              : sel
                                ? "border-primary bg-primary text-on-primary shadow-sm"
                                : "border-outline-variant bg-surface-container text-on-surface hover:border-primary/40 hover:bg-primary/5"
                          }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {afternoonSlots.length > 0 && (
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant/70">
                  Afternoon
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {afternoonSlots.map((slot) => {
                    const sel = booking.time === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => pickTime(slot)}
                        className={`rounded-md border py-2 text-xs font-medium transition-all
                          ${
                            !slot.available
                              ? "cursor-not-allowed border-outline-variant/40 text-on-surface-variant/30 line-through"
                              : sel
                                ? "border-primary bg-primary text-on-primary shadow-sm"
                                : "border-outline-variant bg-surface-container text-on-surface hover:border-primary/40 hover:bg-primary/5"
                          }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
