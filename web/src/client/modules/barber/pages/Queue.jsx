"use client";

import { useMemo, useState } from "react";
import { Plus, Radio } from "lucide-react";
import QueueStats from "@/client/modules/barber/components/Queue/QueueStats";
import ChairBoard from "@/client/modules/barber/components/Queue/ChairBoard";
import QueueRow from "@/client/modules/barber/components/Queue/QueueRow";
import AddToQueueModal, {
  EMPTY_FORM,
} from "@/client/modules/barber/components/Queue/AddToQueueModal";
import { INITIAL_CHAIRS, INITIAL_QUEUE } from "@/client/modules/barber/data/queueData";
import { STATUS_ORDER } from "@/client/modules/barber/constants/queue.js";
import { QUEUE_TABS, QUEUE_SOURCE_TABS } from "@/client/modules/barber/constants/barber.js";

function newId() {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function Queue() {
  const [chairs, setChairs] = useState(INITIAL_CHAIRS);
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [tab, setTab] = useState("active");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const stats = useMemo(() => {
    const waiting = queue.filter((q) => q.status === "waiting").length;
    const inService = queue.filter(
      (q) => q.status === "in-service" || q.status === "paused",
    ).length;
    const chairsFree = chairs.filter((c) => !c.customerId).length;
    const doneTimes = queue
      .filter((q) => q.status === "done" && q.startedAt)
      .map((q) => Math.round((q.startedAt - q.addedAt) / 60000))
      .filter((m) => m > 0);
    const avgWait = doneTimes.length
      ? Math.round(doneTimes.reduce((a, b) => a + b, 0) / doneTimes.length)
      : 0;
    return {
      waiting,
      inService,
      chairsFree,
      chairsTotal: chairs.length,
      avgWait,
    };
  }, [queue, chairs]);

  const waitingOrdered = useMemo(
    () => queue.filter((q) => q.status === "waiting").sort((a, b) => a.addedAt - b.addedAt),
    [queue],
  );

  const filtered = useMemo(() => {
    let list = queue;
    if (tab === "active") {
      list = list.filter(
        (q) => q.status === "waiting" || q.status === "in-service" || q.status === "paused",
      );
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

  function patchForm(patch) {
    setForm((p) => ({ ...p, ...patch }));
    setErrors((p) => {
      const n = { ...p };
      for (const k of Object.keys(patch)) delete n[k];
      return n;
    });
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setErrors({});
    setOpen(true);
  }

  function validate() {
    const n = {};
    if (!form.name.trim()) n.name = "Customer name is required.";
    if (!form.service) n.service = "Pick a service.";
    const d = Number(form.duration);
    if (!form.duration || Number.isNaN(d) || d < 5)
      n.duration = "Duration must be at least 5 minutes.";
    setErrors(n);
    return Object.keys(n).length === 0;
  }

  function submit() {
    if (!validate()) return;
    setQueue((prev) => [
      ...prev,
      {
        id: newId(),
        name: form.name.trim(),
        phone: form.phone.trim(),
        service: form.service,
        duration: Number(form.duration),
        source: form.source,
        status: "waiting",
        chairId: null,
        addedAt: Date.now(),
        notes: form.notes.trim(),
      },
    ]);
    setOpen(false);
  }

  function moveInQueue(id, delta) {
    const ordered = [...waitingOrdered];
    const idx = ordered.findIndex((q) => q.id === id);
    const j = idx + delta;
    if (idx < 0 || j < 0 || j >= ordered.length) return;
    const a = ordered[idx];
    const b = ordered[j];
    setQueue((prev) =>
      prev.map((q) => {
        if (q.id === a.id) return { ...q, addedAt: b.addedAt };
        if (q.id === b.id) return { ...q, addedAt: a.addedAt };
        return q;
      }),
    );
  }

  function seatAtChair(chairId, customerId) {
    setChairs((prev) =>
      prev.map((c) =>
        c.id === chairId
          ? { ...c, customerId }
          : c.customerId === customerId
            ? { ...c, customerId: null }
            : c,
      ),
    );
    setQueue((prev) =>
      prev.map((q) =>
        q.id === customerId ? { ...q, status: "in-service", chairId, startedAt: Date.now() } : q,
      ),
    );
  }

  function seatNext(chairId) {
    const next = waitingOrdered[0];
    if (!next) return;
    seatAtChair(chairId, next.id);
  }

  function seatSpecific(customerId) {
    const freeChair = chairs.find((c) => !c.customerId);
    if (!freeChair) return;
    seatAtChair(freeChair.id, customerId);
  }

  function completeByChair(chairId) {
    const chair = chairs.find((c) => c.id === chairId);
    if (!chair?.customerId) return;
    const customerId = chair.customerId;
    setChairs((prev) => prev.map((c) => (c.id === chairId ? { ...c, customerId: null } : c)));
    setQueue((prev) =>
      prev.map((q) =>
        q.id === customerId ? { ...q, status: "done", completedAt: Date.now(), chairId: null } : q,
      ),
    );
  }

  function completeByCustomer(customerId) {
    const chair = chairForCustomer(customerId);
    if (chair) return completeByChair(chair.id);
    setQueue((prev) =>
      prev.map((q) =>
        q.id === customerId ? { ...q, status: "done", completedAt: Date.now() } : q,
      ),
    );
  }

  function pauseToggle(chairId) {
    const chair = chairs.find((c) => c.id === chairId);
    if (!chair?.customerId) return;
    setQueue((prev) =>
      prev.map((q) =>
        q.id === chair.customerId
          ? {
              ...q,
              status: q.status === "paused" ? "in-service" : "paused",
            }
          : q,
      ),
    );
  }

  function clearChair(chairId) {
    const chair = chairs.find((c) => c.id === chairId);
    setChairs((prev) => prev.map((c) => (c.id === chairId ? { ...c, customerId: null } : c)));
    if (chair?.customerId) {
      setQueue((prev) =>
        prev.map((q) =>
          q.id === chair.customerId
            ? { ...q, status: "waiting", chairId: null, startedAt: undefined }
            : q,
        ),
      );
    }
  }

  function cancelCustomer(id) {
    const chair = chairForCustomer(id);
    if (chair) {
      setChairs((prev) => prev.map((c) => (c.id === chair.id ? { ...c, customerId: null } : c)));
    }
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "cancelled", chairId: null } : q)),
    );
  }

  function reopen(id) {
    setQueue((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status: "waiting", chairId: null, addedAt: Date.now() } : q,
      ),
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
        <button
          type="button"
          onClick={openAdd}
          className="bg-primary text-on-primary inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add to queue
        </button>
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
          onPauseToggle={pauseToggle}
          onClear={clearChair}
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
              {QUEUE_TABS.map((t) => {
                const active = tab === t.key;
                const count =
                  t.key === "active"
                    ? queue.filter(
                        (q) =>
                          q.status === "waiting" ||
                          q.status === "in-service" ||
                          q.status === "paused",
                      ).length
                    : t.key === "all"
                      ? queue.length
                      : queue.filter((q) => q.status === t.key).length;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "bg-primary text-on-primary"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {t.label}
                    <span
                      className={`rounded-full px-1.5 text-[10px] font-bold ${
                        active
                          ? "bg-on-primary/20 text-on-primary"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUEUE_SOURCE_TABS.map((s) => {
              const active = sourceFilter === s.key;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSourceFilter(s.key)}
                  className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-outline-variant text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
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
                  canMoveUp={waitIdx > 0}
                  canMoveDown={waitIdx >= 0 && waitIdx < waitingOrdered.length - 1}
                  onMove={moveInQueue}
                  onSeat={seatSpecific}
                  onComplete={completeByCustomer}
                  onCancel={cancelCustomer}
                  onReopen={reopen}
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

      <AddToQueueModal
        open={open}
        form={form}
        errors={errors}
        onChange={patchForm}
        onClose={() => setOpen(false)}
        onSubmit={submit}
      />
    </div>
  );
}
