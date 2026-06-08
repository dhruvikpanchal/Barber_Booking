"use client";

import { useMemo, useState, useEffect } from "react";
import { Minus, Plus, RefreshCw, X } from "lucide-react";
import { formatMoney, getTotalDuration } from "@/client/modules/customer/data/appointmentsData.js";
import { servicesEqual } from "@/client/modules/customer/helpers/appointments.js";
import Modal from "@/client/modules/shared/components/ui/Modal";

export default function RequestServiceChangeModal({
  appt,
  currentServices,
  catalog = [],
  onClose,
  onSubmit,
  submitting,
}) {
  const [selected, setSelected] = useState(() => currentServices.map((s) => ({ ...s })));
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!catalog.length) return;
    setSelected((prev) =>
      prev.map((s) => {
        if (s.id) return s;
        const match = catalog.find((c) => c.name === s.name);
        return match ? { ...match } : s;
      }),
    );
  }, [catalog]);

  const addOptions = useMemo(
    () =>
      catalog.filter(
        (c) => !selected.some((s) => s.id === c.id || (!s.id && s.name === c.name)),
      ),
    [selected, catalog],
  );

  const total = selected.reduce((sum, s) => sum + s.price, 0);
  const duration = getTotalDuration(selected);

  function removeService(key) {
    setSelected((prev) => prev.filter((s) => (s.id ?? s.name) !== key));
    setError("");
  }

  function addService(id) {
    const svc = catalog.find((c) => c.id === id);
    if (!svc) return;
    setSelected((prev) => [...prev, { ...svc }]);
    setError("");
  }

  function replaceService(oldKey, newId) {
    const svc = catalog.find((c) => c.id === newId);
    if (!svc) return;
    setSelected((prev) =>
      prev.map((s) => ((s.id ?? s.name) === oldKey ? { ...svc } : s)),
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
    const missingId = selected.some((s) => !s.id);
    if (missingId) {
      setError("Could not resolve service IDs. Try again.");
      return;
    }
    onSubmit({
      serviceIds: selected.map((s) => s.id),
      customerNote: note.trim(),
    });
  }

  if (!appt) return null;

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      labelledBy="request-service-change-title"
      backdropClassName="bg-black/60 backdrop-blur-sm"
      className="flex max-h-[92dvh] flex-col rounded-t-2xl sm:max-h-[90vh] sm:rounded-2xl"
      panelClassName="scrollbar-thin border-outline-variant bg-surface-container-low overflow-hidden border shadow-2xl"
    >
        <div className="border-outline-variant flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary/15 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <RefreshCw className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2
                id="request-service-change-title"
                className="text-on-surface font-serif text-base font-bold"
              >
                Request service change
              </h2>
              <p className="text-on-surface-variant text-xs">
                Your barber must approve updates before they take effect.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:bg-surface-container flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="scrollbar-thin min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {selected.map((s) => {
              const key = s.id ?? s.name;
              return (
                <div
                  key={key}
                  className="border-outline-variant bg-surface-container flex flex-wrap items-center gap-2 rounded-lg border p-3"
                >
                  <span className="text-on-surface min-w-0 flex-1 text-sm font-medium">
                    {s.name}
                  </span>
                  <select
                    value=""
                    onChange={(e) => replaceService(key, e.target.value)}
                    className="border-outline-variant bg-surface-container-low text-on-surface rounded-md border px-2 py-1 text-xs"
                  >
                    <option value="">Swap…</option>
                    {catalog
                      .filter((c) => c.id !== s.id && c.name !== s.name)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeService(key)}
                    className="text-status-cancelled hover:bg-status-cancelled/10 flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                    aria-label={`Remove ${s.name}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              );
            })}

            {addOptions.length > 0 && (
              <label className="block">
                <span className="font-label-caps text-on-surface-variant text-[10px]">
                  Add service
                </span>
                <select
                  value=""
                  onChange={(e) => addService(e.target.value)}
                  className="border-outline-variant bg-surface-container text-on-surface mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                >
                  <option value="">Choose a service…</option>
                  {addOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} · {formatMoney(c.price)}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="block">
              <span className="font-label-caps text-on-surface-variant text-[10px]">
                Note for your barber (optional)
              </span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="border-outline-variant bg-surface-container text-on-surface mt-1 w-full resize-none rounded-lg border px-3 py-2 text-sm"
                placeholder="Explain what you'd like changed…"
              />
            </label>

            {error ? (
              <p className="text-status-cancelled text-xs" role="alert">
                {error}
              </p>
            ) : null}

            <p className="text-on-surface-variant text-xs">
              New total estimate: {duration} min · {formatMoney(total)}
            </p>
          </div>

          <div className="border-outline-variant flex gap-2 border-t px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="border-outline-variant text-on-surface hover:bg-surface-container-high flex-1 rounded-xl border py-2.5 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-on-primary flex-1 rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send request"}
            </button>
          </div>
        </form>
    </Modal>
  );
}
