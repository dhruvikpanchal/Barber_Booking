"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle, Flame } from "lucide-react";
import customerServices from "@/client/modules/customer/services/customerServices.jsx";
import { formatMoney } from "@/client/modules/customer/helpers/booking.js";

export default function BookingStep2Services({ booking, onToggle }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const slug = booking.barber?.slug ?? booking.barber?.id;

  useEffect(() => {
    if (!slug) {
      setServices([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    customerServices
      .listBookingServices(slug)
      .then((items) => {
        if (!cancelled) setServices(Array.isArray(items) ? items.filter((s) => s.active !== false) : []);
      })
      .catch(() => {
        if (!cancelled) setServices([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const selectedIds = new Set(booking.services.map((s) => s.id));
  const total = booking.services.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = booking.services.reduce((sum, s) => sum + s.duration, 0);

  if (!booking.barber) {
    return (
      <p className="text-on-surface-variant text-sm">Select a barber first to see available services.</p>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface-container h-28 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <p className="text-on-surface-variant text-sm">No services available for this barber.</p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-on-surface-variant text-xs">
        Pricing shown is an estimate. You pay at the chair after your visit — no online payment.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((service) => {
          const selected = selectedIds.has(service.id);
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onToggle(service)}
              className={`group relative rounded-xl border p-4 text-left transition-all duration-200 ${
                selected
                  ? "border-primary bg-primary/5 shadow-primary/10 shadow-sm"
                  : "border-outline-variant bg-surface-container-low hover:border-outline hover:bg-surface-container"
              }`}
            >
              {selected && <CheckCircle className="text-primary absolute top-3 right-3 h-5 w-5" />}

              <h3 className="text-on-surface font-serif text-sm leading-snug font-bold">
                {service.name}
              </h3>
              {service.description ? (
                <p className="text-on-surface-variant mt-1 text-xs leading-relaxed">
                  {service.description}
                </p>
              ) : null}

              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`text-sm font-bold ${selected ? "text-primary" : "text-on-surface"}`}
                >
                  {formatMoney(service.price)}
                </span>
                <span className="text-on-surface-variant flex items-center gap-1 text-xs">
                  <Clock className="h-3.5 w-3.5" />
                  {service.duration} min
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {booking.services.length > 0 && (
        <div className="border-primary/25 bg-surface-container-low rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-on-surface-variant text-xs">
                {booking.services.length} service
                {booking.services.length > 1 ? "s" : ""} selected
              </p>
              <p className="text-on-surface-variant mt-0.5 flex items-center gap-2 text-sm">
                <Clock className="text-primary h-3.5 w-3.5" />
                {totalDuration} min total
              </p>
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant text-[11px]">Estimated total</p>
              <p className="text-primary font-serif text-xl font-bold">{formatMoney(total)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
