import Link from "next/link";
import { CalendarPlus, Images, MessageSquare, Star, Clock } from "lucide-react";
import { routes } from "@/config/routes/routes.js";

/**
 * @param {{ barber: object }} props
 */
export default function BarberBookingSidebar({ barber, disabled = false }) {
  const bookHref = routes.auth.login;

  return (
    <aside className="space-y-4 lg:sticky lg:top-28">
      <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
        <p className="font-label-caps text-on-surface-variant">Book with</p>
        <p className="mt-1 font-serif text-xl font-bold text-on-surface">
          {barber.name}
        </p>

        <div className="mt-3 space-y-2 text-sm text-on-surface-variant">
          <p className="inline-flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-primary text-primary" aria-hidden />
            <span className="font-semibold text-on-surface">
              {barber.rating.toFixed(1)}
            </span>
            · {barber.reviewCount} reviews
          </p>
          <p className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary/70" aria-hidden />
            {barber.experience} years experience
          </p>
        </div>

        {barber.available ? (
          <Link
            href={bookHref}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : undefined}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-bold text-on-primary transition-colors hover:bg-primary/90 aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden />
            Book appointment
          </Link>
        ) : (
          <p className="mt-4 rounded-md border border-status-cancelled/30 bg-status-cancelled/10 px-3 py-3 text-center text-xs text-status-cancelled">
            Not accepting new bookings right now
          </p>
        )}

        <div className="mt-3 flex flex-col gap-2">
          <a
            href="#gallery"
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : undefined}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-outline-variant text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            <Images className="h-4 w-4" aria-hidden />
            View gallery
          </a>
          <a
            href="#reviews"
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : undefined}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-outline-variant text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container aria-disabled:pointer-events-none aria-disabled:opacity-50"
          >
            <MessageSquare className="h-4 w-4" aria-hidden />
            Read reviews
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
        <p className="font-label-caps text-on-surface-variant">
          Specializations
        </p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {barber.specialties.map((s) => (
            <li
              key={s}
              className="rounded-full border border-outline-variant bg-surface-container px-2.5 py-0.5 text-[11px] text-on-surface"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
