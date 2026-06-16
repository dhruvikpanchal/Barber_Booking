"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import LandingHero from "@/client/modules/public/components/HomePage/LandingHero.jsx";
import LandingSearchStrip from "@/client/modules/public/components/HomePage/LandingSearchStrip.jsx";
import LandingFeaturedShops from "@/client/modules/public/components/HomePage/LandingFeaturedShops.jsx";
import LandingFeaturedBarbers from "@/client/modules/public/components/HomePage/LandingFeaturedBarbers.jsx";
import LandingServicesShowcase from "@/client/modules/public/components/HomePage/LandingServicesShowcase.jsx";
import LandingHowItWorks from "@/client/modules/public/components/HomePage/LandingHowItWorks.jsx";
import LandingTestimonials from "@/client/modules/public/components/HomePage/LandingTestimonials.jsx";
import LandingBarberRegister from "@/client/modules/public/components/HomePage/LandingBarberRegister.jsx";
import LandingFinalCta from "@/client/modules/public/components/HomePage/LandingFinalCta.jsx";
import { publicHook } from "@/client/modules/public/hooks/publicQuery.jsx";

export default function Home({ initialData }) {
  const { data: home, isError, error } = publicHook.Home.useHome({
    initialData: initialData ?? undefined,
  });

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load home page content.");
    }
  }, [isError, error]);

  return (
    <>
      <LandingHero />
      <LandingSearchStrip />
      {/* <LandingFeaturedShops /> */}
      <LandingFeaturedBarbers barbers={home?.barbers ?? []} />
      <LandingServicesShowcase services={home?.services ?? []} />
      <LandingHowItWorks />
      <LandingTestimonials />
      <LandingBarberRegister />
      <LandingFinalCta />
    </>
  );
}
