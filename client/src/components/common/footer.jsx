import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full px-4 md:px-16 py-16 bg-[#1b1c1c] border-t-2 border-[#53443c]">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <Link
              href="/"
              className="text-[#e4e2e1] text-3xl font-black tracking-tight hover:text-[#ffb68c] transition-colors"
            >
              IRON &amp; OAK
            </Link>

            <p className="text-[#b7b5b4] text-base leading-relaxed max-w-xs">
              Crafting the standard of modern grooming. Heritage techniques for
              the contemporary man.
            </p>

            <div className="flex gap-4 mt-2">
              {["IG", "FB", "X"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="w-9 h-9 border border-[#53443c] flex items-center justify-center text-[#d8c2b7] hover:border-[#ffb68c] hover:text-[#ffb68c] transition-colors text-sm"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-2 md:col-start-6 flex flex-col gap-4">
            <span className="text-[#ffb68c] text-xs font-semibold tracking-[0.1em]">
              EXPLORE
            </span>

            <nav className="flex flex-col gap-3">
              {[
                "Services",
                "Our Barbers",
                "Gallery",
                "About Us",
                "Contact",
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-[#b7b5b4] hover:text-[#ffb68c] transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Account */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <span className="text-[#ffb68c] text-xs font-semibold tracking-[0.1em]">
              ACCOUNT
            </span>

            <nav className="flex flex-col gap-3">
              {["Sign In", "Register", "My Bookings", "Book Now"].map(
                (item) => (
                  <Link
                    key={item}
                    href="#"
                    className="text-[#b7b5b4] hover:text-[#ffb68c] transition-colors"
                  >
                    {item}
                  </Link>
                ),
              )}
            </nav>
          </div>

          {/* Visit */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <span className="text-[#ffb68c] text-xs font-semibold tracking-[0.1em]">
              VISIT US
            </span>

            <address className="not-italic text-[#b7b5b4] leading-relaxed">
              124 Industrial Avenue
              <br />
              Steel District, New York
              <br />
              NY 10012
              <br />
              <br />
              <Link
                href="tel:+12125550178"
                className="hover:text-[#ffb68c] transition-colors"
              >
                (212) 555-0178
              </Link>
              <br />
              <Link
                href="mailto:hello@ironandoak.com"
                className="hover:text-[#ffb68c] transition-colors"
              >
                hello@ironandoak.com
              </Link>
            </address>

            <div className="mt-2 text-[#b7b5b4]">
              <p className="text-[10px] tracking-[0.1em] text-[#a08d83] mb-1">
                HOURS
              </p>
              Mon – Fri: 9am – 8pm
              <br />
              Sat: 8am – 6pm
              <br />
              Sun: Closed
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#53443c] pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-[#b7b5b4] text-[10px] tracking-[0.2em]">
            © 2026 IRON &amp; OAK BARBERSHOP. ALL RIGHTS RESERVED.
          </p>

          <nav className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Contact"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-[#b7b5b4] hover:text-[#ffb68c] transition-colors text-[10px] tracking-[0.1em]"
              >
                {item.toUpperCase()}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
