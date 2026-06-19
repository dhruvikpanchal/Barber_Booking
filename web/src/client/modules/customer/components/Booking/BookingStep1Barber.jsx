"use client";

import { useMemo, useState } from "react";
import { Star, Clock, Scissors, CheckCircle, Search, MapPin } from "lucide-react";

export default function BookingStep1Barber({
  booking,
  onSelect,
  disabled = false,
  barbers = [],
  loading = false,
}) {
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");

  const serviceNames = useMemo(() => {
    const names = new Set();
    for (const b of barbers) {
      for (const s of b.services ?? []) names.add(s);
    }
    return [...names].sort();
  }, [barbers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return barbers.filter((barber) => {
      const matchesQuery =
        !q ||
        barber.name.toLowerCase().includes(q) ||
        barber.role.toLowerCase().includes(q) ||
        (barber.location ?? "").toLowerCase().includes(q) ||
        (barber.city ?? "").toLowerCase().includes(q) ||
        barber.specialties.some((s) => s.toLowerCase().includes(q));

      const matchesService =
        !serviceFilter ||
        barber.specialties.some((s) => s.toLowerCase().includes(serviceFilter.toLowerCase())) ||
        (barber.services ?? []).some((s) =>
          s.toLowerCase().includes(serviceFilter.toLowerCase()),
        );

      return matchesQuery && matchesService;
    });
  }, [query, serviceFilter, barbers]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface-container h-24 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative block h-full min-w-0 flex-1">
          <span className="sr-only">Search barbers</span>
          <Search
            className="text-on-surface-variant pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by barber name, specialty, or location…"
            disabled={disabled}
            className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary h-11 w-full rounded-lg border py-2 pr-3 pl-10 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </label>
        <label className="block sm:w-52">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            disabled={disabled}
            className="border-outline-variant bg-surface-container text-on-surface focus:border-primary h-11 w-full rounded-lg border px-3 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All services</option>
            {serviceNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="border-outline-variant rounded-xl border border-dashed px-4 py-10 text-center">
          <p className="text-on-surface text-sm font-medium">No barbers found</p>
          <p className="text-on-surface-variant mt-1 text-xs">
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
                disabled={disabled || !barber.available}
                onClick={() => !disabled && barber.available && onSelect(barber)}
                className={`group relative w-full overflow-hidden rounded-xl border text-left transition-all duration-200 ${
                  !barber.available
                    ? "border-outline-variant/50 bg-surface-container/50 cursor-not-allowed opacity-55"
                    : selected
                      ? "border-primary bg-primary/5 shadow-primary/10 shadow-md"
                      : "border-outline-variant bg-surface-container-low hover:border-outline hover:bg-surface-container"
                }`}
              >
                <div className="flex gap-4 p-4">
                  <div className="relative shrink-0">
                    <div
                      className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition-colors ${selected ? "border-primary" : "border-outline-variant"}`}
                    >
                      {barber.image ? (
                        <img
                          src={barber.image}
                          alt={barber.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="bg-surface-container-high h-full w-full" />
                      )}
                    </div>
                    {barber.available && (
                      <span className="border-surface-container-low bg-status-confirmed absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-on-surface font-semibold">{barber.name}</p>
                        <p className="text-on-surface-variant text-xs">{barber.role}</p>
                      </div>
                      {selected && <CheckCircle className="text-primary h-5 w-5 shrink-0" />}
                      {!barber.available && (
                        <span className="font-label-caps border-outline-variant text-on-surface-variant shrink-0 rounded-full border px-2 py-0.5 text-[10px]">
                          Unavailable
                        </span>
                      )}
                    </div>

                    <p className="text-on-surface-variant mt-1.5 flex items-center gap-1 text-xs">
                      <MapPin className="text-primary/70 h-3.5 w-3.5 shrink-0" />
                      {barber.location ?? "—"}
                      {barber.city ? ` · ${barber.city}` : ""}
                    </p>

                    <div className="text-on-surface-variant mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                      <span className="flex items-center gap-1">
                        <Star className="text-status-pending h-3.5 w-3.5" />
                        {barber.rating} ({barber.reviews})
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="text-primary/70 h-3.5 w-3.5" />
                        {barber.experience} yrs exp
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {barber.specialties.map((s) => (
                        <span
                          key={s}
                          className="border-outline-variant bg-surface-container text-on-surface-variant inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]"
                        >
                          <Scissors className="text-primary/60 h-2.5 w-2.5" />
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
