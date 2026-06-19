import Link from "@/lib/AppLink";
import Image from "next/image";
import { Star, Clock, MapPin, CalendarPlus, Images, MessageSquare, User } from "lucide-react";

/**
 * Shared barber profile card — matches public listing/detail hierarchy.
 * @param {{
 *   variant?: 'hero' | 'compact',
 *   barber: {
 *     name: string,
 *     role?: string,
 *     image?: string | null,
 *     available: boolean,
 *     location: string,
 *     address?: string,
 *     city?: string,
 *     rating?: number,
 *     reviewCount?: number,
 *     experienceText?: string,
 *     startingPrice?: number,
 *     bio?: string,
 *     specialties?: string[],
 *     services?: string[],
 *   },
 *   showActions?: boolean,
 *   bookHref?: string,
 * }} props
 */
export default function BarberProfileSummary({
  variant = "hero",
  barber,
  showActions = false,
  bookHref = "#",
}) {
  const isCompact = variant === "compact";
  const services = barber.services?.length
    ? barber.services
    : (barber.specialties ?? []).slice(0, 4);
  const rating = barber.rating ?? 0;
  const reviewCount = barber.reviewCount ?? 0;
  const startingPrice = barber.startingPrice;

  const availabilityBadge = (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${
        barber.available
          ? "border-status-confirmed/40 bg-status-confirmed/15 text-status-confirmed"
          : "border-status-cancelled/40 bg-status-cancelled/15 text-status-cancelled"
      }`}
    >
      {barber.available ? "Available" : "Unavailable"}
    </span>
  );

  const imageBlock = (
    <div
      className={
        isCompact
          ? "bg-surface-container relative aspect-square min-h-[88px] w-full"
          : "bg-surface-container relative aspect-square md:aspect-auto md:min-h-[320px]"
      }
    >
      {barber.image ? (
        <Image
          src={barber.image}
          alt=""
          fill
          className="object-cover"
          sizes={isCompact ? "120px" : "(max-width: 768px) 100vw, 280px"}
          unoptimized={typeof barber.image === "string" && barber.image.startsWith("blob:")}
        />
      ) : (
        <div className="text-on-surface-variant flex h-full min-h-[inherit] items-center justify-center">
          <User className={isCompact ? "h-8 w-8 opacity-40" : "h-16 w-16 opacity-40"} aria-hidden />
        </div>
      )}
      <span className={`absolute ${isCompact ? "top-2 right-2" : "top-4 left-4"}`}>
        {availabilityBadge}
      </span>
    </div>
  );

  const statsRow = (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${isCompact ? "text-xs" : "text-sm"}`}
    >
      {rating > 0 ? (
        <span className="text-on-surface inline-flex items-center gap-1 font-semibold">
          <Star
            className={`fill-primary text-primary ${isCompact ? "h-3.5 w-3.5" : "h-5 w-5"}`}
            aria-hidden
          />
          {rating.toFixed(1)}
          <span className="text-on-surface-variant font-normal">({reviewCount} reviews)</span>
        </span>
      ) : null}
      {barber.experienceText ? (
        <span className="text-on-surface-variant inline-flex items-center gap-1">
          <Clock
            className={`text-primary/70 ${isCompact ? "h-3.5 w-3.5" : "h-4 w-4"}`}
            aria-hidden
          />
          {barber.experienceText}
        </span>
      ) : null}
      {startingPrice > 0 ? (
        <span className="text-primary font-semibold">From ₹{startingPrice}</span>
      ) : null}
    </div>
  );

  const contentBlock = (
    <div className={`flex min-w-0 flex-col ${isCompact ? "p-3" : "p-5 sm:p-6 md:p-8"}`}>
      {barber.role ? (
        <p className={`font-label-caps text-primary ${isCompact ? "text-[10px]" : ""}`}>
          {barber.role}
        </p>
      ) : null}
      <h2
        className={`text-on-surface font-serif font-bold tracking-tight ${
          isCompact ? "mt-0.5 text-base leading-snug" : "mt-1 text-3xl md:text-4xl"
        }`}
      >
        {barber.name}
      </h2>

      <p
        className={`text-on-surface-variant mt-1.5 flex items-start gap-1.5 ${
          isCompact ? "text-xs" : "text-sm"
        }`}
      >
        <MapPin
          className={`text-primary shrink-0 ${isCompact ? "mt-0.5 h-3.5 w-3.5" : "mt-0.5 h-4 w-4"}`}
          aria-hidden
        />
        <span className="min-w-0 break-words">
          {barber.location}
          {barber.address ? (
            <>
              <br />
              <span className="text-on-surface-variant/90">{barber.address}</span>
            </>
          ) : null}
        </span>
      </p>

      <div className={isCompact ? "mt-2" : "mt-4"}>{statsRow}</div>

      {showActions && !isCompact ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {barber.available ? (
            <Link
              href={bookHref}
              className="bg-primary text-on-primary hover:bg-primary/90 inline-flex h-11 items-center gap-2 rounded-md px-5 text-sm font-bold transition-colors"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden />
              Book appointment
            </Link>
          ) : (
            <span className="border-outline-variant bg-surface-container text-on-surface-variant inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-md border px-5 text-sm font-semibold opacity-60">
              <CalendarPlus className="h-4 w-4" aria-hidden />
              Currently unavailable
            </span>
          )}
          <a
            href="#gallery"
            className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high inline-flex h-11 items-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors"
          >
            <Images className="h-4 w-4" aria-hidden />
            View gallery
          </a>
          <a
            href="#reviews"
            className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high inline-flex h-11 items-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors"
          >
            <MessageSquare className="h-4 w-4" aria-hidden />
            Read reviews
          </a>
        </div>
      ) : null}
    </div>
  );

  return (
    <section className="border-outline-variant bg-surface-container-low overflow-hidden rounded-xl border">
      <div
        className={
          isCompact
            ? "grid grid-cols-[minmax(88px,32%)_1fr]"
            : "grid md:grid-cols-[minmax(0,280px)_1fr]"
        }
      >
        {imageBlock}
        {contentBlock}
      </div>

      {(barber.bio || services.length > 0) && (
        <div className={`border-outline-variant border-t ${isCompact ? "p-3" : "p-5 sm:p-6"}`}>
          {barber.bio ? (
            <>
              <h3
                className={`text-on-surface font-serif font-bold ${
                  isCompact ? "text-sm" : "text-lg"
                }`}
              >
                About
              </h3>
              <p
                className={`text-on-surface-variant mt-1.5 leading-relaxed ${
                  isCompact ? "line-clamp-3 text-xs" : "text-sm"
                }`}
              >
                {barber.bio}
              </p>
            </>
          ) : null}
          {services.length > 0 ? (
            <div className={barber.bio ? "mt-3" : ""}>
              {!isCompact && (
                <p className="font-label-caps text-on-surface-variant mb-2 text-[10px]">
                  Specialties
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {services.map((s) => (
                  <span
                    key={s}
                    className="border-primary/25 bg-primary/10 text-primary rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
