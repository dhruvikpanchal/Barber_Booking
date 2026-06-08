import Link from "next/link";
import { routes } from "@/client/config/routes/routes";

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      <p className="font-label-caps text-primary mb-3">Company</p>

      <h1 className="text-on-surface font-serif text-4xl font-bold md:text-5xl">
        About Iron & Oak
      </h1>

      <p className="text-on-surface-variant mt-6 max-w-2xl leading-8">
        Iron & Oak is a modern barber booking platform designed to make scheduling appointments
        simple and convenient. We connect clients with skilled barbers through an easy-to-use
        booking experience, helping both customers and barbers save time and stay organized.
      </p>

      <div className="mt-10 grid w-full max-w-2xl gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-5">
          <h2 className="font-semibold">Easy Booking</h2>
          <p className="text-on-surface-variant mt-2 text-sm">
            Schedule appointments in just a few clicks.
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <h2 className="font-semibold">Skilled Barbers</h2>
          <p className="text-on-surface-variant mt-2 text-sm">
            Connect with trusted professionals.
          </p>
        </div>

        <div className="rounded-xl border p-5">
          <h2 className="font-semibold">Modern Experience</h2>
          <p className="text-on-surface-variant mt-2 text-sm">
            Simple, fast, and designed for convenience.
          </p>
        </div>
      </div>

      <Link
        href={routes.public.home}
        className="font-label-caps text-primary mt-10 hover:underline"
      >
        ← Back Home
      </Link>
    </main>
  );
}
