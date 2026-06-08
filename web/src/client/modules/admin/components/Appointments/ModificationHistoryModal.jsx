"use client";

import { History, X } from "lucide-react";
import Modal from "@/client/modules/shared/components/ui/Modal";

function formatTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ModificationHistoryModal({ appt, onClose }) {
  if (!appt) return null;

  const history = [...(appt.modificationHistory ?? [])].sort(
    (a, b) => new Date(b.at) - new Date(a.at),
  );

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      labelledBy="history-title"
      panelClassName="scrollbar-thin max-h-[85vh] overflow-y-auto rounded-xl border border-outline-variant bg-surface-container-low shadow-2xl"
    >
        <header className="flex items-start justify-between gap-3 border-b border-outline-variant px-5 py-4">
          <div>
            <p className="font-label-caps text-primary">Modification history</p>
            <h2
              id="history-title"
              className="font-serif text-lg font-bold text-on-surface"
            >
              #{appt.id}
            </h2>
            <p className="text-sm text-on-surface-variant">
              {appt.customer.name} · {appt.barberName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="p-5">
          {history.length === 0 ? (
            <p className="py-8 text-center text-sm text-on-surface-variant">
              No modifications recorded.
            </p>
          ) : (
            <ul className="divide-y divide-outline-variant rounded-lg border border-outline-variant">
              {history.map((entry, i) => (
                <li key={`${entry.at}-${i}`} className="flex gap-3 p-4">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <History className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-on-surface">{entry.change}</p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {entry.actor} · {formatTime(entry.at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
    </Modal>
  );
}
