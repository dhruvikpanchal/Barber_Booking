import Link from "@/lib/AppLink";
import { useMemo } from "react";
import { routes } from "@/client/config/routes/routes";
import ServiceCard from "@/client/modules/public/components/Services/ServiceCard.jsx";
import { enrichService } from "@/client/modules/public/helpers/serviceHelpers.js";

export default function LandingServicesShowcase({ services = [] }) {
  const enriched = useMemo(() => services.map(enrichService).filter(Boolean), [services]);

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
            className="font-label-caps text-on-surface-variant hover:text-primary link-underline hidden md:inline"
          >
            Full catalog →
          </Link>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {enriched.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
