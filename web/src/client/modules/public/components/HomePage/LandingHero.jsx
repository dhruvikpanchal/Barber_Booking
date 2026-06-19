import Image from "next/image";
import Link from "@/lib/AppLink";
import { ArrowDown } from "lucide-react";
import { routes } from "@/config/routes/routes";

const heroImage =
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&q=80";

export default function LandingHero() {
  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Iron & Oak barbershop interior"
          fill
          priority
          className="object-cover grayscale brightness-[0.3]"
          sizes="100vw"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-16">
        <span className="font-label-caps mb-4 block tracking-[0.4em] text-primary">
          Established MMXXIV · Multi-Shop Network
        </span>
        <h1 className="font-serif text-5xl leading-[1.05] text-on-surface md:text-7xl lg:text-[84px]">
          FIND YOUR
          <br />
          BARBER.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-on-surface-variant md:text-lg">
          Browse multi-shop locations, book real chairs, and track your queue.
          Heritage craft, no online checkout — pay in person at the shop.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={routes.auth.login}
            className="font-label-caps bg-primary px-10 py-4 text-on-primary tracking-[0.2em] hover:bg-primary/90 active:scale-95"
          >
            Book your appointment
          </Link>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 animate-bounce text-outline">
        <ArrowDown className="h-5 w-5" aria-hidden />
      </div>
    </section>
  );
}
