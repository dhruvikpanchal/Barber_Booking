"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import customerServices from "@/client/modules/customer/services/customerServices.jsx";
import { formatLocalDate } from "@/client/modules/shared/helpers/formatLocalDate";

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
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export default function BookingStep3DateTime({ booking, onSelect, disabled = false }) {
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

  const [timeSlots, setTimeSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const selectedDate = booking.date ? new Date(booking.date) : null;
  const slug = booking.barber?.slug ?? booking.barber?.id;

  const monthStart = startOfMonth(cursor);
  const firstDow = monthStart.getDay();
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();

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
    onSelect({ date: d.toISOString(), time: null, timeLabel: null });
  }

  function pickTime(slot) {
    if (!slot.available) return;
    onSelect({ time: slot.id, timeLabel: slot.label });
  }

  useEffect(() => {
    if (!selectedDate || !slug || booking.services.length === 0) {
      setTimeSlots([]);
      return;
    }
    let cancelled = false;
    setSlotsLoading(true);
    const duration = booking.services.reduce((s, sv) => s + sv.duration, 0);
    const serviceIds = booking.services.map((s) => s.id);

    customerServices
      .getAvailableSlots(slug, {
        date: formatLocalDate(selectedDate),
        duration,
        serviceIds,
      })
      .then((slots) => {
        if (!cancelled) setTimeSlots(Array.isArray(slots) ? slots : []);
      })
      .catch(() => {
        if (!cancelled) setTimeSlots([]);
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, slug, booking.services]);

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
      <div className="border-outline-variant bg-surface-container-low rounded-xl border p-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => !disabled && goMonth(-1)}
            disabled={disabled}
            className="border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-on-surface font-serif text-sm font-bold">
            {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
          </p>
          <button
            type="button"
            onClick={() => !disabled && goMonth(1)}
            disabled={disabled}
            className="border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface flex h-8 w-8 items-center justify-center rounded-md border transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-1 grid grid-cols-7 gap-1">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-on-surface-variant py-1 text-center text-[11px] font-semibold tracking-wide uppercase"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (!day) return <div key={`e${idx}`} />;

            const cellDate = new Date(cursor.getFullYear(), cursor.getMonth(), day);
            const isPast = cellDate < today;
            const isToday = isSameDay(cellDate, today);
            const isSelected = selectedDate && isSameDay(cellDate, selectedDate);

            return (
              <button
                key={day}
                type="button"
                disabled={isPast || disabled}
                onClick={() => !disabled && pickDate(day)}
                className={`relative flex h-9 w-full items-center justify-center rounded-lg text-sm transition-all ${
                  isPast
                    ? "text-on-surface-variant/30 cursor-not-allowed"
                    : isSelected
                      ? "bg-primary text-on-primary font-semibold shadow-sm"
                      : isToday
                        ? "border-primary/50 text-primary hover:bg-primary/10 border font-semibold"
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
          <div className="border-outline-variant flex h-full items-center justify-center rounded-xl border border-dashed p-8">
            <div className="text-center">
              <Clock className="text-on-surface-variant/40 mx-auto mb-2 h-8 w-8" />
              <p className="text-on-surface-variant text-sm">Pick a date to see available times</p>
            </div>
          </div>
        ) : booking.services.length === 0 ? (
          <div className="border-outline-variant flex h-full items-center justify-center rounded-xl border border-dashed p-8">
            <p className="text-on-surface-variant text-center text-sm">
              Select services first to load time slots.
            </p>
          </div>
        ) : slotsLoading ? (
          <div className="border-outline-variant bg-surface-container-low space-y-2 rounded-xl border p-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface-container h-8 animate-pulse rounded-md" />
            ))}
          </div>
        ) : (
          <div className="border-outline-variant bg-surface-container-low space-y-4 rounded-xl border p-4">
            <p className="font-label-caps text-on-surface-variant text-xs">Available times</p>

            {morningSlots.length > 0 && (
              <div>
                <p className="text-on-surface-variant/70 mb-2 text-[11px] font-semibold tracking-wide uppercase">
                  Morning
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {morningSlots.map((slot) => {
                    const sel = booking.time === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={disabled || !slot.available}
                        onClick={() => !disabled && pickTime(slot)}
                        className={`rounded-md border py-2 text-xs font-medium transition-all ${
                          disabled || !slot.available
                            ? "border-outline-variant/40 text-on-surface-variant/30 cursor-not-allowed line-through"
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
                <p className="text-on-surface-variant/70 mb-2 text-[11px] font-semibold tracking-wide uppercase">
                  Afternoon
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {afternoonSlots.map((slot) => {
                    const sel = booking.time === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={disabled || !slot.available}
                        onClick={() => !disabled && pickTime(slot)}
                        className={`rounded-md border py-2 text-xs font-medium transition-all ${
                          disabled || !slot.available
                            ? "border-outline-variant/40 text-on-surface-variant/30 cursor-not-allowed line-through"
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

            {morningSlots.length === 0 && afternoonSlots.length === 0 && (
              <p className="text-on-surface-variant text-xs">No slots available on this date.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
