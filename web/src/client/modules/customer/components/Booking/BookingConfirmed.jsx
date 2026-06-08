"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Scissors,
  CalendarCheck,
} from "lucide-react";

import { formatLongDate, formatMoney } from "@/client/modules/customer/helpers/booking.js";

export default function BookingConfirmed({ booking, onBookAnother }) {
  const total = booking.services.reduce((s, sv) => s + sv.price, 0);
  const [confirmId, setConfirmId] = useState("IOK-······");

  useEffect(() => {
    setConfirmId(
      `IOK-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    );
  }, []);

  return (
    <div className="mx-auto max-w-lg py-4">
      <div className="mb-6 text-center">
        <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-status-confirmed/20" />
          <div className="absolute inset-0 rounded-full border-2 border-status-confirmed/30 bg-status-confirmed/10" />
          <CheckCircle className="relative h-10 w-10 text-status-confirmed" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-on-surface">
          You&apos;re booked!
        </h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Your appointment is pending barber confirmation. See you soon.
        </p>
        <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container px-4 py-1.5">
          <span className="text-xs text-on-surface-variant">Confirmation #</span>
          <span className="font-mono text-sm font-bold text-primary">
            {confirmId}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
        <div className="divide-y divide-outline-variant p-5">
          <div className="flex items-center gap-4 pb-4">
            {booking.barber?.image && (
              <img
                src={booking.barber.image}
                alt={booking.barber.name}
                className="h-12 w-12 rounded-xl border-2 border-primary/30 object-cover"
              />
            )}
            <div>
              <p className="font-semibold text-on-surface">
                {booking.barber?.name}
              </p>
              <p className="text-xs text-on-surface-variant">
                {booking.barber?.role}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-on-surface-variant">
                <MapPin className="h-3 w-3 shrink-0" />
                {booking.barber?.location}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface-container text-on-surface-variant">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant">
                  Date
                </p>
                <p className="text-sm font-medium text-on-surface">
                  {formatLongDate(booking.date)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface-container text-on-surface-variant">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant">
                  Time
                </p>
                <p className="text-sm font-medium text-on-surface">
                  {booking.timeLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <p className="font-label-caps mb-2.5 text-[10px] text-on-surface-variant">
              Services
            </p>
            <div className="space-y-1.5">
              {booking.services.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-on-surface">{s.name}</span>
                  <span className="font-semibold text-on-surface">
                    {formatMoney(s.price)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5">
              <span className="text-sm font-semibold text-on-surface">
                Estimated total
              </span>
              <span className="font-serif text-lg font-bold text-primary">
                {formatMoney(total)}
              </span>
            </div>
            <p className="mt-2 text-center text-[11px] text-on-surface-variant">
              Final price confirmed after your visit · pay at the chair
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container text-sm font-semibold text-on-surface transition-all hover:bg-surface-container-high active:scale-[0.98]"
        >
          <CalendarCheck className="h-4 w-4 text-primary" />
          Add to calendar
        </button>
        <button
          type="button"
          onClick={onBookAnother}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-on-primary transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Scissors className="h-4 w-4" />
          Book another
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-on-surface-variant">
        A confirmation has been sent to your email address.
      </p>
    </div>
  );
}
