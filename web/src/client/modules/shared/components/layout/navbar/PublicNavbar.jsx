"use client";

import Link from "@/lib/AppLink";
import Logo from "@/components/layout/primitives/Logo";
import NavLink from "@/components/layout/primitives/NavLink";
import PublicAccountMenu from "@/components/layout/primitives/PublicAccountMenu";
import { routes } from "@/config/routes/routes";

const navLinks = [
  { href: routes.public.home, label: "Home" },
  { href: routes.public.services, label: "Services" },
  { href: routes.public.barbers, label: "Barbers" },
  { href: routes.public.about, label: "About" },
  { href: routes.public.contact, label: "Contact" },
];

const linkClass =
  "font-label-caps text-on-surface-variant transition-colors hover:text-primary data-[active=true]:text-primary";

export default function PublicNavbar() {
  return (
    <>
      {/* Desktop — logo left, nav center, actions right */}
      <header className="fixed inset-x-0 top-0 z-40 hidden border-b border-outline-variant bg-surface/85 backdrop-blur supports-[backdrop-filter]:bg-surface/70 md:block">
        <div
          className="mx-auto grid h-[var(--header-height)] max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-8"
          style={{ minHeight: "var(--header-height)" }}
        >
          <Logo href={routes.public.home} />

          <nav
            className="flex items-center justify-center gap-7"
            aria-label="Primary"
          >
            {navLinks.map((l) => (
              <NavLink key={l.label} href={l.href} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3">
            <Link
              href={routes.auth.login}
              prefetch={false}
              className="font-label-caps rounded-md border border-outline px-4 py-2 text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              Sign in
            </Link>
            <Link
              href={routes.auth.register}
              prefetch={false}
              className="font-label-caps rounded-md bg-primary px-5 py-2 text-on-primary transition-colors hover:opacity-90 active:scale-[0.98]"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile — logo left, account menu right (nav lives in bottom bar) */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-outline-variant bg-surface/90 backdrop-blur md:hidden">
        <div
          className="mx-auto flex h-[var(--header-height)] items-center justify-between gap-3 px-4"
          style={{ minHeight: "var(--header-height)" }}
        >
          <Logo href={routes.public.home} compact />
          <PublicAccountMenu />
        </div>
      </header>
    </>
  );
}
