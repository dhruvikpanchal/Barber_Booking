"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, RefreshCw, X } from "lucide-react";
import { BOOKING_SERVICES } from "../../../../data/customer/bookingData.js";
import {
  formatMoney,
  getTotalDuration,
} from "../../../../data/customer/appointmentsData.js";
import { servicesEqual } from "./serviceChangeUtils.js";

const CATALOG = BOOKING_SERVICES.map((s) => ({
  name: s.name,
  duration: s.duration,
  price: s.price,
}));

export default function RequestServiceChangeModal({
  appt,
  currentServices,
  onClose,
  onSubmit,
  submitting,
}) {
  const [selected, setSelected] = useState(() =>
    currentServices.map((s) => ({ ...s })),
  );
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const addOptions = useMemo(
    () => CATALOG.filter((c) => !selected.some((s) => s.name === c.name)),
    [selected],
  );

  const total = selected.reduce((sum, s) => sum + s.price, 0);
  const duration = getTotalDuration(selected);

  function removeService(name) {
    setSelected((prev) => prev.filter((s) => s.name !== name));
    setError("");
  }

  function addService(name) {
    const svc = CATALOG.find((c) => c.name === name);
    if (!svc) return;
    setSelected((prev) => [...prev, { ...svc }]);
    setError("");
  }

  function replaceService(oldName, newName) {
    const svc = CATALOG.find((c) => c.name === newName);
    if (!svc) return;
    setSelected((prev) =>
      prev.map((s) => (s.name === oldName ? { ...svc } : s)),
    );
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (selected.length === 0) {
      setError("Select at least one service.");
      return;
    }
    if (servicesEqual(selected, currentServices)) {
      setError("Change at least one service before submitting.");
      return;
    }
    onSubmit({ requestedServices: selected, customerNote: note.trim() });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-service-change-title"
    >
      <div
        className="scrollbar-thin flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-outline-variant bg-surface-container-low shadow-2xl sm:max-h-[90vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <RefreshCw className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p
                id="request-service-change-title"
                className="font-semibold text-on-surface"
              >
                Request service change
              </p>
              <p className="text-xs text-on-surface-variant">
                Add, remove, or replace services — barber must approve
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-5 py-4">
            <p className="text-xs text-on-surface-variant">
              Booking #{appt.id} · {appt.barber.name}
            </p>

            <div>
              <p className="font-label-caps mb-2 text-[10px] text-on-surface-variant">
                Current selection
              </p>
              <ul className="space-y-2">
                {selected.map((s) => (
                  <li
                    key={s.name}
                    className="flex flex-col gap-2 rounded-lg border border-outline-variant bg-surface-container p-3 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-on-surface">
                        {s.name}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {s.duration}m · {formatMoney(s.price)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {addOptions.length > 0 && (
                        <label
                          className="sr-only"
                          htmlFor={`replace-${s.name}`}
                        >
                          Replace {s.name}
                        </label>
                      )}
                      <select
                        id={`replace-${s.name}`}
                        value=""
                        onChange={(e) => {
                          if (e.target.value)
                            replaceService(s.name, e.target.value);
                          e.target.value = "";
                        }}
                        className="h-8 max-w-[10rem] flex-1 rounded-md border border-outline-variant bg-surface-container-low px-2 text-xs text-on-surface"
                      >
                        <option value="">Replace with…</option>
                        {CATALOG.filter((c) => c.name !== s.name).map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeService(s.name)}
                        disabled={selected.length <= 1}
                        className="inline-flex h-8 items-center gap-1 rounded-md border border-status-cancelled/30 px-2.5 text-xs font-semibold text-status-cancelled transition-colors hover:bg-status-cancelled/10 disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" aria-hidden />
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {addOptions.length > 0 && (
              <div>
                <p className="font-label-caps mb-2 text-[10px] text-on-surface-variant">
                  Add a service
                </p>
                <div className="flex gap-2">
                  <select
                    id="add-service"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) addService(e.target.value);
                      e.target.value = "";
                    }}
                    className="h-10 min-w-0 flex-1 rounded-md border border-outline-variant bg-surface-container px-3 text-sm text-on-surface"
                  >
                    <option value="">Choose service to add…</option>
                    {addOptions.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} · {formatMoney(c.price)}
                      </option>
                    ))}
                  </select>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-outline-variant text-primary">
                    <Plus className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="change-note"
                className="font-label-caps mb-2 block text-[10px] text-on-surface-variant"
              >
                Message to barber (optional)
              </label>
              <textarea
                id="change-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="e.g. Can we swap beard sculpt for hot towel shave?"
                className="w-full resize-none rounded-md border border-outline-variant bg-surface-container px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-3 text-sm">
              <p className="text-on-surface-variant">New estimated total</p>
              <p className="font-serif text-xl font-bold text-primary">
                {formatMoney(total)}
              </p>
              <p className="text-xs text-on-surface-variant">
                {duration} min total
              </p>
            </div>

            {error ? (
              <p className="text-sm text-status-cancelled" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-outline-variant p-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-outline-variant px-4 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
