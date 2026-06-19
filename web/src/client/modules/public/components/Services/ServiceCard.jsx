import Link from "@/lib/AppLink";
import { Clock, ChevronRight, Flame } from "lucide-react";
import { routes } from "@/client/config/routes/routes";

function PopularBadge() {
  return (
    <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
      <Flame className="h-2.5 w-2.5" aria-hidden />
      Popular
    </span>
  );
}

export default function ServiceCard({ service }) {
  const Icon = service.icon;
  const detailHref = routes.public.servicesDetail(service.id);

  return (
    <article className="group border-outline-variant bg-surface-container-low hover:border-primary/60 hover:shadow-[0_0_0_1px_var(--color-primary,theme(colors.primary))_inset] hover:shadow-primary/10 relative flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-200">
      <div className="via-primary/40 h-px w-full bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="border-outline-variant bg-surface-container text-primary group-hover:border-primary/40 group-hover:bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors duration-200">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
          {service.popular && <PopularBadge />}
        </div>

        <p className="font-label-caps text-on-surface-variant mb-1 text-[10px] tracking-widest uppercase">
          {service.category}
        </p>

        <h2 className="text-on-surface group-hover:text-primary font-serif text-xl leading-snug font-bold transition-colors duration-150">
          {service.name}
        </h2>

        <p className="text-on-surface-variant mt-2 flex-1 text-sm leading-relaxed">
          {service.description}
        </p>

        <div className="border-outline-variant text-on-surface-variant mt-5 flex items-center gap-4 border-t pt-4 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="text-primary/70 h-3.5 w-3.5 shrink-0" aria-hidden />
            {service.duration} min
          </span>
          <span className="text-primary ml-auto font-serif text-base font-semibold">
            from ₹{service.startingPrice}
          </span>
        </div>

        <Link
          href={detailHref}
          className="border-outline-variant bg-surface-container text-on-surface hover:border-primary/50 hover:bg-primary/10 hover:text-primary focus-visible:ring-primary/70 mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border text-sm font-semibold transition-colors duration-150 focus-visible:ring-2 focus-visible:outline-none"
          aria-label={`View details for ${service.name}`}
        >
          View Details
          <ChevronRight
            className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </article>
  );
}
