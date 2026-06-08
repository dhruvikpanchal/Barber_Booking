import Link from "next/link";
import { routes } from "@/client/config/routes/routes";
import LandingServiceCard from "@/client/modules/public/components/HomePage/LandingServiceCard";

export default function LandingServicesShowcase({ services = [] }) {
  return (
    <section className="px-4 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <div>
            <div className="font-label-caps text-primary mb-3">Services</div>
            <h2 className="text-on-surface font-serif text-4xl font-bold md:text-5xl">The menu.</h2>
          </div>
          <Link
            href={routes.public.services}
            className="font-label-caps link-underline text-on-surface-variant hover:text-primary hidden md:inline"
          >
            Full catalog →
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <LandingServiceCard key={s.id} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
