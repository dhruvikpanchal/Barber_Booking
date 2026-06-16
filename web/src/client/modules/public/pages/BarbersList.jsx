"use client";

import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";
import BarberListCard from "@/client/modules/public/components/Barbers/BarberListCard.jsx";
import { publicHook } from "@/client/modules/public/hooks/publicQuery.jsx";

export default function BarbersList({ initialBarbers }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), query ? 300 : 0);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: barbers = [], isPending, isError, error } = publicHook.Barbers.useBarbers(
    { q: debouncedQuery || undefined, limit: 50 },
    { initialData: debouncedQuery ? undefined : (initialBarbers ?? undefined) },
  );

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load barbers.");
    }
  }, [isError, error]);

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
            disabled={isPending}
            className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary h-11 w-full rounded-lg border py-2 pr-3 pl-10 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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

      {isPending && !barbers.length ? (
        <p className="text-on-surface-variant mt-10 text-center text-sm">Loading barbers…</p>
      ) : isError ? (
        <p className="text-error mt-10 text-center text-sm" role="alert">
          {error?.message || "Could not load barbers."}
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
            disabled={isPending}
            className="text-primary mt-4 text-sm font-semibold hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
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
