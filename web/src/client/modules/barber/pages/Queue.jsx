"use client";

import { useEffect, useMemo, useState } from "react";
import { Radio } from "lucide-react";
import { toast } from "sonner";
import QueueStats from "@/client/modules/barber/components/Queue/QueueStats";
import ChairBoard from "@/client/modules/barber/components/Queue/ChairBoard";
import QueueRow from "@/client/modules/barber/components/Queue/QueueRow";
import AddToQueueModal, {
  EMPTY_FORM,
} from "@/client/modules/barber/components/Queue/AddToQueueModal";
import { STATUS_ORDER } from "@/client/modules/barber/constants/queueConstants.js";
import {
  QUEUE_TABS,
  QUEUE_SOURCE_TABS,
} from "@/client/modules/barber/constants/barberConstants.js";
import { barberHook, useBarberInvalidation } from "@/client/modules/barber/hooks/barberQuery.jsx";
import { mapChair, mapQueueEntry } from "@/client/modules/barber/helpers/barberMappers.js";

export default function Queue() {
  const [tab, setTab] = useState("active");
  const [sourceFilter, setSourceFilter] = useState("all");
  const invalidate = useBarberInvalidation();

  const queueQuery = barberHook.Queue.useGetQueue({ tab, source: sourceFilter });
  const statusMutation = barberHook.Queue.useUpdateQueueStatus();
  const assignMutation = barberHook.Queue.useAssignChair();
  const busy = queueQuery.isPending || statusMutation.isPending || assignMutation.isPending;

  useEffect(() => {
    if (queueQuery.isError) {
      toast.error(queueQuery.error?.message || "Could not load queue.");
    }
  }, [queueQuery.isError, queueQuery.error]);

  const snapshot = queueQuery.data;
  const chairs = useMemo(() => (snapshot?.chairs ?? []).map(mapChair), [snapshot?.chairs]);
  const queue = useMemo(() => (snapshot?.entries ?? []).map(mapQueueEntry), [snapshot?.entries]);

  const stats = useMemo(
    () => ({
      waiting: snapshot?.waiting ?? 0,
      inService: snapshot?.inService ?? 0,
      chairsFree: snapshot?.chairsFree ?? 0,
      chairsTotal: snapshot?.chairsTotal ?? chairs.length,
      avgWait: snapshot?.avgWaitMin ?? 0,
    }),
    [snapshot, chairs.length],
  );

  const waitingOrdered = useMemo(
    () => queue.filter((q) => q.status === "waiting").sort((a, b) => a.addedAt - b.addedAt),
    [queue],
  );

  const filtered = useMemo(() => {
    let list = queue;
    if (tab === "active") {
      list = list.filter((q) => q.status === "waiting" || q.status === "in-service");
    } else if (tab !== "all") {
      list = list.filter((q) => q.status === tab);
    }
    if (sourceFilter !== "all") {
      list = list.filter((q) => q.source === sourceFilter);
    }
    return [...list].sort((a, b) => {
      const r = STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
      if (r !== 0) return r;
      return a.addedAt - b.addedAt;
    });
  }, [queue, tab, sourceFilter]);

  const chairForCustomer = (customerId) => chairs.find((c) => c.customerId === customerId);

  async function refetch() {
    await queueQuery.refetch();
  }

  async function updateStatus(id, status) {
    if (busy) return;
    try {
      await statusMutation.mutateAsync({ id, status: status.toUpperCase().replace("-", "_") });
      await refetch();
      await invalidate.workflow();
    } catch {
      toast.error("Could not update queue status.");
    }
  }

  async function seatAtChair(chairId, entryId) {
    if (busy) return;
    try {
      await assignMutation.mutateAsync({ id: entryId, chairId });
      await statusMutation.mutateAsync({ id: entryId, status: "IN_SERVICE" });
      await refetch();
      await invalidate.workflow();
    } catch {
      toast.error("Could not assign chair.");
    }
  }

  function seatNext(chairId) {
    const next = waitingOrdered[0];
    if (!next) return;
    seatAtChair(chairId, next.id);
  }

  function seatSpecific(entryId) {
    const freeChair = chairs.find((c) => !c.customerId);
    if (!freeChair) return;
    seatAtChair(freeChair.id, entryId);
  }

  async function completeByChair(chairId) {
    const chair = chairs.find((c) => c.id === chairId);
    if (!chair?.customerId) return;
    await updateStatus(chair.customerId, "done");
  }

  async function completeByCustomer(entryId) {
    await updateStatus(entryId, "done");
  }

  async function cancelCustomer(id) {
    await updateStatus(id, "cancelled");
  }

  async function reopen(id) {
    await updateStatus(id, "waiting");
  }

  if (queueQuery.isPending && !snapshot) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 pb-6">
        <div className="bg-surface-container h-24 animate-pulse rounded-xl" />
        <div className="bg-surface-container h-64 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (queueQuery.isError && !snapshot) {
    return (
      <div className="mx-auto max-w-6xl pb-6 text-center">
        <p className="text-on-surface font-serif text-xl font-bold">Could not load queue</p>
        <p className="text-on-surface-variant mt-2 text-sm">
          {queueQuery.error?.message ?? "Please try again in a moment."}
        </p>
        <button
          type="button"
          onClick={() => queueQuery.refetch()}
          disabled={queueQuery.isFetching}
          className="bg-primary text-on-primary mt-4 inline-flex h-10 items-center rounded-md px-5 text-sm font-semibold hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {queueQuery.isFetching ? "Retrying…" : "Try again"}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="font-label-caps text-primary">Barber · Queue</p>
          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            Queue management
          </h1>
          <p className="text-on-surface-variant flex max-w-xl items-center gap-2 text-sm leading-relaxed">
            <Radio className="text-status-confirmed h-3.5 w-3.5 animate-pulse" aria-hidden />
            Live board · online bookings and walk-ins in one flow.
          </p>
        </div>
      </header>

      <QueueStats stats={stats} />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-on-surface font-serif text-lg font-bold">Chair status</h2>
          <p className="text-on-surface-variant text-xs">
            {stats.chairsFree} free · {chairs.length - stats.chairsFree} occupied
          </p>
        </div>
        <ChairBoard
          chairs={chairs}
          queue={queue}
          onAssignNext={seatNext}
          onComplete={completeByChair}
          onPauseToggle={() => toast.info("Pause is not available for live queue entries.")}
          onClear={(chairId) => {
            const chair = chairs.find((c) => c.id === chairId);
            if (chair?.customerId) cancelCustomer(chair.customerId);
          }}
        />
      </section>

      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        <div className="border-outline-variant flex flex-col gap-4 border-b px-5 py-4 md:px-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-on-surface font-serif text-lg font-bold">Live queue</h2>
              <p className="text-on-surface-variant text-sm">
                {stats.waiting} waiting · {stats.inService} in chair
              </p>
            </div>
            <div className="scrollbar-thin border-outline-variant -mx-1 flex gap-1 overflow-x-auto rounded-lg border p-0.5">
              {QUEUE_TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => !busy && setTab(t.key)}
                  disabled={busy}
                  className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    tab === t.key
                      ? "bg-primary text-on-primary"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUEUE_SOURCE_TABS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => !busy && setSourceFilter(s.key)}
                disabled={busy}
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  sourceFilter === s.key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-outline-variant text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 p-4 md:p-6">
          {filtered.length > 0 ? (
            filtered.map((entry) => {
              const waitIdx = waitingOrdered.findIndex((q) => q.id === entry.id);
              const position = waitIdx >= 0 ? waitIdx + 1 : "";
              const chair = chairForCustomer(entry.id);
              return (
                <QueueRow
                  key={entry.id}
                  entry={entry}
                  position={position}
                  chairLabel={chair?.label}
                  canMoveUp={false}
                  canMoveDown={false}
                  onMove={() => {}}
                  onSeat={seatSpecific}
                  onComplete={completeByCustomer}
                  onCancel={cancelCustomer}
                  onReopen={reopen}
                  disabled={busy}
                />
              );
            })
          ) : (
            <div className="border-outline-variant rounded-lg border border-dashed px-4 py-14 text-center">
              <p className="text-on-surface font-serif text-base font-bold">
                Nothing here right now
              </p>
              <p className="text-on-surface-variant mt-1 text-sm">
                Add a customer or wait for online bookings.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
