import Link from "next/link";
import {
  Star,
  Clock,
  Scissors,
  MapPin,
  ChevronRight,
  CalendarPlus,
} from "lucide-react";
import { routes } from "@/config/routes/routes.js";

/**
 * Matches booking step barber preview — image, stats, services, availability.
 * @param {{ barber: import('@/data/public/barbers.js').barbers[number] }} props
 */
export default function BarberListCard({ barber }) {
  const profileHref = routes.public.barbersDetail(barber.id);
  const bookHref = routes.auth.login;

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-xl border bg-surface-container-low transition-all duration-200 ${
        barber.available
          ? "border-outline-variant hover:border-outline hover:shadow-sm"
          : "border-outline-variant/60 opacity-90"
      }`}
    >
      <Link
        href={profileHref}
        className="group relative block aspect-[4/3] overflow-hidden"
      >
        <img
          src={barber.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${
            barber.available
              ? "border-status-confirmed/40 bg-status-confirmed/15 text-status-confirmed"
              : "border-status-cancelled/40 bg-status-cancelled/15 text-status-cancelled"
          }`}
        >
          {barber.available ? "Available" : "Unavailable"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="min-w-0">
          <Link href={profileHref} className="group/title">
            <h2 className="font-serif text-lg font-bold text-on-surface transition-colors group-hover/title:text-primary sm:text-xl">
              {barber.name}
            </h2>
          </Link>
          <p className="text-xs text-on-surface-variant">{barber.role}</p>
        </div>

        <p className="mt-2 flex items-start gap-1.5 text-xs text-on-surface-variant">
          <MapPin
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70"
            aria-hidden
          />
          <span className="line-clamp-2">
            {barber.location} · {barber.city}
          </span>
        </p>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-on-surface-variant">
          <span className="inline-flex items-center gap-1 font-medium text-on-surface">
            <Star
              className="h-3.5 w-3.5 fill-primary text-primary"
              aria-hidden
            />
            {barber.rating}
            <span className="font-normal text-on-surface-variant">
              ({barber.reviewCount} reviews)
            </span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-primary/70" aria-hidden />
            {barber.experience} yrs
          </span>
          <span className="font-semibold text-primary">
            from ${barber.startingPrice}
          </span>
        </div>

        <div className="mt-3">
          <p className="font-label-caps mb-1.5 text-[10px] text-on-surface-variant">
            Services
          </p>
          <div className="flex flex-wrap gap-1.5">
            {barber.services.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container px-2 py-0.5 text-[11px] text-on-surface-variant"
              >
                <Scissors className="h-2.5 w-2.5 text-primary/60" aria-hidden />
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row">
          <Link
            href={profileHref}
            className="inline-flex h-10 flex-1 p-2 items-center justify-center gap-1.5 rounded-md border border-outline-variant bg-surface-container text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
          >
            View profile
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
          {barber.available ? (
            <Link
              href={bookHref}
              className="inline-flex h-10 p-2 flex-1 items-center justify-center gap-1.5 rounded-md bg-primary text-sm font-bold text-on-primary transition-colors hover:bg-primary/90"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden />
              Book
            </Link>
          ) : (
            <span
              className="inline-flex h-10 flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-md border border-outline-variant bg-surface-container text-sm font-semibold text-on-surface-variant opacity-60"
              aria-disabled="true"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden />
              Book
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
