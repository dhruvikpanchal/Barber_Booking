import Link from "next/link";

const cols = [
  {
    title: "Platform",
    links: ["Find shops", "Find barbers", "Services", "Become a barber"],
  },
  { title: "Company", links: ["About", "Contact", "Careers", "Press"] },
  { title: "Account", links: ["Sign in", "Register", "Customer app", "Barber console"] },
  { title: "Support", links: ["Help center", "Privacy", "Terms", "Status"] },
];

export default function PublicFooter() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container-lowest">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-5 md:px-8">
        <div className="md:col-span-1">
          <div className="font-serif text-xl font-black tracking-tighter">
            IRON &amp; OAK
          </div>
          <p className="mt-3 max-w-xs text-sm text-on-surface-variant">
            Multi-shop barber appointment and queue management. Heritage craft,
            modern booking.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="font-label-caps mb-4 text-on-surface">{c.title}</div>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              {c.links.map((l) => (
                <li key={l}>
                  <Link href="#" className="hover:text-primary">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-outline-variant px-4 py-5 text-center text-xs text-on-surface-variant md:px-8">
        © {new Date().getFullYear()} Iron &amp; Oak. Payment in person at the
        shop.
      </div>
    </footer>
  );
}
