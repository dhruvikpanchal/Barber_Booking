"use client";

import Image from "next/image";
import { Calendar, Mail, Phone, Sparkles, User } from "lucide-react";
import { formatMemberSince } from "../../../../data/customer/profileData.js";

export default function ProfileSummaryCard({
  fullName,
  email,
  phone,
  photoUrl,
  joinedAt,
}) {
  const displayName = fullName?.trim() || "Your name";
  const memberLabel = formatMemberSince(joinedAt);
  const isRemoteImage =
    typeof photoUrl === "string"
    && (photoUrl.startsWith("https://") || photoUrl.startsWith("http://"));

  return (
    <section className="relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low shadow-sm">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent" />

      <div className="relative border-b border-outline-variant p-6 text-center">
        <div className="relative mx-auto h-28 w-28">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-primary/5 p-[3px]">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-surface-container-low bg-surface-container">
              {photoUrl ? (
                isRemoteImage ? (
                  <Image
                    src={photoUrl}
                    alt={displayName}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={photoUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                )
              ) : (
                <User
                  className="h-12 w-12 text-on-surface-variant/50"
                  aria-hidden
                />
              )}
            </div>
          </div>
          <span className="font-label-caps absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] tracking-wider text-primary">
            Customer
          </span>
        </div>

        <h2 className="font-serif mt-6 text-2xl font-bold tracking-tight text-on-surface">
          {displayName}
        </h2>
        <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-xs text-on-surface-variant">
          <Sparkles className="h-3.5 w-3.5 text-primary/80" aria-hidden />
          Iron &amp; Oak member
        </p>
      </div>

      <div className="relative space-y-0 divide-y divide-outline-variant/80 p-4 sm:p-5">
        <div className="flex items-start gap-3 py-3 first:pt-0">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant">
            <Mail className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-label-caps text-[10px] text-on-surface-variant">
              Email
            </p>
            <p className="break-all text-sm font-medium text-on-surface">
              {email}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant">
            <Phone className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-label-caps text-[10px] text-on-surface-variant">
              Phone
            </p>
            <p className="text-sm font-medium text-on-surface">
              {phone?.trim() ? phone : "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 py-3 last:pb-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <Calendar className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="font-label-caps text-[10px] text-on-surface-variant">
              Member since
            </p>
            <p className="text-sm font-semibold text-on-surface">
              {memberLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
