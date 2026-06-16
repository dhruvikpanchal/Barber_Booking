'use client';

import { Search, MapPin, Scissors } from 'lucide-react';

export default function LandingSearchStrip({ disabled = false }) {
  return (
    <section className="border-y border-outline-variant bg-surface-container-lowest px-4 py-10 md:px-16">
      <div className="mx-auto max-w-5xl">
        <form
          className="grid gap-px overflow-hidden rounded-2xl border border-outline-variant bg-outline-variant shadow-sm md:grid-cols-[1fr_1fr_auto]"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Location Field */}
          <label className="flex items-center gap-3 bg-surface-container px-5 py-4">
            <MapPin className="h-4 w-4 shrink-0 text-on-surface-variant" aria-hidden />
            <input
              className="font-label-caps w-full min-w-0 bg-transparent text-on-surface placeholder:text-on-surface-variant focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="City or neighborhood"
              name="location"
              autoComplete="off"
              disabled={disabled}
            />
          </label>

          {/* Service Field */}
          <label className="flex items-center gap-3 bg-surface-container px-5 py-4">
            <Scissors className="h-4 w-4 shrink-0 text-on-surface-variant" aria-hidden />
            <input
              className="font-label-caps w-full min-w-0 bg-transparent text-on-surface placeholder:text-on-surface-variant focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Service or barber"
              name="query"
              autoComplete="off"
              disabled={disabled}
            />
          </label>

          {/* Search Button */}
          <button
            type="submit"
            disabled={disabled}
            className="group flex min-h-14 items-center justify-center gap-2 bg-primary px-8 py-4 font-label-caps text-on-primary transition-all duration-300 hover:bg-primary/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 md:min-w-[180px]"
          >
            <Search
              className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12"
              aria-hidden
            />
            <span>Search</span>
          </button>
        </form>
      </div>
    </section>
  );
}
