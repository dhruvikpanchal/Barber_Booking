"use client";

import { useEffect, useState } from "react";
import LandingHero from "@/client/modules/public/components/HomePage/LandingHero.jsx";
import LandingSearchStrip from "@/client/modules/public/components/HomePage/LandingSearchStrip.jsx";
import LandingFeaturedShops from "@/client/modules/public/components/HomePage/LandingFeaturedShops.jsx";
import LandingFeaturedBarbers from "@/client/modules/public/components/HomePage/LandingFeaturedBarbers.jsx";
import LandingServicesShowcase from "@/client/modules/public/components/HomePage/LandingServicesShowcase.jsx";
import LandingHowItWorks from "@/client/modules/public/components/HomePage/LandingHowItWorks.jsx";
import LandingTestimonials from "@/client/modules/public/components/HomePage/LandingTestimonials.jsx";
import LandingBarberRegister from "@/client/modules/public/components/HomePage/LandingBarberRegister.jsx";
import LandingFinalCta from "@/client/modules/public/components/HomePage/LandingFinalCta.jsx";
import { publicServices } from "@/client/modules/public/services/publicServices.jsx";

export default function Home() {
  const [home, setHome] = useState(null);

  useEffect(() => {
    publicServices
      .getHome()
      .then(setHome)
      .catch(() => setHome(null));
  }, []);

  return (
    <>
      <LandingHero />
      <LandingSearchStrip />
      <LandingFeaturedShops />
      <LandingFeaturedBarbers barbers={home?.barbers ?? []} />
      <LandingServicesShowcase services={home?.services ?? []} />
      <LandingHowItWorks />
      <LandingTestimonials reviews={home?.testimonials ?? []} />
      <LandingBarberRegister />
      <LandingFinalCta />
    </>
  );
}
