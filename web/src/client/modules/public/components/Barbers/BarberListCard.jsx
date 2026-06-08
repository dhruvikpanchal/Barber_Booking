import Link from "next/link";
import { Star, Clock, Scissors, MapPin, ChevronRight, CalendarPlus } from "lucide-react";
import { routes } from "@/config/routes/routes.js";

/**
 * Matches booking step barber preview — image, stats, services, availability.
 * @param {{ barber: import('@/modules/public/data/barbers.js').barbers[number] }} props
 */
export default function BarberListCard({ barber }) {
  const profileHref = routes.public.barbersDetail(barber.id);
  const bookHref = routes.auth.login;

  return (
    <article
      className={`bg-surface-container-low flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-200 ${
        barber.available
          ? "border-outline-variant hover:border-outline hover:shadow-sm"
          : "border-outline-variant/60 opacity-90"
      }`}
    >
      <Link href={profileHref} className="group relative block aspect-[4/3] overflow-hidden">
        <img
          src={barber.image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute top-3 right-3 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${
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
            <h2 className="text-on-surface group-hover/title:text-primary font-serif text-lg font-bold transition-colors sm:text-xl">
              {barber.name}
            </h2>
          </Link>
          <p className="text-on-surface-variant text-xs">{barber.role}</p>
        </div>

        <p className="text-on-surface-variant mt-2 flex items-start gap-1.5 text-xs">
          <MapPin className="text-primary/70 mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="line-clamp-2">
            {barber.location} · {barber.city}
          </span>
        </p>

        <div className="text-on-surface-variant mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
          <span className="text-on-surface inline-flex items-center gap-1 font-medium">
            <Star className="fill-primary text-primary h-3.5 w-3.5" aria-hidden />
            {barber.rating}
            <span className="text-on-surface-variant font-normal">
              ({barber.reviewCount} reviews)
            </span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="text-primary/70 h-3.5 w-3.5" aria-hidden />
            {barber.experience} yrs
          </span>
          <span className="text-primary font-semibold">from ${barber.startingPrice}</span>
        </div>

        <div className="mt-3">
          <p className="font-label-caps text-on-surface-variant mb-1.5 text-[10px]">Services</p>
          <div className="flex flex-wrap gap-1.5">
            {barber.services.map((name) => (
              <span
                key={name}
                className="border-outline-variant bg-surface-container text-on-surface-variant inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]"
              >
                <Scissors className="text-primary/60 h-2.5 w-2.5" aria-hidden />
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-4 sm:flex-row">
          <Link
            href={profileHref}
            className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md border p-2 text-sm font-semibold transition-colors"
          >
            View profile
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
          {barber.available ? (
            <Link
              href={bookHref}
              className="bg-primary text-on-primary hover:bg-primary/90 inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md p-2 text-sm font-bold transition-colors"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden />
              Book
            </Link>
          ) : (
            <span
              className="border-outline-variant bg-surface-container text-on-surface-variant inline-flex h-10 flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-md border text-sm font-semibold opacity-60"
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
