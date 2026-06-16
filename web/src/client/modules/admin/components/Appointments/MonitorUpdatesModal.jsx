"use client";

import { Activity, Radio, X } from "lucide-react";
import Modal from "@/client/modules/shared/components/ui/Modal";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { APPOINTMENT_STATUSES } from "@/client/modules/admin/constants/adminConstants.js";

function formatLogTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MonitorUpdatesModal({ appt, onClose }) {
  if (!appt) return null;

  const log = [...(appt.activityLog ?? [])].sort((a, b) => new Date(b.at) - new Date(a.at));

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      labelledBy="monitor-title"
      panelClassName="scrollbar-thin max-h-[85vh] overflow-y-auto rounded-xl border border-outline-variant bg-surface-container-low shadow-2xl"
    >
      <header className="border-outline-variant flex items-start justify-between gap-3 border-b px-5 py-4">
        <div>
          <p className="font-label-caps text-primary">Monitor updates</p>
          <h2 id="monitor-title" className="text-on-surface font-serif text-lg font-bold">
            {appt.customer.name}
          </h2>
          <p className="text-on-surface-variant text-xs">#{appt.id}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-on-surface-variant hover:bg-surface-container flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </header>

      <div className="space-y-4 p-5">
        <div className="border-outline-variant bg-surface-container flex items-center justify-between rounded-lg border px-4 py-3">
          <span className="text-on-surface-variant inline-flex items-center gap-2 text-sm">
            <Radio className="text-status-confirmed h-4 w-4" aria-hidden />
            Live feed
          </span>
          <StatusBadge status={appt.status} config={APPOINTMENT_STATUSES} />
        </div>

        {log.length === 0 ? (
          <p className="text-on-surface-variant py-8 text-center text-sm">
            No activity recorded yet.
          </p>
        ) : (
          <ul className="space-y-0">
            {log.map((entry, i) => (
              <li
                key={`${entry.at}-${i}`}
                className="border-primary/30 relative flex gap-3 border-l-2 py-3 pl-5 last:pb-0"
              >
                <span className="bg-primary/20 absolute top-4 -left-[9px] flex h-4 w-4 items-center justify-center rounded-full">
                  <Activity className="text-primary h-2.5 w-2.5" aria-hidden />
                </span>
                <div>
                  <p className="text-on-surface text-sm">{entry.message}</p>
                  <p className="text-on-surface-variant mt-0.5 text-xs">
                    {formatLogTime(entry.at)}
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
