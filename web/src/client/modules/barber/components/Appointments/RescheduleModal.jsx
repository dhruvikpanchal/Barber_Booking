"use client";

import { useEffect, useState } from "react";
import { CalendarClock, X } from "lucide-react";
import Modal from "@/client/modules/shared/components/ui/Modal";

function toDateInput(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function toTimeInput(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function RescheduleModal({ open, appt, onClose, onSubmit }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && appt) {
      setDate(toDateInput(appt.startAt));
      setTime(toTimeInput(appt.startAt));
      setError("");
    }
  }, [open, appt]);

  if (!open || !appt) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!date || !time) {
      setError("Pick a new date and time.");
      return;
    }
    const next = new Date(`${date}T${time}`);
    if (Number.isNaN(next.getTime())) {
      setError("Invalid date/time.");
      return;
    }
    onSubmit(appt.id, next.toISOString());
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="md"
      className="rounded-t-2xl sm:rounded-2xl"
      panelClassName="border-outline-variant bg-surface-container-low p-6 shadow-2xl"
    >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <CalendarClock className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-serif text-lg font-bold text-on-surface">
                Reschedule
              </h2>
              <p className="text-xs text-on-surface-variant">
                {appt.customer.name} · {appt.service}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="font-label-caps text-on-surface-variant">
                Date
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-md border border-outline-variant bg-surface-container px-3 text-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-label-caps text-on-surface-variant">
                Time
              </span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1.5 h-11 w-full rounded-md border border-outline-variant bg-surface-container px-3 text-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </label>
          </div>
          {error && (
            <p className="text-xs font-medium text-status-cancelled">{error}</p>
          )}
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-md border border-outline-variant px-4 text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-11 rounded-md bg-primary px-5 text-sm font-semibold text-on-primary hover:opacity-90"
            >
              Save new time
            </button>
          </div>
        </form>
    </Modal>
  );
}
