"use client";

import Image from "next/image";
import { Clock, MapPin, Star, User } from "lucide-react";
import { EXP_TIERS } from "@/client/modules/barber/constants/barberConstants.js";

function isLocalImage(url) {
  return typeof url === "string" && url.startsWith("blob:");
}

export default function PublicPreview({ profile, displayName, experienceLabel }) {
  const tier = EXP_TIERS.find((t) => t.value === profile.experience);
  const experienceText = tier
    ? `${tier.sub} experience`
    : experienceLabel
      ? `${experienceLabel} experience`
      : null;

  const location = profile.shopName?.trim() || profile.city?.trim() || "Your location";
  const address = profile.shopAddress?.trim() || profile.city?.trim() || "";
  const portfolio = profile.portfolio ?? [];

  return (
    <div className="border-outline-variant overflow-hidden rounded-2xl border bg-surface shadow-sm">
      <div className="relative aspect-[16/10] w-full min-h-[180px] bg-surface-container sm:aspect-[2/1]">
        {profile.photoPreview ? (
          <Image
            key={profile.photoPreview}
            src={profile.photoPreview}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 320px"
            unoptimized={isLocalImage(profile.photoPreview)}
          />
        ) : (
          <div className="text-on-surface-variant flex h-full items-center justify-center">
            <User className="h-16 w-16 opacity-30" aria-hidden />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <span
            className={`mb-2 inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
              profile.availableToday
                ? "border-status-confirmed/50 bg-status-confirmed/20 text-status-confirmed"
                : "border-white/30 bg-black/30 text-white/90"
            }`}
          >
            {profile.availableToday ? "Available today" : "Unavailable"}
          </span>
          <p className="font-label-caps text-primary-foreground/80 text-[10px] text-white/80">
            {profile.shopName ? `Barber · ${profile.shopName}` : "Barber"}
          </p>
          <h2 className="font-serif text-xl font-bold tracking-tight text-white sm:text-2xl">
            {displayName}
          </h2>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="text-on-surface inline-flex items-center gap-1 font-semibold">
            <Star className="fill-primary text-primary h-4 w-4" aria-hidden />
            4.9
            <span className="text-on-surface-variant font-normal">(128)</span>
          </span>
          {experienceText ? (
            <span className="text-on-surface-variant inline-flex items-center gap-1.5">
              <Clock className="text-primary h-4 w-4" aria-hidden />
              {experienceText}
            </span>
          ) : null}
        </div>

        <p className="text-on-surface-variant flex items-start gap-2 text-sm leading-relaxed">
          <MapPin className="text-primary mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span className="min-w-0">
            <span className="text-on-surface font-medium">{location}</span>
            {address ? (
              <>
                <br />
                <span className="text-on-surface-variant/90">{address}</span>
              </>
            ) : null}
            {profile.shopHours ? (
              <>
                <br />
                <span className="text-on-surface-variant/80 text-xs">{profile.shopHours}</span>
              </>
            ) : null}
          </span>
        </p>

        {profile.bio?.trim() ? (
          <div>
            <h3 className="text-on-surface font-serif text-sm font-bold">About</h3>
            <p className="text-on-surface-variant mt-1.5 text-sm leading-relaxed">{profile.bio}</p>
          </div>
        ) : null}

        {profile.specialties?.length > 0 ? (
          <div>
            <h3 className="font-label-caps text-on-surface-variant mb-2 text-[10px]">Specialties</h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.specialties.map((item) => (
                <span
                  key={item}
                  className="border-primary/25 bg-primary/10 text-primary rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {portfolio.length > 0 ? (
          <div>
            <h3 className="font-label-caps text-on-surface-variant mb-2 text-[10px]">Portfolio</h3>
            <div className="scrollbar-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  className="border-outline-variant relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border sm:h-24 sm:w-24"
                >
                  <Image
                    src={item.url}
                    alt={item.caption || "Portfolio"}
                    fill
                    className="object-cover"
                    sizes="96px"
                    loading="lazy"
                    unoptimized={isLocalImage(item.url)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
