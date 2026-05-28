import Link from "next/link";
import { barbers } from "@/data/public/barbers";
import { routes } from "@/config/routes/routes";
import LandingBarberCard from "@/modules/public/components/homePage/LandingBarberCard";

export default function LandingFeaturedBarbers() {
  return (
    <section className="border-t border-outline-variant bg-surface-container-low px-4 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <div>
            <div className="font-label-caps mb-3 text-primary">Top barbers</div>
            <h2 className="font-serif text-4xl font-bold text-on-surface md:text-5xl">
              The roster.
            </h2>
          </div>
          <Link
            href={routes.public.barbers}
            className="font-label-caps link-underline hidden text-on-surface-variant hover:text-primary md:inline"
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
