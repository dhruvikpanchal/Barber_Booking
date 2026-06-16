"use client";

import { User, Scissors, Calendar, Clock, MapPin, ChevronRight, AlertCircle } from "lucide-react";

import { formatLongDate } from "@/client/lib/format/formatDateTime.js";
import { formatMoney } from "@/client/lib/format/formatMoney.js";

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 py-4 first:pt-0">
      <div className="border-outline-variant bg-surface-container text-on-surface-variant flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-label-caps text-on-surface-variant text-[10px]">{label}</p>
        <div className="mt-0.5">{value}</div>
      </div>
    </div>
  );
}

export default function BookingStep4Summary({
  booking,
  onConfirm,
  confirming,
  disabled = false,
}) {
  const total = booking.services.reduce((s, sv) => s + sv.price, 0);
  const totalDuration = booking.services.reduce((s, sv) => s + sv.duration, 0);

  return (
    <div className="space-y-5">
      <div className="border-outline-variant bg-surface-container-low overflow-hidden rounded-xl border">
        {booking.barber?.image && (
          <div className="relative h-24 overflow-hidden">
            <img
              src={booking.barber.image}
              alt={booking.barber.name}
              className="h-full w-full object-cover"
            />
            <div className="from-surface-container-lowest/80 absolute inset-0 bg-gradient-to-r to-transparent" />
            <div className="absolute inset-0 flex items-center px-5">
              <p className="text-on-surface font-serif text-lg font-bold drop-shadow-sm">
                {booking.barber.name}
              </p>
            </div>
          </div>
        )}

        <div className="divide-outline-variant divide-y px-5">
          <SummaryRow
            icon={User}
            label="Barber"
            value={
              <div className="flex items-center gap-3">
                {booking.barber?.image && (
                  <img
                    src={booking.barber.image}
                    alt={booking.barber.name}
                    className="border-outline-variant h-9 w-9 rounded-lg border object-cover"
                  />
                )}
                <div>
                  <p className="text-on-surface text-sm font-semibold">{booking.barber?.name}</p>
                  <p className="text-on-surface-variant text-xs">{booking.barber?.role}</p>
                </div>
              </div>
            }
          />

          <SummaryRow
            icon={MapPin}
            label="Location"
            value={
              <div>
                <p className="text-on-surface text-sm font-semibold">{booking.barber?.location}</p>
                <p className="text-on-surface-variant text-xs">{booking.barber?.address}</p>
              </div>
            }
          />

          <SummaryRow
            icon={Scissors}
            label="Services"
            value={
              <div className="space-y-1.5 pt-0.5">
                {booking.services.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-4">
                    <span className="text-on-surface text-sm">{s.name}</span>
                    <div className="text-on-surface-variant flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {s.duration} min
                      </span>
                      <span className="text-on-surface font-semibold">{formatMoney(s.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            }
          />

          <SummaryRow
            icon={Calendar}
            label="Date & Time"
            value={
              <div>
                <p className="text-on-surface text-sm font-semibold">
                  {formatLongDate(booking.date)}
                </p>
                <p className="text-on-surface-variant text-xs">{booking.timeLabel ?? "—"}</p>
              </div>
            }
          />
        </div>
      </div>

      <div className="border-outline-variant bg-surface-container-low rounded-xl border p-5">
        <p className="font-label-caps text-on-surface-variant mb-3 text-xs">Estimated pricing</p>
        <div className="space-y-2">
          {booking.services.map((s) => (
            <div key={s.id} className="flex items-center justify-between text-sm">
              <span className="text-on-surface-variant">{s.name}</span>
              <span className="text-on-surface">{formatMoney(s.price)}</span>
            </div>
          ))}
        </div>
        <div className="border-outline-variant mt-3 flex items-center justify-between border-t pt-3">
          <div>
            <p className="text-on-surface font-semibold">Estimated total</p>
            <p className="text-on-surface-variant text-xs">
              {totalDuration} min · pay at the chair
            </p>
          </div>
          <p className="text-primary font-serif text-2xl font-bold">{formatMoney(total)}</p>
        </div>
      </div>

      <div className="border-outline-variant bg-surface-container flex gap-3 rounded-xl border px-4 py-3">
        <AlertCircle className="text-on-surface-variant mt-0.5 h-4 w-4 shrink-0" />
        <p className="text-on-surface-variant text-xs leading-relaxed">
          Free cancellation up to 24 hours before your appointment. Final price is confirmed after
          your visit — no online payment required.
        </p>
      </div>

      <button
        type="button"
        onClick={onConfirm}
        disabled={confirming || disabled}
        className="bg-primary text-on-primary flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold tracking-wide transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {confirming ? (
          <>
            <span className="border-on-primary/30 border-t-on-primary h-4 w-4 animate-spin rounded-full border-2" />
            Confirming…
          </>
        ) : (
          <>
            Confirm booking
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}
