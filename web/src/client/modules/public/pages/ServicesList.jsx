"use client";

import { useEffect, useMemo, useState } from "react";
import { Flame, Scissors } from "lucide-react";
import { toast } from "sonner";
import { publicHook } from "@/client/modules/public/hooks/publicQuery.jsx";
import { enrichService } from "@/client/modules/public/helpers/serviceHelpers.js";
import { ssrQueryOptions } from "@/client/modules/public/helpers/publicQueryHelpers.js";
import ServiceCard from "@/client/modules/public/components/Services/ServiceCard.jsx";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CategoryPills({ categories, active, onChange, disabled = false }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter services by category">
      {categories.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            disabled={disabled}
            aria-pressed={isActive}
            className={[
              "disabled:cursor-not-allowed disabled:opacity-50",
              "focus-visible:ring-primary/70 h-9 rounded-full border px-4 text-xs font-semibold tracking-wide transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none",
              isActive
                ? "border-primary bg-primary text-on-primary"
                : "border-outline-variant bg-surface-container text-on-surface-variant hover:border-outline hover:bg-surface-container-high hover:text-on-surface",
            ].join(" ")}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

function EmptyState({ onReset, disabled = false }) {
  return (
    <div className="border-outline-variant col-span-full mt-4 rounded-xl border border-dashed px-6 py-20 text-center">
      <Scissors className="text-on-surface-variant/30 mx-auto h-10 w-10" aria-hidden />
      <p className="text-on-surface mt-4 font-serif text-lg font-bold">
        No services in this category
      </p>
      <p className="text-on-surface-variant mt-1.5 text-sm">
        Try a different filter to see what we offer.
      </p>
      <button
        type="button"
        onClick={onReset}
        disabled={disabled}
        className="text-primary mt-5 text-sm font-semibold transition-opacity hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Show all services
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ServicesList({ initialServices }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const {
    data: rawServices = [],
    isPending,
    isError,
    error,
  } = publicHook.Services.useServices({ limit: 50 }, ssrQueryOptions(initialServices));

  const services = useMemo(() => rawServices.map(enrichService), [rawServices]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load services.");
    }
  }, [isError, error]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(services.map((s) => s.category).filter(Boolean)))],
    [services],
  );

  const filtered = useMemo(
    () =>
      activeCategory === "All" ? services : services.filter((s) => s.category === activeCategory),
    [activeCategory, services],
  );

  const popularCount = services.filter((s) => s.popular).length;

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-4 pt-4 pb-24 md:px-16">
      {/* Page header */}
      <header className="max-w-2xl">
        <p className="font-label-caps text-primary">Services</p>
        <h1 className="text-on-surface font-serif text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          The full menu.
        </h1>
        <p className="text-on-surface-variant mt-3 text-sm leading-relaxed md:text-base">
          Every service is priced from a starting rate — your barber's exact price is confirmed when
          you book. Durations are estimates and may vary.
        </p>

        {/* Quick stat strip */}
        <div className="text-on-surface-variant mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <Scissors className="text-primary/70 h-3.5 w-3.5" aria-hidden />
            <span>
              <span className="text-on-surface font-semibold">{services.length}</span> services
              available
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Flame className="text-primary/70 h-3.5 w-3.5" aria-hidden />
            <span>
              <span className="text-on-surface font-semibold">{popularCount}</span> most-booked
              picks
            </span>
          </span>
        </div>
      </header>

      {/* Category filter */}
      <div className="border-outline-variant bg-surface-container-low mt-8 rounded-xl border p-4 sm:p-5">
        <p className="font-label-caps text-on-surface-variant mb-3 text-[10px] tracking-widest uppercase">
          Filter by category
        </p>
        <CategoryPills
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
          disabled={isPending}
        />
        {activeCategory !== "All" && (
          <p className="text-on-surface-variant mt-3 text-xs">
            Showing <span className="text-on-surface font-semibold">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "service" : "services"} in{" "}
            <span className="text-on-surface font-semibold">{activeCategory}</span>
          </p>
        )}
      </div>

      {/* Services grid */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {isPending ? (
          <p className="text-on-surface-variant col-span-full text-center text-sm">
            Loading services…
          </p>
        ) : filtered.length === 0 ? (
          <EmptyState onReset={() => setActiveCategory("All")} disabled={isPending} />
        ) : (
          filtered.map((service) => <ServiceCard key={service.id} service={service} />)
        )}
      </div>

      {/* Pricing disclaimer */}
      <p className="text-on-surface-variant mt-10 text-center text-xs">
        * Prices shown are starting rates and may vary by barber, shop location, and hair type.
        Final pricing is displayed before you confirm your booking.
      </p>
    </div>
  );
}
