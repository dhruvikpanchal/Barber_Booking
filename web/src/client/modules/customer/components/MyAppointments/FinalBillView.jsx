"use client";

import { IndianRupee, Receipt } from "lucide-react";
import { formatMoney } from "@/client/lib/format/formatMoney.js";

export default function FinalBillView({
  originalServices = [],
  updatedServices = null,
  estimatedPrice,
  finalPrice,
}) {
  const services = updatedServices ?? originalServices;
  const serviceSubtotal = services.reduce((sum, s) => sum + s.price, 0);
  const hasFinal = finalPrice != null;
  const delta = hasFinal && estimatedPrice != null ? finalPrice - estimatedPrice : null;

  return (
    <section className="border-outline-variant bg-surface-container-low min-w-0 overflow-hidden rounded-xl border">
      <header className="border-outline-variant flex items-center gap-3 border-b px-4 py-3.5 sm:px-5 sm:py-4">
        <span className="bg-status-confirmed/15 text-status-confirmed flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
          <Receipt className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-on-surface font-serif text-base font-bold sm:text-lg">Pricing</h2>
          <p className="text-on-surface-variant text-xs">
            Estimated vs final totals for this visit.
          </p>
        </div>
      </header>

      <div className="space-y-4 p-4 sm:p-5">
        <ul className="border-outline-variant bg-surface-container space-y-2 rounded-lg border px-3 py-3 sm:px-4">
          {services.map((s) => (
            <li key={s.name} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-on-surface min-w-0 truncate">{s.name}</span>
              <span className="text-on-surface shrink-0 font-medium">{formatMoney(s.price)}</span>
            </li>
          ))}
          <li className="border-outline-variant/60 text-on-surface-variant flex items-center justify-between gap-3 border-t pt-2 text-xs">
            <span>Services subtotal</span>
            <span>{formatMoney(serviceSubtotal)}</span>
          </li>
        </ul>

        <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
          <div className="border-outline-variant bg-surface-container rounded-lg border p-4">
            <div className="text-on-surface-variant flex items-center gap-2">
              <IndianRupee className="h-4 w-4 shrink-0" aria-hidden />
              <p className="font-label-caps text-[10px]">Estimated total</p>
            </div>
            <p className="text-on-surface mt-2 font-serif text-2xl font-bold">
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
            <div className="text-on-surface-variant flex items-center gap-2">
              <IndianRupee className="h-4 w-4 shrink-0" aria-hidden />
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
              <p className="text-on-surface-variant mt-1 text-xs">
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
