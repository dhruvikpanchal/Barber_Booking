"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Calendar, Clock, MapPin, Scissors, CalendarCheck } from "lucide-react";

import { formatLongDate } from "@/client/lib/format/formatDateTime.js";
import { formatMoney } from "@/client/lib/format/formatMoney.js";

export default function BookingConfirmed({ booking, onBookAnother }) {
  const total = booking.services.reduce((s, sv) => s + sv.price, 0);
  const [confirmId, setConfirmId] = useState("IOK-······");

  useEffect(() => {
    setConfirmId(`IOK-${Math.random().toString(36).slice(2, 7).toUpperCase()}`);
  }, []);

  return (
    <div className="mx-auto max-w-lg py-4">
      <div className="mb-6 text-center">
        <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center">
          <div className="bg-status-confirmed/20 absolute inset-0 animate-ping rounded-full" />
          <div className="border-status-confirmed/30 bg-status-confirmed/10 absolute inset-0 rounded-full border-2" />
          <CheckCircle className="text-status-confirmed relative h-10 w-10" />
        </div>
        <h2 className="text-on-surface font-serif text-2xl font-bold">You&apos;re booked!</h2>
        <p className="text-on-surface-variant mt-1 text-sm">
          Your appointment is pending barber confirmation. See you soon.
        </p>
        <div className="border-outline-variant bg-surface-container mx-auto mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
          <span className="text-on-surface-variant text-xs">Confirmation #</span>
          <span className="text-primary font-mono text-sm font-bold">{confirmId}</span>
        </div>
      </div>

      <div className="border-outline-variant bg-surface-container-low overflow-hidden rounded-xl border">
        <div className="divide-outline-variant divide-y p-5">
          <div className="flex items-center gap-4 pb-4">
            {booking.barber?.image && (
              <img
                src={booking.barber.image}
                alt={booking.barber.name}
                className="border-primary/30 h-12 w-12 rounded-xl border-2 object-cover"
              />
            )}
            <div>
              <p className="text-on-surface font-semibold">{booking.barber?.name}</p>
              <p className="text-on-surface-variant text-xs">{booking.barber?.role}</p>
              <p className="text-on-surface-variant mt-0.5 flex items-center gap-1 text-xs">
                <MapPin className="h-3 w-3 shrink-0" />
                {booking.barber?.location}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="flex items-start gap-3">
              <div className="border-outline-variant bg-surface-container text-on-surface-variant flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-label-caps text-on-surface-variant text-[10px]">Date</p>
                <p className="text-on-surface text-sm font-medium">
                  {formatLongDate(booking.date)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="border-outline-variant bg-surface-container text-on-surface-variant flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="font-label-caps text-on-surface-variant text-[10px]">Time</p>
                <p className="text-on-surface text-sm font-medium">{booking.timeLabel}</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <p className="font-label-caps text-on-surface-variant mb-2.5 text-[10px]">Services</p>
            <div className="space-y-1.5">
              {booking.services.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-on-surface">{s.name}</span>
                  <span className="text-on-surface font-semibold">{formatMoney(s.price)}</span>
                </div>
              ))}
            </div>
            <div className="border-primary/20 bg-primary/5 mt-3 flex items-center justify-between rounded-lg border px-4 py-2.5">
              <span className="text-on-surface text-sm font-semibold">Estimated total</span>
              <span className="text-primary font-serif text-lg font-bold">
                {formatMoney(total)}
              </span>
            </div>
            <p className="text-on-surface-variant mt-2 text-center text-[11px]">
              Final price confirmed after your visit · pay at the chair
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all active:scale-[0.98]"
        >
          <CalendarCheck className="text-primary h-4 w-4" />
          Add to calendar
        </button>
        <button
          type="button"
          onClick={onBookAnother}
          className="bg-primary text-on-primary flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Scissors className="h-4 w-4" />
          Book another
        </button>
      </div>

      <p className="text-on-surface-variant mt-5 text-center text-xs">
        A confirmation has been sent to your email address.
      </p>
    </div>
  );
}
