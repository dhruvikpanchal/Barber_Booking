import Link from "next/link";
import { routes } from "@/config/routes/routes";

const rules = [
  {
    title: "Admin verification",
    body: "After you register, your account and submitted details are reviewed on the admin side. Staff verify your identity, credentials, and shop assignment before you can take bookings.",
  },
  {
    title: "One confirmation email",
    body: "If your registration is approved, you will receive a single confirmation email with next steps. Check your inbox and spam folder — we do not send duplicate approval messages.",
  },
  {
    title: "Honest information only",
    body: "Submit accurate photos and documents. Incomplete or mismatched data will delay verification or require you to resubmit from the admin request queue.",
  },
];

export default function LandingBarberRegister() {
  return (
    <section className="border-y border-outline-variant bg-surface-container-low px-4 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,380px)] lg:items-start lg:gap-16">
          <div>
            <div className="font-label-caps mb-3 text-primary">
              Barber registration
            </div>
            <h2 className="font-serif text-4xl font-bold text-on-surface md:text-5xl">
              Join the network.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-on-surface-variant">
              Open chairs are invite-only on paper, digital-first in practice.
              Read how onboarding works before you apply.
            </p>
            <ul className="mt-10 space-y-6 border-t border-outline-variant pt-10">
              {rules.map((rule) => (
                <li key={rule.title} className="max-w-2xl">
                  <h3 className="font-label-caps text-on-surface">
                    {rule.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                    {rule.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <aside className="border border-outline-variant bg-surface-container p-8">
            <p className="font-serif text-lg font-semibold text-on-surface">
              Ready to apply?
            </p>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              You will create an account, upload verification details, then wait
              for admin approval before accessing the barber console.
            </p>
            <Link
              href={routes.auth.barberRegisterRules}
              className="font-label-caps mt-8 flex w-full items-center justify-center bg-primary px-6 py-4 text-center text-on-primary tracking-[0.2em] hover:bg-primary/90 active:scale-[0.99]"
            >
              Register as a barber
            </Link>
            <p className="mt-4 text-xs leading-5 text-on-surface-variant">
              Questions about status? Use{" "}
              <Link
                href={routes.public.contact}
                className="text-primary underline-offset-2 hover:underline"
              >
                contact
              </Link>{" "}
              and reference the email address you registered with.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
