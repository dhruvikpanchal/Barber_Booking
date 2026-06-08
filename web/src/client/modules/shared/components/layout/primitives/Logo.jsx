import Link from "next/link";
import { routes } from "@/config/routes/routes";

export default function Logo({ href = routes.public.home, compact = false }) {
  return (
    <Link
      href={href}
      className="font-serif font-black tracking-tighter text-on-surface transition-colors hover:text-primary"
      aria-label="Iron & Oak home"
    >
      {compact ? (
        <span className="text-xl">I&amp;O</span>
      ) : (
        <span className="text-xl md:text-2xl">IRON &amp; OAK</span>
      )}
    </Link>
  );
}
