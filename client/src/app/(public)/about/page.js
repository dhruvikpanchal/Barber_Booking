import Link from "next/link";
import { routes } from "@/config/routes/routes";
import PublicPageShell from "@/components/common/shellHeading/PublicPageShell.jsx";

export default function AboutPage() {
  return (
    <PublicPageShell eyebrow="Company" title="About Iron & Oak">
      <p className="text-sm leading-7">
        Heritage craft and modern booking — this page is a placeholder while the
        marketing story is written.
      </p>
      <Link
        href={routes.public.home}
        className="font-label-caps mt-8 inline-block text-primary hover:underline"
      >
        ← Back home
      </Link>
    </PublicPageShell>
  );
}
