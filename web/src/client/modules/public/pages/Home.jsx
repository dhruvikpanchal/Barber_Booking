"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import LandingHero from "@/client/modules/public/components/HomePage/LandingHero.jsx";
import LandingSearchStrip from "@/client/modules/public/components/HomePage/LandingSearchStrip.jsx";
import LandingFeaturedBarbers from "@/client/modules/public/components/HomePage/LandingFeaturedBarbers.jsx";
import LandingServicesShowcase from "@/client/modules/public/components/HomePage/LandingServicesShowcase.jsx";
import LandingHowItWorks from "@/client/modules/public/components/HomePage/LandingHowItWorks.jsx";
import LandingTestimonials from "@/client/modules/public/components/HomePage/LandingTestimonials.jsx";
import LandingBarberRegister from "@/client/modules/public/components/HomePage/LandingBarberRegister.jsx";
import LandingFinalCta from "@/client/modules/public/components/HomePage/LandingFinalCta.jsx";
import { publicHook } from "@/client/modules/public/hooks/publicQuery.jsx";
import {
  PUBLIC_HOME_STALE_MS,
  ssrQueryOptions,
} from "@/client/modules/public/helpers/publicQueryHelpers.js";

export default function Home({ initialData }) {
  const { data: home, isError, error } = publicHook.Home.useHome(
    ssrQueryOptions(initialData, { staleTime: PUBLIC_HOME_STALE_MS }),
  );

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load home page content.");
    }
  }, [isError, error]);

  return (
    <>
      <LandingHero />
      <LandingSearchStrip />
      <LandingFeaturedBarbers barbers={home?.barbers ?? []} />
      <LandingServicesShowcase services={home?.services ?? []} />
      <LandingHowItWorks />
      <LandingTestimonials />
      <LandingBarberRegister />
      <LandingFinalCta />
    </>
  );
}
