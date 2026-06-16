"use client";

import { useState } from "react";
import {
  Star,
  MapPin,
  Clock,
  Scissors,
  Calendar,
  Trash2,
  CheckCircle,
  XCircle,
  CalendarCheck,
} from "lucide-react";
import { formatLastVisited } from "@/client/modules/customer/helpers/favoritesHelpers.js";

function StarRow({ rating, yourRating }) {
  return (
    <div className="flex items-center gap-2">
      {/* Public rating */}
      <span className="text-on-surface flex items-center gap-1 text-xs font-semibold">
        <Star className="fill-status-pending text-status-pending h-3.5 w-3.5" />
        {rating}
      </span>
      {/* Your personal rating */}
      {yourRating && (
        <span className="text-on-surface-variant flex items-center gap-0.5 text-[11px]">
          <span className="text-outline-variant mx-1">·</span>
          Your rating:
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`h-3 w-3 ${
                s <= yourRating ? "fill-primary text-primary" : "text-outline-variant"
              }`}
            />
          ))}
        </span>
      )}
    </div>
  );
}

export default function SavedBarberCard({ barber, onRemove, onBook, disabled = false }) {
  const [removing, setRemoving] = useState(false);
  const [booked, setBooked] = useState(false);

  async function handleRemove() {
    if (disabled) return;
    setRemoving(true);
    await new Promise((r) => setTimeout(r, 400));
    onRemove(barber.id);
  }

  async function handleBook() {
    if (disabled) return;
    setBooked(true);
    await new Promise((r) => setTimeout(r, 600));
    onBook(barber);
  }

  return (
    <article
      className={`group bg-surface-container-low relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${removing ? "scale-95 opacity-0" : "border-outline-variant hover:border-outline hover:shadow-md hover:shadow-black/10"}`}
    >
      {/* Availability badge – top-right */}
      <div className="absolute top-3 right-3 z-10">
        {barber.available ? (
          <span className="border-status-confirmed/30 bg-status-confirmed/15 text-status-confirmed flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm">
            <CheckCircle className="h-3 w-3" />
            Available
          </span>
        ) : (
          <span className="border-outline-variant bg-surface-container/80 text-on-surface-variant flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm">
            <XCircle className="h-3 w-3" />
            Busy
          </span>
        )}
      </div>

      {/* Remove button – top-left on hover */}
      <button
        type="button"
        onClick={handleRemove}
        disabled={disabled || removing}
        title="Remove from favorites"
        className="border-outline-variant bg-surface-container/80 text-on-surface-variant hover:border-status-cancelled/40 hover:bg-status-cancelled/10 hover:text-status-cancelled absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {/* Photo */}
      <div className="bg-surface-container h-48 w-full overflow-hidden">
        <img
          src={barber.image}
          alt={barber.name}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Name + role */}
        <div>
          <h3 className="text-on-surface font-serif text-lg leading-tight font-bold">
            {barber.name}
          </h3>
          <p className="text-on-surface-variant text-xs">{barber.role}</p>
        </div>

        {/* Ratings */}
        <StarRow rating={barber.rating} yourRating={barber.yourRating} />

        {/* Meta */}
        <div className="text-on-surface-variant space-y-1.5 text-xs">
          <p className="flex items-center gap-2">
            <MapPin className="text-primary/60 h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {(barber.shopName ?? "").replace("Iron & Oak — ", "") || "—"}
              {barber.shopCity ? ` · ${barber.shopCity}` : ""}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Clock className="text-primary/60 h-3.5 w-3.5 shrink-0" />
            Next: <span className="text-on-surface font-medium">{barber.nextAvailable}</span>
          </p>
          <p className="flex items-center gap-2">
            <CalendarCheck className="text-primary/60 h-3.5 w-3.5 shrink-0" />
            {barber.totalVisits > 0
              ? `${barber.totalVisits} visits · Last ${formatLastVisited(barber.lastVisited)}`
              : "No visits yet"}
          </p>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5">
          {barber.specialties.map((s) => (
            <span
              key={s}
              className="border-outline-variant bg-surface-container text-on-surface-variant inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]"
            >
              <Scissors className="text-primary/50 h-2.5 w-2.5" />
              {s}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="border-outline-variant border-t" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-on-surface-variant text-[10px] tracking-wide uppercase">From</p>
            <p className="text-primary font-serif text-xl font-bold">${barber.startingPrice}</p>
          </div>
          <button
            type="button"
            onClick={handleBook}
            disabled={disabled || !barber.available || booked}
            className={`flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-semibold transition-all ${
              booked
                ? "border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed border"
                : barber.available
                  ? "bg-primary text-on-primary hover:opacity-90 active:scale-95"
                  : "border-outline-variant bg-surface-container text-on-surface-variant cursor-not-allowed border opacity-50"
            }`}
          >
            {booked ? (
              <>
                <CheckCircle className="h-3.5 w-3.5" />
                Redirecting…
              </>
            ) : (
              <>
                <Calendar className="h-3.5 w-3.5" />
                Quick Book
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
