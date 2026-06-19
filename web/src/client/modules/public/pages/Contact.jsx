"use client";

import { Breadcrumb } from "@/client/modules/public/components/Contact/Primitives.jsx";
import { ContactForm } from "@/client/modules/public/components/Contact/ContactForm.jsx";
import { ContactInfoPanel } from "@/client/modules/public/components/Contact/ContactInfoPanel.jsx";
import { publicHook } from "@/client/modules/public/hooks/publicQuery.jsx";
import { normalizeContactInfo } from "@/client/modules/public/helpers/contactHelpers.js";
import {
  PUBLIC_CONTACT_STALE_MS,
  ssrQueryOptions,
} from "@/client/modules/public/helpers/publicQueryHelpers.js";

export default function Contact({ initialContactInfo }) {
  const normalizedInitial = initialContactInfo
    ? normalizeContactInfo(initialContactInfo)
    : undefined;

  const { data, isFetching } = publicHook.ContactInfo.useContactInfo(
    ssrQueryOptions(normalizedInitial, { staleTime: PUBLIC_CONTACT_STALE_MS }),
  );
  const { info: contactInfo } = data ?? normalizeContactInfo(null);

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 px-4 pt-4 pb-24 md:px-16">
      <Breadcrumb />

      <header className="mt-5 max-w-2xl">
        <p className="font-label-caps text-primary">Support</p>
        <h1 className="text-on-surface mt-1 font-serif text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Get in touch.
        </h1>
        <p className="text-on-surface-variant mt-3 text-sm leading-relaxed md:text-base">
          Have a question about a booking, your account, or the platform? Fill in the form and our
          support team will get back to you — usually within one business day.
        </p>
      </header>

      <div className="from-primary/30 via-outline-variant my-8 h-px w-full bg-gradient-to-r to-transparent" />

      <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start xl:grid-cols-[1fr_360px]">
        <section className="border-outline-variant bg-surface-container-low rounded-xl border">
          <header className="border-outline-variant border-b px-5 py-4 sm:px-6">
            <p className="font-label-caps text-primary text-[10px] tracking-widest uppercase">
              Send a message
            </p>
            <h2 className="text-on-surface mt-0.5 font-serif text-lg font-bold">Contact form</h2>
            <p className="text-on-surface-variant mt-1 text-xs">
              All fields marked with{" "}
              <span className="text-error" aria-hidden>
                *
              </span>{" "}
              are required.
            </p>
          </header>

          <div className="p-5 sm:p-6">
            <ContactForm />
          </div>
        </section>

        <div className="lg:sticky lg:top-28">
          <ContactInfoPanel contactInfo={contactInfo} disabled={isFetching && !normalizedInitial} />
        </div>
      </div>

      <p className="text-on-surface-variant mt-10 text-center text-xs">
        Iron &amp; Oak is a platform team — we manage the booking system, not individual barber
        shops. For shop-specific inquiries (pricing, availability, walk-ins), please contact the
        shop or barber directly via their profile page.
      </p>
    </div>
  );
}
