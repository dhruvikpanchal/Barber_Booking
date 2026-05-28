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
import { formatLastVisited } from "../../../../data/customer/favoritesData.js";

function StarRow({ rating, yourRating }) {
  return (
    <div className="flex items-center gap-2">
      {/* Public rating */}
      <span className="flex items-center gap-1 text-xs font-semibold text-on-surface">
        <Star className="h-3.5 w-3.5 fill-status-pending text-status-pending" />
        {rating}
      </span>
      {/* Your personal rating */}
      {yourRating && (
        <span className="flex items-center gap-0.5 text-[11px] text-on-surface-variant">
          <span className="mx-1 text-outline-variant">·</span>
          Your rating:
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`h-3 w-3 ${
                s <= yourRating
                  ? "fill-primary text-primary"
                  : "text-outline-variant"
              }`}
            />
          ))}
        </span>
      )}
    </div>
  );
}

export default function SavedBarberCard({ barber, onRemove, onBook }) {
  const [removing, setRemoving] = useState(false);
  const [booked, setBooked] = useState(false);

  async function handleRemove() {
    setRemoving(true);
    await new Promise((r) => setTimeout(r, 400));
    onRemove(barber.id);
  }

  async function handleBook() {
    setBooked(true);
    await new Promise((r) => setTimeout(r, 600));
    onBook(barber);
  }

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-surface-container-low transition-all duration-300
        ${removing ? "scale-95 opacity-0" : "border-outline-variant hover:border-outline hover:shadow-md hover:shadow-black/10"}`}
    >
      {/* Availability badge – top-right */}
      <div className="absolute right-3 top-3 z-10">
        {barber.available ? (
          <span className="flex items-center gap-1 rounded-full border border-status-confirmed/30 bg-status-confirmed/15 px-2.5 py-1 text-[10px] font-semibold text-status-confirmed backdrop-blur-sm">
            <CheckCircle className="h-3 w-3" />
            Available
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container/80 px-2.5 py-1 text-[10px] font-semibold text-on-surface-variant backdrop-blur-sm">
            <XCircle className="h-3 w-3" />
            Busy
          </span>
        )}
      </div>

      {/* Remove button – top-left on hover */}
      <button
        type="button"
        onClick={handleRemove}
        disabled={removing}
        title="Remove from favorites"
        className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface-container/80 text-on-surface-variant opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:border-status-cancelled/40 hover:bg-status-cancelled/10 hover:text-status-cancelled"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {/* Photo */}
      <div className="h-48 w-full overflow-hidden bg-surface-container">
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
          <h3 className="font-serif text-lg font-bold leading-tight text-on-surface">
            {barber.name}
          </h3>
          <p className="text-xs text-on-surface-variant">{barber.role}</p>
        </div>

        {/* Ratings */}
        <StarRow rating={barber.rating} yourRating={barber.yourRating} />

        {/* Meta */}
        <div className="space-y-1.5 text-xs text-on-surface-variant">
          <p className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/60" />
            <span className="truncate">
              {barber.shopName.replace("Iron & Oak — ", "")} · {barber.shopCity}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 shrink-0 text-primary/60" />
            Next:{" "}
            <span className="font-medium text-on-surface">
              {barber.nextAvailable}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <CalendarCheck className="h-3.5 w-3.5 shrink-0 text-primary/60" />
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
              className="inline-flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container px-2 py-0.5 text-[11px] text-on-surface-variant"
            >
              <Scissors className="h-2.5 w-2.5 text-primary/50" />
              {s}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-outline-variant" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-on-surface-variant">
              From
            </p>
            <p className="font-serif text-xl font-bold text-primary">
              ${barber.startingPrice}
            </p>
          </div>
          <button
            type="button"
            onClick={handleBook}
            disabled={!barber.available || booked}
            className={`flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-semibold transition-all
              ${
                booked
                  ? "border border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed"
                  : barber.available
                    ? "bg-primary text-on-primary hover:opacity-90 active:scale-95"
                    : "cursor-not-allowed border border-outline-variant bg-surface-container text-on-surface-variant opacity-50"
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
