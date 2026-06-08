"use client";

import { useMemo, useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import WalkInCard from "@/client/modules/barber/components/WalkIns/WalkInCard";
import WalkInFormModal from "@/client/modules/barber/components/WalkIns/WalkInFormModal";
import QueueStats from "@/client/modules/barber/components/WalkIns/QueueStats";
import { STATUS_ORDER, STATUSES, WALK_IN_TABS } from "@/client/modules/barber/constants/walk_In";
import { EMPTY_WALK_IN_FORM } from "@/client/modules/shared/constants/empty_form.js";
import { INITIAL } from "@/client/modules/barber/data/walkinsData.js";
import { createId } from "@/client/modules/shared/helpers/createId.js";

export default function WalkIns() {
  const [entries, setEntries] = useState(INITIAL);
  const [tab, setTab] = useState("active");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_WALK_IN_FORM);
  const [errors, setErrors] = useState({});

  const stats = useMemo(() => {
    const waiting = entries.filter((e) => e.status === "waiting").length;
    const inService = entries.filter((e) => e.status === "in-service").length;
    const done = entries.filter((e) => e.status === "done");
    const waits = done
      .map((e) => Math.max(0, Math.round((Date.now() - e.addedAt) / 60000)))
      .filter(Boolean);
    const avgWait = waits.length ? Math.round(waits.reduce((a, b) => a + b, 0) / waits.length) : 0;
    return { waiting, inService, done: done.length, avgWait };
  }, [entries]);

  const filtered = useMemo(() => {
    let list = entries;
    if (tab === "active") {
      list = entries.filter((e) => e.status === "waiting" || e.status === "in-service");
    } else if (tab !== "all") {
      list = entries.filter((e) => e.status === tab);
    }
    const rank = (s) => STATUS_ORDER.indexOf(s);
    return [...list].sort((a, b) => {
      const r = rank(a.status) - rank(b.status);
      if (r !== 0) return r;
      return a.addedAt - b.addedAt;
    });
  }, [entries, tab]);

  const waitingOrder = useMemo(() => {
    const map = new Map();
    entries
      .filter((e) => e.status === "waiting")
      .sort((a, b) => a.addedAt - b.addedAt)
      .forEach((e, i) => map.set(e.id, i + 1));
    entries.filter((e) => e.status === "in-service").forEach((e) => map.set(e.id, "•"));
    return map;
  }, [entries]);

  function patchForm(patch) {
    setForm((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(patch)) delete next[k];
      return next;
    });
  }

  function openAdd() {
    setForm(EMPTY_WALK_IN_FORM);
    setErrors({});
    setFormOpen(true);
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Customer name is required.";
    if (!form.service) next.service = "Pick a service.";
    const d = Number(form.duration);
    if (!form.duration || Number.isNaN(d) || d < 5)
      next.duration = "Duration must be at least 5 minutes.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit() {
    if (!validate()) return;
    setEntries((prev) => [
      ...prev,
      {
        id: createId(),
        name: form.name.trim(),
        phone: form.phone.trim(),
        service: form.service,
        duration: Number(form.duration),
        notes: form.notes.trim(),
        status: "waiting",
        addedAt: Date.now(),
      },
    ]);
    setFormOpen(false);
    setForm(EMPTY_WALK_IN_FORM);
  }

  function advance(id) {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        if (e.status === "waiting") return { ...e, status: "in-service" };
        if (e.status === "in-service") return { ...e, status: "done" };
        return e;
      }),
    );
  }
  function cancel(id) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "cancelled" } : e)));
  }
  function reopen(id) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "waiting", addedAt: Date.now() } : e)),
    );
  }
  function remove(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-4">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="font-label-caps text-primary">Barber · Walk-ins</p>
          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            Walk-in queue
          </h1>
          <p className="text-on-surface-variant max-w-xl text-sm leading-relaxed">
            Drop in customers, manage the live queue, and move them through service with one tap.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="bg-primary text-on-primary inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add walk-in
        </button>
      </header>

      <QueueStats stats={stats} />

      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        <div className="border-outline-variant flex flex-col gap-4 border-b px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <span className="bg-primary/15 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <UserPlus className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-on-surface font-serif text-lg font-bold">Live queue</h2>
              <p className="text-on-surface-variant text-sm">
                {stats.waiting} waiting · {stats.inService} in chair
              </p>
            </div>
          </div>
          <div className="scrollbar-thin border-outline-variant -mx-1 flex gap-1 overflow-x-auto rounded-lg border p-0.5">
            {WALK_IN_TABS.map((t) => {
              const active = tab === t.key;
              const count =
                t.key === "active"
                  ? stats.waiting + stats.inService
                  : t.key === "all"
                    ? entries.length
                    : entries.filter((e) => e.status === t.key).length;
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

        <div className="space-y-3 p-4 md:p-6">
          {filtered.length > 0 ? (
            filtered.map((entry) => (
              <WalkInCard
                key={entry.id}
                entry={entry}
                position={waitingOrder.get(entry.id) ?? ""}
                onAdvance={advance}
                onCancel={cancel}
                onReopen={reopen}
                onRemove={remove}
              />
            ))
          ) : (
            <div className="border-outline-variant rounded-lg border border-dashed px-4 py-14 text-center">
              <p className="text-on-surface font-serif text-base font-bold">
                No {STATUSES[tab]?.label.toLowerCase() ?? "walk-ins"} right now
              </p>
              <p className="text-on-surface-variant mt-1 text-sm">
                Add a walk-in to get the queue moving.
              </p>
            </div>
          )}
        </div>
      </section>

      <WalkInFormModal
        open={formOpen}
        form={form}
        errors={errors}
        onChange={patchForm}
        onClose={() => setFormOpen(false)}
        onSubmit={submit}
      />
    </div>
  );
}
