"use client";

import { DollarSign, Receipt } from "lucide-react";
import { formatMoney } from "../../../../data/customer/appointmentsData.js";

export default function FinalBillView({
  originalServices = [],
  updatedServices = null,
  estimatedPrice,
  finalPrice,
}) {
  const services = updatedServices ?? originalServices;
  const serviceSubtotal = services.reduce((sum, s) => sum + s.price, 0);
  const hasFinal = finalPrice != null;
  const delta =
    hasFinal && estimatedPrice != null ? finalPrice - estimatedPrice : null;

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
      <header className="flex items-center gap-3 border-b border-outline-variant px-4 py-3.5 sm:px-5 sm:py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-status-confirmed/15 text-status-confirmed">
          <Receipt className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="font-serif text-base font-bold text-on-surface sm:text-lg">
            Pricing
          </h2>
          <p className="text-xs text-on-surface-variant">
            Estimated vs final totals for this visit.
          </p>
        </div>
      </header>

      <div className="space-y-4 p-4 sm:p-5">
        <ul className="space-y-2 rounded-lg border border-outline-variant bg-surface-container px-3 py-3 sm:px-4">
          {services.map((s) => (
            <li
              key={s.name}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="min-w-0 truncate text-on-surface">{s.name}</span>
              <span className="shrink-0 font-medium text-on-surface">
                {formatMoney(s.price)}
              </span>
            </li>
          ))}
          <li className="flex items-center justify-between gap-3 border-t border-outline-variant/60 pt-2 text-xs text-on-surface-variant">
            <span>Services subtotal</span>
            <span>{formatMoney(serviceSubtotal)}</span>
          </li>
        </ul>

        <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
          <div className="rounded-lg border border-outline-variant bg-surface-container p-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <DollarSign className="h-4 w-4 shrink-0" aria-hidden />
              <p className="font-label-caps text-[10px]">Estimated total</p>
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-on-surface">
              {formatMoney(estimatedPrice)}
            </p>
          </div>
          <div
            className={`rounded-lg border p-4 ${
              hasFinal
                ? "border-primary/30 bg-primary/5"
                : "border-outline-variant bg-surface-container"
            }`}
          >
            <div className="flex items-center gap-2 text-on-surface-variant">
              <DollarSign className="h-4 w-4 shrink-0" aria-hidden />
              <p className="font-label-caps text-[10px]">Final total</p>
            </div>
            <p
              className={`mt-2 font-serif text-2xl font-bold ${
                hasFinal ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              {formatMoney(finalPrice)}
            </p>
            {!hasFinal && (
              <p className="mt-1 text-xs text-on-surface-variant">
                Charged after your visit is complete.
              </p>
            )}
            {delta != null && delta !== 0 && (
              <p
                className={`mt-1 text-xs font-medium ${
                  delta > 0 ? "text-status-pending" : "text-status-confirmed"
                }`}
              >
                {delta > 0 ? "+" : ""}
                {formatMoney(delta)} vs estimate
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
