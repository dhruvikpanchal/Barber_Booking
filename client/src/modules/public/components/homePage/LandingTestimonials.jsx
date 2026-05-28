import { Star } from "lucide-react";
import { reviews } from "@/data/public/reviews";

export default function LandingTestimonials() {
  return (
    <section className="px-4 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="font-label-caps mb-3 text-primary">
          Word on the street
        </div>
        <h2 className="font-serif text-4xl font-bold text-on-surface md:text-5xl">
          Trusted by regulars.
        </h2>
        <div className="mt-14 grid gap-px bg-outline-variant md:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-surface-container p-8">
              <div
                className="flex gap-1"
                aria-label={`${r.rating} out of 5 stars`}
              >
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary text-primary"
                    aria-hidden
                  />
                ))}
              </div>
              <p className="mt-5 text-on-surface">&ldquo;{r.text}&rdquo;</p>
              <div className="mt-6 flex items-center justify-between border-t border-outline-variant pt-4 text-xs text-on-surface-variant">
                <span className="font-label-caps text-on-surface">
                  {r.name}
                </span>
                <span>{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
