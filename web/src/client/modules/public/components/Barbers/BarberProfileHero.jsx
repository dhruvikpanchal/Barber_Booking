import { routes } from "@/config/routes/routes.js";
import BarberProfileSummary from "@/components/domain/BarberProfileSummary.jsx";

/**
 * @param {{ barber: import('@/modules/public/data/barbers.js').barbers[number] & import('@/modules/public/data/barberProfiles.js').BARBER_PROFILE_DETAILS[string] }} props
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
