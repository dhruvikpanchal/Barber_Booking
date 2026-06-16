import { ArrowRight, Clock, Mail, MapPin, MessageSquare, Phone } from "lucide-react";

import { CONTACT_INFO } from "@/client/modules/public/constants/contactConstants.js";
import { InfoRow } from "@/client/modules/public/components/Contact/Primitives.jsx";

export function ContactInfoPanel({ contactInfo = CONTACT_INFO, disabled = false }) {
  const { phone, email, address, hours, social } = contactInfo ?? {};
  const normalizedPhone = typeof phone === "string" ? phone : CONTACT_INFO.phone;
  const normalizedEmail = typeof email === "string" ? email : CONTACT_INFO.email;
  const normalizedAddress = address ?? CONTACT_INFO.address;
  const normalizedHours = Array.isArray(hours) && hours.length ? hours : CONTACT_INFO.hours;
  const normalizedSocial = Array.isArray(social) && social.length ? social : CONTACT_INFO.social;
  const mapsHref = `https://maps.google.com/?q=${encodeURIComponent(
    `${normalizedAddress?.street ?? ""}, ${normalizedAddress?.city ?? ""}, ${normalizedAddress?.state ?? ""} ${normalizedAddress?.zip ?? ""}`,
  )}`;

  return (
    <aside className="space-y-5">
      {/* Contact details card */}
      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        <header className="border-outline-variant border-b px-5 py-4">
          <p className="font-label-caps text-primary text-[10px] tracking-widest uppercase">
            Get in touch
          </p>
          <h2 className="text-on-surface mt-0.5 font-serif text-base font-bold">
            Platform support
          </h2>
        </header>

        <div className="space-y-5 p-5">
          {/* Phone */}
          <InfoRow Icon={Phone} label="Support phone">
            <a
              href={`tel:${normalizedPhone.replace(/\s|\(|\)|-/g, "")}`}
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : undefined}
              className="text-primary font-medium hover:underline aria-disabled:pointer-events-none aria-disabled:opacity-50"
            >
              {normalizedPhone}
            </a>
          </InfoRow>

          {/* Email */}
          <InfoRow Icon={Mail} label="Support email">
            <a
              href={`mailto:${normalizedEmail}`}
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : undefined}
              className="text-primary font-medium break-all hover:underline aria-disabled:pointer-events-none aria-disabled:opacity-50"
            >
              {normalizedEmail}
            </a>
          </InfoRow>

          {/* Address */}
          <InfoRow Icon={MapPin} label="Office address">
            <address className="text-on-surface leading-relaxed not-italic">
              {normalizedAddress.street}
              {normalizedAddress.suite && <>, {normalizedAddress.suite}</>}
              <br />
              {normalizedAddress.city}, {normalizedAddress.state} {normalizedAddress.zip}
              <br />
              {normalizedAddress.country}
            </address>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : undefined}
              className="text-primary mt-1.5 inline-flex items-center gap-1 text-xs font-semibold hover:underline aria-disabled:pointer-events-none aria-disabled:opacity-50"
            >
              View on map
              <ArrowRight className="h-3 w-3" aria-hidden />
            </a>
          </InfoRow>
        </div>
      </section>

      {/* Working hours card */}
      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        <header className="border-outline-variant flex items-center gap-2.5 border-b px-5 py-4">
          <span className="bg-primary/12 text-primary flex h-7 w-7 items-center justify-center rounded-lg">
            <Clock className="h-3.5 w-3.5" aria-hidden />
          </span>
          <h2 className="text-on-surface font-serif text-sm font-bold">Support hours</h2>
        </header>

        <ul className="divide-outline-variant/60 divide-y px-5">
          {normalizedHours.map(({ days, time }) => {
            const isClosed = time === "Closed";
            return (
              <li key={days} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="text-on-surface-variant">{days}</span>
                <span
                  className={
                    isClosed
                      ? "text-on-surface-variant/60 font-medium"
                      : "text-on-surface font-semibold"
                  }
                >
                  {time}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="px-5 pt-2 pb-4">
          <p className="border-outline-variant bg-surface-container text-on-surface-variant rounded-lg border px-3.5 py-2.5 text-xs leading-relaxed">
            Response time is typically within{" "}
            <span className="text-on-surface font-semibold">1 business day</span>. For urgent
            booking issues, call or email directly.
          </p>
        </div>
      </section>

      {/* Social media card */}
      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        <header className="border-outline-variant flex items-center gap-2.5 border-b px-5 py-4">
          <span className="bg-primary/12 text-primary flex h-7 w-7 items-center justify-center rounded-lg">
            <MessageSquare className="h-3.5 w-3.5" aria-hidden />
          </span>
          <h2 className="text-on-surface font-serif text-sm font-bold">Follow us</h2>
        </header>

        <ul className="space-y-1.5 p-4">
          {normalizedSocial.map(({ id, label, handle, href, Icon }) => (
            <li key={id}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : undefined}
                className="group border-outline-variant bg-surface-container hover:border-primary/40 hover:bg-primary/8 focus-visible:ring-primary/60 flex items-center gap-3 rounded-lg border px-3.5 py-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none aria-disabled:pointer-events-none aria-disabled:opacity-50"
                aria-label={`${label} — ${handle}`}
              >
                <span className="border-outline-variant bg-surface-container-high text-on-surface-variant group-hover:border-primary/30 group-hover:text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors">
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-on-surface group-hover:text-primary text-xs font-semibold transition-colors">
                    {label}
                  </p>
                  <p className="text-on-surface-variant text-[11px]">{handle}</p>
                </div>
                <ArrowRight
                  className="text-on-surface-variant/40 group-hover:text-primary h-3.5 w-3.5 shrink-0 transition-all group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
