"use client";

import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import BarberListCard from "@/client/modules/public/components/Barbers/BarberListCard.jsx";
import { publicServices } from "@/client/modules/public/services/publicServices.jsx";

export default function BarbersList() {
  const [query, setQuery] = useState("");
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const timer = setTimeout(() => {
      publicServices
        .getBarbers({ q: query.trim() || undefined, limit: 50 })
        .then((items) => {
          if (!cancelled) setBarbers(items);
        })
        .catch((err) => {
          if (!cancelled) {
            setBarbers([]);
            setError(err?.message || "Could not load barbers.");
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, query ? 300 : 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const filtered = barbers;

  const availableCount = filtered.filter((b) => b.available).length;

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-4 pt-4 pb-24 md:px-16">
      <header className="max-w-2xl">
        <p className="font-label-caps text-primary">Directory</p>
        <h1 className="text-on-surface font-serif text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Find your barber
        </h1>
        <p className="text-on-surface-variant mt-3 text-sm leading-relaxed md:text-base">
          Browse profiles, compare ratings and services, and book with the barber that fits your
          style.
        </p>
      </header>

      <div className="border-outline-variant bg-surface-container-low mt-8 rounded-xl border p-4 sm:p-5">
        <label className="relative block">
          <span className="sr-only">Search barbers by name</span>
          <Search
            className="text-on-surface-variant pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, service, specialty, or city…"
            className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary h-11 w-full rounded-lg border py-2 pr-3 pl-10 text-sm focus:outline-none"
          />
        </label>
        <p className="text-on-surface-variant mt-3 flex flex-wrap items-center gap-2 text-xs">
          <Users className="text-primary h-3.5 w-3.5" aria-hidden />
          <span>
            <span className="text-on-surface font-semibold">{filtered.length}</span> barber
            {filtered.length !== 1 ? "s" : ""}
            {query.trim() ? " matching your search" : " on the roster"}
            {" · "}
            <span className="text-status-confirmed font-semibold">{availableCount}</span> available
            now
          </span>
        </p>
      </div>

      {loading ? (
        <p className="text-on-surface-variant mt-10 text-center text-sm">Loading barbers…</p>
      ) : error ? (
        <p className="text-error mt-10 text-center text-sm" role="alert">
          {error}
        </p>
      ) : filtered.length === 0 ? (
        <div className="border-outline-variant mt-10 rounded-xl border border-dashed px-6 py-16 text-center">
          <Search className="text-on-surface-variant/40 mx-auto h-10 w-10" aria-hidden />
          <p className="text-on-surface mt-3 font-serif text-lg font-bold">No barbers found</p>
          <p className="text-on-surface-variant mt-1 text-sm">
            {query.trim() ? "Try a different name or clear your search." : "Check back soon."}
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-primary mt-4 text-sm font-semibold hover:opacity-80"
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
