"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Clock, ChevronRight, Flame, Scissors, Zap, Star } from "lucide-react";
import { routes } from "@/client/config/routes/routes";
import { publicServices } from "@/client/modules/public/services/publicServices.jsx";

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

const CATEGORY_ICONS = {
  Haircut: Scissors,
  Beard: Star,
  Packages: Flame,
  Package: Flame,
  Service: Scissors,
};

function enrichService(service) {
  const Icon = CATEGORY_ICONS[service.category] ?? Scissors;
  return { ...service, icon: Icon };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CategoryPills({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter services by category">
      {categories.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            aria-pressed={isActive}
            className={[
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

function PopularBadge() {
  return (
    <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
      <Flame className="h-2.5 w-2.5" aria-hidden />
      Popular
    </span>
  );
}

function ServiceCard({ service }) {
  const Icon = service.icon;
  const detailHref = routes.public.servicesDetail(service.id);

  return (
    <article className="group border-outline-variant bg-surface-container-low hover:border-primary/60 hover:shadow-[0_0_0_1px_var(--color-primary,theme(colors.primary))_inset] hover:shadow-primary/10 relative flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-200">
      {/* Top accent bar */}
      <div className="via-primary/40 h-px w-full bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Icon + popular badge row */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="border-outline-variant bg-surface-container text-primary group-hover:border-primary/40 group-hover:bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors duration-200">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          {service.popular && <PopularBadge />}
        </div>

        {/* Category label */}
        <p className="font-label-caps text-on-surface-variant mb-1 text-[10px] tracking-widest uppercase">
          {service.category}
        </p>

        {/* Service name */}
        <h2 className="text-on-surface group-hover:text-primary font-serif text-xl leading-snug font-bold transition-colors duration-150">
          {service.name}
        </h2>

        {/* Description */}
        <p className="text-on-surface-variant mt-2 flex-1 text-sm leading-relaxed">
          {service.description}
        </p>

        {/* Meta row */}
        <div className="border-outline-variant text-on-surface-variant mt-5 flex items-center gap-4 border-t pt-4 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="text-primary/70 h-3.5 w-3.5 shrink-0" aria-hidden />
            {service.duration} min
          </span>
          <span className="text-primary ml-auto font-serif text-base font-semibold">
            from ${service.startingPrice}
          </span>
        </div>

        {/* CTA */}
        <Link
          href={detailHref}
          className="border-outline-variant bg-surface-container text-on-surface hover:border-primary/50 hover:bg-primary/10 hover:text-primary focus-visible:ring-primary/70 mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border text-sm font-semibold transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none"
          aria-label={`View details for ${service.name}`}
        >
          View Details
          <ChevronRight
            className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </article>
  );
}

function EmptyState({ onReset }) {
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
        className="text-primary mt-5 text-sm font-semibold transition-opacity hover:opacity-75"
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
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicServices
      .getServices({ limit: 50 })
      .then((items) => setServices(items.map(enrichService)))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(services.map((s) => s.category).filter(Boolean)))],
    [services],
  );

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? services
        : services.filter((s) => s.category === activeCategory),
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
        {loading ? (
          <p className="text-on-surface-variant col-span-full text-center text-sm">
            Loading services…
          </p>
        ) : filtered.length === 0 ? (
          <EmptyState onReset={() => setActiveCategory("All")} />
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
