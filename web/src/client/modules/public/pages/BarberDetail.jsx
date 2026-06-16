"use client";

import { useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import BarberProfileHero from "@/client/modules/public/components/Barbers/BarberProfileHero.jsx";
import BarberRatingSummary from "@/client/modules/public/components/Barbers/BarberRatingSummary.jsx";
import BarberServicesSection from "@/client/modules/public/components/Barbers/BarberServicesSection.jsx";
import BarberWorkingHours from "@/client/modules/public/components/Barbers/BarberWorkingHours.jsx";
import BarberGallery from "@/client/modules/public/components/Barbers/BarberGallery.jsx";
import BarberReviewsSection from "@/client/modules/public/components/Barbers/BarberReviewsSection.jsx";
import BarberBookingSidebar from "@/client/modules/public/components/Barbers/BarberBookingSidebar.jsx";
import { publicHook } from "@/client/modules/public/hooks/publicQuery.jsx";

export default function BarberDetail({ slug, initialBarber }) {
  const { data: barber, isPending, isError, error } = publicHook.Barbers.useBarber(slug, {
    initialData: initialBarber ?? undefined,
  });

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load barber profile.");
    }
  }, [isError, error]);

  useEffect(() => {
    if (!isPending && !isError && !barber) {
      notFound();
    }
  }, [isPending, isError, barber]);

  if (isPending && !barber) {
    return (
      <div className="text-on-surface-variant mx-auto max-w-6xl px-4 py-24 text-center text-sm md:px-16">
        Loading barber profile…
      </div>
    );
  }

  if (!barber) return null;

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-4 pt-28 pb-24 md:px-16">
      <Link
        href={routes.public.barbers}
        onClick={(e) => {
          if (isPending) e.preventDefault();
        }}
        aria-disabled={isPending}
        tabIndex={isPending ? -1 : undefined}
        className="text-on-surface-variant hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All barbers
      </Link>

      <div className="mt-6 space-y-8">
        <BarberProfileHero barber={barber} />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="min-w-0 space-y-8">
            <section className="border-outline-variant bg-surface-container-low rounded-xl border p-5 sm:p-6">
              <h2 className="text-on-surface font-serif text-lg font-bold">About</h2>
              <p className="text-on-surface-variant mt-3 text-sm leading-relaxed">{barber.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {barber.specialties.map((s) => (
                  <span
                    key={s}
                    className="border-primary/25 bg-primary/10 text-primary rounded-full border px-3 py-1 text-xs font-medium"
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
            <BarberBookingSidebar barber={barber} disabled={isPending} />
            <BarberWorkingHours hours={barber.workingHours} />
          </div>
        </div>
      </div>
    </div>
  );
}
