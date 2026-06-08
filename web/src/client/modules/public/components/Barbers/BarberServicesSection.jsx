import { Clock, Scissors, Sparkles } from "lucide-react";

/**
 * @param {{ services: Array<{ id: string, name: string, price: number, duration: number, description?: string, popular?: boolean }> }} props
 */
export default function BarberServicesSection({ services }) {
  return (
    <section
      id="services"
      className="scroll-mt-28 rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-6"
    >
      <header className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Scissors className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-serif text-lg font-bold text-on-surface">
            Services & pricing
          </h2>
          <p className="text-xs text-on-surface-variant">
            Select services when booking — final price confirmed at the chair.
          </p>
        </div>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {services.map((svc) => (
          <li
            key={svc.id}
            className="flex flex-col rounded-xl border border-outline-variant bg-surface-container p-4 transition-colors hover:border-outline"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-on-surface">{svc.name}</p>
              {svc.popular ? (
                <span className="inline-flex items-center gap-0.5 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  <Sparkles className="h-2.5 w-2.5" aria-hidden />
                  Popular
                </span>
              ) : null}
            </div>
            {svc.description ? (
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-on-surface-variant">
                {svc.description}
              </p>
            ) : null}
            <div className="mt-3 flex items-center justify-between border-t border-outline-variant/60 pt-3 text-sm">
              <span className="font-serif text-lg font-bold text-primary">
                ${svc.price}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {svc.duration} min
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
