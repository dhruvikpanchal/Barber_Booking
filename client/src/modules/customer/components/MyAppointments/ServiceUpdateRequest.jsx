"use client";

import { ArrowRight, Clock, Scissors } from "lucide-react";
import {
  formatMoney,
  getTotalDuration,
} from "@/data/customer/appointmentsData.js";
import ChangeRequestPendingBadge from "./ChangeRequestPendingBadge.jsx";
import ChangeRequestStatusBadge from "./ChangeRequestStatusBadge.jsx";

function ServiceList({ services, title }) {
  if (!services?.length) return null;
  const duration = getTotalDuration(services);
  const total = services.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface-container p-3 sm:p-4">
      <p className="font-label-caps text-[10px] text-on-surface-variant">
        {title}
      </p>
      <ul className="mt-2 space-y-2">
        {services.map((s) => (
          <li
            key={`${title}-${s.name}`}
            className="flex items-start justify-between gap-2 text-sm"
          >
            <span className="min-w-0 text-on-surface">{s.name}</span>
            <span className="shrink-0 text-xs text-on-surface-variant">
              {s.duration}m · {formatMoney(s.price)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 border-t border-outline-variant/60 pt-2 text-xs text-on-surface-variant">
        {duration} min · {formatMoney(total)}
      </p>
    </div>
  );
}

function resolveRequestStatus(pendingChangeRequest, latestChangeRequest, hasUpdate) {
  if (pendingChangeRequest?.status === "pending") return "pending";
  if (latestChangeRequest?.status === "rejected") return "rejected";
  if (
    latestChangeRequest?.status === "accepted"
    || hasUpdate
  ) {
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
    updatedServices
    && JSON.stringify(originalServices) !== JSON.stringify(updatedServices);
  const pending = pendingChangeRequest?.status === "pending";
  const requestStatus = resolveRequestStatus(
    pendingChangeRequest,
    latestChangeRequest,
    hasUpdate,
  );
  const rejectedRequest =
    latestChangeRequest?.status === "rejected" ? latestChangeRequest : null;

  const subtitle = pending
    ? "Your change request is awaiting barber approval."
    : requestStatus === "rejected"
      ? "Your barber declined the requested service change."
      : requestStatus === "accepted"
        ? "Your barber approved an updated service list."
        : "Booked services for this appointment.";

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
      <header className="flex flex-col gap-3 border-b border-outline-variant px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Scissors className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="font-serif text-base font-bold text-on-surface sm:text-lg">
              Selected services
            </h2>
            <p className="text-xs text-on-surface-variant">{subtitle}</p>
          </div>
        </div>
        {requestStatus === "pending" ? (
          <ChangeRequestPendingBadge className="self-start sm:self-center" />
        ) : requestStatus ? (
          <ChangeRequestStatusBadge
            status={requestStatus}
            className="self-start sm:self-center"
          />
        ) : null}
      </header>

      <div className="p-4 sm:p-5">
        {pending ? (
          <div className="mb-4 rounded-lg border border-status-pending/25 bg-status-pending/8 p-3 sm:p-4">
            <div className="flex items-start gap-2">
              <Clock
                className="mt-0.5 h-4 w-4 shrink-0 text-status-pending"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-on-surface">
                  Requested services
                </p>
                <ul className="mt-2 space-y-1 text-sm text-on-surface-variant">
                  {pendingChangeRequest.requestedServices.map((s) => (
                    <li key={s.name}>
                      {s.name} · {s.duration}m · {formatMoney(s.price)}
                    </li>
                  ))}
                </ul>
                {pendingChangeRequest.customerNote ? (
                  <p className="mt-2 text-xs text-on-surface-variant">
                    <span className="font-medium text-on-surface">
                      Your note:{" "}
                    </span>
                    {pendingChangeRequest.customerNote}
                  </p>
                ) : null}
              </div>
            </div>
            <p className="mt-3 text-xs text-on-surface-variant">
              Current booked services remain active until the barber responds.
            </p>
          </div>
        ) : null}

        {rejectedRequest && !pending ? (
          <div className="mb-4 rounded-lg border border-status-cancelled/25 bg-status-cancelled/8 p-3 sm:p-4">
            <p className="text-sm font-medium text-on-surface">
              Declined request
            </p>
            <ul className="mt-2 space-y-1 text-sm text-on-surface-variant">
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
            <ServiceList
              services={originalServices}
              title="Original services"
            />
            <div className="flex shrink-0 items-center justify-center text-primary lg:flex-col lg:px-1">
              <ArrowRight
                className="h-5 w-5 rotate-90 lg:rotate-0"
                aria-hidden
              />
            </div>
            <ServiceList services={updatedServices} title="Updated services" />
          </div>
        ) : !pending ? (
          <ServiceList services={originalServices} title="Booked services" />
        ) : (
          <ServiceList
            services={originalServices}
            title="Current booked services"
          />
        )}
      </div>
    </section>
  );
}
