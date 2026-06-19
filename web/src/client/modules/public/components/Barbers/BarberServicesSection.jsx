import { Clock, Scissors, Sparkles } from "lucide-react";

/**
 * @param {{ services: Array<{ id: string, name: string, price: number, duration: number, description?: string, popular?: boolean }> }} props
 */
export default function BarberServicesSection({ services }) {
  return (
    <section
      id="services"
      className="border-outline-variant bg-surface-container-low scroll-mt-28 rounded-xl border p-4 sm:p-6"
    >
      <header className="mb-4 flex items-center gap-2">
        <span className="bg-primary/15 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
          <Scissors className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-on-surface font-serif text-lg font-bold">Services & pricing</h2>
          <p className="text-on-surface-variant text-xs">
            Select services when booking — final price confirmed at the chair.
          </p>
        </div>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {services.map((svc) => (
          <li
            key={svc.id}
            className="border-outline-variant bg-surface-container hover:border-outline flex flex-col rounded-xl border p-4 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-on-surface font-semibold">{svc.name}</p>
              {svc.popular ? (
                <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[10px] font-bold">
                  <Sparkles className="h-2.5 w-2.5" aria-hidden />
                  Popular
                </span>
              ) : null}
            </div>
            {svc.description ? (
              <p className="text-on-surface-variant mt-1.5 flex-1 text-xs leading-relaxed">
                {svc.description}
              </p>
            ) : null}
            <div className="border-outline-variant/60 mt-3 flex items-center justify-between border-t pt-3 text-sm">
              <span className="text-primary font-serif text-lg font-bold">₹{svc.price}</span>
              <span className="text-on-surface-variant inline-flex items-center gap-1 text-xs">
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
