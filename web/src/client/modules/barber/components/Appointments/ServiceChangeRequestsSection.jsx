"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, History, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { formatMoney } from "@/client/lib/format/formatMoney.js";
import { barberHook } from "@/client/modules/barber/hooks/barberQuery.jsx";
import { useBarberInvalidation } from "@/client/modules/barber/hooks/useBarberInvalidation.js";
import { mapBarberServiceChangeRequest } from "@/client/modules/barber/helpers/appointmentHelpers.js";

function ServiceChips({ services, label }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="font-label-caps text-on-surface-variant text-[10px]">{label}</p>
      <ul className="text-on-surface mt-1 space-y-0.5 text-sm">
        {(services ?? []).map((s) => (
          <li key={`${label}-${s.name}`}>
            {s.name}{" "}
            <span className="text-on-surface-variant text-xs">({formatMoney(s.price)})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RequestStatusPill({ status }) {
  const styles = {
    pending: "border-status-pending/30 bg-status-pending/15 text-status-pending",
    accepted: "border-status-confirmed/30 bg-status-confirmed/15 text-status-confirmed",
    rejected: "border-status-cancelled/30 bg-status-cancelled/15 text-status-cancelled",
  };
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${styles[status] ?? styles.pending}`}
    >
      {status}
    </span>
  );
}

function RequestCard({ req, actingId, onAccept, onReject, highlight, disabled }) {
  const snap = req.snapshot ?? {};
  const when = new Date(req.requestedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const resolvedWhen = req.resolvedAt
    ? new Date(req.resolvedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;
  const apptWhen = snap.startAt
    ? new Date(snap.startAt).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;
  const isPending = req.status === "pending";
  const isActing = actingId === req.id;

  return (
    <li
      className={`px-4 py-4 sm:px-5 ${
        highlight && isPending ? "bg-status-pending/5 ring-status-pending/25 ring-1 ring-inset" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-on-surface font-semibold">{snap.customer?.name ?? "Customer"}</p>
          <p className="text-on-surface-variant text-xs">
            #{req.appointmentId}
            {apptWhen ? ` · ${apptWhen}` : ""}
          </p>
          <p className="text-on-surface-variant mt-0.5 text-[11px]">
            Requested {when}
            {resolvedWhen ? ` · Resolved ${resolvedWhen}` : ""}
          </p>
        </div>
        <RequestStatusPill status={req.status} />
      </div>

      <div className="border-outline-variant bg-surface-container mt-3 flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-start">
        <ServiceChips services={req.previousServices ?? []} label="Current" />
        <ArrowRight
          className="text-primary mx-auto h-4 w-4 shrink-0 rotate-90 sm:rotate-0"
          aria-hidden
        />
        <ServiceChips services={req.requestedServices} label="Requested" />
      </div>

      {req.customerNote ? (
        <p className="border-outline-variant/60 bg-surface-container text-on-surface-variant mt-2 rounded-md border px-3 py-2 text-sm">
          <span className="text-on-surface font-medium">Note: </span>
          {req.customerNote}
        </p>
      ) : null}

      {isPending ? (
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            disabled={disabled || isActing}
            onClick={() => onReject(req)}
            className="border-outline-variant text-on-surface-variant hover:border-status-cancelled/40 hover:text-status-cancelled inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Reject
          </button>
          <button
            type="button"
            disabled={disabled || isActing}
            onClick={() => onAccept(req)}
            className="bg-primary text-on-primary inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" aria-hidden />
            Accept
          </button>
        </div>
      ) : null}
    </li>
  );
}

/**
 * @param {{
 *   appointmentId?: string | null,
 *   requests?: Array | null,
 *   showHistory?: boolean,
 *   compact?: boolean,
 * }} props
 */
export default function ServiceChangeRequestsSection({
  appointmentId = null,
  requests: requestsProp = null,
  showHistory = false,
  compact = false,
}) {
  const invalidate = useBarberInvalidation();
  const respondMutation = barberHook.Appointments.useRespondServiceChange();
  const [actingId, setActingId] = useState(null);

  const inboxQuery = barberHook.Appointments.useListPendingServiceChanges({
    enabled: !requestsProp && !appointmentId,
  });

  const busy = respondMutation.isPending || (!requestsProp && !appointmentId && inboxQuery.isPending);

  const allRequests = useMemo(() => {
    if (requestsProp) {
      return requestsProp.map((req) => mapBarberServiceChangeRequest(req));
    }
    if (!appointmentId) {
      return (inboxQuery.data?.requests ?? []).map((req) => mapBarberServiceChangeRequest(req));
    }
    return [];
  }, [requestsProp, appointmentId, inboxQuery.data?.requests]);

  const scoped = useMemo(() => {
    if (!appointmentId) return allRequests;
    return allRequests.filter((r) => r.appointmentId === appointmentId);
  }, [allRequests, appointmentId]);

  const pending = useMemo(
    () =>
      [...scoped]
        .filter((r) => r.status === "pending")
        .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)),
    [scoped],
  );

  const history = useMemo(
    () =>
      [...scoped]
        .filter((r) => r.status !== "pending")
        .sort(
          (a, b) =>
            new Date(b.resolvedAt ?? b.requestedAt) - new Date(a.resolvedAt ?? a.requestedAt),
        ),
    [scoped],
  );

  async function handleDecision(req, decision) {
    if (busy) return;
    setActingId(req.id);
    try {
      await toast.promise(
        respondMutation.mutateAsync({
          appointmentId: req.appointmentId,
          reqId: req.id,
          decision,
        }),
        {
          loading: decision === "ACCEPTED" ? "Accepting change…" : "Rejecting change…",
          success:
            decision === "ACCEPTED"
              ? "Service change accepted. The customer has been notified."
              : "Service change rejected. The customer has been notified.",
          error: "Could not update service change request.",
        },
      );
      await invalidate.operations();
      if (!requestsProp && !appointmentId) {
        await inboxQuery.refetch();
      }
    } catch {
      /* toast handles error */
    } finally {
      setActingId(null);
    }
  }

  const showPendingBlock = pending.length > 0 || !appointmentId;
  const showHistoryBlock = showHistory && history.length > 0;

  if (!requestsProp && !appointmentId && inboxQuery.isError) {
    return (
      <section className="border-outline-variant bg-surface-container-low text-on-surface-variant rounded-xl border px-4 py-8 text-center text-sm sm:px-5">
        Could not load service change requests.
      </section>
    );
  }

  if (appointmentId && pending.length === 0 && !showHistoryBlock) {
    return (
      <section className="border-outline-variant bg-surface-container-low text-on-surface-variant rounded-xl border px-4 py-8 text-center text-sm sm:px-5">
        No service change requests for this appointment.
      </section>
    );
  }

  if (!appointmentId && pending.length === 0 && !showHistoryBlock && !inboxQuery.isPending) {
    return (
      <section className="border-outline-variant bg-surface-container-low min-w-0 overflow-hidden rounded-xl border">
        <header className="border-outline-variant flex flex-col gap-3 border-b px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="bg-status-pending/15 text-status-pending flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10">
              <RefreshCw className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="text-on-surface font-serif text-base font-bold sm:text-lg">
                Service change requests
              </h2>
              <p className="text-on-surface-variant text-xs">0 awaiting your decision</p>
            </div>
          </div>
        </header>
        <div className="text-on-surface-variant px-4 py-10 text-center text-sm sm:px-5">
          No pending service change requests.
        </div>
      </section>
    );
  }

  return (
    <section
      className={`bg-surface-container-low min-w-0 overflow-hidden rounded-xl border ${
        pending.length > 0 && appointmentId
          ? "border-status-pending/40 shadow-status-pending/5 shadow-sm"
          : "border-outline-variant"
      }`}
    >
      <header
        className={`border-outline-variant flex flex-col gap-3 border-b px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${compact ? "py-3" : "sm:py-4"}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${
              pending.length > 0
                ? "bg-status-pending/15 text-status-pending"
                : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            <RefreshCw className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="text-on-surface font-serif text-base font-bold sm:text-lg">
              Service change requests
            </h2>
            <p className="text-on-surface-variant text-xs">
              {appointmentId
                ? `${pending.length} pending · ${history.length} in history`
                : `${pending.length} awaiting your decision`}
            </p>
          </div>
        </div>
        {pending.length > 0 && (
          <span className="border-status-pending/30 bg-status-pending/15 text-status-pending inline-flex shrink-0 self-start rounded-full border px-2.5 py-1 text-xs font-bold sm:self-center">
            {pending.length} pending
          </span>
        )}
      </header>

      {showPendingBlock && pending.length > 0 && (
        <ul className="divide-outline-variant divide-y">
          {pending.map((req) => (
            <RequestCard
              key={req.id}
              req={req}
              actingId={actingId}
              onAccept={(r) => handleDecision(r, "ACCEPTED")}
              onReject={(r) => handleDecision(r, "REJECTED")}
              highlight={Boolean(appointmentId)}
              disabled={busy}
            />
          ))}
        </ul>
      )}

      {showPendingBlock && pending.length === 0 && !appointmentId && inboxQuery.isPending && (
        <div className="text-on-surface-variant px-4 py-10 text-center text-sm sm:px-5">
          Loading service change requests…
        </div>
      )}

      {showPendingBlock && pending.length === 0 && !appointmentId && !inboxQuery.isPending && (
        <div className="text-on-surface-variant px-4 py-10 text-center text-sm sm:px-5">
          No pending service change requests.
        </div>
      )}

      {showHistoryBlock && (
        <>
          <div className="border-outline-variant bg-surface-container/50 flex items-center gap-2 border-t px-4 py-2.5 sm:px-5">
            <History className="text-on-surface-variant h-4 w-4" aria-hidden />
            <p className="font-label-caps text-on-surface-variant">Request history</p>
          </div>
          <ul className="divide-outline-variant divide-y">
            {history.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                actingId={actingId}
                onAccept={(r) => handleDecision(r, "ACCEPTED")}
                onReject={(r) => handleDecision(r, "REJECTED")}
                highlight={false}
                disabled={busy}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
