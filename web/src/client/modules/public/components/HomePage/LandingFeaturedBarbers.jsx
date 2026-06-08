import Link from "next/link";
import { routes } from "@/client/config/routes/routes";
import LandingBarberCard from "@/client/modules/public/components/HomePage/LandingBarberCard";

export default function LandingFeaturedBarbers({ barbers = [] }) {
  return (
    <section className="border-outline-variant bg-surface-container-low border-t px-4 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <div>
            <div className="font-label-caps text-primary mb-3">Top barbers</div>
            <h2 className="text-on-surface font-serif text-4xl font-bold md:text-5xl">
              The roster.
            </h2>
          </div>
          <Link
            href={routes.public.barbers}
            className="font-label-caps link-underline text-on-surface-variant hover:text-primary hidden md:inline"
          >
            View all →
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {barbers.map((b) => (
            <LandingBarberCard key={b.id} barber={b} />
          ))}
        </div>
      </div>
    </section>
  );
}
