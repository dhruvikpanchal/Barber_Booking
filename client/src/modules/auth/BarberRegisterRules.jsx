import Link from "next/link";
import { routes } from "@/config/routes/routes";
import PublicPageShell from "@/components/common/shellHeading/PublicPageShell.jsx";

const rules = [
  "After you register, admins verify your profile and documents from the admin side. You cannot take live appointments until that review is complete.",
  "If your registration is successful, you will receive one confirmation email with next steps. Check spam if you do not see it within a business day or two.",
  "Submit accurate information only; mismatched or incomplete files will delay approval or require a resubmission.",
];

export default function BarberRegisterRules() {
  return (
    <PublicPageShell eyebrow="Platform" title="Become a barber">
      <p className="text-sm leading-7 text-on-surface-variant">
        This flow mirrors the landing page: create your account, send
        verification details, then wait for admin approval before the barber
        dashboard unlocks.
      </p>
      <div className="mt-8 border border-outline-variant bg-surface-container p-6">
        <p className="font-label-caps text-primary">How it works</p>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7 text-on-surface-variant">
          {rules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ol>
      </div>
      <Link
        href={routes.auth.barberRegister}
        className="font-label-caps mt-8 inline-flex items-center justify-center bg-primary px-8 py-3 text-on-primary hover:bg-primary/90"
      >
        Start barber registration
      </Link>
      <p className="mt-4 text-xs text-on-surface-variant">
        Admins work from{" "}
        <Link
          href={routes.admin.dashboard}
          className="text-primary underline-offset-2 hover:underline"
        >
          Admin dashboard
        </Link>
        .
      </p>
      <Link
        href={routes.public.home}
        className="font-label-caps mt-10 inline-block text-primary hover:underline"
      >
        ← Back home
      </Link>
    </PublicPageShell>
  );
}
