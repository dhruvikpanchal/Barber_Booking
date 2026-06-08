import Link from "next/link";
import { routes } from "@/client/config/routes/routes";
import { rules } from "@/client/modules/auth/constants/authConstants.js";

export default function BarberRegisterRules() {
  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:min-h-screen lg:flex-row lg:items-center lg:justify-between">
          {/* Left Section */}
          <div className="w-full max-w-2xl">
            <span className="bg-primary/10 text-primary inline-flex rounded-full px-4 py-2 text-sm font-medium">
              Barber Program
            </span>

            <h1 className="text-on-surface mt-6 text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
              Become a Professional Barber
            </h1>

            <p className="text-on-surface-variant mt-6 text-base leading-7 sm:text-lg sm:leading-8">
              Join our platform, complete your verification process, and start managing customer
              appointments after approval from our team.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href={routes.auth.barberRegister}
                className="bg-primary text-on-primary hover:bg-primary/90 inline-flex w-full items-center justify-center px-8 py-4 text-center font-medium transition sm:w-auto"
              >
                Start Registration
              </Link>

              <Link
                href={routes.public.home}
                className="border-outline text-on-surface hover:bg-surface-container inline-flex w-full items-center justify-center border px-8 py-4 text-center font-medium transition sm:w-auto"
              >
                Back Home
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full max-w-2xl">
            <div className="border-outline bg-surface rounded-3xl border p-5 shadow-sm sm:p-8">
              <div className="mb-8">
                <p className="text-primary text-sm font-medium tracking-wider uppercase">
                  Registration Process
                </p>

                <h2 className="text-on-surface mt-2 text-2xl font-bold">How It Works</h2>
              </div>

              <div className="space-y-6">
                {rules.map((rule, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="bg-primary text-on-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold">
                      {index + 1}
                    </div>

                    <p className="text-on-surface-variant leading-7">{rule}</p>
                  </div>
                ))}
              </div>

              <div className="bg-primary/5 border-primary/10 mt-8 rounded-2xl border p-5">
                <h3 className="text-on-surface mb-2 font-semibold">After Approval</h3>

                <p className="text-on-surface-variant text-sm leading-6">
                  Once approved by an administrator, you'll gain access to your barber dashboard
                  where you can manage bookings, availability, services, and customer appointments.
                </p>
              </div>

              <div className="mt-6 border-t pt-6">
                <p className="text-on-surface-variant text-sm">
                  Administrators review registrations through the admin dashboard before granting
                  barber access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
