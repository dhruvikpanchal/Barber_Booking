// import Link from "next/link";
import { shops } from "@/data/public/shops";
// import { routes } from "@/config/routes/routes";
import LandingShopCard from "@/modules/public/components/homePage/LandingShopCard";

export default function LandingFeaturedShops() {
  return (
    <section className="px-4 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <div>
            <div className="font-label-caps mb-3 text-primary">
              Featured shops
            </div>
            <h2 className="font-serif text-4xl font-bold text-on-surface md:text-5xl">
              Locations.
            </h2>
          </div>
          {/* <Link
            href={routes.public.shops}
            className="font-label-caps link-underline hidden text-on-surface-variant hover:text-primary md:inline"
          >
            View all →
          </Link> */}
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shops.map((s) => (
            <LandingShopCard key={s.id} shop={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
