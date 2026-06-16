import { routes } from "@/config/routes/routes.js";
import BarberProfileSummary from "@/client/modules/shared/types/BarberProfileSummary.jsx";

/**
 * @param {{ barber: import('@/client/modules/public/data/barbersData.js').barbers[number] & import('@/client/modules/public/data/barberProfilesData.js').BARBER_PROFILE_DETAILS[string] }} props
 */
export default function BarberProfileHero({ barber }) {
  return (
    <BarberProfileSummary
      variant="hero"
      showActions
      bookHref={routes.auth.login}
      barber={{
        name: barber.name,
        role: barber.role,
        image: barber.image,
        available: barber.available,
        location: barber.location,
        address: barber.address,
        city: barber.city,
        rating: barber.rating,
        reviewCount: barber.reviewCount,
        experienceText: `${barber.experience} years experience`,
        startingPrice: barber.startingPrice,
      }}
    />
  );
}
