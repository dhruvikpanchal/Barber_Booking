"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publicServices } from "@/client/modules/public/services/publicServices.jsx";
import {
  Clock,
  ChevronRight,
  Flame,
  Scissors,
  Zap,
  Star,
  CalendarPlus,
  CheckCircle2,
  Info,
  ArrowLeft,
  Home,
} from "lucide-react";
import { routes } from "@/client/config/routes/routes";

// ---------------------------------------------------------------------------
// Service catalog with full detail data
// ---------------------------------------------------------------------------
const SERVICES = [
  {
    id: "signature-cut",
    name: "Signature Cut",
    category: "Haircut",
    startingPrice: 45,
    duration: 45,
    popular: true,
    icon: Scissors,
    tagline: "Precision, personalised — every time.",
    description:
      "Our Signature Cut starts with a thorough one-on-one consultation so your barber understands your lifestyle, face shape, and maintenance routine before a single snip is taken. The cut itself uses scissor-over-comb and clipper blending techniques to deliver a shape that sits perfectly both fresh from the chair and a few weeks out. Every session closes with a hot-towel neck finish and a light hold styling product of your choice.",
    benefits: [
      "Personal consultation before the cut begins",
      "Scissor and clipper blending for natural movement",
      "Hot-towel neckline finish for a clean close",
      "Style advice and product recommendations",
      "Suitable for all hair types and textures",
    ],
    note: "Duration may extend by 10–15 min for longer or denser hair. Price varies by barber and location.",
    relatedIds: ["skin-fade", "the-works", "hot-towel-shave"],
  },
  {
    id: "skin-fade",
    name: "Skin Fade",
    category: "Haircut",
    startingPrice: 40,
    duration: 40,
    popular: true,
    icon: Zap,
    tagline: "Sharp taper, clean finish — zero compromise.",
    description:
      "The Skin Fade is the definitive modern barber service — a seamless gradient that moves from skin-bare at the sides up to your chosen length on top. Your barber will establish a clean guide line, then blend downward through multiple guard lengths before finishing bare with a foil or T-bar trimmer. The result is a structured, high-contrast look that stays sharp for weeks.",
    benefits: [
      "Seamless gradient from skin to full length",
      "Razor-detailed hairline, temples, and neckline",
      "High, mid, or low taper placement to suit your style",
      "Aftershave balm applied to faded areas",
      "Lasts 3–4 weeks before a touch-up is needed",
    ],
    note: "Exact fade height and contrast are agreed during the consultation. Price varies by barber.",
    relatedIds: ["signature-cut", "the-works", "beard-sculpt"],
  },
  {
    id: "beard-sculpt",
    name: "Beard Sculpt",
    category: "Beard",
    startingPrice: 28,
    duration: 25,
    popular: false,
    icon: Scissors,
    tagline: "Define, condition, repeat.",
    description:
      "The Beard Sculpt takes your beard from overgrown to intentional. Your barber trims to your preferred length with scissors and a comb, then sculpts the cheek lines and neckline with a straight razor for surgical definition. A conditioning beard oil treatment follows to soften the hair, hydrate the skin beneath, and add a healthy sheen.",
    benefits: [
      "Custom length setting to your preference",
      "Straight-razor cheek and neckline definition",
      "Warm towel wrap to open pores before shaping",
      "Conditioning beard oil applied after sculpting",
      "Tips on home maintenance to hold the shape longer",
    ],
    note: "Can be added as an add-on to any haircut service for a reduced combined rate. Price varies by barber.",
    relatedIds: ["hot-towel-shave", "the-works", "signature-cut"],
  },
  {
    id: "hot-towel-shave",
    name: "Hot Towel Shave",
    category: "Beard",
    startingPrice: 35,
    duration: 30,
    popular: false,
    icon: Star,
    tagline: "The old-school ritual, done properly.",
    description:
      "The Hot Towel Shave is a slow, deliberate ritual that leaves skin impossibly smooth. A series of progressively hotter towels soften the stubble and open the pores before a rich pre-shave oil is massaged in. Your barber then applies a lathered shaving cream with a badger brush and uses a precision straight razor in short, controlled strokes with the grain. A cold towel closes the pores, followed by a soothing aftershave balm.",
    benefits: [
      "Multi-stage hot-towel prep for a closer shave",
      "Pre-shave oil to protect and soften the skin",
      "Badger-brush lathered shaving cream application",
      "Single-pass straight-razor shave with the grain",
      "Cold towel closure and aftershave balm finish",
    ],
    note: "Not recommended within 48 hours of active skin irritation or razor burn. Price varies by barber.",
    relatedIds: ["beard-sculpt", "the-works", "signature-cut"],
  },
  {
    id: "father-son",
    name: "Father & Son Cut",
    category: "Packages",
    startingPrice: 65,
    duration: 60,
    popular: false,
    icon: Scissors,
    tagline: "Two chairs, one memory.",
    description:
      "The Father & Son Cut is a shared experience — two precision haircuts delivered side by side in the same session. Each cut is tailored individually: the adult receives our full Signature Cut consultation and finish, while the junior cut is adapted to the child's hair type and the parent's preferred maintenance style. A great way to introduce younger clients to the barbershop.",
    benefits: [
      "Two individual consultations, one shared booking slot",
      "Adult Signature Cut included for the senior client",
      "Junior cut tailored for younger hair and scalp",
      "Hot-towel neckline finish for both",
      "A relaxed, unhurried pace — no rush between chairs",
    ],
    note: "Junior client must be 3 years or older. Price covers two cuts and may vary by barber and shop.",
    relatedIds: ["signature-cut", "skin-fade", "the-works"],
  },
  {
    id: "the-works",
    name: "The Works",
    category: "Packages",
    startingPrice: 85,
    duration: 75,
    popular: true,
    icon: Flame,
    tagline: "Every service. One sitting.",
    description:
      "The Works is the full Iron & Oak experience in a single 75-minute session. It opens with a scalp-stimulating treatment to prep the hair, followed by your choice of cut, a straight-razor hot-towel shave, beard sculpt, and a finishing scalp massage with revitalising tonic. Leave looking and feeling genuinely different. Ideal as a monthly reset or a special-occasion treat.",
    benefits: [
      "Scalp stimulating treatment at the start of the session",
      "Full Signature Cut or Skin Fade of your choice",
      "Straight-razor hot-towel shave included",
      "Beard sculpt with conditioning oil finish",
      "Revitalising scalp massage and tonic to close",
    ],
    note: "Advance booking strongly recommended — slots are limited. Price varies by barber and location.",
    relatedIds: ["signature-cut", "skin-fade", "beard-sculpt"],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const CATEGORY_ICON = {
  Haircut: Scissors,
  Beard: Star,
  Packages: Flame,
};

const SERVICE_ICONS = {
  "signature-cut": Scissors,
  "skin-fade": Zap,
  "beard-sculpt": Scissors,
  "hot-towel-shave": Star,
  "father-son": Scissors,
  "the-works": Flame,
};

function attachIcon(service) {
  if (!service) return null;
  const Icon = SERVICE_ICONS[service.id] ?? CATEGORY_ICON[service.category] ?? Scissors;
  return { ...service, icon: Icon };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Breadcrumb trail */
function Breadcrumb({ service }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-on-surface-variant flex items-center gap-1.5 text-xs"
    >
      <Link
        href={routes.public.home}
        className="hover:text-primary inline-flex items-center gap-1 transition-colors"
      >
        <Home className="h-3 w-3" aria-hidden />
        Home
      </Link>
      <ChevronRight className="h-3 w-3 shrink-0 opacity-40" aria-hidden />
      <Link href={routes.public.services} className="hover:text-primary transition-colors">
        Services
      </Link>
      <ChevronRight className="h-3 w-3 shrink-0 opacity-40" aria-hidden />
      <span className="text-on-surface font-medium" aria-current="page">
        {service.name}
      </span>
    </nav>
  );
}

/** Hero section — full-width banner with service identity */
function ServiceHero({ service }) {
  const Icon = service.icon;
  const CatIcon = CATEGORY_ICON[service.category] ?? Scissors;

  return (
    <section className="border-outline-variant bg-surface-container-low relative overflow-hidden rounded-xl border">
      {/* Decorative gradient layer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 50%, var(--color-primary), transparent)",
        }}
      />

      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 39px,var(--color-outline-variant) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,var(--color-outline-variant) 40px)",
        }}
      />

      <div className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center md:gap-12 md:p-10 lg:p-12">
        {/* Left — text content */}
        <div>
          {/* Category chip */}
          <div className="border-outline-variant bg-surface-container text-on-surface-variant mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-widest uppercase">
            <CatIcon className="text-primary/70 h-3 w-3" aria-hidden />
            {service.category}
          </div>

          <div className="flex flex-wrap items-start gap-3">
            <h1 className="text-on-surface font-serif text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {service.name}
            </h1>
            {service.popular && (
              <span className="border-primary/30 bg-primary/10 text-primary mt-1.5 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-widest uppercase">
                <Flame className="h-2.5 w-2.5" aria-hidden />
                Popular
              </span>
            )}
          </div>

          <p className="text-on-surface-variant mt-2 font-serif text-base italic md:text-lg">
            {service.tagline}
          </p>

          {/* Stats row */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-on-surface-variant text-[10px] font-semibold tracking-widest uppercase">
                Starting from
              </span>
              <span className="text-primary font-serif text-2xl font-bold">
                ${service.startingPrice}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-on-surface-variant text-[10px] font-semibold tracking-widest uppercase">
                Duration
              </span>
              <span className="text-on-surface inline-flex items-center gap-1.5 font-serif text-2xl font-bold">
                <Clock className="text-primary/70 h-5 w-5" aria-hidden />
                {service.duration} min
              </span>
            </div>
          </div>

          {/* CTA row */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={routes.auth.login}
              className="bg-primary text-on-primary hover:bg-primary/90 focus-visible:ring-primary/70 inline-flex h-12 items-center gap-2 rounded-lg px-6 text-sm font-bold shadow-sm transition-all duration-150 hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden />
              Book Appointment
            </Link>
            <Link
              href={routes.public.services}
              className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high focus-visible:ring-primary/70 inline-flex h-12 items-center gap-2 rounded-lg border px-5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              All Services
            </Link>
          </div>
        </div>

        {/* Right — large icon medallion */}
        <div
          className="border-primary/20 bg-primary/8 hidden h-36 w-36 shrink-0 items-center justify-center rounded-2xl border md:flex lg:h-44 lg:w-44"
          aria-hidden
        >
          <Icon className="text-primary/60 h-16 w-16 lg:h-20 lg:w-20" />
        </div>
      </div>
    </section>
  );
}

/** Full description block */
function ServiceDescription({ service }) {
  return (
    <section className="border-outline-variant bg-surface-container-low rounded-xl border p-5 sm:p-6">
      <header className="mb-4 flex items-center gap-2.5">
        <span className="bg-primary/12 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <Info className="h-4 w-4" aria-hidden />
        </span>
        <h2 className="text-on-surface font-serif text-lg font-bold">About this service</h2>
      </header>
      <p className="text-on-surface-variant text-sm leading-7">{service.description}</p>
    </section>
  );
}

/** Benefits / what's included checklist */
function ServiceBenefits({ service }) {
  return (
    <section className="border-outline-variant bg-surface-container-low rounded-xl border p-5 sm:p-6">
      <header className="mb-4 flex items-center gap-2.5">
        <span className="bg-primary/12 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
        </span>
        <h2 className="text-on-surface font-serif text-lg font-bold">What&rsquo;s included</h2>
      </header>
      <ul className="space-y-3">
        {service.benefits.map((benefit, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span className="text-on-surface-variant text-sm leading-relaxed">{benefit}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Pricing info card */
function PricingCard({ service }) {
  return (
    <div className="border-outline-variant bg-surface-container-low rounded-xl border p-5 sm:p-6">
      <p className="font-label-caps text-on-surface-variant text-[10px] tracking-widest uppercase">
        Pricing
      </p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-primary font-serif text-4xl font-bold">${service.startingPrice}</span>
        <span className="text-on-surface-variant text-sm">starting from</span>
      </div>
      <p className="text-on-surface-variant mt-3 text-xs leading-relaxed">
        Exact pricing is set by each barber based on their experience, location, and the specific
        requirements of your appointment. The final price is shown before you confirm your booking —
        no surprises.
      </p>

      <div className="border-outline-variant my-4 border-t" />

      <div className="text-on-surface-variant flex items-center gap-2 text-sm">
        <Clock className="text-primary/70 h-4 w-4 shrink-0" aria-hidden />
        <span>
          Approx. <span className="text-on-surface font-semibold">{service.duration} minutes</span>
        </span>
      </div>

      <Link
        href={routes.auth.login}
        className="bg-primary text-on-primary hover:bg-primary/90 focus-visible:ring-primary/70 mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none"
      >
        <CalendarPlus className="h-4 w-4" aria-hidden />
        Book Appointment
      </Link>

      {service.note && (
        <p className="border-outline-variant bg-surface-container text-on-surface-variant mt-4 rounded-lg border px-3 py-2.5 text-[11px] leading-relaxed">
          <span className="text-on-surface font-semibold">Note: </span>
          {service.note}
        </p>
      )}
    </div>
  );
}

/** Related services row */
function RelatedServices({ services }) {
  if (!services.length) return null;

  return (
    <section className="mt-14">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-label-caps text-primary text-[11px] tracking-widest uppercase">
            Explore more
          </p>
          <h2 className="text-on-surface mt-1 font-serif text-2xl font-bold">Related services</h2>
        </div>
        <Link
          href={routes.public.services}
          className="font-label-caps text-on-surface-variant hover:text-primary hidden text-xs tracking-widest transition-colors sm:inline-flex sm:items-center sm:gap-1"
        >
          Full catalog
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <Link
              key={svc.id}
              href={routes.public.servicesDetail(svc.id)}
              className="group border-outline-variant bg-surface-container-low hover:border-primary/50 hover:bg-surface-container focus-visible:ring-primary/70 flex flex-col gap-3 rounded-xl border p-5 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="border-outline-variant bg-surface-container text-primary group-hover:border-primary/40 group-hover:bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors">
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                {svc.popular && (
                  <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[10px] font-bold">
                    <Flame className="h-2 w-2" aria-hidden />
                    Popular
                  </span>
                )}
              </div>

              <div>
                <p className="text-on-surface group-hover:text-primary font-serif text-base font-bold transition-colors">
                  {svc.name}
                </p>
                <p className="text-on-surface-variant mt-1 line-clamp-2 text-xs leading-relaxed">
                  {svc.tagline}
                </p>
              </div>

              <div className="border-outline-variant text-on-surface-variant mt-auto flex items-center justify-between border-t pt-3 text-xs">
                <span className="inline-flex items-center gap-1">
                  <Clock className="text-primary/60 h-3 w-3" aria-hidden />
                  {svc.duration} min
                </span>
                <span className="text-primary font-serif text-sm font-semibold">
                  from ${svc.startingPrice}
                </span>
              </div>

              <div className="text-primary flex items-center gap-1 text-xs font-semibold opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                View details
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 sm:hidden">
        <Link
          href={routes.public.services}
          className="text-primary inline-flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-75"
        >
          See the full catalog
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Drop this component into src/modules/public/ServiceDetail.jsx.
 * Wire it up from src/app/(public)/services/[id]/page.js:
 *
 *   import ServiceDetail from "@/client/modules/public/ServiceDetail";
 *   export default function ServiceDetailPage({ params }) {
 *     return <ServiceDetail id={params.id} />;
 *   }
 */
export default function ServiceDetail({ id }) {
  const [service, setService] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    publicServices
      .getService(id)
      .then(async (data) => {
        if (cancelled) return;
        const main = attachIcon(data);
        setService(main);
        const relatedItems = await Promise.all(
          (data.relatedIds ?? []).map((slug) =>
            publicServices.getService(slug).catch(() => null),
          ),
        );
        if (!cancelled) {
          setRelated(relatedItems.map(attachIcon).filter(Boolean));
        }
      })
      .catch(() => {
        if (!cancelled) setService(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="text-on-surface-variant mx-auto max-w-6xl px-4 py-24 text-center text-sm md:px-16">
        Loading service…
      </div>
    );
  }

  if (!service) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-4 pt-4 pb-24 md:px-16">
      {/* Breadcrumb */}
      <Breadcrumb service={service} />

      {/* Hero */}
      <div className="mt-6">
        <ServiceHero service={service} />
      </div>

      {/* Main body — 2-column on large screens */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start xl:grid-cols-[1fr_320px]">
        {/* Left column */}
        <div className="space-y-5">
          <ServiceDescription service={service} />
          <ServiceBenefits service={service} />
        </div>

        {/* Right column — sticky pricing card */}
        <div className="lg:sticky lg:top-28">
          <PricingCard service={service} />
        </div>
      </div>

      {/* Related services */}
      <RelatedServices services={related} />
    </div>
  );
}
