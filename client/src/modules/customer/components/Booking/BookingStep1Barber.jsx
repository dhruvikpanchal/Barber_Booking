"use client";

import { useMemo, useState } from "react";
import {
  Star,
  Clock,
  Scissors,
  CheckCircle,
  Search,
  MapPin,
} from "lucide-react";
import {
  BOOKING_BARBERS,
  BOOKING_SERVICES,
} from "@/data/customer/bookingData.js";

export default function BookingStep1Barber({ booking, onSelect }) {
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return BOOKING_BARBERS.filter((barber) => {
      const matchesQuery =
        !q
        || barber.name.toLowerCase().includes(q)
        || barber.role.toLowerCase().includes(q)
        || barber.location.toLowerCase().includes(q)
        || barber.city.toLowerCase().includes(q)
        || barber.specialties.some((s) => s.toLowerCase().includes(q));

      const matchesService =
        !serviceFilter
        || barber.specialties.some((s) =>
          s.toLowerCase().includes(serviceFilter.toLowerCase()),
        );

      return matchesQuery && matchesService;
    });
  }, [query, serviceFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative block min-w-0 flex-1 h-full">
          <span className="sr-only">Search barbers</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by barber name, specialty, or location…"
            className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container py-2 pr-3 pl-10 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
          />
        </label>
        <label className="block sm:w-52">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container px-3 text-sm text-on-surface focus:border-primary focus:outline-none"
          >
            <option value="">All services</option>
            {BOOKING_SERVICES.map((svc) => (
              <option key={svc.id} value={svc.name}>
                {svc.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant px-4 py-10 text-center">
          <p className="text-sm font-medium text-on-surface">
            No barbers found
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">
            Try a different name or clear the service filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((barber) => {
            const selected = booking.barber?.id === barber.id;
            return (
              <button
                key={barber.id}
                type="button"
                disabled={!barber.available}
                onClick={() => barber.available && onSelect(barber)}
                className={`group relative w-full overflow-hidden rounded-xl border text-left transition-all duration-200
                  ${
                    !barber.available
                      ? "cursor-not-allowed border-outline-variant/50 bg-surface-container/50 opacity-55"
                      : selected
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-outline-variant bg-surface-container-low hover:border-outline hover:bg-surface-container"
                  }`}
              >
                <div className="flex gap-4 p-4">
                  <div className="relative shrink-0">
                    <div
                      className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition-colors
                        ${selected ? "border-primary" : "border-outline-variant"}`}
                    >
                      <img
                        src={barber.image}
                        alt={barber.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    {barber.available && (
                      <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-surface-container-low bg-status-confirmed" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-on-surface">
                          {barber.name}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {barber.role}
                        </p>
                      </div>
                      {selected && (
                        <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                      )}
                      {!barber.available && (
                        <span className="font-label-caps shrink-0 rounded-full border border-outline-variant px-2 py-0.5 text-[10px] text-on-surface-variant">
                          Unavailable
                        </span>
                      )}
                    </div>

                    <p className="mt-1.5 flex items-center gap-1 text-xs text-on-surface-variant">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                      {barber.location} · {barber.city}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-status-pending" />
                        {barber.rating} ({barber.reviews})
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-primary/70" />
                        {barber.experience} yrs exp
                      </span>
                      <span className="font-medium text-primary">
                        from ${barber.startingPrice}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {barber.specialties.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container px-2 py-0.5 text-[11px] text-on-surface-variant"
                        >
                          <Scissors className="h-2.5 w-2.5 text-primary/60" />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
