"use client";

import Image from "next/image";
import { Calendar, Mail, Phone, Sparkles, User } from "lucide-react";
import { formatMemberSince } from "@/client/modules/customer/helpers/profileHelpers.js";

export default function ProfileSummaryCard({ fullName, email, phone, photoUrl, joinedAt }) {
  const displayName = fullName?.trim() || "Your name";
  const memberLabel = formatMemberSince(joinedAt);
  const isRemoteImage =
    typeof photoUrl === "string" &&
    (photoUrl.startsWith("https://") || photoUrl.startsWith("http://"));

  return (
    <section className="border-outline-variant bg-surface-container-low relative overflow-hidden rounded-xl border shadow-sm">
      <div className="from-primary/8 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent" />

      <div className="border-outline-variant relative border-b p-6 text-center">
        <div className="relative mx-auto h-28 w-28">
          <div className="from-primary/40 to-primary/5 absolute inset-0 rounded-full bg-gradient-to-br p-[3px]">
            <div className="border-surface-container-low bg-surface-container flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2">
              {photoUrl ? (
                isRemoteImage ? (
                  <Image
                    key={photoUrl}
                    src={photoUrl}
                    alt={displayName}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    key={photoUrl}
                    src={photoUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                )
              ) : (
                <User className="text-on-surface-variant/50 h-12 w-12" aria-hidden />
              )}
            </div>
          </div>
          <span className="font-label-caps border-primary/30 bg-primary/10 text-primary absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border px-2.5 py-0.5 text-[10px] tracking-wider">
            Customer
          </span>
        </div>

        <h2 className="text-on-surface mt-6 font-serif text-2xl font-bold tracking-tight">
          {displayName}
        </h2>
        <p className="text-on-surface-variant mt-1 inline-flex items-center justify-center gap-1.5 text-xs">
          <Sparkles className="text-primary/80 h-3.5 w-3.5" aria-hidden />
          Iron &amp; Oak member
        </p>
      </div>

      <div className="divide-outline-variant/80 relative space-y-0 divide-y p-4 sm:p-5">
        <div className="flex items-start gap-3 py-3 first:pt-0">
          <span className="bg-surface-container text-on-surface-variant mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <Mail className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-label-caps text-on-surface-variant text-[10px]">Email</p>
            <p className="text-on-surface text-sm font-medium break-all">{email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-3">
          <span className="bg-surface-container text-on-surface-variant mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <Phone className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-label-caps text-on-surface-variant text-[10px]">Phone</p>
            <p className="text-on-surface text-sm font-medium">{phone?.trim() ? phone : "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 py-3 last:pb-0">
          <span className="bg-primary/12 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <Calendar className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="font-label-caps text-on-surface-variant text-[10px]">Member since</p>
            <p className="text-on-surface text-sm font-semibold">{memberLabel}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
