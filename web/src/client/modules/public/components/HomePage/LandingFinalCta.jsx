import Image from "next/image";
import Link from "@/lib/AppLink";
import { routes } from "@/config/routes/routes";

const ctaImage =
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600&q=80";

export default function LandingFinalCta() {
  return (
    <section className="relative overflow-hidden border-y border-outline-variant px-4 py-24 md:px-16">
      <div className="absolute inset-0 z-0">
        <Image
          src={ctaImage}
          alt=""
          fill
          className="object-cover grayscale brightness-[0.25]"
          sizes="100vw"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-4xl font-bold text-on-surface md:text-6xl">
          Ready for the chair?
        </h2>
        <p className="mt-4 text-on-surface-variant">
          Pick a shop, lock a slot, walk in sharp.
        </p>
        <Link
          href={routes.auth.login}
          className="font-label-caps mt-10 inline-block bg-primary px-12 py-4 text-on-primary tracking-[0.2em] hover:bg-primary/90 active:scale-95"
        >
          Book now
        </Link>
      </div>
    </section>
  );
}
