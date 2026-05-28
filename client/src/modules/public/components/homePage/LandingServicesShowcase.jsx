import Link from "next/link";
import { services } from "@/data/public/services";
import { routes } from "@/config/routes/routes";
import LandingServiceCard from "@/modules/public/components/homePage/LandingServiceCard";

export default function LandingServicesShowcase() {
  return (
    <section className="px-4 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <div>
            <div className="font-label-caps mb-3 text-primary">Services</div>
            <h2 className="font-serif text-4xl font-bold text-on-surface md:text-5xl">
              The menu.
            </h2>
          </div>
          <Link
            href={routes.public.services}
            className="font-label-caps link-underline hidden text-on-surface-variant hover:text-primary md:inline"
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
