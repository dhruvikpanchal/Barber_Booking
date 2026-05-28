import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import BarberProfileHero from "./components/barbers/BarberProfileHero.jsx";
import BarberRatingSummary from "./components/barbers/BarberRatingSummary.jsx";
import BarberServicesSection from "./components/barbers/BarberServicesSection.jsx";
import BarberWorkingHours from "./components/barbers/BarberWorkingHours.jsx";
import BarberGallery from "./components/barbers/BarberGallery.jsx";
import BarberReviewsSection from "./components/barbers/BarberReviewsSection.jsx";
import BarberBookingSidebar from "./components/barbers/BarberBookingSidebar.jsx";

/**
 * @param {{ barber: ReturnType<import('@/data/public/barbers.js').getBarberById> }} props
 */
export default function BarberDetail({ barber }) {
  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-4 pb-24 pt-28 md:px-16">
      <Link
        href={routes.public.barbers}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All barbers
      </Link>

      <div className="mt-6 space-y-8">
        <BarberProfileHero barber={barber} />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="min-w-0 space-y-8">
            <section className="rounded-xl border border-outline-variant bg-surface-container-low p-5 sm:p-6">
              <h2 className="font-serif text-lg font-bold text-on-surface">
                About
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                {barber.bio}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {barber.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>

            <BarberRatingSummary
              rating={barber.rating}
              reviewCount={barber.reviewCount}
              breakdown={barber.ratingBreakdown}
            />

            <BarberServicesSection services={barber.offeredServices} />

            <BarberGallery images={barber.gallery} />

            <BarberReviewsSection reviews={barber.reviews} />
          </div>

          <div className="min-w-0 space-y-4">
            <BarberBookingSidebar barber={barber} />
            <BarberWorkingHours hours={barber.workingHours} />
          </div>
        </div>
      </div>
    </div>
  );
}
