import { Clock } from "lucide-react";

export default function LandingServiceCard({ service }) {
  return (
    <div className="border border-outline-variant bg-surface-container p-6 transition-colors hover:border-primary">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-xl font-semibold text-on-surface">{service.name}</h3>
        <div className="font-serif text-xl text-primary">${service.price}</div>
      </div>
      <p className="mt-3 text-sm text-on-surface-variant">{service.description}</p>
      <div className="mt-5 flex items-center gap-2 border-t border-outline-variant pt-4 text-xs text-on-surface-variant">
        <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden /> {service.duration} min
      </div>
    </div>
  );
}
