import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { routes } from "@/config/routes/routes";

export default function LandingBarberCard({ barber }) {
  return (
    <Link
      href={routes.public.barbersDetail(barber.id)}
      className="group block border border-outline-variant bg-surface-container transition-colors hover:border-primary"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={barber.image}
          alt={barber.name}
          fill
          className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-serif text-lg font-semibold text-on-surface">
              {barber.name}
            </div>
            <div className="mt-1 text-xs text-on-surface-variant">
              {barber.location ?? barber.shop} · {barber.city}
            </div>
          </div>
          <span
            className={`font-label-caps shrink-0 px-2 py-0.5 text-[10px] ${
              barber.available
                ? "border border-status-confirmed text-status-confirmed"
                : "border border-status-cancelled text-status-cancelled"
            }`}
          >
            {barber.available ? "Open" : "Booked"}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-outline-variant pt-4 text-xs">
          <div className="flex items-center gap-1">
            <Star
              className="h-3.5 w-3.5 fill-primary text-primary"
              aria-hidden
            />
            <span className="text-on-surface">{barber.rating}</span>
            <span className="text-on-surface-variant">
              · {barber.experience}y
              {barber.reviewCount != null
                ? ` · ${barber.reviewCount} reviews`
                : ""}
            </span>
          </div>
          <div className="font-label-caps text-primary">
            From ${barber.startingPrice}
          </div>
        </div>
      </div>
    </Link>
  );
}
