import Image from "next/image";
// import Link from "next/link";
import { Star, MapPin } from "lucide-react";
// import { routes } from "@/config/routes/routes";

export default function LandingShopCard({ shop }) {
  return (
    // <Link
    // href={`${routes.public.shops}/${shop.id}`}
    //   className="group block border border-outline-variant bg-surface-container transition-colors hover:border-primary"
    // >
    <div className="group block border border-outline-variant bg-surface-container transition-colors hover:border-primary">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={shop.image}
          alt={shop.name}
          fill
          className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-5">
        <div className="font-serif text-lg font-semibold text-on-surface">
          {shop.name}
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-on-surface-variant">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden /> {shop.city}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-outline-variant pt-4">
          <div className="flex items-center gap-1 text-xs">
            <Star
              className="h-3.5 w-3.5 fill-primary text-primary"
              aria-hidden
            />
            <span className="text-on-surface">{shop.rating}</span>
            <span className="text-on-surface-variant">({shop.reviews})</span>
          </div>
          <div className="font-label-caps text-primary">
            From ${shop.startingPrice}
          </div>
        </div>
      </div>
    </div>
    // </Link>
  );
}
