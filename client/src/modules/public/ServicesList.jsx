"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock, ChevronRight, Flame, Scissors, Zap, Star } from "lucide-react";
import { routes } from "@/config/routes/routes";

// ---------------------------------------------------------------------------
// Service data enriched with categories
// ---------------------------------------------------------------------------
const SERVICES = [
  {
    id: "signature-cut",
    name: "Signature Cut",
    category: "Haircut",
    startingPrice: 45,
    duration: 45,
    description:
      "A thorough consultation followed by a precision cut, finished with a hot-towel close to leave the neckline crisp.",
    popular: true,
    icon: Scissors,
  },
  {
    id: "skin-fade",
    name: "Skin Fade",
    category: "Haircut",
    startingPrice: 40,
    duration: 40,
    description:
      "Tight gradient fade tapering all the way to skin, refined with straight-razor detail along every edge.",
    popular: true,
    icon: Zap,
  },
  {
    id: "beard-sculpt",
    name: "Beard Sculpt",
    category: "Beard",
    startingPrice: 28,
    duration: 25,
    description:
      "Precision trim and shape followed by a conditioning oil treatment that softens the beard and defines its line.",
    popular: false,
    icon: Scissors,
  },
  {
    id: "hot-towel-shave",
    name: "Hot Towel Shave",
    category: "Beard",
    startingPrice: 35,
    duration: 30,
    description:
      "Classic straight-razor shave with a pre-softening hot-towel wrap and a soothing post-shave balm finish.",
    popular: false,
    icon: Star,
  },
  {
    id: "father-son",
    name: "Father & Son Cut",
    category: "Packages",
    startingPrice: 65,
    duration: 60,
    description:
      "Two precision cuts booked side by side — the perfect excuse to spend an hour together at the chair.",
    popular: false,
    icon: Scissors,
  },
  {
    id: "the-works",
    name: "The Works",
    category: "Packages",
    startingPrice: 85,
    duration: 75,
    description:
      "The full experience: haircut, straight-razor shave, beard sculpt, and a revitalising scalp treatment.",
    popular: true,
    icon: Flame,
  },
];

const ALL_CATEGORIES = ["All", ...Array.from(new Set(SERVICES.map((s) => s.category)))];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CategoryPills({ active, onChange }) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter services by category"
    >
      {ALL_CATEGORIES.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            aria-pressed={isActive}
            className={[
              "h-9 rounded-full border px-4 text-xs font-semibold tracking-wide transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
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

function PopularBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase">
      <Flame className="h-2.5 w-2.5" aria-hidden />
      Popular
    </span>
  );
}

function ServiceCard({ service }) {
  const Icon = service.icon;
  const detailHref = routes.public.servicesDetail(service.id);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low transition-all duration-200 hover:border-primary/60 hover:shadow-[0_0_0_1px_var(--color-primary,theme(colors.primary))_inset] hover:shadow-primary/10">
      {/* Top accent bar */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Icon + popular badge row */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface-container text-primary transition-colors duration-200 group-hover:border-primary/40 group-hover:bg-primary/10">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          {service.popular && <PopularBadge />}
        </div>

        {/* Category label */}
        <p className="font-label-caps mb-1 text-[10px] tracking-widest text-on-surface-variant uppercase">
          {service.category}
        </p>

        {/* Service name */}
        <h2 className="font-serif text-xl font-bold leading-snug text-on-surface transition-colors duration-150 group-hover:text-primary">
          {service.name}
        </h2>

        {/* Description */}
        <p className="mt-2 flex-1 text-sm leading-relaxed text-on-surface-variant">
          {service.description}
        </p>

        {/* Meta row */}
        <div className="mt-5 flex items-center gap-4 border-t border-outline-variant pt-4 text-xs text-on-surface-variant">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden />
            {service.duration} min
          </span>
          <span className="ml-auto font-serif text-base font-semibold text-primary">
            from ${service.startingPrice}
          </span>
        </div>

        {/* CTA */}
        <Link
          href={detailHref}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container text-sm font-semibold text-on-surface transition-colors duration-150 hover:border-primary/50 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          aria-label={`View details for ${service.name}`}
        >
          View Details
          <ChevronRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="col-span-full mt-4 rounded-xl border border-dashed border-outline-variant px-6 py-20 text-center">
      <Scissors
        className="mx-auto h-10 w-10 text-on-surface-variant/30"
        aria-hidden
      />
      <p className="mt-4 font-serif text-lg font-bold text-on-surface">
        No services in this category
      </p>
      <p className="mt-1.5 text-sm text-on-surface-variant">
        Try a different filter to see what we offer.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 text-sm font-semibold text-primary transition-opacity hover:opacity-75"
      >
        Show all services
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ServicesList() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? SERVICES
        : SERVICES.filter((s) => s.category === activeCategory),
    [activeCategory],
  );

  const popularCount = SERVICES.filter((s) => s.popular).length;

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-24 pt-4 md:px-16">
      {/* Page header */}
      <header className="max-w-2xl">
        <p className="font-label-caps text-primary">Services</p>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-on-surface md:text-4xl lg:text-5xl">
          The full menu.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant md:text-base">
          Every service is priced from a starting rate — your barber's exact
          price is confirmed when you book. Durations are estimates and may vary.
        </p>

        {/* Quick stat strip */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-on-surface-variant">
          <span className="inline-flex items-center gap-1.5">
            <Scissors className="h-3.5 w-3.5 text-primary/70" aria-hidden />
            <span>
              <span className="font-semibold text-on-surface">{SERVICES.length}</span>{" "}
              services available
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-primary/70" aria-hidden />
            <span>
              <span className="font-semibold text-on-surface">{popularCount}</span>{" "}
              most-booked picks
            </span>
          </span>
        </div>
      </header>

      {/* Category filter */}
      <div className="mt-8 rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
        <p className="font-label-caps mb-3 text-[10px] tracking-widest text-on-surface-variant uppercase">
          Filter by category
        </p>
        <CategoryPills active={activeCategory} onChange={setActiveCategory} />
        {activeCategory !== "All" && (
          <p className="mt-3 text-xs text-on-surface-variant">
            Showing{" "}
            <span className="font-semibold text-on-surface">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "service" : "services"} in{" "}
            <span className="font-semibold text-on-surface">{activeCategory}</span>
          </p>
        )}
      </div>

      {/* Services grid */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 ? (
          <EmptyState onReset={() => setActiveCategory("All")} />
        ) : (
          filtered.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))
        )}
      </div>

      {/* Pricing disclaimer */}
      <p className="mt-10 text-center text-xs text-on-surface-variant">
        * Prices shown are starting rates and may vary by barber, shop location,
        and hair type. Final pricing is displayed before you confirm your
        booking.
      </p>
    </div>
  );
}
