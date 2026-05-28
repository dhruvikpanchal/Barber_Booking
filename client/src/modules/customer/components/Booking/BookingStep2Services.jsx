"use client";

import { Clock, CheckCircle, Flame } from "lucide-react";
import { BOOKING_SERVICES } from "@/data/customer/bookingData.js";

function formatMoney(v) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);
}

export default function BookingStep2Services({ booking, onToggle }) {
  const selectedIds = new Set(booking.services.map((s) => s.id));
  const total = booking.services.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = booking.services.reduce(
    (sum, s) => sum + s.duration,
    0,
  );

  return (
    <div className="space-y-4">
      <p className="text-xs text-on-surface-variant">
        Pricing shown is an estimate. You pay at the chair after your visit —
        no online payment.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {BOOKING_SERVICES.map((service) => {
          const selected = selectedIds.has(service.id);
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onToggle(service)}
              className={`group relative rounded-xl border p-4 text-left transition-all duration-200
                ${
                  selected
                    ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                    : "border-outline-variant bg-surface-container-low hover:border-outline hover:bg-surface-container"
                }`}
            >
              {service.popular && !selected && (
                <span className="font-label-caps absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-status-pending/15 px-2 py-0.5 text-[10px] text-status-pending">
                  <Flame className="h-2.5 w-2.5" />
                  Popular
                </span>
              )}

              {selected && (
                <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-primary" />
              )}

              <h3 className="font-serif text-sm font-bold leading-snug text-on-surface">
                {service.name}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                {service.description}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`text-sm font-bold ${selected ? "text-primary" : "text-on-surface"}`}
                >
                  {formatMoney(service.price)}
                </span>
                <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                  <Clock className="h-3.5 w-3.5" />
                  {service.duration} min
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {booking.services.length > 0 && (
        <div className="rounded-xl border border-primary/25 bg-surface-container-low p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-on-surface-variant">
                {booking.services.length} service
                {booking.services.length > 1 ? "s" : ""} selected
              </p>
              <p className="mt-0.5 flex items-center gap-2 text-sm text-on-surface-variant">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {totalDuration} min total
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-on-surface-variant">
                Estimated total
              </p>
              <p className="font-serif text-xl font-bold text-primary">
                {formatMoney(total)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
