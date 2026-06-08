"use client";

import { ArrowRight, Clock, Scissors } from "lucide-react";
import { formatMoney, getTotalDuration } from "@/modules/customer/data/appointmentsData.js";
import ChangeRequestPendingBadge from "./ChangeRequestPendingBadge.jsx";
import ChangeRequestStatusBadge from "./ChangeRequestStatusBadge.jsx";

function ServiceList({ services, title }) {
  if (!services?.length) return null;
  const duration = getTotalDuration(services);
  const total = services.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="border-outline-variant bg-surface-container min-w-0 flex-1 rounded-lg border p-3 sm:p-4">
      <p className="font-label-caps text-on-surface-variant text-[10px]">{title}</p>
      <ul className="mt-2 space-y-2">
        {services.map((s) => (
          <li key={`${title}-${s.name}`} className="flex items-start justify-between gap-2 text-sm">
            <span className="text-on-surface min-w-0">{s.name}</span>
            <span className="text-on-surface-variant shrink-0 text-xs">
              {s.duration}m · {formatMoney(s.price)}
            </span>
          </li>
        ))}
      </ul>
      <p className="border-outline-variant/60 text-on-surface-variant mt-2 border-t pt-2 text-xs">
        {duration} min · {formatMoney(total)}
      </p>
    </div>
  );
}

function resolveRequestStatus(pendingChangeRequest, latestChangeRequest, hasUpdate) {
  if (pendingChangeRequest?.status === "pending") return "pending";
  if (latestChangeRequest?.status === "rejected") return "rejected";
  if (latestChangeRequest?.status === "accepted" || hasUpdate) {
    return "accepted";
  }
  return null;
}

export default function ServiceUpdateRequest({
  originalServices = [],
  updatedServices = null,
  pendingChangeRequest = null,
  latestChangeRequest = null,
}) {
  const hasUpdate =
    updatedServices && JSON.stringify(originalServices) !== JSON.stringify(updatedServices);
  const pending = pendingChangeRequest?.status === "pending";
  const requestStatus = resolveRequestStatus(pendingChangeRequest, latestChangeRequest, hasUpdate);
  const rejectedRequest = latestChangeRequest?.status === "rejected" ? latestChangeRequest : null;

  const subtitle = pending
    ? "Your change request is awaiting barber approval."
    : requestStatus === "rejected"
      ? "Your barber declined the requested service change."
      : requestStatus === "accepted"
        ? "Your barber approved an updated service list."
        : "Booked services for this appointment.";

  return (
    <section className="border-outline-variant bg-surface-container-low min-w-0 overflow-hidden rounded-xl border">
      <header className="border-outline-variant flex flex-col gap-3 border-b px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="bg-primary/15 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <Scissors className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="text-on-surface font-serif text-base font-bold sm:text-lg">
              Selected services
            </h2>
            <p className="text-on-surface-variant text-xs">{subtitle}</p>
          </div>
        </div>
        {requestStatus === "pending" ? (
          <ChangeRequestPendingBadge className="self-start sm:self-center" />
        ) : requestStatus ? (
          <ChangeRequestStatusBadge status={requestStatus} className="self-start sm:self-center" />
        ) : null}
      </header>

      <div className="p-4 sm:p-5">
        {pending ? (
          <div className="border-status-pending/25 bg-status-pending/8 mb-4 rounded-lg border p-3 sm:p-4">
            <div className="flex items-start gap-2">
              <Clock className="text-status-pending mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <div className="min-w-0">
                <p className="text-on-surface text-sm font-medium">Requested services</p>
                <ul className="text-on-surface-variant mt-2 space-y-1 text-sm">
                  {pendingChangeRequest.requestedServices.map((s) => (
                    <li key={s.name}>
                      {s.name} · {s.duration}m · {formatMoney(s.price)}
                    </li>
                  ))}
                </ul>
                {pendingChangeRequest.customerNote ? (
                  <p className="text-on-surface-variant mt-2 text-xs">
                    <span className="text-on-surface font-medium">Your note: </span>
                    {pendingChangeRequest.customerNote}
                  </p>
                ) : null}
              </div>
            </div>
            <p className="text-on-surface-variant mt-3 text-xs">
              Current booked services remain active until the barber responds.
            </p>
          </div>
        ) : null}

        {rejectedRequest && !pending ? (
          <div className="border-status-cancelled/25 bg-status-cancelled/8 mb-4 rounded-lg border p-3 sm:p-4">
            <p className="text-on-surface text-sm font-medium">Declined request</p>
            <ul className="text-on-surface-variant mt-2 space-y-1 text-sm">
              {rejectedRequest.requestedServices.map((s) => (
                <li key={s.name}>
                  {s.name} · {s.duration}m · {formatMoney(s.price)}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {!pending && hasUpdate ? (
          <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
            <ServiceList services={originalServices} title="Original services" />
            <div className="text-primary flex shrink-0 items-center justify-center lg:flex-col lg:px-1">
              <ArrowRight className="h-5 w-5 rotate-90 lg:rotate-0" aria-hidden />
            </div>
            <ServiceList services={updatedServices} title="Updated services" />
          </div>
        ) : !pending ? (
          <ServiceList services={originalServices} title="Booked services" />
        ) : (
          <ServiceList services={originalServices} title="Current booked services" />
        )}
      </div>
    </section>
  );
}
