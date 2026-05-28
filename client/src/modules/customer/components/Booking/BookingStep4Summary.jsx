"use client";

import {
  User,
  Scissors,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

function formatMoney(v) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-4 py-4 first:pt-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface-container text-on-surface-variant">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-label-caps text-[10px] text-on-surface-variant">
          {label}
        </p>
        <div className="mt-0.5">{value}</div>
      </div>
    </div>
  );
}

export default function BookingStep4Summary({
  booking,
  onConfirm,
  confirming,
}) {
  const total = booking.services.reduce((s, sv) => s + sv.price, 0);
  const totalDuration = booking.services.reduce((s, sv) => s + sv.duration, 0);

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
        {booking.barber?.image && (
          <div className="relative h-24 overflow-hidden">
            <img
              src={booking.barber.image}
              alt={booking.barber.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/80 to-transparent" />
            <div className="absolute inset-0 flex items-center px-5">
              <p className="font-serif text-lg font-bold text-on-surface drop-shadow-sm">
                {booking.barber.name}
              </p>
            </div>
          </div>
        )}

        <div className="divide-y divide-outline-variant px-5">
          <SummaryRow
            icon={User}
            label="Barber"
            value={
              <div className="flex items-center gap-3">
                {booking.barber?.image && (
                  <img
                    src={booking.barber.image}
                    alt={booking.barber.name}
                    className="h-9 w-9 rounded-lg border border-outline-variant object-cover"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    {booking.barber?.name}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {booking.barber?.role}
                  </p>
                </div>
              </div>
            }
          />

          <SummaryRow
            icon={MapPin}
            label="Location"
            value={
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  {booking.barber?.location}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {booking.barber?.address}
                </p>
              </div>
            }
          />

          <SummaryRow
            icon={Scissors}
            label="Services"
            value={
              <div className="space-y-1.5 pt-0.5">
                {booking.services.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-sm text-on-surface">{s.name}</span>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {s.duration} min
                      </span>
                      <span className="font-semibold text-on-surface">
                        {formatMoney(s.price)}
                      </span>
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
                <p className="text-sm font-semibold text-on-surface">
                  {formatDate(booking.date)}
                </p>
                <p className="text-xs text-on-surface-variant">
                  {booking.timeLabel ?? "—"}
                </p>
              </div>
            }
          />
        </div>
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
        <p className="font-label-caps mb-3 text-xs text-on-surface-variant">
          Estimated pricing
        </p>
        <div className="space-y-2">
          {booking.services.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-on-surface-variant">{s.name}</span>
              <span className="text-on-surface">{formatMoney(s.price)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-outline-variant pt-3">
          <div>
            <p className="font-semibold text-on-surface">Estimated total</p>
            <p className="text-xs text-on-surface-variant">
              {totalDuration} min · pay at the chair
            </p>
          </div>
          <p className="font-serif text-2xl font-bold text-primary">
            {formatMoney(total)}
          </p>
        </div>
      </div>

      <div className="flex gap-3 rounded-xl border border-outline-variant bg-surface-container px-4 py-3">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-on-surface-variant" />
        <p className="text-xs leading-relaxed text-on-surface-variant">
          Free cancellation up to 24 hours before your appointment. Final price
          is confirmed after your visit — no online payment required.
        </p>
      </div>

      <button
        type="button"
        onClick={onConfirm}
        disabled={confirming}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold tracking-wide text-on-primary transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {confirming ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary/30 border-t-on-primary" />
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
