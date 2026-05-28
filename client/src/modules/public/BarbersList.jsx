"use client";

import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { barbers } from "@/data/public/barbers.js";
import BarberListCard from "./components/barbers/BarberListCard.jsx";

export default function BarbersList() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return barbers;

    return barbers.filter(
      (b) =>
        b.name.toLowerCase().includes(q)
        || b.role.toLowerCase().includes(q)
        || b.city.toLowerCase().includes(q)
        || b.location.toLowerCase().includes(q)
        || b.services.some((s) => s.toLowerCase().includes(q))
        || b.specialties.some((s) => s.toLowerCase().includes(q)),
    );
  }, [query]);

  const availableCount = filtered.filter((b) => b.available).length;

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-24 pt-4 md:px-16">
      <header className="max-w-2xl">
        <p className="font-label-caps text-primary">Directory</p>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-on-surface md:text-4xl lg:text-5xl">
          Find your barber
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant md:text-base">
          Browse profiles, compare ratings and services, and book with the
          barber that fits your style.
        </p>
      </header>

      <div className="mt-8 rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
        <label className="relative block">
          <span className="sr-only">Search barbers by name</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, service, specialty, or city…"
            className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container py-2 pr-3 pl-10 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none"
          />
        </label>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
          <Users className="h-3.5 w-3.5 text-primary" aria-hidden />
          <span>
            <span className="font-semibold text-on-surface">
              {filtered.length}
            </span>{" "}
            barber{filtered.length !== 1 ? "s" : ""}
            {query.trim() ? " matching your search" : " on the roster"}
            {" · "}
            <span className="font-semibold text-status-confirmed">
              {availableCount}
            </span>{" "}
            available now
          </span>
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-outline-variant px-6 py-16 text-center">
          <Search
            className="mx-auto h-10 w-10 text-on-surface-variant/40"
            aria-hidden
          />
          <p className="mt-3 font-serif text-lg font-bold text-on-surface">
            No barbers found
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Try a different name or clear your search.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-4 text-sm font-semibold text-primary hover:opacity-80"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((barber) => (
            <BarberListCard key={barber.id} barber={barber} />
          ))}
        </div>
      )}
    </div>
  );
}
