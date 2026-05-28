import LandingHero from "@/modules/public/components/homePage/LandingHero.jsx";
import LandingSearchStrip from "@/modules/public/components/homePage/LandingSearchStrip.jsx";
import LandingFeaturedShops from "@/modules/public/components/homePage/LandingFeaturedShops.jsx";
import LandingFeaturedBarbers from "@/modules/public/components/homePage/LandingFeaturedBarbers.jsx";
import LandingServicesShowcase from "@/modules/public/components/homePage/LandingServicesShowcase.jsx";
import LandingHowItWorks from "@/modules/public/components/homePage/LandingHowItWorks.jsx";
import LandingTestimonials from "@/modules/public/components/homePage/LandingTestimonials.jsx";
import LandingBarberRegister from "@/modules/public/components/homePage/LandingBarberRegister.jsx";
import LandingFinalCta from "@/modules/public/components/homePage/LandingFinalCta.jsx";

export default function Home() {
  return (
    <>
      <LandingHero />
      <LandingSearchStrip />
      <LandingFeaturedShops />
      <LandingFeaturedBarbers />
      <LandingServicesShowcase />
      <LandingHowItWorks />
      <LandingTestimonials />
      <LandingBarberRegister />
      <LandingFinalCta />
    </>
  );
}
